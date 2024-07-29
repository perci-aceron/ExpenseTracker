// src/redux/reducers/index.js
import { combineReducers } from 'redux';
import authReducer from './authReducer';
import userReducer from './userReducer';

const rootReducer = combineReducers({
  auth: authReducer,
  user: userReducer// other reducers can be added here
});

export default rootReducer;
