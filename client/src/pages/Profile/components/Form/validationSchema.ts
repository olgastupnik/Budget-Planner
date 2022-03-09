import * as Yup from 'yup';

export const schemaCheckoutForm = Yup.object().shape({
  firstName: Yup.string()
    .matches(/^[A-Za-z]+$/, 'First name must contain only latin letters!')
    .required('Required'),
  lastName: Yup.string()
    .matches(/^[A-Za-z]+$/, 'First name must contain only latin letters!')
    .required('Required'),
  email: Yup.string().email().required('Required'),
});
