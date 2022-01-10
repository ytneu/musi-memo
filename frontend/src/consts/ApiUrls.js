export const BASE = 'https://ws.audioscrobbler.com/2.0/?';

export const GET_INFO = 'user.getinfo';
export const GET_RECENT_TRACKS = 'user.getrecenttracks';

export const ENDPOINT_NAME = (method, user) =>
  `${BASE}method=${method}&user=${user}&api_key=${process.env.REACT_APP_PUBLIC_KEY_LASTFM}&format=json`;
export const GET_RECENT_TRACKS_ENDPOINT = (user, from, to, page = 1) =>
  `${BASE}method=${GET_RECENT_TRACKS}&user=${user}&from=${from}&to=${to}&page=${page}&api_key=${process.env.REACT_APP_PUBLIC_KEY_LASTFM}&limit=200&format=json`;

export const SPOTIFY_CREATE_PLAYLIST_ENDPOINT = 'https://api.spotify.com/v1/me/playlists';
export const SPOTIFY_SEARCH_ITEM_TRACK_ENDPOINT = (artist, name) =>
  `https://api.spotify.com/v1/search?q=track:${name}+artist:${artist}=&type=track`;

export const SPOTIFY_ADD_ITEMS_TO_PLAYLIST = (playlistId) =>
  `https://api.spotify.com/v1/playlists/${playlistId}/tracks`;
