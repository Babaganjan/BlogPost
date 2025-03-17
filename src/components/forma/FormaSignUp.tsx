import { Link, useNavigate } from 'react-router-dom';
import { Spin } from 'antd';
import { useEffect } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useAppDispatch, useAppSelector } from '../../redux/store/hooks';
import InputComponent from '../Input/InputComponent';
import fetchRegistracionUser from '../../api/registrationUser/fetchRegistracionUser';
import { isLoggedInSelector } from '../../redux/slice/registracionUserSlice';
import styles from './formaSignUp.module.scss';

// Интерфейс для данных регистрации
interface UserRegistrationForm {
  username: string;
  email: string;
  password: string;
  repeatPassword: string;
  agreeToTerms: boolean;
}

// Интерфейс для ошибок регистрации
export interface RegistrationError {
  errors: {
    username?: string;
    email?: string;
  };
}

const Inputs = [
  {
    type: 'text',
    placeholder: 'Username',
    label: 'Username',
    name: 'username',
    validation: {
      required: 'Username is required',
      minLength: {
        value: 3,
        message: 'Username must be at least 3 characters long.',
      },
      maxLength: {
        value: 20,
        message: 'Username cannot exceed 20 characters.',
      },
    },
  },
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
  {
    type: 'password',
    placeholder: 'Repeat Password',
    label: 'Repeat Password',
    name: 'repeatPassword',
    validation: {
      required: 'Repeat Password is required',
    },
  },
];

const FormaSignUp = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { loading, isLoggedIn } = useAppSelector(isLoggedInSelector);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<UserRegistrationForm>({
    mode: 'onChange',
  });

  useEffect(() => {
    if (isLoggedIn) {
      navigate('/');
    }
  }, [isLoggedIn, navigate]);

  const onSubmit: SubmitHandler<UserRegistrationForm> = async (data) => {
    if (data.password !== data.repeatPassword) {
      setError('repeatPassword', {
        type: 'manual',
        message: 'Passwords do not match',
      });
      return;
    }

    const resultAction = await dispatch(
      fetchRegistracionUser({
        username: data.username,
        email: data.email,
        password: data.password,
      }),
    );

    if (fetchRegistracionUser.fulfilled.match(resultAction)) {
      navigate('/');
    } else if (resultAction.payload) {
      const serverErrors = resultAction.payload as RegistrationError;
      const { username: usernameError, email: emailError } = serverErrors.errors;

      if (usernameError) {
        setError('username', {
          type: 'manual',
          message: usernameError,
        });
      }

      if (emailError) {
        setError('email', {
          type: 'manual',
          message: emailError,
        });
      }
    } else {
      setError('root', {
        type: 'manual',
        message: 'Registration failed. Please try again.',
      });
    }
  };

  if (loading) {
    return <Spin size="large" className={styles.spin} />;
  }

  return (
    <section>
      <div className={`${styles.form__container} container`}>
        <div className={styles.wrapper_form}>
          <h1 className={styles.form__title}>Create new account</h1>
          <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
            {Inputs.map((input) => (
              <InputComponent
                key={input.label}
                type={input.type}
                label={input.label}
                placeholder={input.placeholder}
                register={register}
                name={input.name as keyof UserRegistrationForm}
                options={input.validation}
                error={errors[input.name as keyof UserRegistrationForm]}
              />
            ))}
            <div className={styles.wrapper__label_checkbox}>
              <label className={styles.label_checkbox}>
                <input
                  type="checkbox"
                  className={styles.checkbox}
                  {...register('agreeToTerms', {
                    required: 'You must agree to the terms.',
                  })}
                />
                <p>I agree to the processing of my personal information</p>
                {errors.agreeToTerms && (
                  <span className={styles.error_essage}>
                    {errors.agreeToTerms.message}
                  </span>
                )}
              </label>
            </div>
            <div className={styles.wrapper_btn}>
              <button className={`${styles.form_btn} btn_reset`} type="submit">
                Create
              </button>
              <span>
                Already have an&nbsp;account?
                <Link to="/sign_in" className={styles.desc_link}>
                  Sign&nbsp;In
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

export default FormaSignUp;
