import {
  API_URL_Lyrics,
  API_URL_TRACK_INFO,
  PROXY,
  getJSON,
} from './config.js';

import LANA_00 from '../../public/00 Lana Del Rey.mp3';
import LANA_01 from '../../public/01 Lana Del Rey.mp3';
import LANA_02 from '../../public/02 Lana Del Rey.mp3';
import LANA_03 from '../../public/03 Lana Del Rey.mp3';

export const state = {
  currentSong: {
    lyrics: '',
    index: 0,
    isPlaying: false,
  },
  playList: [
    {
      path: LANA_00,
      title: 'Honeymoon',
      artist: 'Lana Del Rey',
    },
    {
      path: LANA_01,
      title: 'Video Games',
      artist: 'Lana Del Rey',
    },
    {
      path: LANA_02,
      title: 'Music To Watch Boys To',
      artist: 'Lana Del Rey',
    },

    {
      path: LANA_03,
      title: 'Cinnamon Girl',
      artist: 'Lana Del Rey',
    },
  ],
  isShuffled: false,
  isNewSong: false,
};

export const fetchLyrics = async function () {
  try {
    const data = await getJSON(
      `${API_URL_Lyrics}/${state.artist}/${state.title}`
    );
    // if (!data) throw new Error();
    state.currentSong.lyrics = data.lyrics;
  } catch (err) {
    throw new Error(err.message);
  }
};

export const fetchSongCover = async function () {
  try {
    const res = await fetch(
      `${PROXY}${API_URL_TRACK_INFO}artist:"${
        state.playList[state.currentSong.index].artist
      }" track:"${state.playList[state.currentSong.index].title}"`
    );
    const data = await res.json();
    if (!data.data) {
      throw new Error("An album art for this song wasn't found not found");
    }

    return data.data[0]?.album.cover_big;
  } catch (err) {
    throw new Error(err.message);
  }
};

export const setCurrentMusic = function () {
  state.title = state.playList[state.currentSong.index].title;
  state.artist = state.playList[state.currentSong.index].artist;
};

setCurrentMusic();
