import { gql } from '@apollo/client';

export const inventoryItems = gql`
query InventoryItems($family: String!) {
    inventoryItems(family: $family) {
      _id  
      name
      enable
    }
  }
`;
export const banner = gql`
query Banner($bannerId: ID!) {
  banner(id: $bannerId) {
    gallery {
      route
      url
      name
      id
    }
  }
}
`;

export const getinventoryItem = gql`
query GetInventoryItem($getInventoryItemId: ID) {
    getInventoryItem(id: $getInventoryItemId) {
        name
        description
        tags
        category {
          name
          price
          id:_id
        }
        gallery{
          id
          url
          name
        }
    }
  }
`;

export const getMenu = gql`
query GetMenu($getchefId: ID!) {
  getchef(id: $getchefId) {
    displayname
  }
  getMenu(id: $getchefId) {
    inventoryid
    enable
  }
  inventoryItems(family: "menu") {
      _id
      name
    }
}
`;

export const getChefs = gql`
query Getchefs {
  getchefs {
    _id
    name
    pincode
    phone
  }
}
`

export const getOrders = gql`
query GetOrdersbyDate($dateIso: String!) {
  orders: getOrdersbyDate(dateISO: $dateIso) {
    _id
    userInfo {
      phone
    }
    address {
      location {
        coordinates
      }
      building
      area
      landmark
    }
    total
    createdAt
    status
  }
}
`;
export const getOrdersbyChef = gql`
query GetOrdersbyChef($chefId: String!, $status: String!) {
 orders: getOrdersByChef(chefId: $chefId, status: $status) {
    _id
    items {
      _id
      pdtid
      catid
      chefid
      quantity
    }
  }
}
`;