// Example usage in a component
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginAuth, logoutAuth } from "../redux/actions/authActions";

const LoginComponent = () => {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);

  const handleLogin = () => {
    const credentials = { email: 'user@example.com', password: 'password' };
    dispatch(loginAuth(credentials));
  };

  const handleLogout = () => {
    dispatch(logoutAuth());
  };

  return (
    <div>
      {token ? (
        <button onClick={handleLogout}>Logout</button>
      ) : (
        <button onClick={handleLogin}>Login</button>
      )}
    </div>
  );
};

export default LoginComponent;
