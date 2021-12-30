import { notification } from 'antd';

const Notify = (message_type, desc) => {
  notification.open({
    duration: 1.5,
    message: message_type,
    description: desc,
  });
};

export default Notify;
