import React from 'react';
import { PrototypeProvider } from './PrototypeContext';

const PrototypeContent = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Prototype Content */}
      {children}
    </div>
  );
};

const PrototypeWrapper = ({
  children,
  initialVariables = {},
  initialControlVariables = {}
}) => {
  return (
    <PrototypeProvider
      initialVariables={initialVariables}
      initialControlVariables={initialControlVariables}
    >
      <PrototypeContent>
        {children}
      </PrototypeContent>
    </PrototypeProvider>
  );
};

export default PrototypeWrapper;
