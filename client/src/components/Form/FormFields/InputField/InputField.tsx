import TextField from '@material-ui/core/TextField';
import { Field, useField } from 'formik';

import './InputField.css';

interface IInputFieldProps {
  label: string;
  name: string;
  id?: string;
  type?: string;
  className?: string;
  defaultValue?: string;
  InputLabelProps?: any;
  disabled?: any;
}

export const InputField: React.FC<IInputFieldProps> = ({ label, name, ...props }) => {
  const [field, { touched, error, ...meta }, helpers] = useField({ name });

  const fieldId = name;

  return (
    <div className="textFieldBox">
      <label className="modalText" htmlFor={fieldId}>
        {label}
      </label>
      <Field
        className="textFieldWidth"
        type="text"
        id={fieldId}
        errors={touched && error}
        variant="outlined"
        component={TextField}
        {...field}
        {...helpers}
        {...props}
      />
    </div>
  );
};
