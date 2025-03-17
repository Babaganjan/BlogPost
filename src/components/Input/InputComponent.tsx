import {
  UseFormRegister,
  RegisterOptions,
  Path,
  FieldValues,
  FieldError,
} from 'react-hook-form';
import styles from './input.module.scss';

export interface InputProps<T extends FieldValues> {
  type: string;
  label?: string;
  placeholder: string;
  register: UseFormRegister<T>;
  name: Path<T>;
  options?: RegisterOptions<T>;
  error?: FieldError | undefined;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const InputComponent = <T extends FieldValues>({
  type,
  label,
  placeholder,
  register,
  name,
  options,
  error,
  onChange,
}: InputProps<T>) => (
  <div className={styles.wrapper_label}>
    <label className={styles.label_input}>
      {label}
      <input
        type={type}
        placeholder={placeholder}
        className={`${styles.input} ${error ? styles.inputError : ''}`}
        {...register(name, options)}
        onChange={(e) => {
          if (onChange) {
            onChange(e);
          }
        }}
      />
    </label>
    {error && <span className={styles.errorMessage}>{error.message}</span>}
  </div>
  );
export default InputComponent;
