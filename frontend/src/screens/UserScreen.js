import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

import { getUser, setSpotiToken } from '../components/Auth';
import { DatePicker, Space, Button, Spin, Table } from 'antd';
import moment from 'moment';
import { GET_RECENT_TRACKS_ENDPOINT } from '../consts/ApiUrls';
import SpotifyAuthButton from '../components/SpotifyAuthButton';

import axios from 'axios';
import SpotifyPlaylistModal from '../components/SpotifyPlaylistModal';

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

const ButtonDateRangeContainer = styled.div`
  margin-top: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ButtonSpotifyCreatePlaylistContainer = styled.div`
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

const DescriptionContainer = styled.div`
  text-align: center;
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
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [username, setUsername] = useState(getUser());
  const [dateRange, setDateRange] = useState([moment(), moment()]);
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState([]);
  const [groupedData, setGroupedData] = useState([]);
  const [isRedirect, setIsRedirect] = useState(false);
  const [isSpotiAuth, setIsSpotiAuth] = useState(false);

  const greetingText = `Hello ${username}`;
  const collectDateText = 'Collecting data: ';
  const descriptionText = 'Create a spotify playlist from your musical periods.';

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
        const tracksParsed = tracksWithoutActive.map((item) => ({
          image: item.image[0]['#text'],
          date: item.date['#text'],
          artist: item.artist['#text'],
          name: item.name,
          key: `${item.date['#text']}${item.name}${item.artist['#text']}`,
        }));

        const groupedTracks = _(tracksParsed)
          .groupBy((x) => x.artist)
          .map((value, key) => ({ artist: key, songs: value }))
          .sortBy('songs')
          .reverse('songs')
          .value();

        setData(tracksParsed);
        setGroupedData(groupedTracks);
      })
    );
  };

  const getData = async (pages) => {
    setData([]);
    fetchData(pages);
  };

  const getHashParams = () => {
    var hashParams = {};
    var e,
      r = /([^&;=]+)=?([^&;]*)/g,
      q = window.location.hash.substring(1);
    while ((e = r.exec(q))) {
      hashParams[e[1]] = decodeURIComponent(e[2]);
    }
    return hashParams;
  };

  const setSpotifyParams = () => {
    const spotifyParams = getHashParams();
    if (spotifyParams.access_token) {
      setSpotiToken(spotifyParams.access_token);
      setIsSpotiAuth(true);
    }
  };

  useEffect(() => {
    setSpotifyParams();
  }, [isRedirect]);

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
      <SpotifyPlaylistModal
        data={groupedData}
        isModalVisible={isModalVisible}
        handleCancel={() => setIsModalVisible(false)}
      />
      <SpotifyAuthButton isAuth={isSpotiAuth} setIsRedirect={setIsRedirect} />
      <Container>
        <GreetingContainer>{greetingText}</GreetingContainer>
        <DescriptionContainer>
          <p>{descriptionText}</p>
        </DescriptionContainer>
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
        <ButtonDateRangeContainer>
          <Button onClick={setDate} type="primary" ghost>
            Date Range
          </Button>
        </ButtonDateRangeContainer>
        {data.length > 0 && (
          <ButtonSpotifyCreatePlaylistContainer>
            <Button onClick={() => setIsModalVisible(true)} type="primary" ghost>
              Create Spotify Playlist
            </Button>
          </ButtonSpotifyCreatePlaylistContainer>
        )}
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
