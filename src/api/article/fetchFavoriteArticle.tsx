import { createAsyncThunk } from '@reduxjs/toolkit';
import Cookies from 'js-cookie';
import { ArticleResponse } from '../../redux/slice/articleSlice';

const url = import.meta.env.VITE_API_BASE_URL;

const fetchFavoriteArticle = createAsyncThunk<
  ArticleResponse,
  { slug: string }
>('article/favoriteArticle', async ({ slug }, { rejectWithValue }) => {
  const token = Cookies.get('auth_token');
  try {
    const response = await fetch(`${url}articles/${slug}/favorite`, {
      method: 'POST',
      headers: {
        Authorization: `Token ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      return rejectWithValue(errorData);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    return rejectWithValue({
      message: 'Network error',
      error: error instanceof Error ? error.message : String(error),
    });
  }
});

export default fetchFavoriteArticle;
