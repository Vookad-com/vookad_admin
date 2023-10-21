import { gql } from '@apollo/client';

export const editItems = gql`
mutation InventoryItem($obj: InventoryItemInput) {
    inventoryItem(obj: $obj) {
      name
    }
  }
`;
export const createItem = gql`
mutation NewItemAdd($family: String!) {
    inventoryAdd(family: $family) {
      _id
    }
  }
`;
export const delItem = gql`
mutation NewItemAdd($deleteinventoryItemId: ID) {
    deleteinventoryItem(id: $deleteinventoryItemId) {
        _id
      }
  }
`;