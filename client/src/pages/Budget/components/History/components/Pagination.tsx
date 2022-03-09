import { useContext } from 'react';
import { usePagination } from '@material-ui/lab/Pagination';

import RootStore from 'store';

import './pagination.css';

export const CustomPagination = () => {
  const {
    budgetStore: {
      historyStore: { amountOfPages, currentPage, changePage },
    },
  } = useContext(RootStore);

  const { items } = usePagination({
    count: amountOfPages,
  });

  return (
    <div className="btnBox">
      {items.map(({ page, type }) => {
        const isTypePage = type === 'page';
        return (
          <button
            onClick={(event) => changePage(event)}
            type="button"
            key={Math.random()}
            className={isTypePage ? (page === currentPage ? 'activeBtn' : '') : ''}
          >
            {isTypePage ? page : type === 'next' ? '>' : '<'}
          </button>
        );
      })}
    </div>
  );
};
