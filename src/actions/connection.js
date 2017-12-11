import { getWebsocket, setupWebsocket } from './websocket';
import { getClientId } from './actions';

const MONITORING_INTRVL = 5000;

// NOTE: Possibly excess
export const checkWebsocketAndClientId = ({ clientId }) => (
  getWebsocket().readyState === WebSocket.OPEN && clientId
);

export const prepareWebsocketAndClientId = (dispatch, getState) => {
  const { clientId } = getState();
  const ws = getWebsocket();

  if (!ws || (ws.readyState !== 1 && ws.readyState !== 0)) {
    dispatch(setupWebsocket());
    return;
  }

  if (!clientId) {
    dispatch(getClientId(ws));
  }
};

export const tryToSend = (outgoing, actions = {}) => (dispatch, getState) => {
  const { clientId } = getState();
  const ws = getWebsocket();
  const { success: successAction, fail: failAction } = actions;

  if (ws.readyState !== WebSocket.OPEN) {
    if (failAction) {
      dispatch(failAction);
    }
    dispatch(setupWebsocket());
    return;
  }

  if (!clientId) {
    if (failAction) {
      dispatch(failAction);
    }
    dispatch(getClientId(ws));
    return;
  }
  ws.send(JSON.stringify(outgoing));
  if (successAction) {
    dispatch(successAction);
  }
};

export const startPing = (dispatch, getState) => {
  const monitoringIntervalId = setInterval(() => {
    if (getState().connectionMonitoring.heartbeat === false) {
      // admit heartbeat as true for single next check
      dispatch({
        type: 'REOPENING',
        heartbeat: true
      });
      this.setupWebSocket();
      return;
    }
    dispatch({
      type: 'PING',
      heartbeat: false
    });
    // TODO: replace by tryToSend ?
    getWebsocket().send(JSON.stringify({
      type: 'PING'
    }));
  }, MONITORING_INTRVL);

  return {
    type: 'START_PING',
    monitoringIntervalId,
    heartbeat: true
  };
};

export const stopPing = (intervalId) => {
  clearInterval(intervalId);
  return {
    type: 'STOP_PING',
    intervalId
  };
};
