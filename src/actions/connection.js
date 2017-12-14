import {
  PING,
  PONG,
  RECONNECT,
  START_PING,
  STOP_PING
} from 'constants/action-types';

import { getWebsocket, setupWebsocket, requestClientId } from 'actions';

let monitoringIntervalId;
let heartbeat;

const MONITORING_INTRVL = 10000;

export const prepareWebsocketAndClientId = clientId => (dispatch, getState) => {
  const id = clientId || getState().clientId;
  const ws = getWebsocket();

  if (!ws || (ws.readyState !== 1 && ws.readyState !== 0)) {
    dispatch(setupWebsocket());
    return;
  }

  if (!id) {
    dispatch(requestClientId());
  }
};

export const tryToSend = ({ outgoing, actions = {} }) => (dispatch) => {
  const { success: successAction, fail: failAction } = actions;
  const webSocket = getWebsocket();

  if (webSocket.readyState !== WebSocket.OPEN) {
    if (failAction) {
      dispatch(failAction);
    }
    dispatch(setupWebsocket());
    return;
  }

  webSocket.send(JSON.stringify(outgoing));
  if (successAction) {
    dispatch(successAction);
  }
};

export const ping = () => ({
  type: PING,
  heartbeat: false
});

export const pong = () => ({
  type: PONG,
  heartbeat: true
});

export const reconnect = () => ({
  type: RECONNECT,
  heartbeat: true
});

export const startPing = intervalId => ({
  type: START_PING,
  intervalId,
  heartbeat: true
});

export const stopPing = () => (dispatch, getState) => {
  clearInterval(getState().connectionMonitoring.intervalId);
  return {
    type: STOP_PING,
    intervalId: null,
    heartbeat: false
  };
};

// export const startMonitoring = () => (dispatch, getState) => {
//   const { intervalId } = getState().connectionMonitoring;
//   clearInterval(intervalId);
//
//   const monitoringIntervalId = setInterval(() => {
//     if (getState().connectionMonitoring.heartbeat === false) {
//       // TODO: change websocketStatus to something like 'BROKEN' ?
//       // assume heartbeat as true for single next check
//       dispatch(reconnect());
//       dispatch(setupWebsocket());
//       return;
//     }
//     dispatch(ping());
//     dispatch(tryToSend({
//       outgoing: { type: 'PING' }
//     }));
//   }, MONITORING_INTRVL);
//
//   dispatch(startPing(monitoringIntervalId));
// };

// NOTE: alternative version, without Redux store usage:

export const startMonitoring = () => (dispatch) => {
  clearInterval(monitoringIntervalId);

  monitoringIntervalId = setInterval(() => {
    if (heartbeat === false) {
      // assume heartbeat as true for single next check
      heartbeat = true;
      dispatch(setupWebsocket());
      return;
    }
    heartbeat = false;
    dispatch(tryToSend({
      outgoing: { type: 'PING' }
    }));
  }, MONITORING_INTRVL);

  heartbeat = true;
};
