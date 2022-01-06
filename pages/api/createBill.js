import axios from "axios";

export default async function createBillAPI(req, res) {
  const bill = req.body;
  console.log(bill);
  const response = await axios.post(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/bills`,
    bill
  );
  const data = await response.data;
  console.log(data);
  res.status(200).json({ bill: data });
}
