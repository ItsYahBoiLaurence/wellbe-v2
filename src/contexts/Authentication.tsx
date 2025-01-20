import { createContext, useState, PropsWithChildren, useEffect } from "react";
import { auth } from "../api/firebaseServices/firebaseConfig";
import { User, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from "firebase/auth";
import { Stack } from "@mantine/core";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../api/api";


interface AuthContextType {
    user: User | null;
    login: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    userRegister: (email: string, password: string, company: string, department: string, firstname: string, lastname: string) => Promise<void>;
};

// Create context with a default value of `undefined`
export const AuthenticationContext = createContext<AuthContextType>({
    user: null,
    login: async () => {
        throw new Error('login method not implemented'); // Placeholder
    },
    logout: async () => {
        throw new Error('logout method not implemented'); // Placeholder
    },
    userRegister: async () => {
        throw new Error('register method not implemented')
    }
});

const EXCLUDED_PATHS = [
    "/sign-in",
    "/sign-up",
    "/forgot-password",
    "/reset-password",
    "/otp",
    "/forget-password",
    '/get-started',
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


    const userRegister = async (email: string, password: string, firstname: string, lastname: string, company: string, department: string) => {
        const data = {
            email: email,
            firstName: firstname,
            lastName: lastname,
            company: company,
            department: department,
        }
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password)
            if (userCredential) {
                await api.post('/api/employee/register/', data)
                navigate('/sign-in')
            }
        } catch (error) {
            throw error
        }
    }

    // Redirect to sign-in if user is not logged in and accessing restricted paths
    useEffect(() => {
        if (!user && !EXCLUDED_PATHS.includes(location.pathname)) {
            navigate("/get-started");
        }
    }, [user, location.pathname, navigate]);

    // Redirect to home if user is logged in and accessing excluded paths
    useEffect(() => {
        if (user && EXCLUDED_PATHS.includes(location.pathname)) {
            navigate("/");
        }
    }, [user, location.pathname, navigate]);

    useEffect(() => {

    }, [])

    return (
        <AuthenticationContext.Provider value={{ user, login, logout, userRegister }}>
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
