import myCore from "../myCore/core.js";


const overview = myCore`
    <div class="over-view">
        <iframe 
            src="../../webMusicChicken/index.html" 
            frameborder="0"
        ></iframe>
    </div>
    `;
export default overview;

let data;
try{
    data = window.dataPlayList.list && "0";
}catch(err){
    data = [];
}
const playlist = myCore`

<div class="table">
   <div class="row">
        <div class="STT">STT</div>
        <div class="playlist">Name Play List</div>
        <div class="length-list">Length</div>
        <div class="release-date">Release Date</div>
        <div class="view">View</div>
        <div class="More" colspan="3">More</div>
        <div class="delete">Delete Playlist</div>
   </div>
   ${
       data.map((item, index) => `
           <div class="row">
               <div class="STT">${index + 1}</div>
               <div class="playlist">${item.name_playlist}</div>
               <div class="length-list">${item.length}</div>
               <div class="release-date">${item.release_date}</div>
               <div class="view">${item.view}</div>
               <div class="More">More</div>
               <div class="delete">Delete</div>
           </div>
       `).join('')
   }
   <div class="row footer">
   </div>
</div>
`;

export {playlist};

const header = myCore`
    <header>
        <div class="tools-bar">
            <div class="" onclick="handle('output', 'home')">Home</div>
            <div class="" onclick="handle('output', 'playlist')">PlayList</div>
            <div class="" onclick="handle('output', 'albums')">Albums</div>
            <div class="" onclick="handle('output', 'songs')">Songs</div>
            <div class="" onclick="handle('output', 'authors')">Authors</div>
            <div class="" onclick="handle('output', 'singer')">Singers</div>
            <div class="" onclick="handle('output', '')">Error</div>
            <div class="" onclick="handle('output', '')">Account Client</div>
            <div class="" onclick="handle('output', '')">Your</div>
        </div>
        Over View
        <button onclick="handle('output', 'reload')">Refresh</button>
    </header>`;

export {header};

const albums = myCore`
    <div class="table">
        <div class="row">
                <div class="STT">STT</div>
                <div class="albums">Name Album</div>
                <div class="length-list">Length</div>
                <div class="release-date">Release Date</div>
                <div class="view">View</div>
                <div class="More" colspan="3">More</div>
                <div class="delete">Delete Album</div>
        </div>
        <div class="row">
                <div class="STT">1</div>
                <div class="playlist">M-TP Song</div>
                <div class="length-list">10</div>
                <div class="release-date">02/08/2024</div>
                <div class="view">100K</div>
                <div class="More">
                    <div><a href="#">Infor</a></div>
                    <div><a href="#">Add Songs</a></div>
                    <div><a href="#">Remove Songs</a></div>
                </div>
                <div class="delete">X</div>
        </div>
        <div class="row footer"></div>
    </div>
`;

export {albums};

const songs = myCore`
    <div class="table">
        <div class="row">
                <div class="STT">STT</div>
                <div class="songs">Name song</div>
                <div class="length-list">Length</div>
                <div class="release-date">Release Date</div>
                <div class="view">View</div>
                <div class="More" colspan="3">More</div>
                <div class="delete">Delete Song/div>
        </div>
        <div class="row">
                <div class="STT">1</div>
                <div class="playlist">Chung ta cua hien tai</div>
                <div class="length-list">10</div>
                <div class="release-date">02/08/2024</div>
                <div class="view">100K</div>
                <div class="More">
                    <div><a href="#">Infor</a></div>
                </div>
                <div class="delete">X</div>
        </div>
        <div class="row footer"></div>
    </div>
`;

export {songs};