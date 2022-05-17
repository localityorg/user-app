import { gql } from "@apollo/client";

export const CREATE_ORDER = gql`
	mutation CreateNewOrderMutation($createOrderInput: CreateOrderInput) {
		createNewOrder(createOrderInput: $createOrderInput) {
			id
		}
	}
`;

const ORDER_FRAGMENT = gql`
	fragment OrderDetail on Order {
		id
		meta {
			isLinked
			linkedOrder
			storeName
		}
		payment {
			paid
			isRefund
			deliveryAmount
			grandTotal
			totalAmount
		}
		products {
			id
			brand
			name
			totalPrice
			imageUrl
			quantity {
				count
				type
			}
			itemQuantity
		}
		linkedOrders {
			orderId
		}
		state {
			isConfirmed
			isReturned
			isCancelled
			isDropped
		}
		rating
		delivery {
			isDelivered
			deliveryDate
			deliverBy
			isDelivery
			deliveryAddress {
				line1
				line2
			}
			isDispatched
			dispatchDate
		}
		error {
			isError
			message
		}
		date
	}
`;

export const GET_ORDERS = gql`
	query Query {
		getOrders {
			id
			meta {
				isLinked
				linkedOrder
				storeName
			}
			payment {
				paid
				isRefund
				deliveryAmount
				grandTotal
				totalAmount
			}
			products {
				id
				brand
				name
				totalPrice
				imageUrl
				quantity {
					count
					type
				}
				itemQuantity
			}
			linkedOrders {
				orderId
			}
			state {
				isConfirmed
				isReturned
				isCancelled
				isDropped
			}
			rating
			delivery {
				isDelivered
				deliveryDate
				deliverBy
				isDelivery
				deliveryAddress {
					line1
					line2
				}
				isDispatched
				dispatchDate
			}
			error {
				isError
				message
			}
			date
		}
	}
`;

export const GET_NEW_ORDER = gql`
	subscription Subscription($id: String!) {
		newOrder(id: $id) {
			id
			meta {
				isLinked
				linkedOrder
				storeName
			}
			payment {
				paid
				isRefund
				deliveryAmount
				grandTotal
				totalAmount
			}
			products {
				id
				brand
				name
				totalPrice
				imageUrl
				quantity {
					count
					type
				}
				itemQuantity
			}
			linkedOrders {
				orderId
			}
			state {
				isConfirmed
				isReturned
				isCancelled
				isDropped
			}
			rating
			delivery {
				isDelivered
				deliveryDate
				deliverBy
				isDelivery
				deliveryAddress {
					line1
					line2
				}
				isDispatched
				dispatchDate
			}
			error {
				isError
				message
			}
			date
		}
	}
`;

export const DROP_ORDER = gql`
	mutation Mutation($orderId: String!) {
		droppedOrder(orderId: $orderId)
	}
`;

export const RATE_ORDER = gql`
	mutation RateMutation($rating: Int, $orderId: String!) {
		rateOrder(rating: $rating, orderId: $orderId)
	}
`;

export const GET_TOTAL = gql`
	query GetTotal($orderTotalInput: OrderTotalInput) {
		getTotal(orderTotalInput: $orderTotalInput) {
			deliveryCharge
			taxCharge
			grandTotal
			error
			message
		}
	}
`;

export const GET_DELIVERY_TIMES = gql`
	query DeliveryTimes {
		getDeliveryTimes {
			type
			text
			n
			active
		}
	}
`;

export const GET_PAYMENT_OPTIONS = gql`
	query PaymentOptions {
		getPaymentOptions {
			title
			subtext
			data {
				mode
				uri
				uri1
				type
				pre
				text
				active
			}
		}
	}
`;
