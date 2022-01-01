export const storeToSession = (key, data) => {
  window.sessionStorage.setItem(key, JSON.stringify(data));
};
