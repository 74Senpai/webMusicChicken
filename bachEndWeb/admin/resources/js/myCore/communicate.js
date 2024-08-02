import input from "./input.js";
import output from "./output.js";
import store from "./store.js";

const communicate = {
    contact(accusative){
        if(typeof accusative === "string"){
            accusative = accusative.trim();
            accusative = accusative.toUpperCase();
            switch(accusative){
                case "INPUT":
                    console.log('This is Input');
                    return input;
                case "OUTPUT":
                    
                    return output;
                case "STORE":
                    return store;
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
    },
    save(){

    },
    send(){

    },
    request(){

    },
    rollback(){

    },
    preview(){

    }
}

export default communicate;