"use client";
import AuthService from "@/services/auth";
import { useRouter } from "next/navigation";
import React, {
  ChangeEvent,
  FormEvent,
  KeyboardEvent,
  useEffect,
  useRef,
  useState,
} from "react";
import { Button, Container, Form } from "react-bootstrap";

const Page = () => {
  const router = useRouter();
  const [otp, setOtp] = useState<string[]>(new Array(6).fill(""));
  const inputRefs = useRef<any>([]);
  const [combineOtp, setCombineOtp] = useState<string>("");
  const [errorOtp, setErrorOtp] = useState<boolean>(false);

  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (combineOtp.length !== 6) {
      setErrorOtp(true);
      return;
    }
    const email = localStorage.getItem("email") as string;
    const response = await AuthService.otpPassword(email, combineOtp);
    if (response.success) {
      router.push("/password/reset");
    }
  };

  const handleChange = (index: number, e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (isNaN(+value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);
    const combineOtp = newOtp.join("");
    const firstEmptyIndex = newOtp.findIndex((val) => val === "");
    if (firstEmptyIndex !== -1) {
      inputRefs.current[firstEmptyIndex].focus();
    } else if (
      value &&
      index < otp.length - 1 &&
      inputRefs.current[index + 1]
    ) {
      inputRefs.current[index + 1].focus();
    }
    setCombineOtp(combineOtp);
  };

  const handleClick = (index: number) => {
    inputRefs.current[index].setSelectionRange(1, 1);
    if (index > 0 && !otp[index - 1]) {
      inputRefs.current[otp.indexOf("")].focus();
    }
  };

  const handleKeyDown = async (
    index: number,
    e: KeyboardEvent<HTMLInputElement>
  ) => {
    if (
      e.key === "Backspace" &&
      !otp[index] &&
      index > 0 &&
      inputRefs.current[index - 1]
    ) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handleSendBackOtp = async () => {
    const email = localStorage.getItem("email") as string;
    await AuthService.forgotPassword(email);
  };

  return (
    <Container className="mt-5">
      <h1 className="text-center mb-3">Xác nhận mã OTP</h1>
      <div
        style={{ maxWidth: "480px", cursor: "pointer" }}
        className="text-end m-auto px-2"
        onClick={handleSendBackOtp}>
        <span>Gửi lại</span>
      </div>
      <Form
        className="m-auto"
        style={{ width: "30rem" }}
        onSubmit={handleSubmit}>
        <Form.Group className="inputs d-flex flex-row justify-content-center mt-2 mb-2">
          {otp.map((item, index) => (
            <Form.Control
              key={index}
              ref={(input: any) => (inputRefs.current[index] = input)}
              type="text"
              id={item}
              className="m-2 text-center rounded"
              maxLength={1}
              style={{ height: "50px", fontSize: "23px" }}
              onChange={(e: any) => handleChange(index, e)}
              onClick={() => handleClick(index)}
              onKeyDown={(e: any) => handleKeyDown(index, e)}
            />
          ))}
        </Form.Group>
        {errorOtp && (
          <div className="text-danger mb-2">Vui lòng nhập đầy đủ mã OTP</div>
        )}
        <Form.Group className="mb-3 text-center w-100">
          <Button variant="outline-primary" className="w-100" type="submit">
            Xác nhận
          </Button>
        </Form.Group>
      </Form>
    </Container>
  );
};

export default Page;
