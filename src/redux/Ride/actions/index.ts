// all user
export const SET_ORIGIN = 'SET_ORIGIN';
export const SET_DESTINATION = 'SET_DESTINATION';

export const SET_RIDES = 'SET_RIDES';
export const SET_TRIP = 'SET_TRIP';

export const setRides = (rides: any) => (dispatch: any) => {
  dispatch({
    type: SET_RIDES,
    payload: rides,
  });
};

export const setTrip = (trip: any) => (dispatch: any) => {
  dispatch({
    type: SET_TRIP,
    payload: trip,
  });
};

export const setOrigin = (origin: any) => (dispatch: any) => {
  dispatch({
    type: SET_ORIGIN,
    payload: origin,
  });
};

export const setDestination = (destination: any) => (dispatch: any) => {
  dispatch({
    type: SET_DESTINATION,
    payload: destination,
  });
};
