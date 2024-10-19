import React from 'react';

import { LucideProps } from 'lucide-react';

interface InputFieldProps {
  name: string;
  placeholder: string;
  type: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  Icon?: React.ComponentType<LucideProps>; // Match Lucide icon props
}


export const InputField: React.FC<InputFieldProps> = ({ name, placeholder, type, value, onChange, Icon }) => {
  return (
    <div className="flex items-center bg-gray-100 rounded-md p-2">
      {Icon && <Icon className="text-gray-500 mr-2" size={20} />}
      <input
        type={type}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="bg-transparent w-full focus:outline-none"
      />
    </div>
  );
};
