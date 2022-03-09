import { useContext, useEffect } from 'react';
import { Formik, Form } from 'formik';
import { makeStyles } from '@material-ui/core/styles';
import moment from 'moment';
import { observer } from 'mobx-react';
import { Button } from '@material-ui/core';

import RootStore from 'store';
import { InputField } from 'commonComponents';
import { tryConvert, dateNow, filterAmount, getTotal } from './helpers';
import { CommunalItem } from './components';
import { COMMUNAL } from './constants';
import { communalSchema } from './communalValidation';
import { CommunalChart } from './components/CommunalChart';

import './communal.css';

const useStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: 200,
  },
}));

export const Communal: () => JSX.Element = observer(() => {
  const classes = useStyles();
  const {
    communalStore: { postCommunal, communal, getCommunal, historyTotal, historyMonths, historyCommunal, isLoading },
  } = useContext(RootStore);

  useEffect(() => {
    getCommunal();
  }, [isLoading]);

  return (
    <div className="communal">
      <div className="formBox">
        <Formik initialValues={communal} onSubmit={postCommunal} validationSchema={communalSchema}>
          {({ isValid, values }) => (
            <Form>
              <InputField
                id="timestamp"
                label=""
                name="timestamp"
                type="date"
                defaultValue={moment(dateNow).format('YYYY-MM-DD')}
                className={classes.textField}
                InputLabelProps={{
                  shrink: true,
                }}
              />
              {COMMUNAL.map(({ label }) => {
                const price = tryConvert(filterAmount(label, values), label).toFixed(2);

                return <CommunalItem key={label} title={label} price={+price} />;
              })}

              <h3>{`total: ${getTotal(values).toFixed(2)} hrn`}</h3>
              <Button type="submit" disabled={!isValid}>
                <span>send</span>
              </Button>
            </Form>
          )}
        </Formik>
      </div>
      {!isLoading && (
        <div className="chartBox">
          <CommunalChart totalAmount={historyTotal} months={historyMonths} />
        </div>
      )}
    </div>
  );
});
