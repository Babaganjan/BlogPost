import { createAsyncThunk } from '@reduxjs/toolkit';
import Cookies from 'js-cookie';

const url = import.meta.env.VITE_API_BASE_URL;
interface DeleteArticleResponse {
  slug: string;
}

const fetchDeleteArticle = createAsyncThunk<
  DeleteArticleResponse,
  { slug: string }
>('article/deleteArticle', async ({ slug }, { rejectWithValue }) => {
  const token = Cookies.get('auth_token');

  if (!token) {
    return rejectWithValue('Authorization token is missing');
  }

  try {
    const response = await fetch(`${url}/articles/${slug}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Token ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      return rejectWithValue(
        errorData.errors || 'У вас нет прав удалить этот пост',
      );
    }

    return { slug };
  } catch (error) {
    return rejectWithValue(
      error instanceof Error ? error.message : 'An error occurred',
    );
  }
});

export default fetchDeleteArticle;
