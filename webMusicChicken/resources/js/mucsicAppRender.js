"use strict";
const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

function musicApp(){
    let currenSong = 0;
    let isRandom = false;
    let isLoop = false;
    let listSong = {};
    let isRun = false;
    let boxForInnerHTML = "";
    let lengthList = 0;
    let activeClassName = "";
    let template = ``;
    let dataAPI;
    let fontButton = `<script src="https://kit.fontawesome.com/dae763dd72.js" crossorigin="anonymous"></script>`;
    
    function getData(API){
        fetch(`${API}`)
            .then(response => response.json())
            .then(data => {
                dataAPI = data;
                console.log(data);
            })
            .catch(error =>{
                console.error("Loi khi lay data tu API: ",error);
            }); 
        return dataAPI;
    }

    function renderStruct(template, boxForInnerHTML){
        if(template){
            $(`${boxForInnerHTML}`).innerHTML = template;
        }else{
            let tmp = "";
            for(let i = 0; i < lengthList ; i++){
                tmp += `<div class="song" data-index="@{index}">
                            <div class="img-mini row">
                                <img src="@{img}" alt="@{alt-img}">
                            </div>
                            <div class="infor-song row">
                                <div class="nameSong">@{name-song}</div>
                                <div class="author">@{author} @{singer}</div>
                            </div>
                            <div class="row">
                                <div class="more"><i class="fa-solid fa-ellipsis-vertical"></i> </div>
                            </div>
                        </div>`;

            };
            template = `<div id="container-song-render">
                    <div class="song-infor">
                        <div class="img-song">
                            <img src="@{img}" alt="@{alt-img}">
                        </div>
                        <div class="prossesses-bar"><button name="playTime"></button></div>
                        <div class="control-bar">
                            <button id="loop" name="loop-btn"><i class="fa-solid fa-arrows-rotate"></i></button>
                            <button id="pre" name="pre-btn"><i class="fa-solid fa-backward"></i></button>
                            <button id="pause" name="pause-btn"><i class="fa-solid fa-pause"></i></button>
                            <button id="play" name="play-btn"><i class="fa-solid fa-play"></i></button>
                            <button id="next" name="next-btn"><i class="fa-solid fa-forward"></i></button>
                            <button id="random" name="random-btn"><i class="fa-solid fa-shuffle"></i></button>
                        </div>
                    </div>
                    <div class="container-songLyrics">@{lyrics}</div>
                    <div class="container-songList">
                        ${tmp}
                    </div>
                </div>
                ${fontButton}`;
            $(`${boxForInnerHTML}`).innerHTML = template;
        }
    }

    function skipSong(isNext, isSelect = false) {

        if (!isSelect) {
            if (isRandom) {
                currenSong = getRndInteger(0, length - 1);
            } else {
                if (isNext) {
                    currenSong += 1;
                    if (currenSong >= length) {
                        currenSong = 0;
                    }
                } else {
                    currenSong -= 1;
                    if (currenSong < 0) {
                        currenSong = length - 1;
                    }
                }
            }
        }
        let act;
        let box;
        try{
            box = $(`${boxList}>${type}${active}`).classList;
            act = $(`[data-index="${currenSong}"]`).classList;
            box.remove(`${active}`);
            act.add(`${active}`);
        }catch(err){
            console.log("have an error");
        } 
    }

    function controlBar(){
        const method = {
            playMusic: function (eventClient, playBtn, pauseBtn) {
                $(`${playBtn}`).addEventListener(`${eventClient}`, function () {
                    $(playBtn).style.display = "none";
                    $(pauseBtn).style.display = "inline-block";
                });

                $(`${pauseBtn}`).addEventListener(`${eventClient}`, function () {
                    $(pauseBtn).style.display = "none";
                    $(playBtn).style.display = "inline-block";
                });

            },

            nextSong: function (eventClient, nextBtn) {
                const random = isRandom;
                
                $(`${nextBtn}`).addEventListener(`${eventClient}`, ()=>{
                    skipSong(true);
                });
            },

            preSong: function (eventClient, preBtn) {
                const random = isRandom;
                
                $(`${preBtn}`).addEventListener(`${eventClient}`,function(){
                    skipSong(false);
                });

            },

            randomSong: function (eventClient, nameBtn) {
                let btn = $(`${nameBtn}`);
                btn.addEventListener(`${eventClient}`, function () {
                    isRandom = !isRandom;
                    if (isRandom) {
                        btn.classList.add(`${active}`);
                    } else {
                        btn.classList.remove(`${active}`);
                    }
                });
            },

            loopSong: function (eventClient, nameBtn) {
                
                let btn = $(`${nameBtn}`);
                btn.addEventListener(`${eventClient}`, function () {
                    isLoop = !isLoop;
                    if (isLoop) {
                        btn.classList.add(`${active}`);
                    } else {
                        btn.classList.remove(`${active}`);
                    }
                });
            },

            changeSong: function (eventClient, scale) {
                
                let scaleVar = $(`${scale}`);
                scaleVar.addEventListener(`${eventClient}`, function (e) {
                    let tarGet = e.target;
                    if (!(e.target === scaleVar)) {
                        if (!tarGet.dataset.index) {
                            let tmp;
                            do {
                                tarGet = tarGet.parentElement;
                                tmp = tarGet ? tarGet.dataset.index : null;
                            } while (!tmp && tarGet);
                        }
                        if (!(currenSong == tarGet.dataset.index)) {
                            currenSong = tarGet.dataset.index;
                            skipSong(false, true);
                        }
                    }
                });
            }
        }
    }

    //on update
    setCurrentSong(boxSet, tag, typeSeletor = ".") {
        boxSet = boxSet;
        active = `${tag}`;
        typeActive = typeSeletor;
    }

    #activeCurrent() {
        let box = $(`${boxSet}`).classList;
        box.add(`${active}`);
    }

    getRndInteger(min, max) {
        return Math.floor(Math.random() * (max - min)) + min;
    }

    eventProcessor(eventClient, bar, playTimeBar) {
        const btn = $(`${bar}`);
        const playTime = $(`${playTimeBar}`);
        let isDragging = false;
        let timeOut;

        btn.addEventListener(`${eventClient}`, () => {
            clearTimeout(timeOut);
            btn.classList.add(`${active}`);
        });

        btn.addEventListener(`mouseout`, () => {
            timeOut = setTimeout(() => {
                btn.classList.remove(`${active}`);
            }, 500);
        });

        btn.addEventListener('mousedown', (event) => {
            clearTimeout(timeOut);
            isDragging = true;
            btn.classList.add(`${active}`);
            updatePlayTimeWidth(event);
        });

        document.addEventListener('mousemove', (event) => {
            if (isDragging) {
                clearTimeout(timeOut);
                updatePlayTimeWidth(event);
            }
        });

        document.addEventListener('mouseup', () => {
            if (isDragging) {
                isDragging = false;
                setTimeout(() => {
                    btn.classList.remove(`${active}`);
                }, 500);
            }
        });

        function updatePlayTimeWidth(event) {
            clearTimeout(timeOut);
            const rect = btn.getBoundingClientRect();
            const x = event.clientX - rect.left;
            const width = rect.width;
            const percent = Math.min(Math.max((x / width) * 100, 0), 100);

            playTime.style.width = `${percent}%`;
        }
    }

}