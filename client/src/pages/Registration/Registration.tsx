import { Form, Formik } from 'formik';
import { NavLink } from 'react-router-dom';
import { observer } from 'mobx-react';
import { useContext } from 'react';
import { useHistory } from 'react-router';

import RootStore from 'store';
import { IInitialRegistration, IHistory } from 'types';
import { Button } from '@material-ui/core';
import { InputField } from 'commonComponents';
import { INPUTFIELDS } from './constants';

import './RegForm.css';

export const Registration: () => JSX.Element = observer(() => {
  const {
    registrationStore: { postReg, initialRegistration },
  } = useContext(RootStore);

  const history = useHistory<IHistory>();

  const onSubmitHandler = (values: IInitialRegistration) => {
    postReg(values);
    history.push('/login');
  };

  return (
    <main>
      <div className="regBox">
        <h1>Sign Up</h1>
        <Formik initialValues={initialRegistration} onSubmit={onSubmitHandler}>
          {({ isSubmitting, isValid }) => (
            <Form className="reg">
              {INPUTFIELDS.map(({ id, type, name, label }) => (
                <InputField key={id} id={id} type={type} name={name} label={label} />
              ))}

              <Button disabled={isSubmitting || !isValid} type="submit" variant="contained" color="primary">
                Sign Up
              </Button>
            </Form>
          )}
        </Formik>
        <span>
          Already have an account?
          <NavLink to="/login">Sign In</NavLink>
        </span>
      </div>
    </main>
  );
});
