import { useContext } from 'react';
import { observer } from 'mobx-react';
import { Formik, Field, Form } from 'formik';

import RootStore from 'store';
import { InputField } from 'commonComponents';
import { findCategoryByTitle } from 'helpers';
import { ICategory, IInitValues } from 'types';
import { schemaNumberForm } from './validationNotes';

import './Notes.css';

const initialValues: IInitValues = {
  amount: 0,
  type: 'expense',
  categoryTitle: 'Food',
};

export const Notes: () => JSX.Element = observer(() => {
  const {
    budgetStore: {
      accountStore: { initialAmount, editBudget },
      categoriesStore: { categories },
    },
    profileStore: { userId },
  } = useContext(RootStore);

  return (
    <div className="add">
      <div className="box">
        <h2>Add notes</h2>
        <Formik
          initialValues={initialValues}
          onSubmit={({ amount, type, categoryTitle }, { resetForm }) => {
            const category = findCategoryByTitle(categoryTitle, categories);

            if (category && category.id) {
              editBudget({ amount, type, category_id: category.id, user: userId });
              resetForm();
            }
          }}
          validationSchema={schemaNumberForm}
        >
          {({ isValid, dirty }) => (
            <Form>
              <div>
                <h3>Amount:</h3>
                <InputField className="inputBox" label="" id="amount" type="number" name="amount" />
              </div>
              <div>
                <h3>Category:</h3>
                <Field as="select" name="categoryTitle" className="boxCategory">
                  {categories.map((el: ICategory) => (
                    <option key={el.id} value={el.title}>
                      {el.title}
                    </option>
                  ))}
                </Field>
              </div>
              <div className="labelBox">
                <h3>Type</h3>
                <label htmlFor="income">
                  income
                  <Field id="income" type="radio" name="type" value="income" />
                </label>
                <label htmlFor="expense">
                  expense
                  <Field id="expense" type="radio" name="type" value="expense" />
                </label>
              </div>
              <button type="submit" className="custom-btn btn-4" disabled={!isValid || !dirty || initialAmount === 0}>
                Add note
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
});
