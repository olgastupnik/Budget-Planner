import { useContext } from 'react';
import DeleteIcon from '@material-ui/icons/Delete';
import AddIcon from '@material-ui/icons/Add';
import { Formik, Form } from 'formik';
import { observer } from 'mobx-react';

import RootStore from 'store';
import { MyModal, InputField } from 'commonComponents';
import { ICategory } from 'types';
import { ItemCategory } from './components';
import { schemaCategories } from './validation';

import './Categories.css';

export const Categories: () => JSX.Element = observer(() => {
  const {
    budgetStore: {
      categoriesStore: { categories, addCategories, clearCategories, removeCategoryItem },
    },
    modalStore: { openCategoriesModal, isOpenCategoriesModal },
  } = useContext(RootStore);

  return (
    <div className="categories">
      <div className="box">
        <div>
          <h2>Categories</h2>
          <div>
            <button className="iconColor" type="button" onClick={openCategoriesModal}>
              <AddIcon style={{ fontSize: 'small' }} />
            </button>
            <button className="iconColor" type="button" onClick={clearCategories}>
              <DeleteIcon style={{ fontSize: 'small' }} />
            </button>
          </div>
        </div>
      </div>
      <ul>
        {categories.map((el: ICategory) => (
          <li key={el.title}>
            <ItemCategory
              title={el.title}
              description={el.description}
              isDefault={el.isDefault}
              id={el.id}
              remove={removeCategoryItem}
            />
          </li>
        ))}
      </ul>

      <MyModal isOpen={isOpenCategoriesModal} isShowCloseBtn desc="" title="Categories">
        <Formik
          initialValues={{ title: '', description: '' }}
          onSubmit={addCategories}
          validationSchema={schemaCategories}
        >
          {({ isValid, dirty }) => (
            <Form>
              <div>
                <InputField label="Title" id="title" type="text" name="title" />
              </div>
              <div>
                <InputField label="Description" id="description" type="text" name="description" />
              </div>

              <button type="submit" disabled={!isValid && dirty}>
                <AddIcon style={{ fontSize: 'small' }} />
              </button>
            </Form>
          )}
        </Formik>
      </MyModal>
    </div>
  );
});
