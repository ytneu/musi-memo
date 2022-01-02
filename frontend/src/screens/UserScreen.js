import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

import { getUser } from '../components/Auth';
import { DatePicker, Space, Button, Spin, Table } from 'antd';
import moment from 'moment';
import { GET_RECENT_TRACKS_ENDPOINT } from '../consts/ApiUrls';
import SpotifyAuthButton from '../components/SpotifyAuthButton';

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

const dataSource = [
  {
    key: '1',
    artist: 'Mike',
    name: 32,
    date: '07 Dec 2021, 14:45',
  },
  {
    key: '2',
    artist: 'John',
    name: 42,
    date: '08 Dec 2021, 14:45',
  },
];

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
      console.log(url);
      fetch(url)
        .then((response) => response.json())
        .then((data) => {
          console.log(data.recenttracks['@attr'].totalPages);
          setPages(data.recenttracks['@attr'].totalPages);
        });
    }
  };

  const parseData = (fetchData) => {
    // const data = data.concat(fetchData);
    // data.concat()

    let newData = [];

    for (let i = fetchData.length - 1; i >= 0; i--) {
      newData.push({
        key: toString(data.length+i),
        artist: fetchData[i].artist['#text'],
        name: fetchData[i].name,
        date: fetchData[i].date['#text'],
        image: fetchData[i].image[0]['#text'],
      });
    }

    // console.log('new data', newData)

      const localData = data.concat(newData)
      setData(localData);
    
  };

  const getOnePage = (page) => {
    const url = GET_RECENT_TRACKS_ENDPOINT(getUser(), from, to, page);
    console.log(url);
    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        // console.log(data);
        // console.log(data.recenttracks.track);
        parseData(data.recenttracks.track);
        // console.log(data.recenttracks.track)
      });
  };

  const getData = () => {
    setData([]);
      for (let i = 0; i < pages; i++) {
        getOnePage(i+1);
      }
  };

  const getOnePageData = () => {
    const url = GET_RECENT_TRACKS_ENDPOINT(getUser(), from, to);
    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        // console.log(data);
        console.log(data.recenttracks.track);
        data = data.recenttracks.track;
        let newData = [];

        for (let i = data.length - 1; i >= 0; i--) {
          newData.push({
            key: toString(i),
            artist: data[i].artist['#text'],
            name: data[i].name,
            date: data[i].date['#text'],
            image: data[i].image[0]['#text'],
          });
        }

        setData(newData);
      });
  };

  useEffect(() => {
    // getOnePageData();
    getPages().then(() => getData());
  }, [from, to]);

  const setDate = (v) => {
    setIsLoading(true);
    setDateRange(v);
    try {
      setFrom(dateRange[0].format('X'));
      setTo(dateRange[1].format('X'));
      //   getData();
    } catch (error) {
      setFrom('');
      setTo('');
    }

    setIsLoading(false);
  };

  return (
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
      <SpotifyAuthButton />
      {data ? data.length : null}
      
      {/* <DataContainer>
        {isLoading && <Spin />}
        {from && to && (
          <TextDateContainer>
            <span style={{ color: 'blue' }}>{collectDateText}</span>
            <i>{moment.unix(from).format('LL')}</i> - <i>{moment.unix(to).format('LL')}</i>
          </TextDateContainer>
        )}
        <ResultContainer>
          <Table dataSource={data} columns={columns} /> 
        </ResultContainer>
      </DataContainer> */}
    </Container>
  );
};

export default UserScreen;
