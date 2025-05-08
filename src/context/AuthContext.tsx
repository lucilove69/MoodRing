import React, { createContext, useReducer, useEffect } from 'react';
import { AuthState, User } from '../types';
import { api } from '../services/api';

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  register: (userData: Partial<User>) => Promise<void>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => Promise<void>;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  token: localStorage.getItem('token'),
  loading: true,
  error: null,
};

type AuthAction =
  | { type: 'LOGIN_SUCCESS'; payload: { user: User; token: string } }
  | { type: 'REGISTER_SUCCESS'; payload: { user: User; token: string } }
  | { type: 'USER_LOADED'; payload: User }
  | { type: 'USER_UPDATED'; payload: User }
  | { type: 'AUTH_ERROR' }
  | { type: 'LOGIN_FAIL'; payload: string }
  | { type: 'REGISTER_FAIL'; payload: string }
  | { type: 'LOGOUT' }
  | { type: 'CLEAR_ERROR' }
  | { type: 'SET_LOADING'; payload: boolean };

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'USER_LOADED':
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload,
        loading: false,
      };
    case 'LOGIN_SUCCESS':
    case 'REGISTER_SUCCESS':
      localStorage.setItem('token', action.payload.token);
      return {
        ...state,
        ...action.payload,
        isAuthenticated: true,
        loading: false,
        error: null,
      };
    case 'USER_UPDATED':
      return {
        ...state,
        user: action.payload,
        loading: false,
      };
    case 'AUTH_ERROR':
    case 'LOGIN_FAIL':
    case 'REGISTER_FAIL':
      localStorage.removeItem('token');
      return {
        ...state,
        token: null,
        isAuthenticated: false,
        user: null,
        loading: false,
        error: action.type === 'AUTH_ERROR' ? 'Authentication error' : action.payload,
      };
    case 'LOGOUT':
      localStorage.removeItem('token');
      return {
        ...state,
        token: null,
        isAuthenticated: false,
        user: null,
        loading: false,
      };
    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null,
      };
    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload,
      };
    default:
      return state;
  }
};

export const AuthContext = createContext<AuthContextType>({
  ...initialState,
  login: async () => {},
  register: async () => {},
  logout: () => {},
  updateUser: async () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    const loadUser = async () => {
      if (state.token) {
        try {
          const res = await api.get('/auth/user');
          dispatch({ type: 'USER_LOADED', payload: res.data });
        } catch (err) {
          dispatch({ type: 'AUTH_ERROR' });
        }
      } else {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    };

    loadUser();
  }, [state.token]);

  const login = async (email: string, password: string) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const res = await api.post('/auth/login', { email, password });
      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: res.data,
      });
    } catch (err: any) {
      dispatch({
        type: 'LOGIN_FAIL',
        payload: err.response?.data?.message || 'Login failed',
      });
    }
  };

  const register = async (userData: Partial<User>) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const res = await api.post('/auth/register', userData);
      dispatch({
        type: 'REGISTER_SUCCESS',
        payload: res.data,
      });
    } catch (err: any) {
      dispatch({
        type: 'REGISTER_FAIL',
        payload: err.response?.data?.message || 'Registration failed',
      });
    }
  };

  const logout = () => {
    dispatch({ type: 'LOGOUT' });
  };

  const updateUser = async (userData: Partial<User>) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const res = await api.put('/users/update', userData);
      dispatch({
        type: 'USER_UPDATED',
        payload: res.data,
      });
    } catch (err: any) {
      // Handle error but don't log out - just set loading to false
      dispatch({ type: 'SET_LOADING', payload: false });
      throw err;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        register,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};