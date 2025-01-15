import { createContext, useState, PropsWithChildren, useEffect } from "react";
import { auth } from "../api/firebaseServices/firebaseConfig";
import { User, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { Stack } from "@mantine/core";
import { useLocation, useNavigate } from "react-router-dom";

type AuthContextType = {
    user: User | null;
    login: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
};

// Create context with a default value of `undefined`
export const AuthenticationContext = createContext<AuthContextType | undefined>(undefined);

const EXCLUDED_PATHS = [
    "/sign-in",
    "/sign-up",
    "/forgot-password",
    "/reset-password",
    "/otp",
    "forget-password",
];

export const Authentication = ({ children }: PropsWithChildren<{}>) => {
    const [user, setUser] = useState<User | null>(null);
    const location = useLocation();
    const navigate = useNavigate();

    // Login function
    const login = async (email: string, password: string): Promise<void> => {
        try {
            const userCredentials = await signInWithEmailAndPassword(auth, email, password);
            setUser(userCredentials.user);
        } catch (error) {
            console.error("Login failed", error);
            throw error;
        }
    };

    // Logout function
    const logout = async (): Promise<void> => {
        try {
            await signOut(auth);
            setUser(null);
        } catch (error) {
            console.error("Logout failed", error);
            throw error;
        }
    };

    // Redirect to sign-in if user is not logged in and accessing restricted paths
    useEffect(() => {
        if (!user && !EXCLUDED_PATHS.includes(location.pathname)) {
            navigate("/sign-in");
        }
    }, [user, location.pathname, navigate]);

    // Redirect to home if user is logged in and accessing excluded paths
    useEffect(() => {
        if (user && EXCLUDED_PATHS.includes(location.pathname)) {
            navigate("/");
        }
    }, [user, location.pathname, navigate]);

    return (
        <AuthenticationContext.Provider value={{ user, login, logout }}>
            <Stack
                style={{
                    width: "100vw",
                    height: "100vh",
                }}
            >
                {children}
            </Stack>
        </AuthenticationContext.Provider>
    );
};
