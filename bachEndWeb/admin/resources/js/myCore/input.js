import communicate from "./communicate.js";

async function getData(API) {
    try {
        const response = await fetch(API);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Lỗi khi lấy dữ liệu từ API: ", error);
        throw error; // Ném lỗi ra ngoài để xử lý tiếp nếu cần
    }
}
let data;
const getDataPlayList = getData;

getDataPlayList("playlist.json")
    .then(result => {
        // console.log("result fetched:", result);
        data = result.list_playlist;
        // data = result;
        return result;
    })
    .catch(error => {
        console.error("Error:", error);
        // Xử lý lỗi nếu cần
    });

export { getDataPlayList };
