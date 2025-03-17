import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store/store';
import { fetchArticles, fetchArticleDetail } from '../../api/apiFetchPosts';
import fetchDeleteArticle from '../../api/article/fetchDeleteArticle';
import fetchFavoriteArticle from '../../api/article/fetchFavoriteArticle';
import fetchUnFavoriteArticle from '../../api/article/fetchUnFavoriteArticle';

// Инициализация из localStorage
const initialPage = parseInt(localStorage.getItem('currentPage') || '1', 10);
const storedPageSize = localStorage.getItem('pageSize');
const pageSizeOptions = [10, 20, 50, 100];
const defaultPageSize = 10;
const initialPageSize = pageSizeOptions.includes(
  parseInt(storedPageSize || '10', 10),
)
  ? parseInt(storedPageSize || '10', 10)
  : defaultPageSize;

export interface Article {
  slug: string;
  title: string;
  description: string;
  body: string;
  tagList: string[];
  createdAt: string;
  updatedAt: string;
  favorited: boolean;
  favoritesCount: number;
  author: {
    username: string;
    bio: string;
    image: string;
    following: boolean;
  };
}

export interface ArticlesState {
  articles: Article[];
  articlesCount: number;
  loading: 'idle' | 'pending' | 'fulfilled' | 'rejected';
  error: string | null;
  currentPage: number;
  pageSize: number;
  pageSizeOptions: number[];
  currentArticle: Article | null;
  favoriteLoading: { [slug: string]: boolean };
}

const initialState: ArticlesState = {
  articles: [],
  articlesCount: 0,
  loading: 'idle',
  error: null,
  currentPage: initialPage,
  pageSize: initialPageSize,
  pageSizeOptions,
  currentArticle: null,
  favoriteLoading: {},
};

const articlesSlice = createSlice({
  name: 'articles',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setCurrentPage(state, action) {
      state.currentPage = action.payload;
    },
    setPageSize(state, action) {
      state.pageSize = action.payload;
    },
    addArticle: (state, action) => {
      state.articles.push(action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchArticles.pending, (state) => {
        state.loading = 'pending';
        state.error = null;
      })
      .addCase(fetchArticles.fulfilled, (state, action) => {
        state.articles = action.payload.articles;
        state.articlesCount = action.payload.articlesCount;
        state.loading = 'fulfilled';
      })
      .addCase(fetchArticles.rejected, (state, action) => {
        state.loading = 'rejected';
        state.error = action.error.message || 'Failed to fetch articles';
      })
      .addCase(fetchArticleDetail.pending, (state) => {
        state.loading = 'pending';
        state.error = null;
      })
      .addCase(fetchArticleDetail.fulfilled, (state, action) => {
        state.currentArticle = action.payload;
        state.loading = 'fulfilled';
      })
      .addCase(fetchArticleDetail.rejected, (state, action) => {
        state.loading = 'rejected';
        state.error = action.error.message || 'Failed to fetch article';
      })
      .addCase(fetchDeleteArticle.pending, (state) => {
        state.loading = 'pending';
      })
      .addCase(
        fetchDeleteArticle.fulfilled,
        (state, action: PayloadAction<{ slug: string }>) => {
          state.loading = 'fulfilled';
          state.articles = state.articles.filter(
            (article) => article.slug !== action.payload.slug,
          );
        },
      )
      .addCase(fetchDeleteArticle.rejected, (state, action) => {
        state.loading = 'rejected';
        state.error = action.payload as string;
      })
      .addCase(fetchFavoriteArticle.pending, (state, action) => {
        const { slug } = action.meta.arg;
        state.favoriteLoading[slug] = true;
        state.error = null;
      })
      .addCase(
        fetchFavoriteArticle.fulfilled,
        (state, action: PayloadAction<{ article: Article }>) => {
          const updatedArticle = action.payload.article;
          const index = state.articles.findIndex(
            (article) => article.slug === updatedArticle.slug,
          );
          if (index !== -1) {
            state.articles[index] = updatedArticle;
          }
          if (
            state.currentArticle
            && state.currentArticle.slug === updatedArticle.slug
          ) {
            state.currentArticle = updatedArticle;
          }
          state.favoriteLoading[updatedArticle.slug] = false;
        },
      )
      .addCase(fetchFavoriteArticle.rejected, (state, action) => {
        const { slug } = action.meta.arg;
        state.favoriteLoading[slug] = false;
        state.error = action.error.message || 'Failed to unfavorite article';
      })
      .addCase(fetchUnFavoriteArticle.pending, (state, action) => {
        const { slug } = action.meta.arg;
        state.favoriteLoading[slug] = true;
        state.error = null;
      })
      .addCase(
        fetchUnFavoriteArticle.fulfilled,
        (state, action: PayloadAction<{ article: Article }>) => {
          const updatedArticle = action.payload.article;
          const index = state.articles.findIndex(
            (article) => article.slug === updatedArticle.slug,
          );
          if (index !== -1) {
            state.articles[index] = updatedArticle;
          }
          if (
            state.currentArticle
            && state.currentArticle.slug === updatedArticle.slug
          ) {
            state.currentArticle = updatedArticle;
          }
          state.favoriteLoading[updatedArticle.slug] = false;
        },
      )
      .addCase(fetchUnFavoriteArticle.rejected, (state, action) => {
        const { slug } = action.meta.arg;
        state.favoriteLoading[slug] = false;
        state.error = action.error.message || 'Failed to unfavorite article';
      });
  },
});
export const articlesSelector = (state: RootState) => state.articles;
export const {
  setCurrentPage, setPageSize, addArticle, clearError,
} = articlesSlice.actions;
export default articlesSlice.reducer;
