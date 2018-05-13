import { getWebsocket, setupWebsocket, getClientId } from 'actions';

let monitoringIntervalId;
let heartbeat;

const MONITORING_INTRVL = 10000;

export const prepareWebsocketAndClientId = clientId => (dispatch, getState) => {
  const id = clientId || getState().client.id;
  const ws = getWebsocket();

  if (!ws || (ws.readyState !== 1 && ws.readyState !== 0)) {
    dispatch(setupWebsocket());
    return;
  }

  if (!id) {
    dispatch(getClientId());
  }
};

export const tryToSend = (outgoing, reopen, actions = {}) => (dispatch) => {
  const { successAction, failAction } = actions;
  const webSocket = getWebsocket();

  if (!webSocket || webSocket.readyState !== WebSocket.OPEN) {
    if (failAction) {
      dispatch(failAction);
    }
    if (reopen) {
      dispatch(setupWebsocket());
    }
    console.warn('WebSocket readyState is not OPEN, unable to send ', outgoing);
    return false;
  }

  webSocket.send(JSON.stringify(outgoing));
  if (successAction) {
    dispatch(successAction);
  }
  return true;
};

export const handleServerPong = () => {
  heartbeat = true;
};

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
    dispatch(tryToSend({ type: 'PING' }, false));
  }, MONITORING_INTRVL);

  heartbeat = true;
};

export const stopMonitoring = () => {
  clearInterval(monitoringIntervalId);
};
