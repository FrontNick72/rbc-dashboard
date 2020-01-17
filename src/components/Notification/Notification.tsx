import * as React from 'react';
import './Notification.scss';
import { ToastContainer } from 'react-toastify';

const baseClass = 'notification';

export const NotificationContainer = () => (
  <ToastContainer
    bodyClassName={'notify-body'}
    toastClassName={'notify-toast'}
    className={`${baseClass}s`}
    draggable={false}
    pauseOnHover
    autoClose={2000}
  />
);
