"use strict";
const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

import configHTML from './config.js';

class MusicApp {

    app = () => {
        const _this = this;
        let confix;
        let isLoop;
        let isRandom;
        let currenSong;
        let volume_value;
        let lengthList;
        let template = configHTML.template;
        let dataConfig = configHTML.dataConfig;
        let HTMLForList;
        let eventClient = "click";
        let playBtn;
        let pauseBtn;
        let nextBtn;
        let preBtn;
        let randomBtn;
        let loopBtn;
        let boxSetCurrent;
        let activeClassName;
        let typeActive;
        let isPlay = false;
        (() => {
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
        })();
        //#1 //user roll
        //#2
        const saveConfig = () => {
            localStorage.setItem('musicAppConfig', JSON.stringify(confix));
        }

        //#3 !importan //user roll
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
        //#4 !importan //user roll
        const setLengthList = (length) => {
            if (length) {
                lengthList = length;
                return length;
            }
            console.error('you need set length for list');
            return false;
        }
        //#5 //user roll 
        const createLayout = (layout) => {
            if (layout) {
                template = layout;
            }
            console.info('You use default layout, see in README.md');
            return true;

        }
        //#6 !importan required //user roll
        const createHTMLForList = async (data) => {
            if (data) {
                HTMLForList = data;
                return true;
            }
            console.error('You need create HTML and set infor by Data, see in README.md');
            return false;
        }
        //#7 !importan required
        const renderStruct = (boxForInnerHTML) => {
            let box = $(`${boxForInnerHTML}`);
            if (!box) {
                console.info('render into body tag: ');
                box = $('body');
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
                    (() => { box.innerHTML = template })();
                }
                setButtonValue();
            } catch (err) {
                console.error('can not render HTML: ', err);
                return false;
            }
            return true;
        }
        //#8 required
        const setButtonValue = () => {
            eventClient = "click";
            playBtn = $(`#${dataConfig.id_play}`);
            pauseBtn = $(`#${dataConfig.id_pause}`);
            nextBtn = $(`#${dataConfig.id_next}`);
            preBtn = $(`#${dataConfig.id_pre}`);
            randomBtn = $(`#${dataConfig.id_random}`);
            loopBtn = $(`#${dataConfig.id_loop}`);
        }
        //#8 required
        const getRndInteger = (min, max) => {
            return Math.floor(Math.random() * (max - min)) + min;
        }
        //#8 required
        const secondToMin = (seconds) => {

            if (!typeof seconds === Number) {
                seconds = parseInt(seconds);
            }
            const min = Math.floor(seconds / 60);
            const sec = Math.floor(seconds % 60);
            return `${min}:${sec < 10 ? '0' : ''}${sec}`;
        }
        //#8 required
        const getPlayTime = () => {

            let audio = $(`[data-index="${currenSong}"] audio`);
            audio.preload = "auto";
            let duration;
            let playTime;
            audio.addEventListener('loadedmetadata', () => {
                duration = audio.duration;
                playTime = secondToMin(duration);
                $(`.${dataConfig.current_time}`).innerText = `0:00`;
                $(`.${dataConfig.duration_time}`).innerText = `${playTime}`;
            });

            audio.addEventListener('timeupdate', () => {
                let currTime = audio.currentTime.toFixed(1);
                $(`.${dataConfig.current_time}`).innerText = `${secondToMin(currTime)}`;
            });

            audio.addEventListener('ended', () => {
                if (!confix.isLoop) {
                    skipSong(true);
                } else {
                    audio.currentTime = 0;
                    audio.play();
                }
            });

            audio.load();
        }
        //
        const handlePlayTime = (button) => {
            let isDragging = false;
            let timeOut;
            const audio = $(`[data-index="${currenSong}"] audio`);
            let bar = button.querySelector('.bar');
            let currentTime;
            const updateWidth = (event) => {
                clearTimeout(timeOut);
                const rect = button.getBoundingClientRect();
                const x = event.clientX - rect.left;
                const width = rect.width;
                const percent = Math.min(Math.max((x / width) * 100, 0), 100);
                bar.style.width = `${percent.toFixed(2)}%`;
                currentTime = (percent * audio.duration) / 100;
                $(`.${dataConfig.current_time}`).innerText = `${secondToMin(currentTime)}`;
            };

            button.addEventListener(eventClient, () => {
                clearTimeout(timeOut);
                bar.classList.add(activeClassName);
            });

            button.addEventListener('mouseout', () => {
                timeOut = setTimeout(() => {
                    bar.classList.remove(activeClassName);
                }, 500);
            });

            button.addEventListener('mousedown', (event) => {
                isDragging = true;
                bar.classList.add(activeClassName);
                updateWidth(event);
            });

            document.addEventListener('mousemove', (event) => {
                if (isDragging) {
                    updateWidth(event);
                }
            });

            document.addEventListener('mouseup', () => {
                if (isDragging) {
                    isDragging = false;
                    audio.currentTime = currentTime;
                    setTimeout(() => {
                        button.classList.remove(activeClassName);
                    }, 500);
                }
            });

            audio.addEventListener('loadedmetadata', () => {
                const duration = audio.duration.toFixed(1);
                bar.style.width = "0px";
                const updateWidthByTime = () => {
                    if (!isDragging) {
                        const currTime = audio.currentTime.toFixed(1);
                        bar.style.width = `${(currTime / duration) * 100}%`;
                    }
                };

                audio.addEventListener('timeupdate', updateWidthByTime);
            });

            audio.load();
        };
        const handleVolume = (button) => {
            let isDragging = false;
            let timeOut;
            const audio = $(`[data-index="${currenSong}"] audio`);
            let bar = button.querySelector('.bar');
            bar.style.width = `${confix.volume * 100}%`;
            const updateWidth = (event) => {
                clearTimeout(timeOut);
                const rect = $(`.${dataConfig.class_volume}`).getBoundingClientRect();
                const x = event.clientX - rect.left;
                const width = rect.width;
                const percent = Math.min(Math.max((x / width) * 100, 0), 100);
                bar.style.width = `${percent.toFixed(2)}%`;
                const volume = (percent / 100).toFixed(2);
                audio.volume = volume;
                confix.volume = volume;
                saveConfig();
            };

            button.addEventListener('mouseover', () => {
                clearTimeout(timeOut);
                button.classList.add(activeClassName);
                bar.style.display = 'inline-block';
                
            });

            button.addEventListener('mouseout', () => {
                timeOut = setTimeout(() => {
                    button.classList.remove(activeClassName);
                    bar.style.display = 'none';
                }, 500);
            });

            button.addEventListener('mousedown', (event) => {
                isDragging = true;
                bar.classList.add(activeClassName);
                bar.style.display = 'inline-block';
                updateWidth(event);
            });

            document.addEventListener('mousemove', (event) => {
                if (isDragging) {
                    updateWidth(event);
                }
            });

            document.addEventListener('mouseup', () => {
                if (isDragging) {
                    isDragging = false;
                    setTimeout(() => {
                        button.classList.remove(activeClassName);
                        bar.classList.remove(activeClassName);
                        bar.style.display = 'none';

                    }, 500);
                }
            });

            audio.load();
        };

        //#9 required
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
        }
        //#9 required
        const playSong = () => {
            let audio = $(`[data-index="${currenSong}"] audio`);
            if (isPlay) {
                audio.play();
                audio.volume = volume_value;
                $(`[data-index="${currenSong}"] .${dataConfig.class_name_song} img`).src = "https://zmp3-static.zmdcdn.me/skins/zmp3-v6.1/images/icons/icon-playing.gif";
                $(`[data-index="${currenSong}"] .${dataConfig.class_name_song} img`).style.display = "inline-block";

            } else {
                audio.pause();
                $(`[data-index="${currenSong}"] .${dataConfig.class_name_song} img`).style.display = "none";
            }

        }
        //#9 required //user roll
        const playMusic = (eventClient) => {
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
        //#9 required //user roll
        const nextSong = (eventClient) => {
            nextBtn.addEventListener(eventClient, () => {
                skipSong(true);
            });
        }
        //#9 required //user roll
        const preSong = (eventClient) => {
            preBtn.addEventListener(eventClient, () => {
                skipSong(false);
            });
        }
        //#9 required 
        const skipSong = (isNext, isSelect = false) => {
            let onPlay = $(`${boxSetCurrent} ${typeActive}${activeClassName} audio`);
            onPlay.preload = "none";
            onPlay.load();
            onPlay.pause();
            $(`${boxSetCurrent} ${typeActive}${activeClassName} .${dataConfig.class_name_song} img`).src = "";
            $(`${boxSetCurrent} ${typeActive}${activeClassName} .${dataConfig.class_name_song} img`).style.display = "none";
            if (!isSelect) {
                if (confix.isRandom) {
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
                $(`.${dataConfig.name_song}`).innerText = `${$(`[data-index="${currenSong}"] .${dataConfig.class_name_song}`).innerText}`;
            } catch (err) {
                console.log("Có lỗi xảy ra:", err);
                let act = $(`[data-index="${currenSong}"]`).classList;
                act.add(activeClassName);
            }
            let audioElement = $(`[data-index="${currenSong}"] audio`);
            audioElement.preload = "auto";
            getPlayTime();
            handlePlayTime($(`.${dataConfig.class_prosseses}`));
            playSong();
            confix.currenSong = currenSong;
            saveConfig();
        }
        //#9 required //user roll
        const randomSong = (eventClient) => { setActive(eventClient, randomBtn, isRandom) }
        //#9 required //user roll
        const loopSong = (eventClient) => { setActive(eventClient, loopBtn, isLoop) }
        //#9 required //user roll
        const changeSong = (eventClient) => {
            const songList = $(`.${dataConfig.class_song_list}`);
            songList.addEventListener(eventClient, (e) => {
                let tarGet = e.target;
                if (tarGet === songList) {
                    console.log('out side list');
                } else {
                    if(tarGet === $(`.${dataConfig.class_more_infor}`) || tarGet.closest(`.${dataConfig.class_more_infor}`)){
                        alert('More infor');
                    }else{
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
                    }
                }
            });
        }
        //#9 required //user roll
        const initHandleEvent = () => {
            setButtonValue;
            let box = $(`.${dataConfig.class_parent}`);
            if (box) {
                playMusic('click');
                nextSong('click');
                preSong('click');
                changeSong('click');
                randomSong('click');
                loopSong('click');
            }
        }
        //#10
        const setCurrentSong = (boxSetActiveSong = `.${dataConfig.class_song_tag}`, tag = 'active', typeSelector = ".") => {
            boxSetCurrent = boxSetActiveSong;
            activeClassName = tag;
            typeActive = typeSelector;

            const audioElement = $(`[data-index="${currenSong}"] audio`);

            (() => {
                $(`[data-index="${currenSong}"]`).classList.add(`${tag}`);
                audioElement.preload = "auto";
                audioElement.load();
                audioElement.volume = volume_value;
                $(`.${dataConfig.class_song_img} img`).src = `${$(`[data-index="${currenSong}"] .${dataConfig.class_song_img_mini} img`).src}`;
                $(`.${dataConfig.name_song}`).innerText = `${$(`[data-index="${currenSong}"] .${dataConfig.class_name_song}`).innerText}`;
            })();
            getPlayTime();
            handlePlayTime($(`.${dataConfig.class_prosseses}`));
            handleVolume($(`.${dataConfig.class_control_volume}`));
        }

        const appStart =()=>{
            setCurrentSong();
            initHandleEvent();
        }

        return{
            appStart,
            createLayout,
            createHTMLForList,
            renderStruct,
            getData,
            setLengthList,
            initHandleEvent,
            setCurrentSong
            
        }

    }
}

const App = new MusicApp();

export default App;