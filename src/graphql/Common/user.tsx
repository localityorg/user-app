import {gql} from '@apollo/client';

const USER_FRAGMENT = gql`
  fragment UserDetail on User {
    id
    name
    business
    contact {
      ISD
      number
    }
    deliveryAddresses {
      name
      line2
      line1
      coordinates {
        latitude
        longitude
      }
      pincode
    }
    token
    refreshToken
  }
`;

export const REGISTER_USER = gql`
  ${USER_FRAGMENT}
  mutation register(
    $name: String!
    $contact: ContactInput!
    $business: Boolean!
    $coordinates: CoordinateInput
    $categories: [String]
  ) {
    register(
      registerInput: {
        name: $name
        contact: $contact
        business: $business
        coordinates: $coordinates
        categories: $categories
      }
    ) {
      ...UserDetail
    }
  }
`;

export const LOGIN_USER = gql`
  ${USER_FRAGMENT}
  mutation login($contact: ContactInput!) {
    login(contact: $contact) {
      ...UserDetail
    }
  }
`;

export const EDIT_PROFILE = gql`
  mutation Mutation($editProfileInput: EditProfileInput) {
    editProfile(editProfileInput: $editProfileInput)
  }
`;

export const SET_ADDRESS = gql`
  mutation Mutation($address: String!) {
    editUpi(address: $address)
  }
`;

export const UPDATE_ADDRESSES = gql`
  mutation Mutation($updateAddressInput: UpdateAddress) {
    updateAddress(updateAddressInput: $updateAddressInput)
  }
`;

export const DELETE_ADDRESS = gql`
  mutation DeleteAddress($coordinate: CoordinateInput) {
    deleteAddress(coordinate: $coordinate)
  }
`;

export const DELETE_ACCOUNT = gql`
  mutation DeleteAccount {
    deleteAccount
  }
`;
