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
export const liveToggle= gql`
mutation Mutation($liveToggleId: ID!, $status: Boolean) {
  liveToggle(id: $liveToggleId, status: $status) {
    enable
  }
}
`;
export const editbanner= gql`
mutation Mutation($carouselId: ID!, $payload: [GalleryInput]) {
  carousel(id: $carouselId, payload: $payload) {
    gallery {
      route
      url
      name
      id
    }
  }
}
`;

export const newChef= gql`
mutation Mutation($chef: ChefInput) {
  newchef(chef: $chef) {
    _id
  }
}
`;

export const editmenu = gql`
mutation EditMenu($chefId: String, $inventoryid: String, $enable: Boolean) {
  editMenu(chefId: $chefId, inventoryid: $inventoryid, enable: $enable) {
    enable  
  }
}
`;

export const setToPickup = gql`
mutation setToPickup($orderid: String) {
  setToPickup(orderid: $orderid)
}
`;