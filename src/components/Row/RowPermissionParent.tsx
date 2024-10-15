import { permissionAll } from "@/constants/permission";
import React, { ChangeEvent } from "react";

interface IProps {
  title: string;
  roles: IRole[];
  onHandleSelectedAll: (e: ChangeEvent<HTMLInputElement>) => void;
  value: string;
}
const RowPermissionParent = (props: IProps) => {
  const { title, roles, onHandleSelectedAll, value } = props;
  return (
    <tr>
      <td className="bg-secondary-subtle fw-bold">{title}</td>
      {roles.map((item) => (
        <td key={item._id} className="bg-secondary-subtle">
          <input
            type="checkbox"
            value={value}
            id={item._id}
            onChange={onHandleSelectedAll}
            checked={Object.values(
              permissionAll[value as keyof IPermissionAll]
            ).every((permission: any) => item.permissions.includes(permission))}
          />
        </td>
      ))}
    </tr>
  );
};

export default RowPermissionParent;
