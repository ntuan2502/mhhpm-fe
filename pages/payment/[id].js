import axios from "axios";
import React from "react";
import { useEffect, useState } from "react";
import BillItem from "../../components/Bill/BillItem";
import { currencyFormat } from "../../lib/format";
export const getServerSideProps = async (context) => {
  const id = context.params.id;
  const res = await axios.get(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/bills/${id}`
  );
  const data = await res.data;

  const res2 = await axios.get(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/bill-details?bill.id=${data.id}`
  );

  const data2 = await res2.data;
  console.log(data2);
  return {
    props: { billProp: data, billDetails: data2 },
  };
};

export default function finalBill({ billProp, billDetails }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [bill, setBill] = useState({});

  useEffect(() => {
    setLoading(true);
    setBill(billProp);
    setItems(billDetails);
    setLoading(false);
  }, []);
  return (
    <>
      {loading && (
        <div className="flex justify-center my-8">
          <FadeLoader loading={loading} color={"#000"} />
        </div>
      )}

      {items.length !== 0 && (
        <div className="container py-24 mx-auto font-Roboto_Normal mb-6">
          <h1 className="text-5xl font-bold mb-8">YOUR FINAL BILL</h1>

          <table className="w-full text-3xl font-bold">
            <thead className=" after:content-[''] after:block after:leading-5 after:text-transparent after:h-5 bg-cart-background-color after:bg-white">
              <tr>
                <th className="text-left pl-10">
                  All ({items.length} products)
                </th>
                <th>Unit price</th>
                <th>Quantity</th>
                <th>Into money</th>
                <th>Staff description</th>
                <th>Status</th>
              </tr>
            </thead>

            {/* List item */}
            <tbody className="text-center bg-cart-background-color">
              {items.map((item) => (
                <BillItem item={item} key={item.id}></BillItem>
              ))}
            </tbody>
          </table>

          <div className="flex my-8  text-3xl justify-between">
            <div></div>

            <div className="ml-10 py-5 bg-cart-background-color px-6 w-[500px] self-end">
              <div className="flex justify-between">
                <p className="font-bold">Total</p>
                <p>{currencyFormat(bill.total_prices)}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
