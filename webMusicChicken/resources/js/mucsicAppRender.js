"use strict";
const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const MusicApp = () => {
    const _this = this;
    let dataConfig = {
        class_parent: "container-song",
        class_box_play_song: "song-onplay",
        class_song_infor: "song-infor",
        class_song_img: "song-img",
        alt_img: "day la anh cuar bai hat",
        class_control: "song-control",
        class_prosseses: "song-prosseses",
        class_time: "time-play",
        class_bar: "prosseses-bar",
        class_control_song: "song-control-button",
        id_play: "play-btn",
        id_pause: "pause-btn",
        id_loop: "loop-btn",
        id_random: "random-btn",
        id_next: "next-btn",
        id_pre: "pre-btn",
        class_control_volume: "volume-contol",
        class_volume: "volume-box",
        class_value: "value-volume",
        volume_bar: "volume-bar",
        class_lyrics: "box-lyrics",
        class_box_lyrics: "song-lyrics",
        class_on_active: "text-active",
        class_song_list: "song-list",
        class_song_tag: "song-tag",
        class_song: "song",
        class_song_img_mini: "song-img-mini",
        class_song_infor: "song-infor",
        class_name_song: "name-song",
        class_author: "name-author",
        class_more_infor: "more-infor",
        id_more: "more-btn"
    };
    let confix;
    let isLoop;
    let isRandom;
    let currenSong;
    let volume_value;
    let lengthList;
    let template = `<div class="@{class_parent}">
                    <div>
                        <div class="@{class_box_play_song}">
                            <div class="@{class_song_infor}">
                                <div class="@{class_song_img}">
                                    <img src="@{img_src}" alt="@{alt_img}">
                                </div>
                            </div>
                            <div class="@{class_control}">
                                <div class="@{class_prosseses}" width="100px"  style="background-color: red; width:100px;">
                                    <div class="@{class_time}"></div>
                                    <div class="@{class_bar}" style="background-color:pink; height:5px; "></div>
                                </div>
                                <div class="@{class_control_song}">
                                    <button id="@{id_loop}"><i class="fa-solid fa-arrows-rotate"></i></button>
                                    <button id="@{id_pre}"><i class="fa-solid fa-backward"></i></button>
                                    <button id="@{id_pause}"><i class="fa-solid fa-pause"></i></button>
                                    <button id="@{id_play}"><i class="fa-solid fa-play"></i></button>
                                    <button id="@{id_next}"><i class="fa-solid fa-forward"></i></button>
                                    <button id="@{id_random}"><i class="fa-solid fa-shuffle"></i></button>
                                </div>
                                <div class="@{class_control_volume}" style="width:60px; background-color:yellow;">
                                    <div class="@{class_volume}">
                                        <i class="fa-solid fa-volume-low"></i>
                                        <div class="@{volume_bar}" style="background-color:black; height:5px; display:block;"></div>
                                        <div class="@{class_value}"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="@{class_lyrics}">
                            <div class="@{class_box_lyrics}">
                                <div class="@{class_on_active}"></div>
                            </div>
                        </div>
                        <div class="@{class_song_list}">
                            @{HTML-for-list}
                        </div>
                    </div>
                </div>`;
    let HTMLForList;
    let eventClient = "click";
    let playBtn;
    let pauseBtn;
    let nextBtn;
    let preBtn;
    let randomBtn;
    let loopBtn;
    let songTag;
    const loadConfig = () => {
        const config = JSON.parse(localStorage.getItem('musicAppConfig')) || {
            isRun: false,
            isLoop: false,
            isRandom: false,
            currenSong: 0,
            volume: 100
        };
        confix = config;
        isLoop = config.isLoop;
        isRandom = config.isRandom;
        currenSong = config.currenSong;
        volume_value = config.volume;
    }

    const saveConfig = ()=>{
        localStorage.setItem('musicAppConfig', JSON.stringify(confix));
    }

    const setDataToConfig = () => {
        return dataConfig;
    }

    const getData = async (API) => {
        try {
            const response = await fetch(API);
            const data = await response.json();
            this.dataAPI = data;
            return data;
        } catch (error) {
            console.error("Lỗi khi lấy dữ liệu từ API: ", error);
        }
    }

    const setLengthList = (length) => {
        if (length) {
            lengthList = length;
            return length;
        }
        console.error('Set Length List is not work');
        return false;
    }

    const createLayout = (layout) => {
        if (layout) {
            template = layout;
        }
        console.info('You use default layout, see in README.md');
        return true;

    }

    const createHTMLForList = async (data) => {
        if (data) {
            HTMLForList = data;
            return true;
        }
        console.err('You need create HTML and set infor by Data, see in README.md');
        return false;
    }

    const renderStruct = (boxForInnerHTML) => {
        let box = $(`${boxForInnerHTML}`);
        if (!box) {
            console.error('can not find this Element: ', err);
            return false;
        }
        try {
            if (template) {
                template = template
                    .replace(`@{HTML-for-list}`, HTMLForList);

                for (let key in dataConfig) {
                    template = template
                        .replace(new RegExp(`@{${key}}`, 'g'), dataConfig[key]);
                    // .replace(`@{${key}}`, this.dataConfig[key])     
                }
                await(() => { $(boxForInnerHTML).innerHTML = template })();
            }
        } catch (err) {
            console.error('can not render HTML: ', err);
            return false;
        }
        return true;
    }

    const setButtonValue = () => {
        eventClient = "click";
        playBtn = $(`#${dataConfig.id_play}`);
        pauseBtn = $(`#${dataConfig.id_pause}`);
        nextBtn = $(`#${dataConfig.id_next}`);
        preBtn = $(`#${dataConfig.id_pre}`);
        randomBtn = $(`#${dataConfig.id_random}`);
        loopBtn = $(`#${dataConfig.id_loop}`);
        songTag = $(`.${dataConfig.class_song_tag}`);
    }

    const initHandleEvent = () => {
        setButtonValue;
        let box = $(`.${dataConfig.class_parent}`);
        if (box) {
            box.addEventListener('click', (event) => { handleEvent(event) });
            box.addEventListener('mousedown', (event) => { handleEvent(event) });
            box.addEventListener('mouseup', (event) => { handleEvent(event) });
            box.addEventListener('mousemove', (event) => { handleEvent(event) });
            box.addEventListener('mouseover', (event) => { handleEvent(event) });
            box.addEventListener('muoseout', (event) => { handleEvent(event) });
        }
    }

    const handleEvent = (event) => {
        const target = event.target;

        switch (event.type) {
            case 'click':

                break;
            case 'mouseouver':
            case 'mousedown':
            case 'mousemove':

                break;
            case 'mouseup':
            case 'mouseout':

                break;
            default:
                break;
        }
    }

    const playMusic = () => {
        playBtn.addEventListener(eventClient, () => {
            playBtn.style.display = "none";
            pauseBtn.style.display = "inline-block";
            isPlay = true;
            confix.isRun = true;
            playSong();
            saveConfig();
        });

        pauseBtn.addEventListener(eventClient, () => {
            pauseBtn.style.display = "none";
            playBtn.style.display = "inline-block";
            isPlay = false;
            confix.isRun = false;
            playSong();
            saveConfig();
        });
    }


    const nextSong = (eventClient) => {
        nextBtn.addEventListener(eventClient, () => {
            skipSong(true);
        });
    }

    const preSong = (eventClient) => {
        preBtn.addEventListener(eventClient, () => {
            skipSong(false);
        });
    }

    const setActive = (eventClient, nameBtn, action) => {
        if (action) {
            nameBtn.classList.add(activeClassName);
        }
        nameBtn.addEventListener(eventClient, () => {
            action = !action;
            if (nameBtn === randomBtn) {
                confix.isRandom = action;
            } else {
                confix.isLoop = action;
            }
            saveConfig();
            if (action) {
                nameBtn.classList.add(activeClassName);
            } else {
                nameBtn.classList.remove(activeClassName);
            }
        });

        const randomSong = (eventClient) => { setActive(eventClient, randomBtn, isRandom) }

        const loopSong = (eventClient) => { setActive(eventClient, loopBtn, isLoop) }

        const changeSong = (eventClient) => {
            songTag.addEventListener(eventClient, (e) => {
                let tarGet = e.target;
                let index = tarGet.closest(`[data-index]`);
                if (!index) {
                    index = tarGet.querySelector('[data-index]');
                }
                if (currenSong != index.dataset.index) {
                    currenSong = index.dataset.index;
                    $(`[data-index="${currenSong}"] audio`).load();
                    skipSong(false, true);
                    confix.currenSong = currenSong;
                    saveConfig();
                }
            });
        }
    }

    const skipSong = (isNext, isSelect = false) =>{
        let onPlay = $(`${boxSetCurrent} ${typeActive}${activeClassName} audio`);
        onPlay.preload = "none";
        onPlay.load();
        onPlay.pause();
        $(`${boxSetCurrent} ${typeActive}${activeClassName} .${dataConfig.class_name_song} img`).src = "";
        $(`${boxSetCurrent} ${typeActive}${activeClassName} .${dataConfig.class_name_song} img`).style.display = "none";
        if (!isSelect) {
            if (isRandom) {
                currenSong = getRndInteger(0, lengthList - 1);
            } else {
                if (isNext) {
                    currenSong = (currenSong + 1) % lengthList;
                } else {
                    currenSong = (currenSong - 1 + lengthList) % lengthList;
                }
            }
            $(`[data-index="${currenSong}"] audio`).load();
        }

        try {
            let box = $(`${boxSetCurrent} ${typeActive}${activeClassName}`).classList;
            let act = $(`[data-index="${currenSong}"]`).classList;
            box.remove(activeClassName);
            act.add(activeClassName);
            $(`.${dataConfig.class_song_img} img`).src = `${$(`[data-index="${currenSong}"] .${dataConfig.class_song_img_mini} img`).src}`;
        } catch (err) {
            console.log("Có lỗi xảy ra:", err);
            let act = $(`[data-index="${currenSong}"]`).classList;
            act.add(activeClassName);
        }
        let audioElement = $(`[data-index="${currenSong}"] audio`);
        audioElement.preload = "auto";
        getPlayTime();
        eventProcessorApp();
        playSong();

        confix.currenSong = currenSong;
        saveConfig();
    }

    const playSong = ()=>{
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


}