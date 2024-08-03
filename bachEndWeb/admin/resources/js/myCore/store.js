import communicate from "./communicate.js";

const dataPlayList = {
    list : [
        {
            name_playlist: "",
            length : "",
            release_date : "",
            view : "",
            infor : ""
        }
    ]
}

function setData(type, data, value) {
    switch(value) {
        case "playlist":
            if (type === "remove") {
                dataPlayList.list = [];
            } else if (type === "add") {
                let playlist = data.list_playlist;
                // console.log("ahihhih ", playlist);
                playlist.forEach(item => {
                    dataPlayList.list.push({
                        name_playlist: item.name_playlist,
                        length: item.length,
                        release_date: item.release_date,
                        view: item.view,
                        infor: item.infor
                    });
                });
            }
            window.dataPlayList = dataPlayList;
            // console.log(dataPlayList);
            if(window.redata === "playlist"){
                communicate.contact("output", "playlist");
            }

            break;
        case "songs":
            // Xử lý trường hợp "songs"
            break;
    }
}





let store;

export default store;

export {setData};