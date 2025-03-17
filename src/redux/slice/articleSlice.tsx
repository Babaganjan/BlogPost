import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import fetchCreateArticle from '../../api/article/fetchCreateArticle';
import fetchEditArticle from '../../api/article/fetchEditArticle';

import { RootState } from '../store/store';

export interface FormValues {
  title: string;
  description: string;
  body: string;
  tagList?: string[];
}

// Загрузка состояния формы из Local Storage
const loadFormState = (): FormValues => {
  const savedForm = localStorage.getItem('formData');
  return savedForm
    ? JSON.parse(savedForm)
    : {
      title: '',
      description: '',
      body: '',
      tagList: [''],
    };
};

// Интерфейс для данных статьи, которые отправляются на сервер
export interface ArticleRequest {
  article: {
    title: string;
    description: string;
    body: string;
    tagList: string[];
  };
}

// Интерфейс для автора статьи
interface Author {
  username: string;
  bio: string;
  image: string;
  following: boolean;
}

// Интерфейс для ответа сервера после создания статьи
export interface ArticleResponse {
  article: {
    slug: string;
    title: string;
    description: string;
    body: string;
    tagList: string[];
    createdAt: string;
    updatedAt: string;
    favorited: boolean;
    favoritesCount: number;
    author: Author;
  };
}

// Начальное состояние
interface ArticleState {
  article: ArticleResponse['article'] | null;
  loading: 'idle' | 'pending' | 'fulfilled' | 'rejected';
  error: string | null;
  form: FormValues;
}

const initialState: ArticleState = {
  article: null,
  loading: 'idle',
  error: null,
  form: loadFormState(),
};

// Создание слайса
const articleSlice = createSlice({
  name: 'article',
  initialState,
  reducers: {
    setLoadingArticle: (
      state,
      action: PayloadAction<'idle' | 'pending' | 'fulfilled' | 'rejected'>,
    ) => {
      state.loading = action.payload;
    },
    updateForm: (state, action: PayloadAction<Partial<FormValues>>) => {
      state.form = { ...state.form, ...action.payload };
    },
    clearForm: (state) => {
      state.form = {
        title: '',
        description: '',
        body: '',
        tagList: [''],
      };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCreateArticle.pending, (state) => {
        state.loading = 'pending';
        state.error = null;
      })
      .addCase(
        fetchCreateArticle.fulfilled,
        (state, action: PayloadAction<ArticleResponse>) => {
          state.loading = 'fulfilled';
          state.article = action.payload.article;
        },
      )
      .addCase(fetchCreateArticle.rejected, (state, action) => {
        state.loading = 'rejected';
        if (action.payload) {
          state.error = action.payload as string;
        } else {
          state.error = action.error.message || 'Unknown error';
        }
      })
      .addCase(fetchEditArticle.pending, (state) => {
        state.loading = 'pending';
        state.error = null;
      })
      .addCase(
        fetchEditArticle.fulfilled,
        (state, action: PayloadAction<ArticleResponse>) => {
          state.loading = 'fulfilled';
          state.article = action.payload.article;
        },
      )
      .addCase(fetchEditArticle.rejected, (state, action) => {
        state.loading = 'rejected';
        if (action.payload) {
          state.error = action.payload as string;
        } else {
          state.error = action.error.message || 'Unknown error';
        }
      });
  },
});

export const articleSelector = (state: RootState) => state.article;

export const { setLoadingArticle, updateForm, clearForm } = articleSlice.actions;
export default articleSlice.reducer;
