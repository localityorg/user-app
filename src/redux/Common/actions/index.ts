// all user
export const SET_USER = 'SET_USER';
export const REMOVE_USER = 'REMOVE_USER';

// location
export const SET_USER_LOCATION = 'SET_USER_LOCATION';

export const setUser = (user: any) => (dispatch: any) => {
  dispatch({
    type: SET_USER,
    payload: user,
  });
};

export const removeUser = () => (dispatch: any) => {
  dispatch({
    type: REMOVE_USER,
  });
};

export const setUserLocation =
  (location: {latitude: string; longitude: string}) => (dispatch: any) => {
    dispatch({
      type: SET_USER_LOCATION,
      payload: location,
    });
  };
