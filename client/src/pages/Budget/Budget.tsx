import { useEffect, useContext } from 'react';
import { observer } from 'mobx-react';

import RootStore from 'store';
import { Notes, Account, Categories, History } from './components';

export const Budget: () => JSX.Element = observer(() => {
  const {
    budgetStore: {
      accountStore: { getInitial },
      historyStore: { getHistory, history },
      categoriesStore: { getCategories },
    },
  } = useContext(RootStore);

  useEffect(() => {
    getInitial();
    getCategories();
    getHistory();
  }, [history.length]);

  return (
    <div className="container">
      <div>
        <Account />
        <Notes />
        <Categories />
      </div>
      <History />
    </div>
  );
});
