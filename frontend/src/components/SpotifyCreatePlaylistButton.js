import styled from 'styled-components';
import { BsSpotify } from 'react-icons/bs';
import { getSpotiToken } from './Auth';

import { SPOTIFY_CREATE_PLAYLIST_ENDPOINT } from '../consts/ApiUrls';

import Notify from './Notify';

const Container = styled.div``;

const Button = styled.button``;

const SpotifyCreatePlaylistButton = ({ name, description, isPlaylistPublic }) => {
  const createPlaylist = (spotifyToken) => {
    fetch(SPOTIFY_CREATE_PLAYLIST_ENDPOINT, {
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
        }
      });
  };

  const onClick = () => {
    const spotifyToken = getSpotiToken();
    if (!spotifyToken) {
      Notify('Error', 'Connect to spotify first.');
      return;
    }
    if (!name) {
      Notify('Error', 'Playlist name is required.');
      return;
    }
    createPlaylist(spotifyToken);
  };

  return (
    <Container>
      <Button onClick={onClick}>Create Spotify Playlist</Button>
    </Container>
  );
};

export default SpotifyCreatePlaylistButton;
