import communicate from "./communicate.js";

const $ = document.querySelector.bind(document);
window.handle = communicate.contact;

let output = communicate.contact("output");
const input = communicate.contact("input");
// window.dataRequest = communicate.request;

export default function myCore(...data){
    // console.log(data);
    
    return data.join();
};

export function render(){
    $(`#root`).innerHTML = `${output.sendOutput()}`;
}

(async ()=>{
    let data = await communicate.request("playlist", "playlist.json");
    communicate.send("log", data, "add");
    communicate.send("store", data, "add", "playlist");
})();



