import overview from "../htmlRender/html.js";
import { playlist } from "../htmlRender/html.js";
import { header } from "../htmlRender/html.js";
import { songs } from "../htmlRender/html.js";
import { albums } from "../htmlRender/html.js";

let keys = "default";


const output = {

    sendOutput(){
        switch(keys){
            case "playlist":
                return header + playlist;
            case "songs":
                return header + songs;
            case "albums":
                return header + albums;
            case "authors":
                return header + "Authos";
            case "singer":
                return header + "Singer";
            default:
                let home = header+overview;
                return home;
        }   
    },

    _setKey(data){
        keys = data;
    },

    _getKey(){
        return keys;
    }

}
export default output;