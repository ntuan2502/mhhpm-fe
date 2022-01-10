import axios from "axios";
import { limit } from "../../config/setting";

export default async function tagsAPI(req, res, next) {
  const { slug } = req.query;

  const response = await axios.get(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/foods?_where[tags.slug]=${slug}`
  );

  const _start = parseInt(req.query.start ?? 0); //0, 12, 24, 36
  const _limit = parseInt(req.query.limit ?? limit()); //12
  const _end = parseInt(_limit + _start); //12, 24, 36
  const data = await response.data;
  const foods = data;
  const totalCount = foods.length;
  const getFoods = foods.slice(_start, _end);
  res.status(200).json({ foods: getFoods, totalCount: totalCount });
}
