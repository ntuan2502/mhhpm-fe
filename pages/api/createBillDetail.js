import axios from "axios";

export default async function createBillDetailAPI(req, res) {
  const billDetail = req.body;

  const response = await axios.post(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/bill-details`,
    billDetail
  );
  const data = await response.data;
  res.status(200).json({ data: data });
}
