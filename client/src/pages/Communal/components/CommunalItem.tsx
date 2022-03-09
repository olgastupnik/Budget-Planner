import React from 'react';

import { InputField } from 'commonComponents';
import { ICommunalItem } from 'types';

import './communalItem.css';

export const CommunalItem = ({ title, price }: ICommunalItem) => {
  return (
    <div className="communalItem">
      <span>{title}</span>
      <InputField label="value" type="number" name={title} />
      <h3>{`price: ${price} hrn`}</h3>
    </div>
  );
};
