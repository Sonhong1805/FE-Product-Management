import React from "react";
import style from "./style.module.scss";
import { useAppSelector } from "@/lib/hooks";
import moment from "moment";

const FooterAdmin = () => {
  const setting = useAppSelector((state) => state.setting.data);
  return (
    <div className={style.footerAdmin}>
      <p>
        @Copyright <strong>( {setting.copyright} )</strong> -{" "}
        {moment(setting.updatedAt).format("YYYY")}
      </p>
    </div>
  );
};

export default FooterAdmin;
