import { Modal, Form, Input, Checkbox, InputNumber } from 'antd';
import { useEffect, useState } from 'react';
import styled from 'styled-components';
import SpotifyCreatePlaylistButton from './SpotifyCreatePlaylistButton';

const Container = styled.div``;
const FormContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const SpotifyPlaylistModal = ({ isModalVisible, handleCancel, data }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isPublic, setIsPublic] = useState(false);
  const [playlistLength, setPlaylistLength] = useState(10);

  return (
    <Container>
      <Modal title="Create Playlist" footer={null} onCancel={handleCancel} centered={true} visible={isModalVisible}>
        <FormContainer>
          <Form
            name="basic"
            labelCol={{
              span: 8,
            }}
            wrapperCol={{
              span: 16,
            }}
            initialValues={{
              remember: true,
            }}
            autoComplete="off"
          >
            <Form.Item
              label="Name"
              name="name"
              rules={[
                {
                  required: true,
                  message: 'Please input playlist name!',
                },
              ]}
              onChange={(e) => setName(e.target.value)}
            >
              <Input />
            </Form.Item>

            <Form.Item label="Description" name="description" onChange={(e) => setDescription(e.target.value)}>
              <Input />
            </Form.Item>

            <Form.Item label="Length" name="length">
              <InputNumber defaultValue={playlistLength} onChange={(num) => setPlaylistLength(num)} />
            </Form.Item>

            <Form.Item
              name="public"
              valuePropName="checked"
              wrapperCol={{
                offset: 8,
                span: 16,
              }}
            >
              <Checkbox onChange={(e) => setIsPublic(e.target.checked)}>Public</Checkbox>
            </Form.Item>

            <Form.Item
              wrapperCol={{
                offset: 8,
                span: 16,
              }}
            >
              <SpotifyCreatePlaylistButton
                data={data}
                name={name}
                description={description}
                playlistLength={playlistLength + 1}
                isPlaylistPublic={isPublic}
              />
            </Form.Item>
          </Form>
        </FormContainer>
      </Modal>
    </Container>
  );
};

export default SpotifyPlaylistModal;
