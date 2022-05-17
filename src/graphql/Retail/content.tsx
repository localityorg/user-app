import { gql } from "@apollo/client";

const PRODUCT_FRAGMENT = gql`
	fragment ProductDetails on Product {
		id
		brand
		name
		skus {
			id
			brand
			name
			quantity {
				count
				type
			}
			price {
				mrp
				sale
			}
			imageUrl
		}
	}
`;

export const GET_CONTENT = gql`
	${PRODUCT_FRAGMENT}
	query GetContent {
		getContent {
			products {
				...ProductDetails
			}
			fromarea {
				...ProductDetails
			}
			title
			error
			carts {
				title
				iconUri
				products {
					...ProductDetails
				}
				trending
			}
			stores
			available
			tracking
			message
		}
	}
`;
