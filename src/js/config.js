export const API_URL_Lyrics =
  'https://private-anon-84c3885ecf-lyricsovh.apiary-proxy.com/v1/';
// 'https://api.lyrics.ovh/v1/Coldplay/Adventure of a Lifetime';
// https://lyricsovh.docs.apiary.io/#reference/0/lyrics-of-a-song/search
export const API_URL_TRACK_INFO = 'https://api.deezer.com/search?q=track:';
// https://api.deezer.com/search?q=artist:"aloe blacc" track:"i need a dollar"
export const PROXY = 'https://corsproxy.io/?url=';

export const getJSON = async function (url) {
  try {
    const res = await fetch(url);
    if (res.status === 404) throw new Error();
    return await res.json();
  } catch (err) {
    throw new Error(err.message);
  }
};
