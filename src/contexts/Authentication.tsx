import { createContext, useState, PropsWithChildren, useEffect } from "react";
import { auth } from "../api/firebaseServices/firebaseConfig";
import { User, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged } from "firebase/auth";
import { Stack } from "@mantine/core";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../api/api";
import queryClient from "../queryClient";

interface AuthContextType {
    user: User | null;
    login: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    userRegister: (email: string, password: string, company: string, department: string, firstname: string, lastname: string) => Promise<void>;
}

export const AuthenticationContext = createContext<AuthContextType>({
    user: null,
    login: async () => { throw new Error('login method not implemented'); },
    logout: async () => { throw new Error('logout method not implemented'); },
    userRegister: async () => { throw new Error('register method not implemented'); }
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

    const login = async (email: string, password: string): Promise<void> => {
        try {
            const userCredentials = await signInWithEmailAndPassword(auth, email, password);
            const token = await userCredentials.user.getIdToken();
            localStorage.setItem('CLIENT_TOKEN', token);
            setUser(userCredentials.user);
        } catch (error) {
            console.error("Login failed", error);
            throw error;
        }
    };

    const logout = async (): Promise<void> => {
        try {
            await signOut(auth);
            setUser(null);
            queryClient.clear(); // Clear all queries and cache
            localStorage.clear();
        } catch (error) {
            console.error("Logout failed", error);
            throw error;
        }
    };

    const userRegister = async (email: string, password: string, firstname: string, lastname: string, company: string, department: string) => {
        const data = { email, firstName: firstname, lastName: lastname, company, department };
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const token = await userCredential.user.getIdToken();
            localStorage.setItem('CLIENT_TOKEN', token);
            const response = await api.post('/api/employee/register/', data)
            console.log(response)
            if (response.status) {
                navigate('/sign-in');
            }
        } catch (error) {
            console.error("Registration failed", error);
            throw error;
        }
    };

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, setUser);
        return () => unsubscribe();
    }, []);

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
