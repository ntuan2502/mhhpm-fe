export const currencyFormat = (string) => {
  return parseInt(string).toLocaleString("vi", {
    style: "currency",
    currency: "VND",
  });
};

export const avgStars = (food) => {
  let avgStars = 0;
  if (food.comments?.length > 0) {
    food.comments.map((comment) => {
      avgStars += comment.stars;
    });
    avgStars /= food.comments.length;
  }
  return avgStars;
};
