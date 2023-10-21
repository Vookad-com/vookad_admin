import store from "../../redux/store";
import { load } from "../../redux/orders";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { database } from "../../firebase/config";

function dateconverter(timestamp){
    const date = new Date(timestamp);

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
export async function callordersDB(){
    let ref = query(collection(database, 'orders'), orderBy('timestamp', 'desc'));
    let orders = onSnapshot(ref, snapshot=>{
        let orderArr = [];
        for (const ele of snapshot.docs) {
            orderArr.push({
                time: dateconverter(ele.data().timestamp),
                phone: ele.data().phone,
                address: ele.data().address,
                cart: ele.data().cart,
                total: ele.data().total,
                stores: ele.data().stores,
                payment: ele.data().payStatus,
                ref: ele,
            });
        }
        store.dispatch(load(orderArr));
      });
}