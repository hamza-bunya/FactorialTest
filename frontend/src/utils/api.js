import { message } from 'antd';
import axios from 'axios';

const api = axios.create({
    baseURL: "http://localhost:5001"
})

api.interceptors.response.use((response) => response, (error) => {
    const statusCode = error.response ? error.response.status : null;

    if (statusCode === 500) {
        message.error("Internal Server Error!");
    }
    if (statusCode === 400) {
        message.warning(error?.response?.data)
    }
    if (statusCode === 409) {
        message.warning(error?.response?.data);
    }
    else {
        message.error(error?.message);
    }
    return Promise.reject(error);
});

export default api;