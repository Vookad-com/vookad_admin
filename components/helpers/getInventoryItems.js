import { gql } from "@apollo/client";
import client from "graphql/config";
import store from "../../redux/store";
import { load } from "redux/inventory";

export const fetchInventoryAsObj = async (data) =>{
    const { orders } = data;
    if(orders.length == 0)
        return;
    const pdtids = new Set();
    orders.forEach(ele => {
        ele.items.forEach(item => {
            pdtids.add(item.pdtid);
        })
    });
    
    let querystr = `query GetInventoryItems {
                        ${
                            [...pdtids].map((ele)=>`pdt${ele} : getInventoryItem(id: "${ele}") { name category { _id name }}`)
                            .join("\n")
                    }
                    }`;
    const { data:datum } = await client.query({query:gql`${querystr}`})
    store.dispatch(load(datum));
}