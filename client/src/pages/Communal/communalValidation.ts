import * as Yup from 'yup';

export const communalSchema = Yup.object().shape({
  water: Yup.number().required('Required'),
  gas: Yup.number().required('Required'),
  heating: Yup.number().required('Required'),
  timestamp: Yup.date().required('Required'),
});
