"use strict";
const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);


class PlayMusicApp{
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
    }

    renderList(API, boxInner){
        const _this = this;
        this.boxList = boxInner;
        fetch('https://www.theaudiodb.com/api/v1/json/2/searchalbum.php?s=daft_punk')
            .then(response => response.json()) 
            .then(data => {
                console.log(data.album); 
                _this.listSong = data;
                _this.length = data.album.length;
                // console.log("length ",data.album.length);
                _this.renderElement(boxInner);   
                _this.#activeCurrent();
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
        
        return _this.listSong.album;
    };
    
    
    playMusic(eventClient, playBtn, pauseBtn){
        $(`${playBtn}`).addEventListener(`${eventClient}`, function(){
            $(playBtn).style.display = "none";
            $(pauseBtn).style.display = "inline-block";
        });
        
        $(`${pauseBtn}`).addEventListener(`${eventClient}`, function(){
            $(pauseBtn).style.display = "none";
            $(playBtn).style.display = "inline-block";
        });

    }

    nextSong(eventClient, nextBtn){
        const _this = this;
        const active = this.active;
        const type = this.typeActive;
        const boxList = this.boxList;
        $(`${nextBtn}`).addEventListener(`${eventClient}`, function(){
            if(_this.isRandom){
                _this.currenSong = _this.getRndInteger(0,_this.length -1);
            }else{
                _this.currenSong += 1;
                if(_this.currenSong >=  _this.length){
                    _this.currenSong = 0;
                }
            }
            let box = $(`${boxList} ${type}${active}`).classList;
            let act = $(`[data-index="${_this.currenSong}"]`).classList;
            box.remove(`${active}`);
            act.add(`${active}`);
        });
    }

    preSong(eventClient, preBtn) { 
        const _this = this;
        const active = this.active;
        const type = this.typeActive;
        const boxList = this.boxList;
        $(`${preBtn}`).addEventListener(`${eventClient}`, function(){
            if(_this.isRandom){
                _this.currenSong = _this.getRndInteger(0,_this.length -1);
            }else{
                _this.currenSong -= 1;
                if(_this.currenSong < 0){
                    _this.currenSong = _this.length -1;
                }
            }
            let box = $(`${boxList} ${type}${active}`).classList;
            let act = $(`[data-index="${_this.currenSong}"]`).classList;
            box.remove(`${active}`);
            act.add(`${active}`);
            
        });
    }

    randomSong(eventClient, nameBtn){
        const _this = this;
        let btn = $(`${nameBtn}`);
        btn.addEventListener(`${eventClient}`, function(){
            _this.isRandom = !_this.isRandom;
            if(_this.isRandom){
                btn.classList.add(`${_this.active}`);
                // console.log("is random");
            }else{
                btn.classList.remove(`${_this.active}`);
                // console.log("is not random");

            }
        });
    }

    loopSong(eventClient, nameBtn){
        const _this = this;
        let btn = $(`${nameBtn}`);
        btn.addEventListener(`${eventClient}`, function(){
            _this.isLoop = !_this.isLoop;
            if(_this.isLoop){
                btn.classList.add(`${_this.active}`);
                // console.log("is random");
            }else{
                btn.classList.remove(`${_this.active}`);
                // console.log("is not random");

            }
        });
    }
    // changeSong(eventClient){
    //     $(`${}`).addEventListener(`${eventClient}`, function(){
            
    //     });
    // }
    
    createHTML(...data) {
        let html = '';
        for (let i = this.index; i < this.length; i++) {
          const songHTML = this.template
            .replace('@{index}', `${i}`)
            .replace('@{img}', "anh")
            .replace('@{name}', "test")
            .replace('@{author}', "test");
          html += songHTML;
        }
        return html;
    }

    renderElement(boxInner){
        let html = this.createHTML();
        $(`${boxInner}`).innerHTML = html;
    }
    setCurrentSong(boxSet, tag, typeSeletor = "."){
        this.boxSet = boxSet;
        // let _this = this;
        this.active = `${tag}`;
        this.typeActive = typeSeletor;
    }

    #activeCurrent(){
        let box = $(`${this.boxSet}`).classList;
        box.add(`${this.active}`);
    }

    getRndInteger(min, max) {
        return Math.floor(Math.random() * (max - min) ) + min;
    }

    eventProcessor(eventClient, bar, playTimeBar) {
        const btn = $(`${bar}`);
        const playTime = $(`${playTimeBar}`);
        const _this = this;
        let act = false;
        btn.addEventListener(`${eventClient}`, (event) => {
            btn.classList.add(`${_this.active}`);
            act = true;
            const rect = btn.getBoundingClientRect();
            const x = event.clientX - rect.left;
            const width = rect.width;
            const percent = (x / width) * 100;
    
            playTime.style.width = `${percent}%`;
        });
    
        btn.addEventListener("mouseout", () => {
            btn.classList.remove(`${_this.active}`);
            act = false;
        });
        
        btn.addEventListener("mousemove", (event) => {
            const rect = btn.getBoundingClientRect();
            const x = event.clientX - rect.left; 
            const width = rect.width;
            const percent = (x / width) * 100;
            if(act){
                playTime.style.width = `${percent}%`;
            }
            
        });

    }
    
};

    




