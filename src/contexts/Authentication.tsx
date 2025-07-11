import { createContext, useState, PropsWithChildren, useEffect } from "react";
import { auth } from "../api/firebaseServices/firebaseConfig";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from "firebase/auth";
import { Stack } from "@mantine/core";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../api/api";
import queryClient from "../queryClient";
import { LoginCreds } from "../types";
import { useQuery } from "@tanstack/react-query";

type UserInformation = {
    first_name: string
    last_name: string
    id: number
    email: string
    department_id: number
    department: {
        company: {
            name: string
        },
        name: string
    }

}

interface AuthContextType {
    token: string | null;
    login: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    userRegister: (credentials: LoginCreds) => Promise<void>;
    userInfo: UserInformation | undefined;
}

export const AuthenticationContext = createContext<AuthContextType>({
    token: null,
    login: async () => { throw new Error('login method not implemented'); },
    logout: async () => { throw new Error('logout method not implemented'); },
    userRegister: async () => { throw new Error('register method not implemented'); },
    userInfo: undefined
});

const EXCLUDED_PATHS = [
    "/sign-in",
    "/sign-up",
    "/forgot-password",
    "/reset-password",
    "/otp",
    "/forget-password",
    '/get-started',
    '/change-password'
];

export const Authentication = ({ children }: PropsWithChildren<{}>) => {
    const [token, setToken] = useState<string | null>(null);
    const location = useLocation();
    const navigate = useNavigate();

    const { data: userInfo } = useQuery<UserInformation>({
        queryKey: ['userInformation'],
        queryFn: async () => {
            const res = await api.get('user')
            return res.data
        }
    })

    const login = async (email: string, password: string): Promise<void> => {
        try {
            const response = await api.post('/auth/sign-in', { email, password })
            localStorage.setItem("CLIENT_TOKEN", response.data.access_token)
            navigate('/')
        } catch (error) {
            console.error("Login failed", error);
            throw error;
        }
    };

    const logout = async (): Promise<void> => {
        try {
            setToken(null);
            queryClient.clear(); // Clear all queries and cache
            localStorage.clear();
        } catch (error) {
            console.error("Logout failed", error);
            throw error;
        }
    };

    const userRegister = async (credentials: LoginCreds) => {
        try {
            const response = await api.post('user', credentials)
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
        const user_token = localStorage.getItem("CLIENT_TOKEN")
        if (user_token) setToken(user_token)
        if (!token && !EXCLUDED_PATHS.includes(location.pathname)) {
            navigate('/sign-in')
            return
        }
        if (token && EXCLUDED_PATHS.includes(location.pathname)) navigate('/')
    })

    console.log(userInfo)

    return (
        <AuthenticationContext.Provider value={{ token, login, logout, userRegister, userInfo }}>
            <Stack style={{ width: "100vw", height: "100vh" }}>
                {children}
            </Stack>
        </AuthenticationContext.Provider>
    );
};
