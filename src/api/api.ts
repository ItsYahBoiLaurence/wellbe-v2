import axios from "axios";

const api = axios.create({
    baseURL: 'https://wellbe-staging-employee-qiwsg.ondigitalocean.app/',
    // withCredentials: true,  // Uncomment this if you want to send cookies with requests
    headers: {
        'Content-Type': 'application/json', // Ensure that we are sending JSON data
        'Accept': 'application/json',        // Ensure that we expect a JSON response
    }
});

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("TOKEN");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`
        }
        return config
    },
    (error) => {
        return Promise.reject(error)
    }
)

export default api