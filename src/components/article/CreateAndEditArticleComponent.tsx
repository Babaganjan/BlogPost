import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button, Input as AntInput, Spin } from 'antd';
import {
  useForm, SubmitHandler, Path, FieldError, Controller,
} from 'react-hook-form';
import { useAppDispatch, useAppSelector } from '../../redux/store/hooks';
import {
  articleSelector, setLoadingArticle, updateForm, FormValues,
} from '../../redux/slice/articleSlice';
import fetchEditArticle from '../../api/article/fetchEditArticle';
import fetchCreateArticle from '../../api/article/fetchCreateArticle';
import { fetchArticleDetail } from '../../api/apiFetchPosts';
import InputComponent from '../Input/InputComponent';
import styles from './createAndEditArticle.module.scss';

const inputs = [
  {
    type: 'text',
    placeholder: 'Title',
    label: 'Title',
    name: 'title',
    options: {
      required: 'Title is required',
      minLength: {
        value: 3,
        message: 'Title must be at least 3 characters long.',
      },
      maxLength: {
        value: 40,
        message: 'Title cannot exceed 40 characters.',
      },
    },
  },
  {
    type: 'text',
    placeholder: 'Short description',
    label: 'Short description',
    name: 'description',
    options: {
      required: 'Description is required',
      minLength: {
        value: 3,
        message: 'Description must be at least 3 characters long.',
      },
      maxLength: {
        value: 100,
        message: 'Description cannot exceed 100 characters.',
      },
    },
  },
];

interface CreateArticleComponentProps {
  isEditMode?: boolean;
}

const CreateAndEditArticleComponent: React.FC<CreateArticleComponentProps> = (
  { isEditMode = false },
) => {
  const dispatch = useAppDispatch();
  const { loading, form } = useAppSelector(articleSelector);
  const navigate = useNavigate();
  const { slug } = useParams<{ slug: string }>();
  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm<FormValues>();

  const [tags, setTags] = useState<string[]>(form.tagList || ['']);

  // Восстановление данных из Local Storage при монтировании
  useEffect(() => {
    const savedForm = localStorage.getItem(isEditMode ? 'editForm' : 'formData');
    if (savedForm) {
      const parsedForm = JSON.parse(savedForm);
      Object.keys(parsedForm).forEach((key) => {
        setValue(key as keyof FormValues, parsedForm[key as keyof FormValues]);
      });
      setTags(parsedForm.tagList || ['']);
    }

    if (isEditMode && slug) {
      dispatch(fetchArticleDetail(slug));
    }
  }, [isEditMode, slug, dispatch, setValue]);

  // Очистка данных при успешной отправке формы
  useEffect(() => {
    if (loading === 'fulfilled') {
      localStorage.removeItem(isEditMode ? 'editForm' : 'formData');
      navigate('/');
      dispatch(setLoadingArticle('idle'));
    }
  }, [loading, navigate, dispatch, isEditMode]);

  const onSubmit: SubmitHandler<FormValues> = (data) => {
    const articleData = {
      article: {
        title: data.title,
        description: data.description,
        body: data.body,
        tagList: tags.filter((tag) => tag.trim() !== ''),
      },
    };
    if (isEditMode && slug) {
      dispatch(fetchEditArticle({ slug, articleData }));
    } else {
      dispatch(fetchCreateArticle(articleData));
    }
  };

  const saveFormToLocalStorage = (formData: FormValues & { tagList: string[] }) => {
    localStorage.setItem(isEditMode ? 'editForm' : 'formData', JSON.stringify(formData));
  };

  const handleTitleChange = (value: string) => {
    const updatedForm = { ...form, title: value, tagList: tags };
    setValue('title', value);
    dispatch(updateForm(updatedForm));
    saveFormToLocalStorage(updatedForm);
  };

  const handleDescriptionChange = (value: string) => {
    const updatedForm = { ...form, description: value, tagList: tags };
    setValue('description', value);
    dispatch(updateForm(updatedForm));
    saveFormToLocalStorage(updatedForm);
  };

  const handleBodyChange = (value: string) => {
    const updatedForm = { ...form, body: value, tagList: tags };
    setValue('body', value);
    dispatch(updateForm(updatedForm));
    saveFormToLocalStorage(updatedForm);
  };

  const handleTagsChange = (index: number, value: string) => {
    const newTags = [...tags];
    newTags[index] = value;
    setTags(newTags);
    const updatedForm = { ...form, tagList: newTags };
    dispatch(updateForm(updatedForm));
    saveFormToLocalStorage(updatedForm);
  };

  const addTag = () => {
    const newTags = [...tags, ''];
    setTags(newTags);
    const updatedForm = { ...form, tagList: newTags };
    dispatch(updateForm(updatedForm));
    saveFormToLocalStorage(updatedForm);
  };

  const deleteTag = (index: number) => {
    const newTags = tags.filter((_, i) => i !== index);
    setTags(newTags);
    const updatedForm = { ...form, tagList: newTags };
    dispatch(updateForm(updatedForm));
    saveFormToLocalStorage(updatedForm);
  };

  if (loading === 'pending') {
    return <Spin size="large" className={styles.spin} />;
  }

  return (
    <section>
      <div className={`${styles.form__container} container`}>
        <div className={styles.wrapper_form}>
          <h1 className={styles.form__title}>
            {isEditMode ? 'Edit Article' : 'Create new article'}
          </h1>
          <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
            {inputs.map((input) => (
              <InputComponent
                key={input.name}
                type={input.type}
                label={input.label}
                placeholder={input.placeholder}
                register={register}
                name={input.name as Path<FormValues>}
                options={input.options}
                error={
                  errors[input.name as keyof FormValues] as
                    | FieldError
                    | undefined
                }
                onChange={(e) => (input.name === 'title'
                  ? handleTitleChange(e.target.value)
                  : handleDescriptionChange(e.target.value))
                }
              />
            ))}

            <label className={styles.label_article}>
              Text
              <Controller
                name="body"
                control={control}
                rules={{ required: 'Text is required' }}
                render={({ field }) => (
                  <AntInput.TextArea
                    {...field}
                    placeholder="Text"
                    style={{ height: 168, resize: 'none' }}
                    onChange={(e) => {
                      field.onChange(e);
                      handleBodyChange(e.target.value);
                    }}
                  />
                )}
              />
              {errors.body && (
                <span className={styles.errorMessage}>
                  {errors.body.message}
                </span>
              )}
            </label>
            <div className={styles.wrapper_addtag}>
              <div className={styles.wrapper_inputs}>
                 <span>Tags</span>
                {tags.length === 0 ? (
                  <div className={styles.wrapper_addtag}>
                    <input
                      className={styles.field_tag}
                      type="text"
                      value=""
                      onChange={(e) => handleTagsChange(0, e.target.value)}
                      placeholder="Tag"
                    />
                    <Button
                      className={styles.btn_tag}
                      type="primary"
                      danger
                      ghost
                      disabled
                      style={{ height: '40px' }}
                    >
                      Delete
                    </Button>
                  </div>
                ) : (
                  tags.map((tag, index) => (
                    <div key={index} className={styles.wrapper_addtag}>
                      <input
                        className={styles.field_tag}
                        type="text"
                        value={tag}
                        onChange={(e) => handleTagsChange(index, e.target.value)
                        }
                        placeholder="Tag"
                      />
                      <Button
                        className={styles.btn_tag}
                        type="primary"
                        danger
                        ghost
                        disabled={tags.length === 1}
                        onClick={() => deleteTag(index)}
                        style={{ height: '40px' }}
                      >
                        Delete
                      </Button>
                    </div>
                  ))
                )}
              </div>
              <Button
                className={styles.btn_tag}
                onClick={addTag}
                type="primary"
                ghost
                style={{ height: '40px', alignSelf: 'flex-end' }}
              >
                Add Tag
              </Button>
            </div>

            <Button
              className={styles.btn_send}
              type="primary"
              htmlType="submit"
              style={{ height: '40px' }}
            >
              Send
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default CreateAndEditArticleComponent;
