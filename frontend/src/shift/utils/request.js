import axios from "axios";

export default function request(url, method, data) {
    return axios({
        baseURL: "http://localhost:81/api",
        url,
        method,
        data,
        headers: {
            'Authorization': localStorage.getItem("token"),
            'lang': localStorage.getItem("lang")
        }
    })
}
