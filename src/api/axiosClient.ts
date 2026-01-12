import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ApiResponse, ApiError } from '@/types';
import authApi from './authApi';
import log from '../utils/logger';
import Config from 'react-native-config';

// Base URL matching your curl command exactly
const BASE_URL = (Config && (Config as any).BASE_URL) || 'http://192.168.7.108:3005';

// Function to generate curl command for debugging
function generateCurl(config: any) {
  let curl = [`curl -X ${config.method.toUpperCase()}`];

  // Full URL
  const fullUrl = config.baseURL
    ? `${config.baseURL.replace(/\/$/, '')}${config.url}`
    : config.url;
  curl.push(`"${fullUrl}"`);

  // Headers
  if (config.headers) {
    for (let key in config.headers) {
      if (config.headers.hasOwnProperty(key)) {
        curl.push(`-H "${key}: ${config.headers[key]}"`);
      }
    }
  }

  // Body data
  if (config.data) {
    try {
      let data = config.data;

      // If it's a stringified JSON, try to prettify
      if (typeof data === 'string') {
        try {
          const parsed = JSON.parse(data);
          data = JSON.stringify(parsed);
        } catch (_) {
          // Not JSON, leave as-is
        }
      } else {
        // If it's an object or FormData
        data = JSON.stringify(data);
      }

      curl.push(`-d '${data}'`);
    } catch (err) {
      log.warn('Could not serialize request data for cURL:', err);
    }
  }

  return curl.join(' \\\n  ');
}

const axiosClient: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    accept: 'application/json', // Matching your curl headers
  },
});

// Request interceptor
axiosClient.interceptors.request.use(
  async config => {
    const token = await AsyncStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Debug: Log the equivalent curl command
    if (__DEV__) {
      log.debug('🚀 Axios Request -> cURL equivalent:');
      log.debug(generateCurl(config));
      log.debug('📤 Request Config:', {
        method: config.method,
        url: config.url,
        baseURL: config.baseURL,
        headers: config.headers,
        data: config.data,
      });
    }

    return config;
  },
  error => {
    return Promise.reject(error);
  },
);

// Response interceptor
axiosClient.interceptors.response.use(
  response => {
    // Debug: Log response
    if (__DEV__) {
      log.debug('✅ Axios Response:', {
        status: response.status,
        statusText: response.statusText,
        url: response.config.url,
        data: response.data,
      });
    }
    return response.data;
  },
  async error => {
    // Debug: Log error
    if (__DEV__) {
      log.debug('❌ Axios Error:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        url: error.config?.url,
        data: error.response?.data,
        message: error.message,
      });
    }

    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = await AsyncStorage.getItem('refreshToken');
        if (refreshToken) {
          const response = await authApi.refreshToken(refreshToken);
          const tokenData = response.data || response; // Handle both response object and direct data
          await AsyncStorage.setItem('authToken', tokenData.access);
          await AsyncStorage.setItem('refreshToken', tokenData.refresh);

          // Retry the original request with new token
          originalRequest.headers.Authorization = `Bearer ${tokenData.access}`;
          return axiosClient(originalRequest);
        }
      } catch (refreshError) {
        // Refresh token failed, clear all tokens and redirect to login
        await AsyncStorage.removeItem('authToken');
        await AsyncStorage.removeItem('refreshToken');
        await AsyncStorage.removeItem('userData');
        // You might want to dispatch a logout action here
      }
    }
    // printf("fghfsdfkuhskhfvjbnmbngyjhgb ")
    return Promise.reject(error);
  },
);

export default axiosClient;
