import axios from "axios";

export default async function updateBillStatus(req, res) {
  const billDetail = req.body;

  console.log(billDetail);
  const response = await axios.delete(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/bill-details/${billDetail.id}`
  );
  const data = await response.data;
  res.status(200).json(data);
}
