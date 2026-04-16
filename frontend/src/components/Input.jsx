import React from 'react';

const Input = ({ type = 'text', value, onChange, placeholder, required = false }) => {
  return (
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
    />
  );
};

export default Input;