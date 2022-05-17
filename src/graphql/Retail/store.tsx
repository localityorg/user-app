import { gql } from "@apollo/client";

export const GET_STORES = gql`
	query GetStores($coordinates: CoordinateInput) {
		getAccountStores(coordinates: $coordinates) {
			id
			name
			distance
			available
			amount
		}
	}
`;

export const INVITE_STORE = gql`
	mutation InviteMutation($contact: ContactInput) {
		shopRequest(contact: $contact) {
			error
			message
		}
	}
`;
