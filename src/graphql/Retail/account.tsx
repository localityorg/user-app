import { gql } from "@apollo/client";

export const BOOL_RUNNINGACCOUNT_PRIVACY = gql`
	mutation BoolRunningAccountPrivacy($id: String!) {
		boolRunningAccountPrivacy(id: $id)
	}
`;

const ACCOUNTS_FRAGMENT = gql`
	fragment AccountDetail on UserAccounts {
		store {
			id
			name
		}
		data {
			id
			name
			closed
			totalAmount
			settledAmount
			orders {
				orderId
				amount
				paid
			}
			address {
				line1
				line2
			}
			private
		}
	}
`;

export const GET_ACCOUNTS_UPDATE = gql`
	subscription Subscription($contact: ContactInput, $storeId: String) {
		accountsUpdate(contact: $contact, storeId: $storeId) {
			store {
				id
				name
			}
			data {
				id
				name
				closed
				totalAmount
				settledAmount
				orders {
					orderId
					amount
					paid
				}
				address {
					line1
					line2
				}
				private
				date
			}
		}
	}
`;

export const FETCH_RUNNINGACCOUNTS = gql`
	query FetchAccounts {
		fetchRunningAccounts {
			store {
				id
				name
			}
			data {
				id
				name
				closed
				totalAmount
				settledAmount
				orders {
					orderId
					amount
					paid
				}
				address {
					line1
					line2
				}
				private
				date
			}
		}
	}
`;

export const FETCH_SETTLE_URL = gql`
	mutation FetchUrl($id: String!) {
		settleAccountUri(id: $id) {
			error
			message
			url
		}
	}
`;
