import { useNavigate } from 'react-router-dom';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useAppDispatch } from '../../redux/store/hooks';
import fetchUpdateUser from '../../api/updateUser/fetchUpdateUser';
import { UserRegistracion } from '../../redux/slice/registracionUserSlice';
import { RegistrationError } from './FormaSignUp';
import InputComponent from '../Input/InputComponent';
import styles from './formaEditProfile.module.scss';

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
        value: /^\S+@\S+\.\S+$/i,
        message: 'Email is not valid',
      },
    },
  },
  {
    type: 'password',
    placeholder: 'New password',
    label: 'New password',
    name: 'password',
    validation: {
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
    type: 'url',
    placeholder: 'Avatar Image URL',
    label: 'Avatar Image (URL)',
    name: 'image',
    validation: {
      pattern: {
        value: /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i,
        message: 'Must be a valid image URL.',
      },
    },
  },
];

const FormaEditProfile = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<UserRegistracion>({
    mode: 'onChange',
  });

  const onSubmit: SubmitHandler<UserRegistracion> = async (data) => {
    const finalData = {
      username: data.username,
      email: data.email,
      image: data.image || undefined,
    };

    const resultAction = await dispatch(fetchUpdateUser(finalData));

    if (fetchUpdateUser.fulfilled.match(resultAction)) {
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

  return (
    <section>
      <div className={`${styles.form__container} container`}>
        <div className={styles.wrapper_form}>
          <h1 className={styles.form__title}>Edit Profile</h1>
          <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
            {Inputs.map((input) => (
              <InputComponent
                key={input.label}
                type={input.type}
                label={input.label}
                placeholder={input.placeholder}
                register={register}
                name={input.name as keyof UserRegistracion}
                options={input.validation}
                error={errors[input.name as keyof UserRegistracion]}
              />
            ))}
            {errors.root && (
              <p className={styles.error}>{errors.root.message}</p>
            )}
            <div className={styles.wrapper_btn}>
              <button className={`${styles.form_btn} btn_reset`} type="submit">
                Save
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default FormaEditProfile;
