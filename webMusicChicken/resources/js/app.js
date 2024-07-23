"use strict";
const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

class MusicApp {
    constructor() {
        this.listSong = {};
        this.boxForInnerHTML = "";
        this.lengthList = 0;
        this.activeClassName = "";
        this.template = ``;
        this.isPlay = false;
        this.dataAPI = null;
        this.HTMLForList = "";
        this.boxSetCurrent = "";
        this.fontButton = `<script src="https://kit.fontawesome.com/dae763dd72.js" crossorigin="anonymous"></script>`;
        this.loadConfig();
    }

    loadConfig() {
        const config = JSON.parse(localStorage.getItem('musicAppConfig')) || {
            isRun: false,
            isLoop: false,
            isRandom: false,
            currenSong: 0
        };
        this.confix = config;
        this.isLoop = config.isLoop;
        this.isRandom = config.isRandom;
        this.currenSong = config.currenSong;
    }

    saveConfig() {
        localStorage.setItem('musicAppConfig', JSON.stringify(this.confix));
    }

    async getData(API) {
        try {
            const response = await fetch(API);
            const data = await response.json();
            this.dataAPI = data;
            return data;
        } catch (error) {
            console.error("Lỗi khi lấy dữ liệu từ API: ", error);
        }
    }

    setLengthList(index) {
        this.lengthList = index;
        return index;
    }

    createHTMLForList(boxInner, ...data) {
        this.HTMLForList += data;
    }

    createLayout(layout) {
        this.template = layout;
    }

    renderStruct(boxForInnerHTML) {
        if (this.template) {
            $(boxForInnerHTML).innerHTML = this.template;
        } else {
            this.template = `
                <div id="container-song-render">
                    <div class="song-infor">
                        <div class="img-song">
                            <img src="" alt="@{alt-img}">
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
                        ${this.HTMLForList}
                    </div>
                </div>
                ${this.fontButton}`;
            $(boxForInnerHTML).innerHTML = this.template;
        }
    }

    skipSong(isNext, isSelect = false) {
        let onPlay = $(`${this.boxSetCurrent} ${this.typeActive}${this.activeClassName} audio`);
        onPlay.load();
        onPlay.pause();
        $(`${this.boxSetCurrent} ${this.typeActive}${this.activeClassName} .nameSong img`).src = "";
        $(`${this.boxSetCurrent} ${this.typeActive}${this.activeClassName} .nameSong img`).style.display = "none";

        if (!isSelect) {
            if (this.isRandom) {
                this.currenSong = this.getRndInteger(0, this.lengthList - 1);
            } else {
                if (isNext) {
                    this.currenSong = (this.currenSong + 1) % this.lengthList;
                } else {
                    this.currenSong = (this.currenSong - 1 + this.lengthList) % this.lengthList;
                }
            }
            $(`[data-index="${this.currenSong}"] audio`).load();
        }

        try {
            let box = $(`${this.boxSetCurrent} ${this.typeActive}${this.activeClassName}`).classList;
            let act = $(`[data-index="${this.currenSong}"]`).classList;
            box.remove(this.activeClassName);
            act.add(this.activeClassName);
            $(`.img-song img`).src = `${$(`[data-index="${this.currenSong}"] .img-mini img`).src}`;
        } catch (err) {
            console.log("Có lỗi xảy ra:", err);
            let act = $(`[data-index="${this.currenSong}"]`).classList;
            act.add(this.activeClassName);
        }

        if (this.isPlay) {
            $(`[data-index="${this.currenSong}"] audio`).play();
            $(`[data-index="${this.currenSong}"] .nameSong img`).src = "https://zmp3-static.zmdcdn.me/skins/zmp3-v6.1/images/icons/icon-playing.gif";
            $(`[data-index="${this.currenSong}"] .nameSong img`).style.display = "inline-block";
        }

        this.confix.currenSong = this.currenSong;
        this.saveConfig();
    }

    controlBar() {
        const methods = {
            playMusic: (eventClient = "click", playBtn = "#play", pauseBtn = "#pause") => {
                $(playBtn).addEventListener(eventClient, () => {
                    $(playBtn).style.display = "none";
                    $(pauseBtn).style.display = "inline-block";
                    $(`[data-index="${this.currenSong}"] audio`).play();
                    $(`[data-index="${this.currenSong}"] .nameSong img`).src = "https://zmp3-static.zmdcdn.me/skins/zmp3-v6.1/images/icons/icon-playing.gif";
                    $(`[data-index="${this.currenSong}"] .nameSong img`).style.display = "inline-block";
                    
                    this.isPlay = true;
                    this.confix.isRun = true;
                    this.saveConfig();
                });

                $(pauseBtn).addEventListener(eventClient, () => {
                    $(pauseBtn).style.display = "none";
                    $(playBtn).style.display = "inline-block";
                    $(`[data-index="${this.currenSong}"] audio`).pause();
                    $(`[data-index="${this.currenSong}"] .nameSong img`).src = "";
                    $(`[data-index="${this.currenSong}"] .nameSong img`).style.display = "none";
                    this.isPlay = false;
                    this.confix.isRun = false;
                    this.saveConfig();
                });
            },

            nextSong: (eventClient = "click", nextBtn = "#next") => {
                $(nextBtn).addEventListener(eventClient, () => {
                    this.skipSong(true);
                });
            },

            preSong: (eventClient = "click", preBtn = "#pre") => {
                $(preBtn).addEventListener(eventClient, () => {
                    this.skipSong(false);
                });
            },

            randomSong: (eventClient = "click", nameBtn = "#random") => {
                const btn = $(nameBtn);
                if(this.isRandom){
                    btn.classList.add(this.activeClassName);
                }
                btn.addEventListener(eventClient, () => {
                    this.isRandom = !this.isRandom;
                    this.confix.isRandom = this.isRandom;
                    this.saveConfig();
                    if (this.isRandom) {
                        btn.classList.add(this.activeClassName);
                    } else {
                        btn.classList.remove(this.activeClassName);
                    }
                });
            },

            loopSong: (eventClient = "click", nameBtn = "#loop") => {
                const btn = $(nameBtn);
                if(this.isLoop){
                    btn.classList.add(this.activeClassName);
                }
                btn.addEventListener(eventClient, () => {
                    this.isLoop = !this.isLoop;
                    this.confix.isLoop = this.isLoop;
                    this.saveConfig();
                    if (this.isLoop) {
                        btn.classList.add(this.activeClassName);
                    } else {
                        btn.classList.remove(this.activeClassName);
                    }
                });
            },

            changeSong: (eventClient = "click", scale = ".container-songList") => {
                const scaleVar = $(scale);
                scaleVar.addEventListener(eventClient, (e) => {
                    let tarGet = e.target;
                    if (!(e.target === scaleVar)) {
                        if (!tarGet.dataset.index) {
                            do {
                                tarGet = tarGet.parentElement;
                            } while (!tarGet.dataset.index && tarGet);
                        }
                        if (this.currenSong != tarGet.dataset.index) {
                            this.currenSong = tarGet.dataset.index;
                            $(`[data-index="${this.currenSong}"] audio`).load();
                            this.skipSong(false, true);
                            this.confix.currenSong = this.currenSong;
                            this.saveConfig();
                        }
                    }
                });
            }
        }
        return methods;
    }

    setCurrentSong(boxSetActiveSong, tag, typeSelector = ".") {
        this.boxSetCurrent = boxSetActiveSong;
        this.activeClassName = tag;
        this.typeActive = typeSelector;
        $(`[data-index="${this.confix.currenSong}"]`).classList.add(`${tag}`);
        $(`[data-index="${this.confix.currenSong}"] audio`).load();
        $(`.img-song img`).src = `${$(`[data-index="${this.currenSong}"] .img-mini img`).src}`;
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


