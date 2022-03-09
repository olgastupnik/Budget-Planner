import { useContext } from 'react';
import { Form, Formik } from 'formik';
import { observer } from 'mobx-react';
import { useHistory, NavLink } from 'react-router-dom';
import Button from '@material-ui/core/Button';

import RootStore from 'store';
import { InputField } from 'commonComponents';
import { ILogin } from 'types';
import { schemaLogin } from './schemaLogin';
import { iHistory } from './types';

import './loginForm.css';

export const Login: () => JSX.Element = observer(() => {
  const {
    loginStore: { login, initialFormLogin },
  } = useContext(RootStore);

  const history = useHistory<iHistory>();

  const onSubmitHandler = async ({ email, password }: ILogin) => {
    try {
      await login({ email, password });
      history.push('/profile');
    } catch {
      Error('something went wrong');
    }
  };

  return (
    <main>
      <div className="loginBox">
        <h1>Sign In</h1>
        <Formik initialValues={initialFormLogin} onSubmit={onSubmitHandler} validationSchema={schemaLogin}>
          {({ isSubmitting, isValid }) => (
            <Form className="login">
              <InputField id="email" type="text" name="email" label="Email*" />
              <InputField id="password" type="password" name="password" label="Password*" />
              <Button disabled={isSubmitting || !isValid} type="submit" variant="contained" color="primary">
                Log in
              </Button>
            </Form>
          )}
        </Formik>
        <span>
          Don`t have an account yet?
          <NavLink to="/reg">Sign Up</NavLink>
        </span>
      </div>
    </main>
  );
});
