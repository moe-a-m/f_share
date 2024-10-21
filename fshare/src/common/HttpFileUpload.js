import axios from "axios";

// Dynamically get the server IP address
const API_URL = `http://${window.location.hostname}:3001/`;

export default axios.create({
    baseURL: API_URL,
    headers: {
        "Content-type": "application/json",
    },
});