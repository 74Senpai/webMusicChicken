const configHTML = {
    dataConfig:{
        class_parent: "container-song",
        class_box_play_song: "song-onplay",
        class_song_infor: "song-infor",
        class_song_img: "song-img",
        alt_img: "day la anh cuar bai hat",
        class_control: "song-control",
        class_prosseses: "song-prosseses",
        class_time: "time-play",
        class_bar: "prosseses bar",
        class_control_song: "song-control-button",
        id_play: "play-btn",
        id_pause: "pause-btn",
        id_loop: "loop-btn",
        id_random: "random-btn",
        id_next: "next-btn",
        id_pre: "pre-btn",
        class_control_volume: "volume-control",
        class_volume: "volume-box",
        class_value: "value-volume",
        volume_bar: "volume bar",
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
        id_more: "more-btn",
        current_time: "current-time",
        duration_time : "duration-time",
        control_time : "control-time"
    },
    template :`
        <div class="@{class_parent}">
            <div>
                <div class="@{class_box_play_song}">
                    <div class="@{class_song_infor}">
                        <div class="@{class_song_img}">
                            <img src="@{img_src}" alt="@{alt_img}">
                        </div>
                    </div>
                    <div class="@{class_control}">
                        <div class="@{control_time}">
                            <div class="@{current_time}">000</div>
                            <div class="@{class_prosseses}" width="100px"  style="background-color: red; width:100px;">
                                <div class="@{class_time}"></div>
                                <div class="@{class_bar}" style="background-color:pink; height:5px; "></div>
                            </div>
                            <div class="@{duration_time}">04:05</div>
                        </div>
                        <div class="@{class_control_song}">
                            <button id="@{id_loop}"><i class="fa-solid fa-arrows-rotate"></i></button>
                            <button id="@{id_pre}"><i class="fa-solid fa-backward"></i></button>
                            <button id="@{id_pause}"><i class="fa-solid fa-pause"></i></button>
                            <button id="@{id_play}"><i class="fa-solid fa-play"></i></button>
                            <button id="@{id_next}"><i class="fa-solid fa-forward"></i></button>
                            <button id="@{id_random}"><i class="fa-solid fa-shuffle"></i></button>
                        </div>
                        <div class="@{class_control_volume}">
                            <div id="volume-icon"><i class="fa-solid fa-volume-low"></i></div>
                            <div class="@{class_volume}">
                                <div class="@{volume_bar}" style="background-color:black; height:5px; display:block;"></div>
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
        </div>
    `
}

export default configHTML;
