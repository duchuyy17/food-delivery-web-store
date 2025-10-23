import { gql } from "@apollo/client";

export const GET_ORDERS = gql`
  query OrdersByRestIdWithoutPagination($restaurant: String!, $search: String) {
    ordersByRestIdWithoutPagination(restaurant: $restaurant, search: $search) {
      _id
      orderId
      deliveryAddress {
        location {
          coordinates
          __typename
        }
        deliveryAddress
        details
        label
        __typename
      }
      items {
        _id
        title
        description
        image
        quantity
        variation {
          _id
          title
          price
          discounted
          __typename
        }
        addons {
          _id
          options {
            _id
            title
            description
            price
            __typename
          }
          description
          title
          quantityMinimum
          quantityMaximum
          __typename
        }
        specialInstructions
        isActive
        createdAt
        updatedAt
        __typename
      }
      user {
        _id
        name
        phone
        email
        __typename
      }
      paymentMethod
      paidAmount
      orderAmount
      orderStatus
      status
      paymentStatus
      reason
      isActive
      createdAt
      deliveryCharges
      tipping
      taxationAmount
      __typename
    }
  }
`;
