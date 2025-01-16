import React from "react";
import "./style.scss";
import { useAppSelector } from "@/lib/hooks";

const FooterAdmin = () => {
  const setting = useAppSelector((state) => state.setting.data);
  return (
    <div className="footer-admin">
      <p>
        @Copyright <strong>( {setting.copyright} )</strong> - (10/2024 -
        01/2025)
      </p>
    </div>
  );
};

export default FooterAdmin;
