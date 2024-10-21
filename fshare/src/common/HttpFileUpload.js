import axios from "axios";

const http = axios.create({
    baseURL: `http://${window.location.hostname}:3001`,
    headers: {
        "Content-Type": "application/json",
    },
});

export default http;