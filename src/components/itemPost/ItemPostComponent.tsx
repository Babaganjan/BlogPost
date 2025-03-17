import { Link } from 'react-router-dom';
import { Spin } from 'antd';
import { HeartOutlined } from '@ant-design/icons';
import { useAppDispatch, useAppSelector } from '../../redux/store/hooks';
import { Article, articlesSelector } from '../../redux/slice/articlesSlice';
import fetchFavoriteArticle from '../../api/article/fetchFavoriteArticle';
import fetchUnFavoriteArticle from '../../api/article/fetchUnFavoriteArticle';

import styles from './itemPost.module.scss';

export interface ItemPost {
  article: Article;
}

const ItemPostComponent: React.FC<ItemPost> = ({ article }) => {
  const dispatch = useAppDispatch();
  const { favoriteLoading } = useAppSelector(articlesSelector);

  const dateString = article.createdAt;
  const date = new Date(dateString);

  // Форматируем дату в нужный формат "Month Day, Year"
  const formattedDate = date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const handleToggleFavorite = () => {
    if (article.favorited) {
      dispatch(fetchUnFavoriteArticle({ slug: article.slug }));
    } else {
      dispatch(fetchFavoriteArticle({ slug: article.slug }));
    }
  };

  return (
    <li className={styles.post}>
      <div>
        <div className={styles.post__header}>
          <div className={styles.post__header_left}>
            <div className={styles.post__title_wrapper}>
              <Link to={`/articles/${article.slug}`}>
                <h1 className={styles.post__title}>{article.title}</h1>
              </Link>
              {favoriteLoading[article.slug] ? (
                <Spin />
              ) : (
                <button
                  className={`${styles.post__btn_favorited} btn_reset`}
                  onClick={handleToggleFavorite}
                  type="button"
                >
                  <HeartOutlined
                    className={`${styles.post__like} ${
                      article.favorited ? styles.post__like_favorited : ''
                    }`}
                  />
                  <span>{article.favoritesCount}</span>
                </button>
              )}
            </div>
            <div className={styles.post__tag_wrapper}>
              {article.tagList && article.tagList.length > 0
                ? article.tagList.map((tag, index) => (
                    <span key={index} className={styles.post__tag}>
                      {tag}
                    </span>
                ))
                : ''}
            </div>
          </div>
          <div className={styles.post__header_right}>
            <div className={styles.username_wrapper}>
              <h3 className={styles.post__username}>
                {article.author.username}
              </h3>
              <span className={styles.post__date}>{formattedDate}</span>
            </div>
            <div>
              <img
                className={styles.post__image}
                src={`${article.author.image}`}
                alt="awatar"
              />
            </div>
          </div>
        </div>
        <div className={styles.wrapper_desc}>
          <p className={styles.post__desc}>{article.description}</p>
        </div>
      </div>
    </li>
  );
};

export default ItemPostComponent;
