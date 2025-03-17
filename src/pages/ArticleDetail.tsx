import { useEffect } from 'react';
import { Spin } from 'antd';
import { useParams } from 'react-router-dom';
import ItemPostDetailComponent from '../components/ItemPostDetail/ItemPostDetailComponent';
import { articlesSelector } from '../redux/slice/articlesSlice';
import { useAppDispatch, useAppSelector } from '../redux/store/hooks';
import { fetchArticleDetail } from '../api/apiFetchPosts';

const ArticleDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const dispatch = useAppDispatch();
  const { currentArticle } = useAppSelector(articlesSelector);

  useEffect(() => {
    if (slug) {
      dispatch(fetchArticleDetail(slug));
    }
  }, [dispatch, slug]);

  if (!currentArticle) return <Spin style={{ position: 'absolute', top: '50%', left: '50%' }} />;
  return <ItemPostDetailComponent article={currentArticle} />;
};

export default ArticleDetail;
