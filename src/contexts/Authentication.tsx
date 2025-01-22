import { createContext, useState, PropsWithChildren, useEffect } from "react";
import { auth } from "../api/firebaseServices/firebaseConfig";
import { User, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged } from "firebase/auth";
import { Stack } from "@mantine/core";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../api/api";

interface AuthContextType {
    user: User | null;
    login: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    userRegister: (email: string, password: string, company: string, department: string, firstname: string, lastname: string) => Promise<void>;
};

export const AuthenticationContext = createContext<AuthContextType>({
    user: null,
    login: async () => {
        throw new Error('login method not implemented');
    },
    logout: async () => {
        throw new Error('logout method not implemented');
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
            const token = await userCredentials.user.getIdToken();
            localStorage.setItem('TOKEN', token);
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
            localStorage.removeItem("TOKEN");
        } catch (error) {
            console.error("Logout failed", error);
            throw error;
        }
    };

    // Registration function
    const userRegister = async (email: string, password: string, firstname: string, lastname: string, company: string, department: string) => {
        const data = {
            email: email,
            firstName: firstname,
            lastName: lastname,
            company: company,
            department: department,
        };
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            if (userCredential) {
                await api.post('/api/employee/register/', data);
                navigate('/sign-in');
            }
        } catch (error) {
            console.error("Registration failed", error);
            throw error;
        }
    };

    // Synchronize user state with Firebase Auth
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser); // Keep user state in sync
        });
        return () => unsubscribe(); // Clean up listener on unmount
    }, []);

    // Redirect to appropriate paths based on user authentication state
    useEffect(() => {
        if (!user && !EXCLUDED_PATHS.includes(location.pathname)) {
            navigate("/get-started");
        } else if (user && EXCLUDED_PATHS.includes(location.pathname)) {
            navigate("/");
        }
    }, [user, location.pathname, navigate]);

    return (
        <AuthenticationContext.Provider value={{ user, login, logout, userRegister }}>
            <Stack style={{ width: "100vw", height: "100vh" }}>
                {children}
            </Stack>
        </AuthenticationContext.Provider>
    );
};
