import { useEffect } from 'react';
import { Pagination } from 'antd';
import { useAppDispatch, useAppSelector } from '../../redux/store/hooks';
import { fetchArticles } from '../../api/apiFetchPosts';
import { setCurrentPage, setPageSize } from '../../redux/slice/articlesSlice';
import { RootState } from '../../redux/store/store';

const PaginationComponent: React.FC = () => {
  const dispatch = useAppDispatch();
  const {
    articlesCount, currentPage, pageSize, pageSizeOptions,
  } = useAppSelector((state: RootState) => state.articles);

  // Получение текущей страницы и размера страницы из localStorage
  useEffect(() => {
    const storedPage = localStorage.getItem('currentPage');
    const storedPageSize = localStorage.getItem('pageSize');

    if (storedPage) {
      dispatch(setCurrentPage(parseInt(storedPage, 10)));
    }
    if (storedPageSize) {
      dispatch(setPageSize(parseInt(storedPageSize, 10)));
    }
  }, [dispatch]);

  const handlePageChange = (page: number) => {
    dispatch(setCurrentPage(page));
    localStorage.setItem('currentPage', page.toString());
    dispatch(fetchArticles({ page, pageSize }));
  };

  const handlePageSizeChange = (_: number, size: number) => {
    dispatch(setPageSize(size));
    localStorage.setItem('pageSize', size.toString());
    dispatch(setCurrentPage(1));
    dispatch(fetchArticles({ page: 1, pageSize: size }));
  };

  return (
    <Pagination
      align="center"
      current={currentPage}
      pageSize={pageSize}
      pageSizeOptions={pageSizeOptions}
      onChange={handlePageChange}
      onShowSizeChange={handlePageSizeChange}
      total={articlesCount}
    />
  );
};

export default PaginationComponent;
