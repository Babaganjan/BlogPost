import React, { useEffect } from 'react';
import { Spin } from 'antd';
import { useAppDispatch, useAppSelector } from '../../redux/store/hooks';
import { fetchArticles } from '../../api/apiFetchPosts';
import { Article, articlesSelector } from '../../redux/slice/articlesSlice';
import ItemPostComponent from '../itemPost/ItemPostComponent';
import PaginationComponent from '../paginated/PaginationComponent';

import styles from './listPosts.module.scss';

const ListPostsComponent: React.FC = () => {
  const dispatch = useAppDispatch();
  const {
    articles, loading, currentPage, pageSize,
  } = useAppSelector(articlesSelector);

  useEffect(() => {
    dispatch(fetchArticles({ page: currentPage, pageSize }));
  }, [dispatch]);

  if (loading === 'pending') {
    return <Spin size="large" className={styles.spin} />;
  }

  return (
    <section className={styles.posts__section}>
      <div className={`${styles.posts__container} container`}>
        <ul className={styles.posts__list}>
          {articles.map((article: Article) => (
            <ItemPostComponent key={article.slug} article={article} />
          ))}
        </ul>
        <PaginationComponent />
      </div>
    </section>
  );
};

export default ListPostsComponent;
