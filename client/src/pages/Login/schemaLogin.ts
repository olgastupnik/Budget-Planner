import * as Yup from 'yup';

export const schemaLogin = Yup.object().shape({
  email: Yup.string().email().required('Required'),
  password: Yup.string().required('Required'),
});
