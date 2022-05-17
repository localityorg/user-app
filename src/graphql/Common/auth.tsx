import {gql} from '@apollo/client';

export const TWOFACTOR_AUTH = gql`
  query Query($contact: ContactInput!, $newAcc: Boolean!) {
    twoFactorAuth(contact: $contact, newAcc: $newAcc) {
      date
      error
      message
    }
  }
`;

export const CHECK_AUTH = gql`
  query Query($contact: ContactInput!, $secureCode: String!) {
    checkAuth(contact: $contact, secureCode: $secureCode) {
      error
      status
      errorMsg
    }
  }
`;
