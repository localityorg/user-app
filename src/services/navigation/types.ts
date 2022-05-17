export type ModalProps = {
  RetailTrack: {
    id: string;
    back: string;
    data: string;
  };
  RetailCheckout: undefined;
  RideTrack: undefined;
  RideCheckout: undefined;
};

export type AuthScreenProps = {
  Splash: undefined;
  Onboarding: undefined;
  Login: undefined;
  Register: undefined;
};

export type MainScreenProps = {
  Main: undefined;
  Profile: undefined;
  Addresses: undefined;
  Accounts: undefined;
  Retail: undefined;
  Ride: undefined;
};

export type ScreenProps = {
  RetailMain: undefined;
  Cart: undefined;
  SearchRetail: {
    name: string;
    category: string;
  };
  AllOrders: undefined;
  RideMain: undefined;
  Trips: undefined;
} & AuthScreenProps &
  MainScreenProps &
  ModalProps;
