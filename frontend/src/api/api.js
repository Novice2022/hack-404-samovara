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


//добавление данных волонтера в заявку
export const respondToRequest = async (requestId, volunteerInfo) => {
  try {
    const authToken = localStorage.getItem('authToken');
    if (!authToken) {
      throw new Error('Токен авторизации отсутствует.');
    }

    const response = await axios.post(
      `${API_URL}/VolunteerPersonalAccount/VolunteerPersonalAccount/requests/response`,
      {
        guid: requestId, // Используем guid
        responses: [
          {
            firstNameVolonteer: volunteerInfo.firstNameVolonteer,
            lastNameVolonteer: volunteerInfo.lastNameVolonteer,
            contactInfo: volunteerInfo.contactInfo,
            responseDate: new Date().toISOString()
          }
        ]
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        }
      }
    );

    return response.data; // Возвращаем данные из ответа
  } catch (error) {
    console.error('Ошибка при отправке отклика:', {
      status: error.response?.status,
      data: error.response?.data,
      config: error.config
    });
    throw new Error(error.response?.data?.message || 'Ошибка при отправке отклика');
  }
};

// Выбор отклика
export const selectVolunteer = async (responseId) => {
  try {
    const authToken = localStorage.getItem('authToken');
    if (!authToken) {
      throw new Error('Токен авторизации отсутствует.');
    }

    // Логируем данные для отладки
    console.log('Отправляем запрос с responseId:', responseId);

    const response = await axios.post(
      `${API_URL}/VeteranPersonalAccount/requests/selectvolunteer?responseId=${responseId}`,
      {}, // Пустое тело запроса
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        }
      }
    );

    return response.data; // Возвращаем данные из ответа
  } catch (error) {
    console.error('Ошибка при выборе исполнителя:', {
      status: error.response?.status,
      data: error.response?.data,
      config: error.config
    });
    throw new Error(error.response?.data?.message || 'Ошибка при выборе исполнителя');
  }
};

//отзыв заявки
export const cancelRequest = async (requestId) => {
  try {
    const authToken = localStorage.getItem('authToken');
    if (!authToken) {
      throw new Error('Токен авторизации отсутствует.');
    }

    // Логируем данные для отладки
    console.log('Отправляем запрос на отзыв заявки:', { requestId });

    const response = await axios.delete(
      `${API_URL}/VeteranPersonalAccount/requests?requestId=${requestId}`,
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        }
      }
    );

    return response.data; // Возвращаем данные из ответа
  } catch (error) {
    console.error('Ошибка при отзыве заявки:', {
      status: error.response?.status,
      data: error.response?.data,
      config: error.config
    });
    throw new Error(error.response?.data?.message || 'Ошибка при отзыве заявки');
  }
};