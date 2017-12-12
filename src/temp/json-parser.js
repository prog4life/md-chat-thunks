export default (json) => {
  try {
    return JSON.parse(json);
  } catch (e) {
    console.error('Failed to parse json ', e);
    return false;
  }
};
