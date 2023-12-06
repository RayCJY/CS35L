import React, { createContext, useContext, useReducer } from 'react';

// create new context
const GlobalStateContext = createContext();
const GlobalDispatchContext = createContext();

// defile initial state
const initialState = {
  info: undefined
};

// define reducer
const reducer = (state, action) => {
  switch (action.type) {
    case 'SIGNIN':
      return { ...state, info: action.payload };
    case 'SIGNOUT':
      return { ...state, info: undefined};
    default:
      throw new Error(`Unhandled action type: ${action.type}`);
  }
};

// create provider
export const GlobalProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <GlobalStateContext.Provider value={state}>
      <GlobalDispatchContext.Provider value={dispatch}>
        {children}
      </GlobalDispatchContext.Provider>
    </GlobalStateContext.Provider>
  );
};

// export hooks
export const useGlobalState = () => useContext(GlobalStateContext);
export const useDispatch = () => useContext(GlobalDispatchContext);