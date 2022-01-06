import React, { useState } from 'react';
import styled from 'styled-components';
import 'antd/dist/antd.css';
import { Input, Button } from 'antd';
import { ENDPOINT_NAME, GET_INFO } from '../consts/ApiUrls';
import Notify from '../components/Notify';
import { deleteUserData, setUserData } from '../components/Auth';
import { useNavigate } from 'react-router-dom';

const titleText = 'MUSI MEMO';
const description1 = "Find the music which you've listened";
const description2 = 'a long time ago.';

const Container = styled.div`
  // width: 100wv;
  // height: 100wh;
  // background-color: red;
  // display: flex;
  // flex-direction: column;
  // justify-content: center;
  // align-items: center;
`;

const CenterContainer = styled.div`
  position: absolute;
  top: 35%;
  left: 25%;
`;

const TitleContainer = styled.div`
  margin-top: 50px;
`;

const Title = styled.header`
  font-size: 40px;
  text-align: center;
`;

const TextContainer1 = styled.div`
  margin: 0 auto;
  margin-top: 10px;
  text-align: center;
  width: 160px;
`;

const TextContainer2 = styled.div`
  margin: 0 auto;
  text-align: center;
  width: 100px;
`;

const InputContainer = styled.div`
  width: 50vw;
  margin-top: 50px;
`;

const ButtonContainer = styled.div`
  margin-top: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const SplashScreen = () => {
  const [user, setUser] = useState('');

  let navigate = useNavigate();

  const checkUserExists = (user) => {
    const url = ENDPOINT_NAME(GET_INFO, user);

    console.log(url);

    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        if (data.message) {
          Notify('Error', data.message);
          deleteUserData();
          return;
        }
        if (data.user.name) {
          setUserData(data.user.name);
          navigate('/user');
        }
      });
  };

  const onClick = () => {
    console.log(user);
    if (!user) {
      Notify('Error', 'Please fill username input.');
      return;
    }
    checkUserExists(user);
  };

  return (
    <Container>
      <TitleContainer>
        <Title>{titleText}</Title>
      </TitleContainer>
      <TextContainer1>{description1}</TextContainer1>
      <TextContainer2>{description2}</TextContainer2>
      <CenterContainer>
        <InputContainer>
          <Input value={user} onChange={(e) => setUser(e.target.value)} placeholder="last.fm username" />
        </InputContainer>
        <ButtonContainer>
          <Button onClick={onClick} type="primary" ghost>
            Fetch Memories
          </Button>
        </ButtonContainer>
      </CenterContainer>
    </Container>
  );
};

export default SplashScreen;
