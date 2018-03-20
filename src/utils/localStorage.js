export const loadState = (storageKey) => {
  if (typeof storageKey !== 'string') {
    console.error('Expected storage key of state to be string');
    return undefined;
  }
  try {
    const storedState = localStorage.getItem(storageKey);
    if (storedState === null) {
      return undefined;
    }
    return JSON.parse(storedState);
  } catch (e) {
    console.error(e); // TEMP:
    return undefined;
  }
};

export const saveState = (state, key) => {
  if (typeof key !== 'string') {
    console.error('Expected key for storing state to be string');
    return false;
  }
  try {
    const searializedState = JSON.stringify(state);
    localStorage.setItem(key, searializedState);
    return true;
  } catch (e) {
    console.error(e); // TEMP:
    return false;
  }
};
