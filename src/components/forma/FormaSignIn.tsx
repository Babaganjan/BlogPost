// FormaComponent.tsx
import { Link, useNavigate } from 'react-router-dom';
import { Spin } from 'antd';
import { useEffect } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useAppDispatch, useAppSelector } from '../../redux/store/hooks';
import InputComponent from '../Input/InputComponent';
import { isLoggedInSelector } from '../../redux/slice/registracionUserSlice';
import fetchLoggenUser from '../../api/loggenUser/fetchLoggenUser';
import styles from './formaSignIn.module.scss';

// Интерфейс для данных авторизации
interface UserLoggenForm {
  email: string;
  password: string;
}

interface LoggenError {
  errors: {
    [key: string]: string;
  };
}

const Inputs = [
  {
    type: 'email',
    placeholder: 'Email address',
    label: 'Email address',
    name: 'email',
    validation: {
      required: 'Email is required',
      pattern: {
        value: /^\S+@\S+$/i,
        message: 'Email is not valid',
      },
    },
  },
  {
    type: 'password',
    placeholder: 'Password',
    label: 'Password',
    name: 'password',
    validation: {
      required: 'Password is required',
      minLength: {
        value: 6,
        message: 'Your password needs to be at least 6 characters.',
      },
      maxLength: {
        value: 40,
        message: 'Password cannot exceed 40 characters.',
      },
    },
  },
];

const FormaSignIn = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { loading, isLoggedIn } = useAppSelector(isLoggedInSelector);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<UserLoggenForm>({
    mode: 'onChange',
  });

  useEffect(() => {
    if (isLoggedIn) {
      navigate('/');
    }
  }, [isLoggedIn, navigate]);

  const onSubmit: SubmitHandler<UserLoggenForm> = async (data) => {
    const resultAction = await dispatch(
      fetchLoggenUser({
        email: data.email,
        password: data.password,
      }),
    );

    if (fetchLoggenUser.fulfilled.match(resultAction)) {
      navigate('/');
    } else if (resultAction.payload) {
      const serverErrors = resultAction.payload as LoggenError;
      const errorMessage = serverErrors.errors['email or password'];

      if (errorMessage) {
        setError('email', {
          type: 'manual',
        });

        setError('password', {
          type: 'manual',
        });

        setError('root', {
          type: 'manual',
          message: 'Проверьте введенный email или password.',
        });
      }
    }
  };

  if (loading) {
    return <Spin size="large" className={styles.spin} />;
  }

  return (
    <section>
      <div className={`${styles.form__container} container`}>
        <div className={styles.wrapper_form}>
          <h1 className={styles.form__title}>Sign In</h1>
          <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
            {Inputs.map((input) => (
              <InputComponent
                key={input.label}
                type={input.type}
                label={input.label}
                placeholder={input.placeholder}
                register={register}
                name={input.name as keyof UserLoggenForm}
                options={input.validation}
                error={errors[input.name as keyof UserLoggenForm]}
              />
            ))}
            {errors.root && (
              <span className={styles.error_message}>
                {errors.root.message}
              </span>
            )}
            <div className={styles.wrapper_btn}>
              <button className={`${styles.form_btn} btn_reset`} type="submit">
                Login
              </button>
              <span>
                Don&rsquo;t have an&nbsp;account?
                <Link to={'/sign_up'} className={styles.desc_link}>
                  Sign&nbsp;Up
                </Link>
                .
              </span>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default FormaSignIn;
