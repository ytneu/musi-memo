import { useState } from 'react';
import styled from 'styled-components';
import { BsSpotify } from 'react-icons/bs';
import { getSpotiToken } from './Auth';
import { Button } from 'antd';

import _ from 'lodash';

import {
  SPOTIFY_CREATE_PLAYLIST_ENDPOINT,
  SPOTIFY_SEARCH_ITEM_TRACK_ENDPOINT,
  SPOTIFY_ADD_ITEMS_TO_PLAYLIST,
} from '../consts/ApiUrls';

import Notify from './Notify';
import axios from 'axios';

const Container = styled.div``;

// const Button = styled.button``;

const SpotifyCreatePlaylistButton = ({ name, description, isPlaylistPublic, data, playlistLength }) => {
  const createPlaylist = async (spotifyToken) => {
    return fetch(SPOTIFY_CREATE_PLAYLIST_ENDPOINT, {
      method: 'POST',
      body: JSON.stringify({ name, description, public: isPlaylistPublic }),
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
        Authorization: `Bearer ${spotifyToken}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        const duration = 4.0;
        if (data.error && data.error.status == 401) {
          Notify('Error', 'Cannot create a playlist. Please disconnect and try again.', duration);
          return;
        }
        if (data.error) {
          Notify('Error', data.error.message, duration);
          return;
        }
        if (data.id) {
          Notify('Success', `Playlist: ${name} created.`, duration);
          return data.id;
        }
        return;
      });
  };

  const parseData = (data) => {
    let dataLength = data.length;

    if (data.length > playlistLength) {
      dataLength = playlistLength;
    }

    let outData = [];

    const shuffledData = _.shuffle(data);

    for (let i = 0; i < dataLength; i++) {
      if (i < Math.floor(0.6 * dataLength)) {
        const mostFrequentSongName = _.head(_(data[i].songs).countBy('name').entries().maxBy(_.last));
        outData.push({ artist: data[i].artist, name: mostFrequentSongName });
      } else {
        outData.push({ artist: shuffledData[i].artist, name: shuffledData[i].songs[0].name });
      }
    }

    return outData;
  };

  const getUris = async (spotifyToken, data) => {
    const requests = [];

    for (const item of data) {
      const url = SPOTIFY_SEARCH_ITEM_TRACK_ENDPOINT(item.artist, item.name);
      requests.push(axios.get(url, { headers: { Authorization: `Bearer ${spotifyToken}` } }));
    }

    return axios.all(requests).then(
      axios.spread((...allData) => {
        let uris = [];
        const tracks = allData.map((item) => item.data.tracks.items[0]);
        for (const track of tracks) {
          if (track) {
            uris.push(track.uri);
          }
        }
        return uris;
      })
    );
  };

  const addItemsToPlaylist = (spotifyToken, playlistId, uris) => {
    return fetch(SPOTIFY_ADD_ITEMS_TO_PLAYLIST(playlistId), {
      method: 'POST',
      body: JSON.stringify({ uris: uris, position: 0 }),
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
        Authorization: `Bearer ${spotifyToken}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        const duration = 4.0;
        if (data.error && data.error.status == 401) {
          Notify('Error', 'Cannot create a playlist. Please disconnect and try again.', duration);
          return;
        }
        if (data.error) {
          Notify('Error', data.error.message, duration);
          return;
        }
      });
  };

  const onClick = async () => {
    const spotifyToken = getSpotiToken();
    if (!spotifyToken) {
      Notify('Error', 'Connect to spotify first.');
      return;
    }
    if (!name) {
      Notify('Error', 'Playlist name is required.');
      return;
    }

    const parsedData = parseData(data);

    const spotifyPlaylistId = await createPlaylist(spotifyToken);

    if (spotifyPlaylistId) {
      const uris = await getUris(spotifyToken, parsedData);
      addItemsToPlaylist(spotifyToken, spotifyPlaylistId, uris);
    }
  };

  return (
    <Container>
      <Button type="primary" onClick={onClick}>
        Create Playlist
      </Button>
    </Container>
  );
};

export default SpotifyCreatePlaylistButton;
