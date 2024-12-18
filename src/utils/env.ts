export const isDevelopment = import.meta.env.DEV;
export const isProduction = import.meta.env.PROD;
export const apiUrl = import.meta.env.VITE_API_URL;
export const enableMockApi = import.meta.env.VITE_ENABLE_MOCK_API === 'true';
export const enableDevTools = import.meta.env.VITE_ENABLE_DEV_TOOLS === 'true';