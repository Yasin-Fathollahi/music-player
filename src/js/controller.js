'use strict';
import * as model from './model.js';

// DOM
const audioPlayer = document.querySelector('.audio-input');
const btnsCTA = document.querySelector('.btns-action');
const progressBar = document.querySelector('.progress');
const progressContainer = document.querySelector('.progress-container');
const currentTimeMin = document.querySelector('.cur-minute');
const currentTimeSec = document.querySelector('.cur-second');
const durationMin = document.querySelector('.dur-minute');
const durationSec = document.querySelector('.dur-second');
const songTitle = document.querySelector('.song-name');
const songArtist = document.querySelector('.song-artist');
const albumArt = document.querySelector('.song-cover-img');
const btnPlayPause = document.querySelector('.btn-play');
const btnLyrics = document.querySelector('.btn--song-lyrics');
const lyricsOverlay = document.querySelector('.lyrics-box');
const lyrics = document.querySelector('.lyrics');
const icons = {
  iconPause: `
<svg class="page-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><!--!Font Awesome Free 6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.--><path d="M48 64C21.5 64 0 85.5 0 112L0 400c0 26.5 21.5 48 48 48l32 0c26.5 0 48-21.5 48-48l0-288c0-26.5-21.5-48-48-48L48 64zm192 0c-26.5 0-48 21.5-48 48l0 288c0 26.5 21.5 48 48 48l32 0c26.5 0 48-21.5 48-48l0-288c0-26.5-21.5-48-48-48l-32 0z"/></svg>
`,
  iconPlay: `<svg
          class="page-icon"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 384 512"
        >
          <!--!Font Awesome Free 6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.-->
          <path
            d="M73 39c-14.8-9.1-33.4-9.4-48.5-.9S0 62.6 0 80L0 432c0 17.4 9.4 33.4 24.5 41.9s33.7 8.1 48.5-.9L361 297c14.3-8.7 23-24.2 23-41s-8.7-32.2-23-41L73 39z"
          />
        </svg>`,
  iconFavOutline: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--!Font Awesome Free 6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.--><path d="M47.6 300.4L228.3 469.1c7.5 7 17.4 10.9 27.7 10.9s20.2-3.9 27.7-10.9L464.4 300.4c30.4-28.3 47.6-68 47.6-109.5v-5.8c0-69.9-50.5-129.5-119.4-141C347 36.5 300.6 51.4 268 84L256 96 244 84c-32.6-32.6-79-47.5-124.6-39.9C50.5 55.6 0 115.2 0 185.1v5.8c0 41.5 17.2 81.2 47.6 109.5z"/></svg>`,
  iconFavFill: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--!Font Awesome Free 6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.--><path d="M47.6 300.4L228.3 469.1c7.5 7 17.4 10.9 27.7 10.9s20.2-3.9 27.7-10.9L464.4 300.4c30.4-28.3 47.6-68 47.6-109.5v-5.8c0-69.9-50.5-129.5-119.4-141C347 36.5 300.6 51.4 268 84L256 96 244 84c-32.6-32.6-79-47.5-124.6-39.9C50.5 55.6 0 115.2 0 185.1v5.8c0 41.5 17.2 81.2 47.6 109.5z"/></svg>`,
};

///////////// FUNCTIONS
const formattedSeconds = function (number) {
  return Math.ceil(number % 60) < 10
    ? `0${Math.ceil(number % 60)}`
    : `${Math.ceil(number % 60)}`;
};

const updateTimings = function (DOMElements, value) {
  DOMElements[0].textContent = Math.floor(value / 60);
  DOMElements[1].textContent = formattedSeconds(value);
};

const play = function () {
  audioPlayer.play();
  // setting the current song index
  updateTimings([currentTimeMin, currentTimeSec], audioPlayer.currentTime);
};

const playPause = function () {
  btnPlayPause.removeChild(btnPlayPause.firstElementChild);
  model.state.currentSong.isPlaying = !model.state.currentSong.isPlaying;
  if (model.state.currentSong.isPlaying) {
    // play
    play();
    btnPlayPause.insertAdjacentHTML('beforeend', icons.iconPause);
  } else {
    // pause
    audioPlayer.pause();
    btnPlayPause.insertAdjacentHTML('beforeend', icons.iconPlay);
  }
};

const keepPlaybackState = function () {
  if (model.state.currentSong.isPlaying) play();
  else audioPlayer.pause();
};

const checkIndex = function (previous) {
  if (previous) {
    // check if it's the first song
    model.state.currentSong.index !== 0
      ? model.state.currentSong.index--
      : (model.state.currentSong.index = model.state.playList.length - 1);
    audioPlayer.src = model.state.playList[model.state.currentSong.index].path;
  } else {
    /////// shuffled indexing
    if (model.state.isShuffled) {
      model.state.currentSong.index = shuffledIndex();
    }
    ////// normal indexing
    else {
      // check if it's the last song
      model.state.currentSong.index < model.state.playList.length - 1
        ? model.state.currentSong.index++
        : (model.state.currentSong.index = 0);
    }
  }
};

const updateSongUI = function () {
  songTitle.textContent =
    model.state.playList[model.state.currentSong.index].title;
  songArtist.textContent =
    model.state.playList[model.state.currentSong.index].artist;
};

const previous = async function () {
  try {
    // reset currentTime UI
    updateTimings([currentTimeMin, currentTimeSec], 0);
    // reset the progress bar
    updateProgressBar();
    // set the index
    checkIndex(true);
    //update ui
    updateSongUI();
    //keep playback
    keepPlaybackState();
    // update the state object
    model.setCurrentMusic();
    // update the cover
    albumArt.src = await model.fetchSongCover();
  } catch (err) {
    console.log(err.message);
  }
};

const next = async function () {
  try {
    // reset currentTime UI
    updateTimings([currentTimeMin, currentTimeSec], 0);
    // reset the progress bar
    updateProgressBar();
    // check wether normal (and last index) or shuffled
    checkIndex();
    // setting the song path
    audioPlayer.src = model.state.playList[model.state.currentSong.index].path;
    //update ui
    updateSongUI();
    //keep playback
    keepPlaybackState();
    // update the state object
    model.setCurrentMusic();
    // update the cover
    albumArt.src = await model.fetchSongCover();
  } catch (err) {
    console.log(err.message);
  }
};

const shuffledIndex = function () {
  let shuffledIndex;
  do {
    shuffledIndex = Math.floor(
      Math.random() * (model.state.playList.length - 0) + 0
    );
  } while (shuffledIndex === model.state.currentSong.index);
  return shuffledIndex;
};

const updateProgressBar = function () {
  progressBar.style.width = `${
    (+audioPlayer.currentTime / +audioPlayer.duration) * 100
  }%`;
};

const controlTimeUpdate = function () {
  // updating the progress bar width
  updateProgressBar();
  // updating the current time of music
  updateTimings([currentTimeMin, currentTimeSec], audioPlayer.currentTime);
};

const updateProgressOnClick = function (e) {
  const newCurrentTimePercentage = e.offsetX / this.clientWidth;
  audioPlayer.currentTime = newCurrentTimePercentage * audioPlayer.duration;
};

const showLoadingSpinner = function () {
  lyricsOverlay.classList.add('center-loading');
  document.querySelector('.loader').classList.remove('hidden');
};

const hideLoadingSpinner = function (onError = false) {
  document.querySelector('.loader').classList.add('hidden');
  !onError && lyricsOverlay.classList.remove('center-loading');
};

const fetchShowLyrics = async function () {
  try {
    // activate the overlay
    lyricsOverlay.classList.add('overlay--active');
    // if empty or new song is loaded
    if (!model.state.currentSong.lyrics || model.state.isNewSong) {
      // clear the previous lyrics
      lyrics.textContent = '';
      // show spinner
      showLoadingSpinner();
      await model.fetchLyrics();
      // hide spinner
      hideLoadingSpinner();
      lyrics.textContent = model.state.currentSong.lyrics;
      // switch the new song property
      model.state.isNewSong = false;
    }
  } catch (err) {
    lyrics.textContent =
      'Sorry no lyrics available for this song! Please try using a VPN :(';
    // hide spinner
    hideLoadingSpinner(true);
    // console.error(err);
  }
};

const loop = function () {
  audioPlayer.loop = !audioPlayer.loop;
  document.querySelector('.btn-repeat').classList.toggle('btn--active');
};

const shuffle = function () {
  document.querySelector('.btn-shuffle').classList.toggle('btn--active');
  model.state.isShuffled = !model.state.isShuffled;
};

//////////////// Event listeners
/*////// CTA Buttons /////////*/
// CTA buttons listener
btnsCTA.addEventListener('click', function (e) {
  const clicked = e.target.closest('button');
  if (!clicked) return;
  // play/pause button
  if (clicked.matches('.btn-play')) playPause();
  // btn previous
  if (clicked.matches('.btn-previous')) previous();
  // btn next
  if (clicked.matches('.btn-next')) next();
  // btn repeat
  if (clicked.matches('.btn-repeat')) loop();
  // btn shuffle
  if (clicked.matches('.btn-shuffle')) shuffle();
});

/*////// lyrics /////////*/

// lyrics button listener
btnLyrics.addEventListener('click', fetchShowLyrics);
// for closing the lyrics window
lyricsOverlay.addEventListener('click', function () {
  lyricsOverlay.classList.remove('overlay--active');
});

/*////// Progress bar /////////*/

// updating the progressbar when playing
audioPlayer.addEventListener('timeupdate', controlTimeUpdate);
// changing playing time on click
progressContainer.addEventListener('click', updateProgressOnClick);

/*////// Playback /////////*/

// play next track when current one ends
audioPlayer.addEventListener('ended', next);
// duration change listener
audioPlayer.addEventListener('durationchange', function () {
  // setting the music duration
  updateTimings([durationMin, durationSec], audioPlayer.duration);
  // updating the new newsong property for fetching lyrics
  model.state.isNewSong = true;
});

//////////// Init function
(async function () {
  try {
    const cover = await model.fetchSongCover();
    if (cover) albumArt.src = cover;
  } catch (err) {
    console.log(err.message);
  }
})();
