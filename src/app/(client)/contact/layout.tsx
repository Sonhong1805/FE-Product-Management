import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Liên hệ - Product Management",
  description:
    "Liên hệ với chúng tôi để được hỗ trợ về quản lý sản phẩm, giải đáp thắc mắc hoặc nhận tư vấn cho các giải pháp thương mại điện tử phù hợp với doanh nghiệp của bạn.",
  openGraph: {
    title: "Liên hệ - Product Management",
    description:
      "Kết nối với đội ngũ hỗ trợ của chúng tôi để được tư vấn, giải đáp và hỗ trợ tận tâm về các giải pháp quản lý sản phẩm và thương mại điện tử.",
    type: "website",
    images: [process.env.NEXT_PUBLIC_MY_URL + "/images/logo.png"],
  },
};
export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}
