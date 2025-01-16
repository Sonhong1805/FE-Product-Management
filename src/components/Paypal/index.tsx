"use client";
import {
  PayPalScriptProvider,
  PayPalButtons,
  usePayPalScriptReducer,
} from "@paypal/react-paypal-js";
import { useEffect } from "react";

const style: { layout: "vertical" | "horizontal" | undefined } = {
  layout: "vertical",
};

interface IButtonWrapper {
  currency: string;
  showSpinner: boolean;
  amount: number;
  setIsPaid: React.Dispatch<React.SetStateAction<"" | "SUCCESS" | "ERROR">>;
}

interface Response {
  status: string;
}

const ButtonWrapper = ({
  currency,
  showSpinner,
  amount,
  setIsPaid,
}: IButtonWrapper) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [{ isPending, options }, dispatch]: any = usePayPalScriptReducer();

  useEffect(() => {
    dispatch({
      type: "resetOptions",
      value: {
        ...options,
        currency,
      },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currency, showSpinner]);

  return (
    <>
      {showSpinner && isPending && <div className="spinner" />}
      <PayPalButtons
        style={style}
        disabled={false}
        forceReRender={[style, currency, amount]}
        fundingSource={undefined}
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        createOrder={(data, actions: any) =>
          actions.order
            .create({
              purchase_units: [
                { amount: { currency_code: currency, value: amount } },
              ],
            })
            .then((orderId: string) => orderId)
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        onApprove={(data: any, actions: any) =>
          actions.order
            .capture()
            .then(async (response: Response) => {
              if (response.status === "COMPLETED") {
                setIsPaid("SUCCESS");
              } else {
                setIsPaid("ERROR");
              }
            })
            .catch(() => {
              setIsPaid("ERROR");
            })
        }
      />
    </>
  );
};

type TPaypal = Pick<IButtonWrapper, "amount" | "setIsPaid">;

export default function Paypal({ amount, setIsPaid }: TPaypal) {
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
