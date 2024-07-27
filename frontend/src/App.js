// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SharedLayout from './components/SharedLayout.js';
import Profile from '../src/pages/Profile.js';
import NotFound from '../src/pages/NotFound.js';
import PrivateRoute from '../src/routes/PrivateRoute.js';
// import BgImageWrapper from './components/BgImageWrapper.js';
// import Header from './components/Header.js';

const Home = () => <div>Home Page</div>; // Placeholder
const Login = () => <div>Login Page</div>; // Placeholder

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SharedLayout />}>
          <Route index element={<Home />} />
          <Route path="login" element={<Login />} />
          <Route
            path="profile"
            element={<PrivateRoute component={Profile} />}
          />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
