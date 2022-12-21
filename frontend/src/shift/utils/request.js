import axios from "axios";
import {API_BASE_URL, AUTH_TOKEN, REFRESH_TOKEN} from "./Config";
import {toast} from "react-toastify";

export default function request(url, method, data) {
    return axios({
        baseURL: "/api",
        url,
        method,
        data,
        headers: {
            'Authorization': localStorage.getItem("token"),
            'lang': localStorage.getItem("lang")
        }
    })
}


const instance = axios.create({
    baseURL: API_BASE_URL,
    timeout: 60000,
})

instance.interceptors.request.use(
    (config) => {
        const jwtToken = localStorage.getItem(AUTH_TOKEN)
        if (jwtToken) {
            config.headers['Authorization'] = `${jwtToken}`
        }
        config.headers['lang'] = localStorage.getItem("lang")
        return config
    }, (error) => {
        console.log('request interceptor', error)
        return Promise.reject(error)
    }
)
instance.interceptors.response.use(
    (response) => {
        return response.data
    },
    async (error) => {
        const originalRequest = error.config
        if (error.response.status === 403 && originalRequest && !originalRequest._isRetry) {
            originalRequest._isRetry = true
            try {
                const {data} = await axios({
                    url: `${API_BASE_URL}/v1/auth/token/refresh`,
                    method: 'post',
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem(AUTH_TOKEN)}`,
                        'REFRESH_TOKEN': `Bearer ${localStorage.getItem(REFRESH_TOKEN)}`,
                    }
                })
                console.log(data)
                localStorage.setItem(AUTH_TOKEN, data?.data?.accessToken)
                localStorage.setItem(REFRESH_TOKEN, data?.data?.refreshToken)
                return instance.request(originalRequest)
            } catch (error) {
                console.log('UnAuthorized', error);
            }
        } else {
            toast.error(error.response.data?.message)
        }

        return Promise.reject(error.response);
    }
)
    // export default instance;
