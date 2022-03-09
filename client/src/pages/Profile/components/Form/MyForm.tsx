import { useState, useEffect, useContext } from 'react';
import { Formik, Form } from 'formik';
import Button from '@material-ui/core/Button';
import CheckIcon from '@material-ui/icons/Check';
import CreateIcon from '@material-ui/icons/Create';
import { observer } from 'mobx-react';

import RootStore from 'store';
import { InputField } from 'commonComponents';
import { IInitFormProfile } from 'types';
import { schemaCheckoutForm } from './validationSchema';

import './MyForm.css';

export const MyForm: () => JSX.Element = observer(() => {
  const {
    profileStore: { initialForm, patchUser, getUser },
  } = useContext(RootStore);

  useEffect(() => {
    getUser();
  }, [initialForm.email, initialForm.firstName, initialForm.lastName]);

  const [isDisabled, setIsDisabled] = useState(true);

  const editFormHandler = () => {
    setIsDisabled(!isDisabled);
  };

  return (
    <div className="myDataForm">
      <Formik
        initialValues={initialForm}
        enableReinitialize
        onSubmit={(data: IInitFormProfile) => {
          patchUser(data);
          getUser();
        }}
        validationSchema={schemaCheckoutForm}
      >
        {({ isValid, dirty }) => (
          <Form>
            <InputField label="First Name" id="firstName" type="text" name="firstName" disabled={isDisabled} />
            <InputField label="Last Name" id="lastName" type="text" name="lastName" disabled={isDisabled} />
            <InputField label="Email" id="email" type="email" name="email" disabled={isDisabled} />
            <div className="buttonBox">
              <Button type="button" variant="contained" onClick={editFormHandler}>
                <CreateIcon />
              </Button>
              <Button disabled={!isValid && dirty} type="submit" variant="contained">
                <CheckIcon />
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
});
