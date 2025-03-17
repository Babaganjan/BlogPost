import { useNavigate, useParams } from 'react-router-dom';
import { HeartOutlined } from '@ant-design/icons';
import {
  Button, Popconfirm, Spin, notification,
} from 'antd';
import ReactMarkdown from 'react-markdown';
import { useAppDispatch, useAppSelector } from '../../redux/store/hooks';
import { isLoggedInSelector } from '../../redux/slice/registracionUserSlice';
import { articlesSelector } from '../../redux/slice/articlesSlice';
import fetchDeleteArticle from '../../api/article/fetchDeleteArticle';
import fetchFavoriteArticle from '../../api/article/fetchFavoriteArticle';
import fetchUnFavoriteArticle from '../../api/article/fetchUnFavoriteArticle';
import { ItemPost } from '../itemPost/ItemPostComponent';
import styles from './ItemPostDetail.module.scss';

const ItemPostDetailComponent: React.FC<ItemPost> = ({ article }) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { slug } = useParams<{ slug: string }>();
  const { isLoggedIn, user } = useAppSelector(isLoggedInSelector);
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

  const handleDelete = async () => {
    if (slug) {
      try {
        await dispatch(fetchDeleteArticle({ slug })).unwrap();
        navigate('/');
      } catch (err) {
        notification.error({
          message: 'Error',
          description: 'У вас нет прав для удаление этого поста.',
          placement: 'topRight',
        });
        navigate('/');
      }
    }
  };

  const handleEditClick = () => {
    // Создаем объект с данными статьи для редактирования
    const editFormData = {
      title: article.title,
      description: article.description,
      body: article.body,
      tagList: article.tagList || [],
    };

    // Сохраняем данные в Local Storage
    localStorage.setItem('editForm', JSON.stringify(editFormData));

    // Переходим на страницу редактирования
    navigate(`/edit_article/${article.slug}`);
  };

  return (
    <section className={styles.post__section}>
      <div className={`${styles.post__container} container`}>
        <div className={styles.post__header}>
          <div className={styles.post__header_left}>
            <div className={styles.post__title_wrapper}>
              <h1 className={styles.post__title}>{article.title}</h1>
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
          {isLoggedIn && user && user.username === article.author.username ? (
            <>
              <p className={styles.post__desc}>{article.description}</p>
              <div className={styles.wrapper_btns}>
                <Popconfirm
                  title=""
                  description="Are you sure to delete this article?"
                  okText="Yes"
                  cancelText="No"
                  onConfirm={handleDelete}
                >
                  <Button className={styles.btn_option} danger>
                    Delete
                  </Button>
                </Popconfirm>
                <Button className={styles.btn_option} onClick={handleEditClick}>
                  Edit
                </Button>
              </div>
            </>
          ) : (
            <>
              <p className={styles.post__desc}>{article.description}</p>
            </>
          )}
        </div>
        <div className={styles.articleBody}>
          <ReactMarkdown>{article.body}</ReactMarkdown>
        </div>
      </div>
    </section>
  );
};

export default ItemPostDetailComponent;
