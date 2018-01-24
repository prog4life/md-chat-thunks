// TODO: replace this functionality to reducer ?
// TODO:  only own messages can show statuses
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

const filterMessages = messages => (
  filterMessageStatuses(messages)
);

export { filterMessageStatuses, filterMessages };
