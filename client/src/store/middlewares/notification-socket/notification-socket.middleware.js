import {
  SocketEvent,
  SocketNamespace,
  NotificationType,
  NotificationMessage,
  NotificationSocketEvent
} from 'common/enums/enums';
import { socket } from 'services/services';
import { appActionCreator, threadActionCreator, notificationActionCreator } from 'store/actions';

const notificationSocketInstance = socket.getInstance(SocketNamespace.NOTIFICATION);

const notificationSocket = ({ dispatch }) => {
  notificationSocketInstance.on(
    NotificationSocketEvent.LIKE_POST,
    post => {
      dispatch(threadActionCreator.likePostFromSocket(post));
      dispatch(appActionCreator.notify({
        type: NotificationType.INFO,
        message: NotificationMessage.LIKED_POST
      }));
    }
  );
  notificationSocketInstance.on(
    NotificationSocketEvent.DISLIKE_POST,
    post => {
      dispatch(threadActionCreator.dislikePostFromSocket(post));
      dispatch(appActionCreator.notify({
        type: NotificationType.INFO,
        message: NotificationMessage.DISLIKED_POST
      }));
    }
  );
  notificationSocketInstance.on(
    NotificationSocketEvent.LIKE_COMMENT,
    comment => {
      dispatch(threadActionCreator.likeCommentFromSocket(comment));
      dispatch(appActionCreator.notify({
        type: NotificationType.INFO,
        message: NotificationMessage.LIKED_COMMENT
      }));
    }
  );
  notificationSocketInstance.on(
    NotificationSocketEvent.DISLIKE_COMMENT,
    comment => {
      dispatch(threadActionCreator.dislikeCommentFromSocket(comment));
      dispatch(appActionCreator.notify({
        type: NotificationType.INFO,
        message: NotificationMessage.DISLIKED_COMMENT
      }));
    }
  );
  notificationSocketInstance.on(
    NotificationSocketEvent.NEW_POST,
    post => {
      dispatch(threadActionCreator.applyPost(post));
    }
  );

  return next => action => {
    if (notificationActionCreator.joinRoom.match(action)) {
      notificationSocketInstance.emit(SocketEvent.NOTIFICATION_JOIN_ROOM, `${action.payload}`);
    }

    if (notificationActionCreator.leaveRoom.match(action)) {
      notificationSocketInstance.emit(SocketEvent.NOTIFICATION_LEAVE_ROOM, `${action.payload}`);
    }

    return next(action);
  };
};

export { notificationSocket };
