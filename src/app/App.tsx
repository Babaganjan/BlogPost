import { Routes, Route } from 'react-router-dom';
import Cookies from 'js-cookie';
import { useEffect } from 'react';
import { useAppDispatch } from '../redux/store/hooks';
import { setIsLoggedIn, setUser } from '../redux/slice/registracionUserSlice';
import Layout from '../components/layout/Layout';
import Home from '../pages/Home';
import ArticleDetail from '../pages/ArticleDetail';
import SignIn from '../pages/SignIn';
import SignUp from '../pages/SignUp';
import EditProfile from '../pages/EditProfile';
import ArticleCreate from '../pages/ArticleCreate';
import ArticleEdit from '../pages/ArticleEdit';
import PrivateRoute from '../components/privatRoute/PrivateRoute';
import './App.css';

const App: React.FC = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const user = localStorage.getItem('user');
    const token = Cookies.get('auth_token');

    if (user && token) {
      const parsedUser = JSON.parse(user);
      dispatch(setIsLoggedIn(true));
      dispatch(setUser(parsedUser));
    }
  }, [dispatch]);

  return (
    <>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="/articles/:slug" element={<ArticleDetail />} />
          <Route path="/sign_in" element={<SignIn />} />
          <Route path="/sign_up" element={<SignUp />} />

          {/* Приватные маршруты */}
          <Route
            path="/edit_profile"
            element={
              <PrivateRoute redirect="/sign_in">
                <EditProfile />
              </PrivateRoute>
            }
          />
          <Route
            path="/create_article"
            element={
              <PrivateRoute redirect="/sign_in">
                <ArticleCreate />
              </PrivateRoute>
            }
          />
          <Route
            path="/edit_article/:slug"
            element={
              <PrivateRoute redirect="/sign_in">
                <ArticleEdit />
              </PrivateRoute>
            }
          />
        </Route>
      </Routes>
    </>
  );
};

export default App;
