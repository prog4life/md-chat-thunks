const websocketMonitoring = (store) => {
  let heartbeat = false;
  let monitoringIntervalId;
  const MONITORING_INTRVL = 10000;

  return next => (action) => {
    const { type, monitoringInterval } = action;

    if (type !== 'START_WEBSOCKET_MONITORING' || !monitoringInterval) {
      if (type !== 'HANDLE_SERVER_PONG') {
        next(action);
      }
    }

    const handleServerPong = () => ({
      type: 'HANDLE_SERVER_PONG'
    });

    const startMonitoring = () => (dispatch) => {
      clearInterval(monitoringIntervalId);

      monitoringIntervalId = setInterval(() => {
        if (heartbeat === false) {
          // assume heartbeat as true for single next check
          heartbeat = true;
          dispatch(setupWebsocket());
          return;
        }
        heartbeat = false;
        dispatch(tryToSend({ key: 'Ping' }, false));
      }, MONITORING_INTRVL);

      heartbeat = true;
    };

    const stopMonitoring = () => {
      clearInterval(monitoringIntervalId);
    };
  };
};

export default websocketMonitoring;
