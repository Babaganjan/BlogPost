import React from 'react';
import Cookies from 'js-cookie';
import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../redux/store/hooks';
import {
  setIsLoggedIn,
  isLoggedInSelector,
} from '../../redux/slice/registracionUserSlice';
import styles from './header.module.scss';

const HeaderComponent: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { isLoggedIn, user } = useAppSelector(isLoggedInSelector);

  const handleLogout = () => {
    Cookies.remove('auth_token');
    dispatch(setIsLoggedIn(false));
    localStorage.removeItem('user');
    navigate('/');
  };

  const defaultAvatarUrl = 'https://static.productionready.io/images/smiley-cyrus.jpg';

  return (
    <header className={styles.header}>
      <div className={styles.header__container}>
        <Link to="/" className={`${styles.header__home} btn_reset btn`}>
          Realworld Blog
        </Link>
        <div className={styles.header__group_btn}>
          {isLoggedIn ? (
            <>
              <Link to="/create_article" className={styles.create_article}>
                Create article
              </Link>
              {user && (
                <Link to="/edit_profile" className={styles.username_wrapper}>
                  <h3 className={styles.user_username}>{user.username}</h3>
                  <div>
                    <img
                      className={styles.user_image}
                      src={user.image || defaultAvatarUrl}
                      alt="аватар"
                    />
                  </div>
                </Link>
              )}
              <button
                className={`${styles.log_out} btn_reset`}
                onClick={handleLogout}
              >
                Log Out
              </button>
            </>
          ) : (
            <>
              <Link
                to="/sign_in"
                className={`${styles.header__sign_in} btn_reset btn`}
              >
                Sign In
              </Link>
              <Link
                to="/sign_up"
                className={`${styles.header__sign_up} btn_reset btn`}
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default HeaderComponent;
