import axios from "axios";

export default async function updateBill(req, res) {
  const bill = req.body;

  const response = await axios.put(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/bills/${bill.id}`,
    bill
  );
  const data = await response.data;
  res.status(200).json(data);
}
