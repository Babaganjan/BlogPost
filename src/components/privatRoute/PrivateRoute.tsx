import React from 'react';
import Cookies from 'js-cookie';
import { Navigate, useLocation } from 'react-router-dom';
import { UserRegistracion } from '../../redux/slice/registracionUserSlice';

interface PrivateRouteProps {
  user?: UserRegistracion;
  children: React.ReactNode;
  redirect?: string;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children, redirect }) => {
  const authenticate = !!Cookies.get('auth_token');
  const location = useLocation();

  return authenticate ? (
    <>{children}</>
  ) : (
    <Navigate
      to={`/sign_in?redirect=${encodeURIComponent(redirect || location.pathname)}`}
    />
  );
};

export default PrivateRoute;
