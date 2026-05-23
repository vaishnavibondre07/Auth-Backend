if (!import.meta.env.VITE_BACKEND_URL) {
    throw new Error("VITE_BACKEND_URL is not defined");
}

if (!import.meta.env.VITE_GOOGLE_CLIENT_ID) {
    throw new Error("VITE_GOOGLE_CLIENT_ID is not defined");
}

export const config = {
    BACKEND_URL: import.meta.env.VITE_BACKEND_URL,
    GOOGLE_CLIENT_ID: import.meta.env.VITE_GOOGLE_CLIENT_ID,
};