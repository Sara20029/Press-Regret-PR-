import axios from "axios";

/**
 * Preconfigured Axios instance for all backend API calls
 * Base URL points to the Spring Boot backend running on port 8080
 */
export const api = axios.create({
    baseURL: "http://localhost:8080",
});