document.addEventListener("DOMContentLoaded", function() { startplayer(); }, false);
var music = document.getElementById('playhead');
var player;
var playing = false;
let song = "";
let artist = "";
let volume = 1;

var wait = ms => new Promise((r, j)=>setTimeout(r, ms))

function get_song(){
    document.getElementById('music_source').src='songs/' + artist + ".mp3";
}

function startplayer() {
    player = document.getElementById('music_player');
    player.controls = false;   

        // Predefining Song Information                 ----------  [ TBR ] -----------
    song = "Fly me to the moon";
    artist = "Joytastic Sarah";

    document.getElementById("song_title").innerHTML = "<strong>" + song + "</strong>";
    document.getElementById("song_artist").innerHTML = " - " + artist;

    // Set Volume Indicators
    if(volume === 0){
        document.getElementById("vol_off").classList.toggle("hidden");
    }else if(volume > 0 && volume < 0.51){
        document.getElementById("vol_low").classList.toggle("hidden");
    }else{
        document.getElementById("vol_high").classList.toggle("hidden");
    }

    // Setting Up Volume Slider
    $("#volume").slider({
        min: -1,
        max: 100,
        value: 75,
          range: "min",
        slide: function(event, ui) {
          change_vol(ui.value / 100);
        }
    });
}

function mute() {
    if(volume > 0.51){
        document.getElementById("vol_high").classList.toggle("hidden");
    }else if(volume !== 0){
        document.getElementById("vol_low").classList.toggle("hidden");
    }else{
    }
    player.volume = 0;

    document.getElementById("vol_off").classList.toggle("hidden");

} 

function un_mute() { 
    document.getElementById("vol_off").classList.toggle("hidden");
    player.volume = volume;

        // Set Volume Indicators
        if(volume === 0){
            document.getElementById("vol_off").classList.toggle("hidden");
        }else if(volume > 0 && volume < 0.51){
            document.getElementById("vol_low").classList.toggle("hidden");
        }else{
            document.getElementById("vol_high").classList.toggle("hidden");
        }
}

function timeUpdate() {
	var playPercent = 100 * (player.currentTime / player.duration);
    playhead.style.marginLeft = (playPercent - 0.5) + "%";
    setTimeout(timeUpdate, 1000);
}

function play_aud(){
    // Set Volume to 0
    player.volume = 0;

    // Setting "Playing" variable to true
    playing = true;

    // Play the audio
    player.play();

    // Fade In
   $("#music_player").animate({volume: volume}, 500);

    // Update the Playhead Position
    timeUpdate();

    // Keep the time readouts accurate (loop)
    var current_time = document.getElementById("current_time").innerHTML = calc_current_time(player.currentTime);
    var total_time = document.getElementById("total_time").innerHTML = calc_duration(player.duration);
    UpdateTime();

    // Toggle Play_Button Class from visible to hidden
    var play_button = document.getElementById("play_button").classList.toggle("hidden");

    // Toggle Pause_Button Class from hidden to visible
    var pause_button = document.getElementById("pause_button").classList.toggle("hidden");

} 

function vol_increment(){
    var temp = player.volume;
    temp = (temp + 0.01) * 100;
    temp = Math.round(temp);
    temp = temp / 100;
    player.volume = temp;
    console.log(player.volume);
}

function vol_decrement(){
    var temp = player.volume;
    temp = (temp - 0.01) * 100;
    temp = Math.round(temp);
    temp = temp / 100;
    player.volume = temp;
    console.log(player.volume);
}

function calc_duration(length) {
    var minutes = Math.floor(length / 60),
      seconds_int = length - minutes * 60,
      seconds_str = seconds_int.toString(),
      seconds = seconds_str.substr(0, 2);
      
    
    if(seconds < 10){
        var time = minutes + ":" + "0" + seconds;
    }else{
        var time = minutes + ':' + seconds;
    }

    return time;

}

function calc_current_time(currentTime) {
    var current_hour = parseInt(currentTime / 3600) % 24,
        current_minute = parseInt(currentTime / 60) % 60,
        current_seconds_long = currentTime % 60,
        current_seconds = current_seconds_long.toFixed(),
        current_time = (current_minute < 10 ? "" + current_minute : current_minute) + ":" + (current_seconds < 10 ? "0" + current_seconds : current_seconds);

    return current_time;
}

function pause_aud(){
    // Ensuring the volume elemets are correct
    player.volume = volume;

    // Setting the "Playing" variable to false.
    playing = false;

    // Fade Out
    $("#music_player").animate({volume: 0}, 500);

    // Pause Audio
    setTimeout(stop_aud, 1000);

    // Toggle Play_Button Class from visible to hidden
    var play_button = document.getElementById("play_button").classList.toggle("hidden");

    // Toggle Pause_Button Class from hidden to visible
    var pause_button = document.getElementById("pause_button").classList.toggle("hidden");
}

function stop_aud(){
    player.pause();
}

function change_vol(volumeT){
    if(volumeT < 0.1){
        player.volume = 0;
        volume = 0;
        var deaf = true;
    }

    if(volumeT && deaf != true){
        player.volume = volumeT;
        volume = volumeT;
    }

    document.getElementById("vol_high").classList.add("hidden");
    document.getElementById("vol_low").classList.add("hidden");
    document.getElementById("vol_off").classList.add("hidden");

    if(deaf === true){
        document.getElementById("vol_off").classList.remove("hidden");
    }else if(volume > 0 && volume < 0.51){
        document.getElementById("vol_low").classList.remove("hidden");
    }else{
        document.getElementById("vol_high").classList.remove("hidden");
    }

}

function UpdateTime(){
    var time = player.currentTime;
    var current_time = document.getElementById("current_time").innerHTML = calc_current_time(player.currentTime);
    setTimeout(UpdateTime, 1000);
    console.log("ran")
}

function getDate(){
    // Month
    const monthNames = ["January", "February", "March", "April", "May", "June","July", "August", "September", "October", "November", "December"];
    const d = new Date();
    console.log(monthNames[d.getMonth()]);
    document.getElementById("date_month").innerHTML = monthNames[d.getMonth()];

    // Day
    document.getElementById("date_day").innerHTML = d.getDate();
}

document.onkeyup = function(e){
    if(e.keyCode === 32){
        if(playing){
            pause_aud();
        }else{
            play_aud();
        }
    }
}



/* Playhead Moving
function clickPercent(event) {
    return (event.clientX - getPosition(timeline)) / timelineWidth;
}

timeline.addEventListener("click", function (event) {
	moveplayhead(event);
	music.currentTime = duration * clickPercent(event);
}, false);

function moveplayhead(event) {
    var newMargLeft = event.clientX - getPosition(timeline);
    
    if (newMargLeft === 0) {
		playhead.style.marginLeft = "0px";
	}else if (newMargLeft === timelineWidth) {
		playhead.style.marginLeft = timelineWidth + "px";
	}else {
		playhead.style.marginLeft = newMargLeft + "px";
	}
}

function getPosition(el) {
    return el.getBoundingClientRect().left;
}
*/

