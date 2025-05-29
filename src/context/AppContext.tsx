import React, { createContext, useContext, useReducer, ReactNode } from 'react';

interface User {
  name: string;
  email: string;
}

interface State {
  favorites: string[];
  user: User | null;
}

type Action =
  | { type: 'ADD_FAVORITE'; payload: string }
  | { type: 'REMOVE_FAVORITE'; payload: string }
  | { type: 'CLEAR_FAVORITES' }
  | { type: 'LOGIN'; payload: User }
  | { type: 'LOGOUT' };

const initialState: State = {
  favorites: [],
  user: null,
};

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'ADD_FAVORITE':
      return {
        ...state,
        favorites: [...new Set([...state.favorites, action.payload])],
      };
    case 'REMOVE_FAVORITE':
      return {
        ...state,
        favorites: state.favorites.filter(id => id !== action.payload),
      };
    case 'CLEAR_FAVORITES':
      return { ...state, favorites: [] };
    case 'LOGIN':
      return { ...state, user: action.payload };
    case 'LOGOUT':
      return { favorites: [], user: null };
    default:
      return state;
  }
}

const AppContext = createContext<{
  state: State;
  dispatch: React.Dispatch<Action>;
}>({ state: initialState, dispatch: () => null });

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);