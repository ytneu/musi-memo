import styled from 'styled-components';
import { BsSpotify } from 'react-icons/bs';

const Container = styled.div`
  position: absolute;
  bottom: 88%;
  left: 85%;
  text-align: center;
`;

const LinkContainer = styled.div``;

const SpotifyAuthButton = () => {
  return (
    <Container>
      <BsSpotify size="30px" color="green" />
      <LinkContainer>
        <a onClick={() => console.log('click')}>Connect</a>
      </LinkContainer>
    </Container>
  );
};

export default SpotifyAuthButton;
