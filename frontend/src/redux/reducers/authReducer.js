// src/redux/reducers/authReducer.js
const initialState = {
  token: null,
  user: null,
};

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        token: action.payload.token,
        user: action.payload.user,
      };
    case 'LOGIN_FAILURE':
      return { 
        ...state, 
        error: action.payload };
    case 'LOGOUT':
      return {
        ...state,
        token: null,
        user: null,
      };
    default:
      return state;
  }
};

export default authReducer;
