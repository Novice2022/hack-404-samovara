// src/api.js
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/v1'; // Замените на ваш базовый URL

// api.js
export const registerUser = async (userData) => {
  try {
    const response = await axios.post('http://localhost:5000/api/v1/Authorization/register', userData, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Детали ошибки:', {
      status: error.response?.status,
      data: error.response?.data,
      config: error.config
    });
    throw new Error(error.response?.data?.message || 'Ошибка регистрации');
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

export const createVeteranRequest = async (requestData) => {
  try {
    const response = await axios.post(
      `${API_URL}/VeteranPersonalAccount/requests`,
      requestData,
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        }
      }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Ошибка создания заявки' };
  }
};


export const getVeteranRequests = async () => {
  try {
    const response = await axios.get(`${API_URL}/VeteranPersonalAccount/requests`,
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        }
      }
    );
    return response.data; // Возвращаем данные из ответа
  } catch (error) {
    console.error('Ошибка при получении заявок:', {
      status: error.response?.status,
      data: error.response?.data,
      config: error.config
    });
    throw new Error(error.response?.data?.message || 'Ошибка при получении заявок');
  }
};

export const getVolunteerRequests = async () => {
  try {
    const response = await axios.get(`${API_URL}/VolunteerPersonalAccount/VolunteerPersonalAccount/requests/active`,
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        }
      }
    );
    console.log('Ответ сервера:', response.data);
    return response.data; // Возвращаем данные из ответа
  } catch (error) {
    console.error('Ошибка при получении заявок:', {
      status: error.response?.status,
      data: error.response?.data,
      config: error.config
    });
    throw new Error(error.response?.data?.message || 'Ошибка при получении заявок');
  }
};
