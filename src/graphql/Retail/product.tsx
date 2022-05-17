import { gql } from "@apollo/client";

export const GET_SEARCH_RESULTS = gql`
	query getProducts(
		$name: String!
		$category: Boolean!
		$limit: Int!
		$offset: Int!
	) {
		getProducts(
			name: $name
			category: $category
			limit: $limit
			offset: $offset
		) {
			id
			brand
			name
			buyable
			productId
			meta {
				isDivisible
				isEdible
				isFlagged
			}
			skus {
				id
				meta {
					isVeg
					isVegan
					isFlagged
					isSale
				}
				name
				brand
				price {
					mrp
					sale
				}
				imageUrl
				quantity {
					count
					type
				}
			}
		}
	}
`;

export const GET_QUICK_RESULTS = gql`
	query getProducts($name: String!, $category: Boolean!) {
		getProducts(name: $name, category: $category) {
			id
			name
			skus {
				imageUrl
			}
		}
	}
`;

export const GET_SUGGESTIONS = gql`
	query Suggestions($name: String) {
		getSuggestions(name: $name) {
			id
			name
			category
			imageUrl
		}
	}
`;

export const FETCH_ORDER_PRODUCTS = gql`
	query OrderProducts($orderId: String!) {
		getOrder(orderId: $orderId) {
			products {
				id
				brand
				name
				totalPrice
				imageUrl
				itemQuantity
				quantity {
					count
					type
				}
			}
		}
	}
`;
