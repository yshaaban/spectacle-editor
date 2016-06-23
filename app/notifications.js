import React, { Component } from "react";
import { render } from "react-dom";
import NotificationSystem from "react-notification-system";

const _notificationSystem = {
  addNotification() {}
};

class NotificationComponent extends Component {
  componentDidMount() {
    _notificationSystem.addNotification = this.refs.notificationSystem.addNotification;
  }

  render() {
    return <NotificationSystem ref="notificationSystem" />;
  }
}

render(
  React.createElement(NotificationComponent),
  document.getElementById("notifications")
);

export default _notificationSystem;
