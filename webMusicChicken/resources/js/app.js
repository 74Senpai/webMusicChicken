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
    }

    renderList(API, boxInner){
        const _this = this;
        fetch('https://www.theaudiodb.com/api/v1/json/2/searchalbum.php?s=daft_punk')
            .then(response => response.json()) 
            .then(data => {
                console.log(data.album); 
                _this.listSong = data;
                _this.length = data.album.length;
                // console.log("length ",data.album.length);
                _this.renderElement(boxInner);   
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
        $(`${nextBtn}`).addEventListener(`${eventClient}`, function(){
            let check = _this.currenSong += 1;
            let box = $(`${type}${active}`).classList;
            box.remove(`${active}`);
            if(check == _this.listLength){
                _this.currenSong = 0;
                let act = $(`[data-index="${_this.currenSong}"]`).classList;
                act.add(`${active}`);
            }else{
                let act = $(`${type}${active} ~ div`).classList;
                act.add(`${active}`);

            }
        });
    }

    preSong(eventClient, preBtn) { 
        const _this = this;
        const active = this.active;
        const type = this.typeActive;
        $(`${preBtn}`).addEventListener(`${eventClient}`, function(){
            _this.currenSong -= 1;
            if(_this.currenSong < 0){
                _this.currenSong = _this.length -1;
            }
            let box = $(`${type}${active}`).classList;
            let act = $(`[data-index="${_this.currenSong}"]`).classList;
            box.remove(`${active}`);
            act.add(`${active}`);
            
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
        let _this = this;
        
        let box = $(`${boxSet}`).classList;
        box.add(`${tag}`);
        _this.active = `${tag}`;
        _this.typeActive = typeSeletor;
         
    }

};

    




