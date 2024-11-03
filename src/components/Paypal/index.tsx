"use client";
import {
  PayPalScriptProvider,
  PayPalButtons,
  usePayPalScriptReducer,
} from "@paypal/react-paypal-js";
import { useEffect } from "react";

const style: any = { layout: "vertical" };

const ButtonWrapper = ({ currency, showSpinner, amount, setIsPaid }: any) => {
  const [{ isPending, options }, dispatch]: any = usePayPalScriptReducer();

  useEffect(() => {
    dispatch({
      type: "resetOptions",
      value: {
        ...options,
        currency,
      },
    });
  }, [currency, showSpinner]);

  return (
    <>
      {showSpinner && isPending && <div className="spinner" />}
      <PayPalButtons
        style={style}
        disabled={false}
        forceReRender={[style, currency, amount]}
        fundingSource={undefined}
        createOrder={(data: any, actions: any) =>
          actions.order
            .create({
              purchase_units: [
                { amount: { currency_code: currency, value: amount } },
              ],
            })
            .then((orderId: any) => orderId)
        }
        onApprove={(data: any, actions: any) =>
          actions.order
            .capture()
            .then(async (response: any) => {
              if (response.status === "COMPLETED") {
                setIsPaid("SUCCESS");
              } else {
                setIsPaid("ERROR");
              }
            })
            .catch((error: any) => {
              setIsPaid("ERROR");
            })
        }
      />
    </>
  );
};

export default function Paypal({ amount, setIsPaid }: any) {
  return (
    <div style={{ maxWidth: "750px" }}>
      <PayPalScriptProvider
        options={{ clientId: "test", components: "buttons", currency: "USD" }}>
        <ButtonWrapper
          setIsPaid={setIsPaid}
          currency={"USD"}
          amount={amount}
          showSpinner={false}
        />
      </PayPalScriptProvider>
    </div>
  );
}
