export const public_key = '';
export const secret_key = '';
export const spotify_app_client_id = '';

export const BASE = 'https://ws.audioscrobbler.com/2.0/?';

export const GET_INFO = 'user.getinfo';
export const GET_RECENT_TRACKS = 'user.getrecenttracks';

export const ENDPOINT_NAME = (method, user) => `${BASE}method=${method}&user=${user}&api_key=${public_key}&format=json`;
export const GET_RECENT_TRACKS_ENDPOINT = (user, from, to, page = 1) =>
  `${BASE}method=${GET_RECENT_TRACKS}&user=${user}&from=${from}&to=${to}&page=${page}&api_key=${public_key}&limit=200&format=json`;

export const SPOTIFY_CREATE_PLAYLIST_ENDPOINT = 'https://api.spotify.com/v1/me/playlists';
