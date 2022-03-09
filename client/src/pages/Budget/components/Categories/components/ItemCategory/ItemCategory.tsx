import { useMemo, useEffect, useState, useContext } from 'react';
import DeleteIcon from '@material-ui/icons/Delete';
import { observer } from 'mobx-react';

import RootStore from 'store';
import { IItemCategory } from 'types';
import { calculateExpense } from './helper';

import './itemCategory.css';

export const ItemCategory = observer(({ title, description, isDefault = true, id, remove }: IItemCategory) => {
  const {
    budgetStore: {
      historyStore: { budgetAmount, history },
      categoriesStore: { categories },
    },
  } = useContext(RootStore);
  const [initial, setInitial] = useState<number>(0);

  const percents: number = useMemo(() => (initial * 100) / budgetAmount, [budgetAmount, initial]);

  useEffect(() => {
    setInitial(calculateExpense(history, categories, title));
  }, [history]);

  return (
    <div className="itemCategory">
      <h3>{title}</h3>
      <span>{description}</span>
      <div className="progressBox">
        <span>{` expense: ${initial}`}</span>
        <div className="progress">
          <span className="progress-bar" style={{ width: `${percents}%` }} />
        </div>
      </div>

      {!isDefault && (
        <button type="button" className="removeBtn" onClick={() => remove(id)}>
          <DeleteIcon className="iconColor" style={{ fontSize: 'small' }} />
        </button>
      )}
    </div>
  );
});
