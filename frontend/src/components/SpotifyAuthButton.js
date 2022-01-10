import styled from 'styled-components';
import { BsSpotify } from 'react-icons/bs';
import { deleteSpotiToken } from './Auth';
import { useNavigate } from 'react-router-dom';

import { spotify_app_client_id } from '../consts/ApiUrls';

import { SPOTIFY_REDIRECT_URL } from '../consts/Deploy';

const Container = styled.div`
  position: absolute;
  bottom: 85%;
  left: 85%;
  text-align: center;
`;

const LinkContainer = styled.div``;

const SpotifyAuthButton = ({ setIsRedirect, isAuth }) => {
  const REACT_APP_CLIENT_ID = process.env.REACT_APP_SPOTIFY_CLIENT_ID;
  const REACT_APP_AUTHORIZE_URL = SPOTIFY_REDIRECT_URL;
  const REACT_APP_REDIRECT_URL = 'http://localhost:3000/user';
  var scope = 'playlist-modify-public playlist-modify-private';

  let navigate = useNavigate();

  const generateRandomString = function (length) {
    var text = '';
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (var i = 0; i < length; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
  };

  const handleLogin = () => {
    var state = generateRandomString(16);
    var url = 'https://accounts.spotify.com/authorize';
    url += '?response_type=token';
    url += '&client_id=' + encodeURIComponent(REACT_APP_CLIENT_ID);
    url += '&scope=' + encodeURIComponent(scope);
    url += '&redirect_uri=' + encodeURIComponent(REACT_APP_REDIRECT_URL);
    url += '&state=' + encodeURIComponent(state);
    setIsRedirect((prevState) => !prevState);
    window.location = url;
  };

  const handleLogout = () => {
    deleteSpotiToken();
    setIsRedirect((prevState) => !prevState);
    navigate('/user');
    window.location.reload();
  };

  return (
    <Container>
      <BsSpotify size="30px" color="green" />
      <LinkContainer>
        {isAuth ? <a onClick={handleLogout}>Disconnet</a> : <a onClick={handleLogin}>Connect</a>}
      </LinkContainer>
    </Container>
  );
};

export default SpotifyAuthButton;
