import communicate from "./communicate.js";

let store = communicate.contact("Store");
store.data = "Khong Hihi";

const outPut = communicate.contact("output");

const myCore = {
    render(){
        store.data = "Khong Hihi";
        console.log(outPut);
        console.log("data", store.data);
    }
}


export default myCore;
