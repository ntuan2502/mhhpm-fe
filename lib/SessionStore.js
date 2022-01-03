export const storeToSession = (key, data) => {
  console.log("storing...");
  window.sessionStorage.setItem(key, JSON.stringify(data));
};
