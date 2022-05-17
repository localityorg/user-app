import React, {useReducer, createContext} from 'react';
import jwtDecode from 'jwt-decode';
import * as SecureStore from 'expo-secure-store';

const initialState = {user: null};

async function save(key, value) {
  await SecureStore.setItemAsync(key, value);
}

async function remove(key) {
  await SecureStore.deleteItemAsync(key);
}

async function getValueFor(key) {
  let result = await SecureStore.getItemAsync(key);
  if (result) {
    return result;
  } else {
    return null;
  }
}

getValueFor('jwtToken').then(data => {
  if (data) {
    const decodedToken = jwtDecode(data);
    if (decodedToken.exp * 1000 < Date.now()) {
      remove('jwtToken');
      remove('refreshToken');
    } else {
      initialState.user = {...decodedToken, data};
    }
  }
});

export const AuthContext = createContext({
  user: null,
  login: userData => {},
  logout: () => {},
});

function authReducer(state, action) {
  switch (action.type) {
    case 'LOGIN':
      return {
        ...state,
        user: action.payload,
      };
    case 'LOGOUT':
      return {
        ...state,
        user: null,
      };
    default:
      return state;
  }
}

export function AuthProvider(props) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  function login(userData) {
    save('jwtToken', userData.token).then(() => {
      save('refreshToken', userData.refreshToken);
    });
    dispatch({
      type: 'LOGIN',
      payload: userData,
    });
  }

  function logout() {
    remove('jwtToken').then(() => {
      remove('refreshToken');
    });
    dispatch({
      type: 'LOGOUT',
    });
  }

  return <AuthContext.Provider value={{user: state.user, login, logout}} {...props} />;
}
