import store from "../../redux/store";
import { load } from "../../redux/orders";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { database } from "../../firebase/config";
import client from "graphql/config";
import { getOrders } from "graphql/queries";

function dateconverter(timestamp){
    const date = new Date(+timestamp);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    const readableDateTime = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;

    return readableDateTime;

}
// https://www.google.co.in/maps/place/20%C2%B015'05.1%22N+85%C2%B046'04.0%22E
export async function callordersDB(date){
    const {data:{orders}} = await client.query({
        query: getOrders,
        variables:{
            dateIso: date
        },
        fetchPolicy: 'no-cache'
    });
    // console.log(orders, date);
    let orderArr = [];
    for (const ele of orders) {
        orderArr.push({
            id : ele.id,
            time: dateconverter(ele.createdAt),
            phone: ele.userInfo[0].phone,
            address: ele.address,
            total: ele.total,
        });
    }
    store.dispatch(load(orderArr));
}