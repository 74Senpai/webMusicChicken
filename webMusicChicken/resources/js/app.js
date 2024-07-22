"use strict";
const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

class MusicApp {
    constructor() {
        this.currenSong = 0;
        this.isRandom = false;
        this.isLoop = false;
        this.listSong = {};
        this.isRun = false;
        this.boxForInnerHTML = "";
        this.lengthList = 0;
        this.activeClassName = "";
        this.template = ``;
        this.isPlay = false;
        this.dataAPI = null;
        this.HTMLForList = "";
        this.boxSetCurrent = "";
        this.fontButton = `<script src="https://kit.fontawesome.com/dae763dd72.js" crossorigin="anonymous"></script>`;
    }

    async getData(API) {
        const _this = this;
        try {
            const response = await fetch(API);
            const data = await response.json();
            _this.dataAPI = data;
            // console.log(data);
            return data;
        } catch (error) {
            console.error("Lỗi khi lấy dữ liệu từ API: ", error);
        }
    }

    setLengthList(index){
        this.lengthList = index;
        return index;
    }

    createHTMLForList(boxInner, ...data) {
        
        const _this = this;
        _this.HTMLForList += data;
    }

    createLayout(layout){
        this.template = layout;
    }
    renderStruct(boxForInnerHTML) {
        const _this = this;
        if (_this.template) {
            $(boxForInnerHTML).innerHTML = _this.template;
        } else {
            _this.template = `
                <div id="container-song-render">
                    <div class="song-infor">
                        <div class="img-song">
                            <img src="./resources/img/test.png" alt="@{alt-img}">
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
                        ${_this.HTMLForList}
                    </div>
                </div>
                ${_this.fontButton}`;
                
            $(boxForInnerHTML).innerHTML = _this.template;
        }
    }

    skipSong(isNext, isSelect = false) {
        const _this = this;
        let onPlay = $(`[data-index="${_this.currenSong}"] audio`);
        
        onPlay.load();
        onPlay.pause();
        
       
        if (!isSelect) {
            if (_this.isRandom) {
                _this.currenSong = _this.getRndInteger(0, _this.lengthList - 1);
                $(`[data-index="${_this.currenSong}"] audio`).load();
            } else {
                if (isNext) {
                    _this.currenSong += 1;
                    if (_this.currenSong >= _this.lengthList) {
                        _this.currenSong = 0;
                    }
                    $(`[data-index="${_this.currenSong}"] audio`).load();
                } else {
                    _this.currenSong -= 1;
                    if (_this.currenSong < 0) {
                        _this.currenSong = _this.lengthList - 1;
                    }
                    $(`[data-index="${_this.currenSong}"] audio`).load();
                }
            }
        }
        let act;
        let box;
        try {
            box = $(`${_this.boxSetCurrent} ${_this.typeActive}${_this.activeClassName}`).classList;
            act = $(`[data-index="${_this.currenSong}"]`).classList;
            box.remove(_this.activeClassName);
            act.add(_this.activeClassName);
        } catch (err) {
            console.log("Có lỗi xảy ra:", err);
            act = $(`[data-index="${_this.currenSong}"]`).classList;
            act.add(_this.activeClassName);
        }
        if(_this.isPlay){
            
            $(`[data-index="${_this.currenSong}"] audio`).play();
        }
    }

    controlBar() {
        const _this = this;
        const methods = {
            playMusic: (eventClient = "click", playBtn ="#play", pauseBtn = "#pause") => {
                $(playBtn).addEventListener(eventClient, () => {
                    $(playBtn).style.display = "none";
                    $(pauseBtn).style.display = "inline-block";
                    $(`[data-index="${_this.currenSong}"] audio`).play();
                    _this.isPlay = true;
                });

                $(pauseBtn).addEventListener(eventClient, () => {
                    $(pauseBtn).style.display = "none";
                    $(playBtn).style.display = "inline-block";
                    $(`[data-index="${_this.currenSong}"] audio`).pause();
                    _this.isPlay = false;
                });
            },

            nextSong: (eventClient = "click", nextBtn = "#next") => {
                $(nextBtn).addEventListener(eventClient, () => {
                    _this.skipSong(true);
                });
            },

            preSong: (eventClient = "click", preBtn ="#pre") => {
                $(preBtn).addEventListener(eventClient, () => {
                    _this.skipSong(false);
                });
            },

            randomSong: (eventClient = "click", nameBtn ="#random") => {
                const btn = $(nameBtn);
                btn.addEventListener(eventClient, () => {
                    _this.isRandom = !_this.isRandom;
                    if (this.isRandom) {
                        btn.classList.add(_this.activeClassName);
                    } else {
                        btn.classList.remove(_this.activeClassName);
                    }
                });
            },

            loopSong: (eventClient = "click", nameBtn ="#loop") => {
                const btn = $(nameBtn);
                btn.addEventListener(eventClient, () => {
                    _this.isLoop = !_this.isLoop;
                    if (this.isLoop) {
                        btn.classList.add(_this.activeClassName);
                    } else {
                        btn.classList.remove(_this.activeClassName);
                    }
                });
            },

            changeSong: (eventClient ="click", scale = ".container-songList") => {
                const scaleVar = $(scale);
                scaleVar.addEventListener(eventClient, (e) => {
                    let tarGet = e.target;
                    if (!(e.target === scaleVar)) {
                        if (!tarGet.dataset.index) {
                            let tmp;
                            do {
                                tarGet = tarGet.parentElement;
                                tmp = tarGet ? tarGet.dataset.index : null;
                            } while (!tmp && tarGet);
                        }
                        if (!(_this.currenSong == tarGet.dataset.index)) {
                            _this.currenSong = tarGet.dataset.index;
                            _this.skipSong(false, true);
                        }
                    }
                });
            },
        }
        return methods;
    }

    setCurrentSong(boxSetActiveSong, tag, typeSelector = ".") {
        this.boxSetCurrent = boxSetActiveSong;
        this.activeClassName = tag;
        this.typeActive = typeSelector;
        const _this = this;
        $(`[data-index="${_this.currenSong}"]`).classList.add(`${tag}`);
        $(`[data-index="${_this.currenSong}"] audio`).load();
    }

    getRndInteger(min, max) {
        return Math.floor(Math.random() * (max - min)) + min;
    }

    eventProcessor(eventClient = 'click', bar = `.prossesses-bar`, playTimeBar = `button[name="playTime"]`) {
        const btn = $(bar);
        const playTime = $(playTimeBar);
        let isDragging = false;
        let timeOut;

        btn.addEventListener(eventClient, () => {
            clearTimeout(timeOut);
            btn.classList.add(this.activeClassName);
        });

        btn.addEventListener('mouseout', () => {
            timeOut = setTimeout(() => {
                btn.classList.remove(this.activeClassName);
            }, 500);
        });

        btn.addEventListener('mousedown', (event) => {
            clearTimeout(timeOut);
            isDragging = true;
            btn.classList.add(this.activeClassName);
            this.updatePlayTimeWidth(event);
        });

        document.addEventListener('mousemove', (event) => {
            if (isDragging) {
                clearTimeout(timeOut);
                this.updatePlayTimeWidth(event);
            }
        });

        document.addEventListener('mouseup', () => {
            if (isDragging) {
                isDragging = false;
                setTimeout(() => {
                    btn.classList.remove(this.activeClassName);
                }, 500);
            }
        });

        this.updatePlayTimeWidth = (event) => {
            clearTimeout(timeOut);
            const rect = btn.getBoundingClientRect();
            const x = event.clientX - rect.left;
            const width = rect.width;
            const percent = Math.min(Math.max((x / width) * 100, 0), 100);
            playTime.style.width = `${percent}%`;
        }
    }
}
