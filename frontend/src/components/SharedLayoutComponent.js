// src/components/SharedLayoutComponent.js
import React from "react";
import { Outlet } from "react-router-dom";
import Header from "../components/HeaderComponent.js";

const SharedLayoutComponent = () => {
  return (
    <div>
      <Header />
      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default SharedLayoutComponent;
