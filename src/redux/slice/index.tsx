import { combineReducers } from 'redux';
import articlesSlice from './articlesSlice';
import articleSlice from './articleSlice';
import registracionUserSlice from './registracionUserSlice';

const rootReducer = combineReducers({
  articles: articlesSlice,
  article: articleSlice,
  registracion: registracionUserSlice,
});

export default rootReducer;
