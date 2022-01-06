import axios from "axios";

export default async function updateSold(req, res) {
  const id = req.query.id;
  const newSold = req.query.sold;

  const response = await axios.put(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/foods/${id}`,
    {
      sold: newSold,
    }
  );
  const data = await response.data;
  res.status(200).json({ data: "OK" });
}
