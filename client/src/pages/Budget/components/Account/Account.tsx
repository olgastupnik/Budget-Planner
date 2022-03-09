import { useMemo, useContext } from 'react';
import { observer } from 'mobx-react';
import { toJS } from 'mobx';
import DeleteIcon from '@material-ui/icons/Delete';
import AddIcon from '@material-ui/icons/Add';
import { Formik, Form } from 'formik';
import { PropagateLoader } from 'react-spinners';

import RootStore from 'store';

import './Account.css';
import { InputField, MyModal } from 'commonComponents';

export const Account: () => JSX.Element = observer(() => {
  const {
    budgetStore: {
      accountStore: { initialAmount, clearBudgetAmount, formSubmit },
      historyStore: { budgetAmount },
    },
    modalStore: { isOpenAccountModal, openAccountModal },
  } = useContext(RootStore);

  const getPercents = (): number => {
    return (budgetAmount * 100) / initialAmount;
  };
  const isInitialAmount = initialAmount !== 0;

  const amount: string = !isInitialAmount ? 'not setted' : `${initialAmount}$`;
  const desc: string =
    'Making a budget is a great way to get a handle on where your money is going, and it can also help you free up extra cash. To get started, take a good look at your spending habits and see whether there are any areas where you could cut back.';

  const percents = useMemo(() => getPercents(), [budgetAmount, initialAmount]);

  return (
    <div className="account">
      <div className="box">
        <div>
          <h2>{`Account: ${toJS(budgetAmount)}$`}</h2>
          <div className="d-flex">
            <button className="iconColor" type="button" onClick={openAccountModal}>
              <AddIcon style={{ fontSize: 'small' }} />
            </button>

            <button className="iconColor" type="button" onClick={clearBudgetAmount}>
              <DeleteIcon style={{ fontSize: 'small' }} />
            </button>
          </div>
        </div>
        <h3>{` monthly budget is ${amount}`}</h3>
        {!isInitialAmount ? (
          <div className="loader">
            <PropagateLoader size={10} />
          </div>
        ) : (
          <div className="progress">
            <span className="progress-bar" style={{ width: `${percents}%` }} />
          </div>
        )}
      </div>

      <MyModal title="Budget amount" desc={desc} isOpen={isOpenAccountModal} isShowCloseBtn>
        <Formik initialValues={{ budgetAmount: 0 }} onSubmit={formSubmit}>
          <Form>
            <InputField label="enter amount" id="budgetAmount" type="number" name="budgetAmount" />
            <button type="submit">
              <AddIcon style={{ fontSize: 'small' }} />
            </button>
          </Form>
        </Formik>
      </MyModal>
    </div>
  );
});
