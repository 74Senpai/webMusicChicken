"use strict";
const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

class PlayMusicApp {
    constructor(template) {
        this.template = template;
        this.index = 0;
        this.currenSong = 0;
        this.active = "";
        this.typeActive = "";
        this.listSong = {};
        this.length = 0;
        this.boxSet = "";
        this.isRandom = false;
        this.isLoop = false;
        this.boxList = "";
        this.isRun = false;
    }

    async start(API, boxInner) {
        const _this = this;
        this.boxList += boxInner;
        (() => {
            fetch('https://www.theaudiodb.com/api/v1/json/2/searchalbum.php?s=daft_punk')
                .then(response => response.json())
                .then(data => {
                    console.log(data.album);
                    _this.listSong = data;
                    _this.length = data.album.length;
                    _this.isRun = true;
                    // _this.createHTML();
                    // _this.#activeCurrent();
                })
                .catch(error => {
                    console.error('Error fetching data:', error);
                });

            return _this.listSong.album;
        })();
        console.log("app start");
        return true;
    }
    
    skipSong(isNext, isSelect = false) {
        const _this = this;
        const active = this.active;
        const type = this.typeActive;
        const boxList = this.boxList;
        const isRandom = this.isRandom;
        if (!isSelect) {
            if (isRandom) {
                _this.currenSong = _this.getRndInteger(0, _this.length - 1);
            } else {
                if (isNext) {
                    _this.currenSong += 1;
                    if (_this.currenSong >= _this.length) {
                        _this.currenSong = 0;
                    }
                } else {
                    _this.currenSong -= 1;
                    if (_this.currenSong < 0) {
                        _this.currenSong = _this.length - 1;
                    }
                }
            }
        }

        
        let act;
        let box;
        try{
            box = $(`${boxList}>${type}${active}`).classList;
            act = $(`[data-index="${_this.currenSong}"]`).classList;
            box.remove(`${active}`);
            act.add(`${active}`);
        }catch(err){
            console.log("have an error");
        } 
    }

    // Chua hoan thanh
    async createHTML(imgpath, nameSong, author, ...data) {
        let html = '';
        await this.start();
        for (let i = this.index; i < this.length; i++) {
            const songHTML = this.template
                .replace('@{index}', `${i}`)// required
                .replace('@{img}', "anh")
                .replace('@{name}', "test")
                .replace('@{author}', "test");
            html += songHTML;
        }
        return html;
    }

    async renderElement(boxInner,imgpath, nameSong, author, ...data) {

        console.log("data ", data);
        let html = await this.createHTML(imgpath, nameSong, author,...data);
        $(`${boxInner}`).innerHTML = html;
        // console.log("html",html);
    }

    //Them tinh nang
    appControl() {
        const _this = this;
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
                const random = _this.isRandom;
                
                $(`${nextBtn}`).addEventListener(`${eventClient}`, ()=>{
                    _this.skipSong(true);
                });
            },

            preSong: function (eventClient, preBtn) {
                const random = _this.isRandom;
                
                $(`${preBtn}`).addEventListener(`${eventClient}`,function(){
                    _this.skipSong(false);
                });

            },

            randomSong: function (eventClient, nameBtn) {
                let btn = $(`${nameBtn}`);
                btn.addEventListener(`${eventClient}`, function () {
                    _this.isRandom = !_this.isRandom;
                    if (_this.isRandom) {
                        btn.classList.add(`${_this.active}`);
                    } else {
                        btn.classList.remove(`${_this.active}`);
                    }
                });
            },

            loopSong: function (eventClient, nameBtn) {
                
                let btn = $(`${nameBtn}`);
                btn.addEventListener(`${eventClient}`, function () {
                    _this.isLoop = !_this.isLoop;
                    if (_this.isLoop) {
                        btn.classList.add(`${_this.active}`);
                    } else {
                        btn.classList.remove(`${_this.active}`);
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
                        if (!(_this.currenSong == tarGet.dataset.index)) {
                            _this.currenSong = tarGet.dataset.index;
                            _this.skipSong(false, true);
                        }
                    }
                });
            }
        }

        return method;
    }

    //Oke 
    setCurrentSong(boxSet, tag, typeSeletor = ".") {
        this.boxSet = boxSet;
        this.active = `${tag}`;
        this.typeActive = typeSeletor;
    }

    #activeCurrent() {
        let box = $(`${this.boxSet}`).classList;
        box.add(`${this.active}`);
    }

    getRndInteger(min, max) {
        return Math.floor(Math.random() * (max - min)) + min;
    }

    eventProcessor(eventClient, bar, playTimeBar) {
        const btn = $(`${bar}`);
        const playTime = $(`${playTimeBar}`);
        const _this = this;
        let isDragging = false;
        let timeOut;

        btn.addEventListener(`${eventClient}`, () => {
            clearTimeout(timeOut);
            btn.classList.add(`${_this.active}`);
        });

        btn.addEventListener(`mouseout`, () => {
            timeOut = setTimeout(() => {
                btn.classList.remove(`${_this.active}`);
            }, 500);
        });

        btn.addEventListener('mousedown', (event) => {
            clearTimeout(timeOut);
            isDragging = true;
            btn.classList.add(`${_this.active}`);
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
                    btn.classList.remove(`${_this.active}`);
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
};

