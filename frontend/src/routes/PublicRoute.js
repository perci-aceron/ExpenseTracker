// src/routes/PublicRoute.js
import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const PublicRoute = ({ element: Element, ...rest }) => {
  const token = useSelector((state) => state.auth.token);
  
  return token ? <Navigate to="/profile" /> : <Element {...rest} />;
};

export default PublicRoute;
