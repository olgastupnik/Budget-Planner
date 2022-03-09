interface IInputField{
    id: string;
    type: string;
    name: string;
    label: string;
}

export const INPUTFIELDS: IInputField[] = [
  { id: 'email', type: 'text', name: 'email', label: 'Email' },
  { id: 'firstName', type: 'text', name: 'firstName', label: 'First name' },
  { id: 'lastName', type: 'text', name: 'lastName', label: 'Last Name' },
  { id: 'password', type: 'password', name: 'password', label: 'Password' },
];
