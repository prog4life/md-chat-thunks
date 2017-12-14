const filterMessageStatuses = messages => (
  messages.reduce((accum, current) => {
    const [last] = accum.slice(-1);
    // if (last && last.status === current.status || last.status === 'UNSENT') {
    if (last && last.status === current.status) {
      last.status = null;
    }
    return accum.concat({ ...current });
  }, [])
);

const processMessages = messages => (
  filterMessageStatuses(messages)
);

export { filterMessageStatuses, processMessages };
