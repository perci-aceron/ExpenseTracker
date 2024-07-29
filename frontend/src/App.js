import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './redux/store';
import SharedLayout from './components/SharedLayoutComponent';
import Home from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import NotFound from './pages/NotFoundPage';
// import PrivateRoute from './routes/PrivateRoute';
import PublicRoute from './routes/PublicRoute';

function App() {
  return (
    <Provider store={store}>
      <Router>
        <Routes>
          <Route path="/" element={<SharedLayout />}>
            <Route index element={<PublicRoute element={Home} />} />
            <Route path="login" element={<PublicRoute element={LoginPage} />} />
            {/* <Route path="info" element={<PrivateRoute element={Profile} />} /> */}
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </Router>
    </Provider>
  );
}

export default App;
