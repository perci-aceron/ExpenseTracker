// src/redux/actions/authActions.js
import axiosInstance from "api/axios";
// import axios from 'axios';

export const loginAuth = (credentials) => async (dispatch) => {
  try {
    const response = await axiosInstance.post("api/login", credentials);
    dispatch({ type: 'LOGIN_SUCCESS', payload: response.data.token });
    localStorage.setItem('token', response.data.token);
  } catch (error) {
    dispatch({ type: 'LOGIN_FAILURE', payload: error.message });
  }
};

export const logoutAuth = () => (dispatch) => {
  localStorage.removeItem('token');
  dispatch({ type: 'LOGOUT' });
};

