import styled from 'styled-components';

const sp = 'http://www.spotify.com';

const Button = styled.button`
  background: green;
  border: initial;
  border-width: 0 5px;
  box-sizing: border-box;
  color: #fff;
  cursor: default;
  display: inline-block;
  font-size: 12px;
  line-height: 19px;
  margin: 0;
  max-width: 100%;
  overflow: hidden;
  padding: 3px 3px 3px;
  text-decoration: none;
  text-overflow: ellipsis;
  text-shadow: 0 -1px 0 rgba(0, 0, 0, 0.27);
  white-space: nowrap;
`;

const SpotifyAuthButton = () => {
  return <Button>Connect</Button>;
};

export default SpotifyAuthButton;
