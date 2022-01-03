export const currencyFormat = (string) => {
  return parseInt(string).toLocaleString("it-IT", {
    style: "currency",
    currency: "VND",
  });
};
