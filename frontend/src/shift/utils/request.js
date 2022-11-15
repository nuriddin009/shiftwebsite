import axios from "axios";

export default function request(url, method, data) {
    return axios({
        //agar siz proyectni gitdan olgan bo'lsangiz img taglardan URl larni o'zgartiring 'localhost'ga

        // /api

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
