import axios from "axios";
const { CancelToken } = axios;
const source = CancelToken.source();

axios.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    config.headers.Authorization = token ? `Bearer ${token}` : '';
    config.cancelToken = source.token;
    return config;
});
axios.interceptors.response.use(
    (response) => response,
    (error) => {
        if (axios.isCancel(error)) {
            return Promise.reject({ isCancel: true, message: "Request cancelled" });
        } else {
            return Promise.reject(error);
        }
    }
);

export default axios;
