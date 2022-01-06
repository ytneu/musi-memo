import { notification } from 'antd';

const Notify = (message_type, desc, duration = 1.5) => {
  notification.open({
    duration: duration,
    message: message_type,
    description: desc,
  });
};

export default Notify;
