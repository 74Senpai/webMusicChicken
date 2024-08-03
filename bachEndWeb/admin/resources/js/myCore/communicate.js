import {getDataPlayList} from "./input.js";
import output from "./output.js";
import store from "./store.js";
import { render } from "./core.js";
import { setData } from "./store.js";

const input = 0;
const $ = document.querySelector.bind(document);


const communicate = {
    
    contact(accusative, data){
        let result;
        window.redata = data;
        if(typeof accusative === "string"){
            accusative = accusative.trim();
            accusative = accusative.toUpperCase();
            switch(accusative){
                case "INPUT":
                    result = input;
                    break;
                case "OUTPUT":
                    output._setKey(data);
                    result = output;
                    break;
                case "STORE":
                    result = store;
                    break;
                default:
                    console.group("Core");
                    console.error("Accusative is not define", accusative);
                    console.groupEnd();
            }
        }else{
            console.group("Core");
            console.error("Accusative is not type String", accusative);
            console.groupEnd();
        } 
        if(!data){
            return result;
        }
        render();
        
    },
    save(){
        
    },
    request(option, API){
        switch(option){
            case "playlist":
                // console.log(getDataPlayList);
                return getDataPlayList(API);
            case "songs":
                break;
            case "authors":
                break;
            case "albums":
                break;
            case "singers":
                break;
            default:
                console.group("Core");
                console.error("Option data is not config", option);
                console.groupEnd();
        }
    },
    rollback(){

    },
    preview(){

    },
    send(accusative, data, type, value){
        switch(accusative){
            case "store":
                setData(type, data, value);
                break;
            case "output":
                break;
            case "input":
                break;
            case "core":
                break;
            case "view":
                break;
            case "log":
                console.group("Core------> send log");
                console.log(data);
                console.log("-------------------------------------");
                console.groupEnd();
                break;
            default:
                console.group("Core------");
                console.log("Accusative is not define: ", accusative);
                console.groupEnd();
        }
    },
    action(type){
        switch(type){
            case "add":
                return ;
            case "remove":
                return ;
            case "replace":
                return ;
            
        }
    }
}

export default communicate;