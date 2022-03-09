import * as Yup from 'yup';

export const schemaCategories = Yup.object().shape({
  title: Yup.string().required('Required'),
  description: Yup.string().required('Required'),
});
