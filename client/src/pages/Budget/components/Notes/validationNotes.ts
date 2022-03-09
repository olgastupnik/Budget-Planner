import * as Yup from 'yup';

export const schemaNumberForm = Yup.object().shape({
  amount: Yup.number().required('Required'),
});
