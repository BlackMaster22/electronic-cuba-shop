// src/lib/api.ts
import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';

// Creamos una instancia con configuración base
const api = axios.create({
    baseURL: '/api', // Next.js API Routes
    withCredentials: true, // Para enviar cookies (JWT + CSRF)
    timeout: 10000, // 10 segundos
});

// Interceptor de solicitud
api.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        // CSRF token: lo leemos de una cookie (si existe)
        if (typeof window !== 'undefined') {
            const csrfToken = document.cookie
                .split('; ')
                .find(row => row.startsWith('csrf-token='))
                ?.split('=')[1];

            if (csrfToken) {
                config.headers['X-CSRF-Token'] = csrfToken;
            }
        }
        return config;
    },
    (error: AxiosError) => {
        return Promise.reject(error);
    }
);

// Interceptor de respuesta
api.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => {
        if (error.response) {
            const { status } = error.response;

            // 401: sesión expirada o inválida → redirigir a login
            if (status === 401) {
                if (typeof window !== 'undefined') {
                    // Limpiar estado local (Zustand)
                    localStorage.removeItem('ec-shop-user');
                    // Redirigir
                    window.location.href = '/auth/login';
                }
            }

            // 403: acceso denegado
            if (status === 403) {
                console.error('Acceso denegado: no tienes permisos para esta acción');
                // Aquí podrías mostrar un toast si usas una librería como sonner/toastify
            }

            // 500: error del servidor
            if (status >= 500) {
                console.error('Error del servidor:', error.response?.data);
            }
        }

        return Promise.reject(error);
    }
);

export default api;