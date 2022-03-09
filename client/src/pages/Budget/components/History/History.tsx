import { useContext, useState } from 'react';
import DeleteIcon from '@material-ui/icons/Delete';

import RootStore from 'store';
import { findCategoryById } from 'helpers';
import { ICategory, IHistory } from 'types';
import { FILTER_BTN } from './constants';
import { CustomPagination } from './components/Pagination';

import './History.css';

export const History: () => JSX.Element = () => {
  const {
    budgetStore: {
      historyStore: { filterHistory, deleteHistory, history },
      categoriesStore: { categories },
    },
  } = useContext(RootStore);

  const [filterType, setFilterType] = useState<string>('all');

  return (
    <aside className="asideProfile">
      <div className="box">
        <div className="borderBox">
          <h2>History</h2>
          <div>
            <button className="iconColor" type="button" onClick={deleteHistory}>
              <DeleteIcon style={{ fontSize: 'small' }} />
            </button>
          </div>
        </div>
        <div className="boxBtn">
          {FILTER_BTN.map(({ text }) => (
            <button
              key={text}
              type="button"
              className={filterType === `${text}` ? 'activeFilter' : ''}
              onClick={() => setFilterType(text)}
            >
              {text}
            </button>
          ))}
        </div>
        <div className="hisBox">
          <ul>
            {filterHistory(filterType).map(({ type, amount, category_id, id }: IHistory) => {
              const isExpense = type === 'expense';
              const fixedAmount = +Number(amount).toFixed(2);
              const category: ICategory | undefined = findCategoryById(category_id, categories);
              return (
                <li key={id} className={isExpense ? 'expenseBackground' : 'incomeBackground'}>
                  <div>
                    <div className="amountHistory">{`${fixedAmount}$`}</div>
                    <div>{type}</div>
                  </div>
                  {category && <div className="amountHistory">{category.title}</div>}
                </li>
              );
            })}
          </ul>
          {!!history.length && <CustomPagination />}
        </div>
      </div>
    </aside>
  );
};
