"use strict";
const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

class MusicApp {
    constructor(dataConfig) {
        this.loadDataConfig(dataConfig);
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
            currenSong: 0,
            volume : 100
        };
        this.confix = config;
        this.isLoop = config.isLoop;
        this.isRandom = config.isRandom;
        this.currenSong = config.currenSong;
        this.volume_value = config.volume;
    }

    loadDataConfig(data){
        if(!data){
            console.log("ko co data");
        }

        this.dataConfig = data;
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

    async createHTMLForList(data) {
        this.HTMLForList += data;
    }

    async createLayout(layout) {
        this.template = layout;
    }

    async renderStruct(boxForInnerHTML) {
        if (this.template) {
           this.template = this.template 
                .replace(`@{HTML-for-list}`, this.HTMLForList);
            
            for(let key in this.dataConfig){
                this.template = this.template
                    .replace(new RegExp(`@{${key}}`, 'g'), this.dataConfig[key]);
                    // .replace(`@{${key}}`, this.dataConfig[key])     
            }
            await (()=>{$(boxForInnerHTML).innerHTML = this.template})();
        } else {
            this.template = `
                <div id="container-song-render">
                    <div class="song-infor">
                        <div class="img-song">
                            <img src="" alt="@{alt-img}">
                        </div>
                        <div class="prossesses-bar"><button name="playTime"></button></div>
                        <div class="control-bar">
                            <div class="control-play">
                                <button id="loop" name="loop-btn"><i class="fa-solid fa-arrows-rotate"></i></button>
                                <button id="pre" name="pre-btn"><i class="fa-solid fa-backward"></i></button>
                                <button id="pause" name="pause-btn"><i class="fa-solid fa-pause"></i></button>
                                <button id="play" name="play-btn"><i class="fa-solid fa-play"></i></button>
                                <button id="next" name="next-btn"><i class="fa-solid fa-forward"></i></button>
                                <button id="random" name="random-btn"><i class="fa-solid fa-shuffle"></i></button>
                            </div>
                            <div class="control-volume">
                                <div id="volume" name="volume-btn"><i class="fa-solid fa-volume-off"></i></div>
                            </div>
                        </div>
                    </div>
                    <div class="container-songLyrics">@{lyrics}</div>
                    <div class="container-songList">
                        ${this.HTMLForList}
                    </div>
                </div>
                ${this.fontButton}`;
            await ($(boxForInnerHTML).innerHTML = this.template)();
        }
    }

    skipSong(isNext, isSelect = false) {
        const _this = this;
        let onPlay = $(`${this.boxSetCurrent} ${this.typeActive}${this.activeClassName} audio`);
        onPlay.preload = "none";
        onPlay.load();
        onPlay.pause();
        $(`${this.boxSetCurrent} ${this.typeActive}${this.activeClassName} .${this.dataConfig.class_name_song} img`).src = "";
        $(`${this.boxSetCurrent} ${this.typeActive}${this.activeClassName} .${this.dataConfig.class_name_song} img`).style.display = "none";
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
            $(`.${this.dataConfig.class_song_img} img`).src = `${$(`[data-index="${this.currenSong}"] .${this.dataConfig.class_song_img_mini} img`).src}`;
        } catch (err) {
            console.log("Có lỗi xảy ra:", err);
            let act = $(`[data-index="${this.currenSong}"]`).classList;
            act.add(this.activeClassName);
        }
        let audioElement = $(`[data-index="${this.currenSong}"] audio`);
        audioElement.preload = "auto";
        _this.getPlayTime();
        _this.eventProcessorApp();
        this.playSong();

        this.confix.currenSong = this.currenSong;
        this.saveConfig();
    }

    playSong(){
        let audio = $(`[data-index="${this.currenSong}"] audio`);
        if(this.isPlay){
            audio.play();
            audio.volume = this.volume_value;
            $(`[data-index="${this.currenSong}"] .${this.dataConfig.class_name_song} img`).src = "https://zmp3-static.zmdcdn.me/skins/zmp3-v6.1/images/icons/icon-playing.gif";
            $(`[data-index="${this.currenSong}"] .${this.dataConfig.class_name_song} img`).style.display = "inline-block";
            
        }else{
            audio.pause();
            $(`[data-index="${this.currenSong}"] .${this.dataConfig.class_name_song} img`).style.display = "none";
        }
        
    }

    controlBar() {
        const methods = {
            playMusic: (eventClient = "click", playBtn = `#${this.dataConfig.id_play}`, pauseBtn = `#${this.dataConfig.id_pause}`) => {
                $(playBtn).addEventListener(eventClient, () => {
                    $(playBtn).style.display = "none";
                    $(pauseBtn).style.display = "inline-block";
                    this.isPlay = true;
                    this.confix.isRun = true;
                    this.playSong();
                    this.saveConfig();
                });

                $(pauseBtn).addEventListener(eventClient, () => {
                    $(pauseBtn).style.display = "none";
                    $(playBtn).style.display = "inline-block";
                    this.isPlay = false;
                    this.confix.isRun = false;
                    this.playSong();
                    this.saveConfig();
                });
            },

            nextSong: (eventClient = "click", nextBtn = `#${this.dataConfig.id_next}`) => {
                $(nextBtn).addEventListener(eventClient, () => {
                    this.skipSong(true);
                });
            },

            preSong: (eventClient = "click", preBtn = `#${this.dataConfig.id_pre}`) => {
                $(preBtn).addEventListener(eventClient, () => {
                    this.skipSong(false);
                });
            },

            randomSong: (eventClient = "click", nameBtn = `#${this.dataConfig.id_random}`) => {
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

            loopSong: (eventClient = "click", nameBtn = `#${this.dataConfig.id_loop}`) => {
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

            changeSong: (eventClient = "click", scale = `.${this.dataConfig.class_song_list}`) => {
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

    async setCurrentSong(boxSetActiveSong, tag, typeSelector = ".") {
        this.boxSetCurrent = boxSetActiveSong;
        this.activeClassName = tag;
        this.typeActive = typeSelector;
        const _this = this;
    
        const audioElement = $(`[data-index="${_this.currenSong}"] audio`);
    
        await (() => {
            $(`[data-index="${_this.currenSong}"]`).classList.add(`${tag}`);
            audioElement.preload = "auto"; 
            audioElement.load();  
            audioElement.volume = _this.volume_value;
            $(`.${_this.dataConfig.class_song_img} img`).src = `${$(`[data-index="${_this.currenSong}"] .${_this.dataConfig.class_song_img_mini} img`).src}`;
        })();
        this.setVolume();
        this.getPlayTime();
        this.eventProcessorApp();
    
    }
    

    getRndInteger(min, max) {
        return Math.floor(Math.random() * (max - min)) + min;
    }

    eventProcessorApp() {
        const _this = this;
        let eventClient = 'click';
        let btn = $(`.${this.dataConfig.class_prosseses}`);
        let playTime = $(`.${this.dataConfig.class_bar}`);
        let isDragging = false;
        let timeOut;
        let audio = $(`[data-index="${this.currenSong}"] audio`);
        let audioCurrenTime;
        audio.addEventListener('loadedmetadata', () => {
            const duration = audio.duration.toFixed(1);
            playTime.style.width = "0px";

            const updateWidthByTime = ()=>{
                const currTime = audio.currentTime.toFixed(1);
                playTime.style.width = `${currTime / duration * 100}%`;
            };

            audio.addEventListener('timeupdate', updateWidthByTime);

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
                isDragging = true;
                btn.classList.add(this.activeClassName);
                updatePlayTimeWidth(event);
            });

            document.addEventListener('mousemove', (event) => {
                if (isDragging) {
                    updatePlayTimeWidth(event);
                }
            });

            document.addEventListener('mouseup', () => {
                if (isDragging) {
                    isDragging = false;
                    setCurrentTime();
                    setTimeout(() => {
                        btn.classList.remove(this.activeClassName);
                    }, 500);
                }
            });

            const updatePlayTimeWidth = (event) => {
                clearTimeout(timeOut);
                audio.removeEventListener('timeupdate',updateWidthByTime);
                const rect = btn.getBoundingClientRect();
                const x = event.clientX - rect.left;
                const width = rect.width;
                const percent = Math.min(Math.max((x / width) * 100, 0), 100);
                playTime.style.width = `${percent}%`;
                audioCurrenTime = (percent * duration) / 100;
                
                $(`.${_this.dataConfig.class_time}`).innerText = `
                ${_this.secondToMin(audioCurrenTime)}/ ${_this.secondToMin(duration)}
            `;
            };

            const setCurrentTime =()=>{
                audio.currentTime = audioCurrenTime;
                audio.addEventListener('timeupdate', updateWidthByTime);
                
            };
        });

        audio.load();
    }

    secondToMin(seconds){
        
        if(!typeof seconds === Number){
            seconds = parseInt(seconds);
        }
        const min = Math.floor(seconds / 60);
        const sec = Math.floor(seconds % 60);
        return `${min}:${sec < 10 ? '0' : ''}${sec}`;
    }

    async getPlayTime() {
        const _this = this;
        let audio = $(`[data-index="${_this.currenSong}"] audio`);
        audio.preload = "auto";
        let duration;
        let playTime;
        audio.addEventListener('loadedmetadata', () => {
            duration = audio.duration;
            playTime = _this.secondToMin(duration);
            $(`.${_this.dataConfig.class_time}`).innerText = `
                0:00/ ${playTime}
            `;
        });

        audio.addEventListener('timeupdate', () => {
            let currTime = audio.currentTime.toFixed(1);
            $(`.${_this.dataConfig.class_time}`).innerText = `
                ${_this.secondToMin(currTime)} / ${playTime}
            `;
        });

        audio.addEventListener('ended', () => {
            if(!_this.isLoop){
                _this.skipSong(true);
            }else{
                audio.currentTime = 0;
                audio.play();
            }
        })
        
        audio.load();
    }

    setVolume(){
        const _this = this;
        let isDraggingVolume = false;
        let timeOut;
        let btn = $(`.${this.dataConfig.class_control_volume}`);
        let volume = $(`.${this.dataConfig.volume_bar}`);
        
        volume.style.width = `${_this.confix.volume * 100}%`;

        // btn.addEventListener('mouseover', ()=>{
        //     volume.style.display = "block";
        // });

        // btn.addEventListener('mouseout', ()=>{
        //     volume.style.display = "none";
        // });
        btn.addEventListener('click', () => {
            clearTimeout(timeOut);
            volume.classList.add(this.activeClassName);
        });

        btn.addEventListener('mouseout', () => {
            timeOut = setTimeout(() => {
                volume.classList.remove(this.activeClassName);
            }, 500);
        });

        btn.addEventListener('mousedown', (event)=>{
            
            isDraggingVolume = true;
            updateVolumeWidth(event);
        });

        document.addEventListener('mousemove', (event)=>{
            if(isDraggingVolume){
                updateVolumeWidth(event);
            }
        });

        document.addEventListener('mouseup', ()=>{
            isDraggingVolume = false;
        });

        const updateVolumeWidth = (event)=>{
            clearTimeout(timeOut);
            const rect = btn.getBoundingClientRect();
            const x = event.clientX - rect.left;
            const width = rect.width;
            const percent = Math.min(Math.max((x / width) * 100, 0), 100);
            volume.style.width = `${percent.toFixed(2)}%`;
            _this.confix.volume = (percent/100).toFixed(2);
            $(`[data-index="${this.currenSong}"] audio`).volume = (percent/100);
            this.saveConfig();
        }
    }
}


