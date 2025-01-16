import SettingsService from "@/services/settings";
import { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const response = await SettingsService.index();
  const setting = response.data;

  return {
    title: `Liên hệ - ${setting?.name}`,
    description:
      "Liên hệ với chúng tôi để được hỗ trợ về quản lý sản phẩm, giải đáp thắc mắc hoặc nhận tư vấn cho các giải pháp thương mại điện tử phù hợp với doanh nghiệp của bạn.",
    openGraph: {
      title: `Liên hệ - ${setting?.name}`,
      description:
        "Kết nối với đội ngũ hỗ trợ của chúng tôi để được tư vấn, giải đáp và hỗ trợ tận tâm về các giải pháp quản lý sản phẩm và thương mại điện tử.",
      type: "website",
      images: [setting?.logo + ""],
    },
  };
}

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}
