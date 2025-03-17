import { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import HeaderComponent from '../header/HeaderComponent';
import styles from './layout.module.scss';

const url = import.meta.env.VITE_API_BASE_URL;

// Функция для проверки состояния соединения
const checkConnection = async () => {
  try {
    const response = await fetch(`${url}articles`);
    return response.ok;
  } catch (error) {
    return false;
  }
};

const Layout = () => {
  const [isConnected, setIsConnected] = useState(true);

  useEffect(() => {
    const checkConn = async () => {
      const connectionStatus = await checkConnection();
      setIsConnected(connectionStatus);
    };

    checkConn();
  }, []);

  return (
    <>
      <HeaderComponent />
      <main>
        {isConnected ? (
          <Outlet />
        ) : (
          <p className={styles.warning_text}>
            Нет соединения с сервером. Попробуйте позже.
          </p>
        )}
      </main>
    </>
  );
};

export default Layout;
