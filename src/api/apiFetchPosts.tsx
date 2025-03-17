import { createAsyncThunk } from '@reduxjs/toolkit';
import Cookies from 'js-cookie';
import { Article } from '../redux/slice/articlesSlice';

const url = import.meta.env.VITE_API_BASE_URL;

interface FetchArticlesParams {
  page: number;
  pageSize: number;
}

// Создаем асинхронный thunk для получения списка статей
const fetchArticles = createAsyncThunk<
  {
    articles: Article[];
    articlesCount: number;
  },
  FetchArticlesParams
>('articles/fetch', async ({ page, pageSize }) => {
  const token = Cookies.get('auth_token');
  const headers: HeadersInit = {};

  if (token) {
    headers.Authorization = `Token ${token}`;
  }

  try {
    const response = await fetch(
      `${url}articles?limit=${pageSize}&offset=${(page - 1) * pageSize}`,
      {
        method: 'GET',
        headers,
      },
    );

    if (!response.ok) {
      throw new Error(`Ошибка HTTP: ${response.status}`);
    }

    const data = await response.json();

    return {
      articles: data.articles,
      articlesCount: data.articlesCount,
    };
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(`Ошибка при получении статей: ${error.message}`);
    } else {
      throw new Error('Неизвестная ошибка при получении статей');
    }
  }
});

// Создаем асинхронный thunk для получения деталей статьи
const fetchArticleDetail = createAsyncThunk<Article, string>(
  'articles/fetchDetail',
  async (slug) => {
    const token = Cookies.get('auth_token');
    const headers: HeadersInit = {};

    if (token) {
      headers.Authorization = `Token ${token}`;
    }
    try {
      const response = await fetch(`${url}articles/${slug}`, {
        method: 'GET',
        headers,
      });

      if (!response.ok) {
        throw new Error(`Ошибка HTTP: ${response.status}`);
      }

      const data = await response.json();
      return data.article;
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(`Ошибка при получении статьи: ${error.message}`);
      } else {
        throw new Error('Неизвестная ошибка при получении статьи');
      }
    }
  },
);

export { fetchArticles, fetchArticleDetail };
