// src/api.js
import axios from 'axios';

const API_URL = 'http://ваш-домен/api/v1'; // Замените на ваш базовый URL

export const registerUser = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/Authorization/register`, userData);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};


export const loginUser = async (credentials) => {
  try {
    const response = await axios.post(`${API_URL}/Authorization/login`, credentials);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};