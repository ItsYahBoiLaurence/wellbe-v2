import axios from "axios";
import { signOut } from "firebase/auth";
import { auth } from "./firebaseServices/firebaseConfig";
import queryClient from "../queryClient";

const api = axios.create({
    baseURL: 'http://localhost:8000',
    // withCredentials: true,  // Uncomment this if you want to send cookies with requests
    headers: {
        'Content-Type': 'application/json', // Ensure that we are sending JSON data
        'Accept': 'application/json',        // Ensure that we expect a JSON response
    }
});

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("CLIENT_TOKEN");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`
        }
        return config
    },
    (error) => {
        return Promise.reject(error)
    }
)

const handleLogout = async () => {
    await signOut(auth)
}

api.interceptors.response.use(
    response => response,
    error => {
        if (error.response && error.response.status === 401) {
            queryClient.clear()
            localStorage.clear()
            handleLogout()
        }
        return Promise.reject(error)
    }
)

export default api