import { createAsyncThunk } from '@reduxjs/toolkit';
import Cookies from 'js-cookie';
import {
  ArticleRequest,
  ArticleResponse,
} from '../../redux/slice/articleSlice';

const url = import.meta.env.VITE_API_BASE_URL;

const fetchEditArticle = createAsyncThunk<
  ArticleResponse,
  { slug: string; articleData: ArticleRequest }
>('article/editArticle', async ({ slug, articleData }, { rejectWithValue }) => {
  const token = Cookies.get('auth_token');

  try {
    const response = await fetch(`${url}articles/${slug}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Token ${token}`,
      },
      body: JSON.stringify(articleData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return rejectWithValue(errorData);
    }

    const data: ArticleResponse = await response.json();
    return data;
  } catch (error) {
    return rejectWithValue(
      error instanceof Error ? error.message : 'An error occurred',
    );
  }
});

export default fetchEditArticle;
