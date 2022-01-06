export const currencyFormat = (string) => {
  return parseInt(string).toLocaleString("vi", {
    style: "currency",
    currency: "VND",
  });
};
