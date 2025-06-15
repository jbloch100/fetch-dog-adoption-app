import React, {
  createContext,
  useContext,
  useReducer,
  ReactNode,
  useEffect,
} from 'react';

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

// ✅ Load from localStorage right away
const loadInitialState = (): State => {
  try {
    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    return { favorites, user };
  } catch {
    return { favorites: [], user: null };
  }
};

const AppContext = createContext<{
  state: State;
  dispatch: React.Dispatch<Action>;
}>({ state: { favorites: [], user: null }, dispatch: () => null });

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(reducer, undefined, loadInitialState);

  // 🔁 Sync favorites to localStorage
  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(state.favorites));
  }, [state.favorites]);

  // 🔁 Sync user to localStorage
  useEffect(() => {
    if (state.user) {
      localStorage.setItem('user', JSON.stringify(state.user));
    } else {
      localStorage.removeItem('user');
    }
  }, [state.user]);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};

// 🧠 Pure reducer
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

export const useAppContext = () => useContext(AppContext);

export { reducer };