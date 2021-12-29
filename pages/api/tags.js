import axios from "axios";

export default async function tagsAPI(req, res, next) {
  const { slug, start, limit } = req.query;
  const response = await axios.get(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/tags?slug=${slug}`
  );
  const data = await response.data;
  const foods = data?.[0].foods;
  const getFoods = foods.slice(parseInt(start), parseInt(limit));
  res.status(200).json({ foods: getFoods });
}
