import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

import { getUser } from '../components/Auth';
import { DatePicker, Space, Button, Spin, Table } from 'antd';
import moment from 'moment';
import { GET_RECENT_TRACKS_ENDPOINT } from '../consts/ApiUrls';
import SpotifyAuthButton from '../components/SpotifyAuthButton';

import axios from 'axios';

const Container = styled.div``;

const GreetingContainer = styled.div`
  margin-top: 30px;
  font-size: 40px;
  text-align: center;
`;

const DatePickerContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 30px;
`;

const ButtonContainer = styled.div`
  margin-top: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const DataContainer = styled.div`
  margin-top: 30px;
`;

const TextDateContainer = styled.div`
  text-align: center;
`;

const ResultContainer = styled.div`
  margin-top: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Loading = styled.div`
  position: absolute;
  top: 67%;
  left: 47%;
`;

const { RangePicker } = DatePicker;

const dateFormat = 'YYYY/MM/DD';

const columns = [
  {
    title: 'Image',
    dataIndex: 'image',
    key: 'image',
    render: (text, record) => {
      return (
        <div>
          <img src={record.image} />
        </div>
      );
    },
  },
  {
    title: 'Artist',
    dataIndex: 'artist',
    key: 'artist',
  },
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: 'Date',
    dataIndex: 'date',
    key: 'date',
  },
];

const UserScreen = () => {
  const [username, setUsername] = useState(getUser());
  const [dateRange, setDateRange] = useState([moment(), moment()]);
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState([]);
  const [pages, setPages] = useState(0);

  const greetingText = `Hello ${username}`;
  const collectDateText = 'Collecting data: ';

  const getPages = async () => {
    if (from && to) {
      const url = GET_RECENT_TRACKS_ENDPOINT(getUser(), from, to);
      return fetch(url)
        .then((response) => response.json())
        .then((data) => {
          return data.recenttracks['@attr'].totalPages;
        });
    }
  };

  const fetchData = (pages) => {
    const requests = [];
    for (let i = 0; i < pages; i++) {
      const url = GET_RECENT_TRACKS_ENDPOINT(username, from, to, i + 1);
      requests.push(axios.get(url));
    }

    axios.all(requests).then(
      axios.spread((...allData) => {
        const tracks = allData.map((item) => item.data.recenttracks.track).flat();
        const tracksWithoutActive = tracks.filter((track) => !track['@attr']);
        console.log('tracks', tracksWithoutActive);
        const tracksParsed = tracksWithoutActive.map((item) => ({
          image: item.image[0]['#text'],
          date: item.date['#text'],
          artist: item.artist['#text'],
          name: item.name,
          key: `${item.date['#text']}${item.name}${item.artist['#text']}`,
        }));

        setData(tracksParsed);
      })
    );
  };

  const getData = async (pages) => {
    setData([]);
    fetchData(pages);
  };

  useEffect(async () => {
    const pages = await getPages();
    getData(pages);
  }, [from, to]);

  const setDate = (v) => {
    setDateRange(v);
    try {
      setFrom(dateRange[0].format('X'));
      setTo(dateRange[1].format('X'));
    } catch (error) {
      setFrom('');
      setTo('');
    }
  };

  return (
    <>
      <SpotifyAuthButton />
      <Container>
        <GreetingContainer>{greetingText}</GreetingContainer>
        <DatePickerContainer>
          <Space direction="vertical" size={12}>
            <RangePicker
              disabledDate={(current) => {
                let customDate = moment().format('YYYY-MM-DD');
                return current && current > moment(customDate, 'YYYY-MM-DD');
              }}
              value={dateRange}
              format={dateFormat}
              onChange={(v) => setDateRange(v)}
            />
          </Space>
        </DatePickerContainer>
        <ButtonContainer>
          <Button onClick={setDate} type="primary" ghost>
            Date Range
          </Button>
        </ButtonContainer>
        <DataContainer>
          {/* {isLoading && <Spin />} */}
          {from && to && (
            <>
              <TextDateContainer>
                <span style={{ color: '#0544AC' }}>{collectDateText}</span>
                <i>{moment.unix(from).format('LL')}</i> - <i>{moment.unix(to).format('LL')}</i>
              </TextDateContainer>

              <ResultContainer>
                <Table dataSource={data} columns={columns} />
              </ResultContainer>
            </>
          )}
        </DataContainer>
      </Container>
    </>
  );
};

export default UserScreen;
