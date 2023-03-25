import axios from "axios";

const isDev = process.env.NODE_ENV.trim() === "development";
//export const API_URL = isDev ? "https://172.172.172.46:7259/api" : "/api";
export const API_URL = process.env.REACT_APP_SERVER_API;

const $api = axios.create({
    withCredentials: true,
    baseURL: API_URL
})

$api.interceptors.request.use(config => {
    config.headers.Authorization = "Bearer " + sessionStorage.getItem("user-id");
    return config;
})


$api.interceptors.response.use(config => {
    return config;
}, async error => {
    let originalRequest = error.config;
    if(error.response.status===401)
        try{

            var resp = await axios.post(API_URL + "/refreshlogin");
            sessionStorage.setItem("user-id", resp.data.token);
            return $api.request(originalRequest);
        }
        catch(e){
            console.error("Не прошла повторная автризация");
            return Promise.reject(error);
        }
    else
        return Promise.reject(error);
})

export default $api;