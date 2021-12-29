// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import axios from "axios";

export default async function helloAPI(req, res) {
  const response = await axios.get(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/tags?slug=${req.query.slug}`
  );
  const data = await response.data;
  res.status(200).json({ data: data[0].foods.length });
}
