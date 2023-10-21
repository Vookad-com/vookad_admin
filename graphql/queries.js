import { gql } from '@apollo/client';

export const inventoryItems = gql`
query InventoryItems($family: String!) {
    inventoryItems(family: $family) {
      _id  
      name
    }
  }
`;

export const getinventoryItem = gql`
query GetInventoryItem($getInventoryItemId: ID) {
    getInventoryItem(id: $getInventoryItemId) {
        name
        description
        category {
          name
          price
          id:_id
        }
        gallery{
          url
          name
        }
    }
  }
`;