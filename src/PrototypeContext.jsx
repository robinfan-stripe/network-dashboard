import React, { createContext, useContext, useState, useCallback } from 'react';

const PrototypeContext = createContext(null);

export const usePrototype = () => {
  const context = useContext(PrototypeContext);
  if (!context) {
    throw new Error('usePrototype must be used within a PrototypeProvider');
  }
  return context;
};

export const PrototypeProvider = ({ children, initialVariables = {}, initialControlVariables = {} }) => {
  const [variables, setVariables] = useState(initialVariables);
  const [controlVariables, setControlVariables] = useState(initialControlVariables);

  // Set a single variable
  const setVariable = useCallback((key, value) => {
    setVariables(prev => ({
      ...prev,
      [key]: value
    }));
  }, []);

  // Set multiple variables at once
  const setMultipleVariables = useCallback((updates) => {
    setVariables(prev => ({
      ...prev,
      ...updates
    }));
  }, []);

  // Get a variable
  const getVariable = useCallback((key, defaultValue = undefined) => {
    return variables[key] !== undefined ? variables[key] : defaultValue;
  }, [variables]);

  // Reset all variables to initial state
  const resetVariables = useCallback(() => {
    setVariables(initialVariables);
  }, [initialVariables]);

  // Reset to a new set of variables
  const replaceVariables = useCallback((newVariables) => {
    setVariables(newVariables);
  }, []);

  // Control panel variable management
  const setControlVariable = useCallback((key, value) => {
    setControlVariables(prev => ({
      ...prev,
      [key]: value
    }));
  }, []);

  const getControlVariable = useCallback((key, defaultValue = undefined) => {
    return controlVariables[key] !== undefined ? controlVariables[key] : defaultValue;
  }, [controlVariables]);

  // Set multiple control variables at once
  const setMultipleControlVariables = useCallback((updates) => {
    setControlVariables(prev => ({
      ...prev,
      ...updates
    }));
  }, []);

  const value = {
    variables,
    setVariable,
    setMultipleVariables,
    getVariable,
    resetVariables,
    replaceVariables,
    controlVariables,
    setControlVariable,
    setControlVariables: setMultipleControlVariables,
    getControlVariable,
  };

  return (
    <PrototypeContext.Provider value={value}>
      {children}
    </PrototypeContext.Provider>
  );
};
