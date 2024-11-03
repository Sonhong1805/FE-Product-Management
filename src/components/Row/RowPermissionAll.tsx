import { permissionAll } from "@/constants/permission";
import { ChangeEvent } from "react";

interface IProps {
  roles: IRole[];
  title: string;
  onHandlePermissionAll: (e: ChangeEvent<HTMLInputElement>) => void;
  disabled: boolean;
}
const RowPermissionAll = (props: IProps) => {
  const { roles, title, onHandlePermissionAll, disabled } = props;
  return (
    <tr>
      <td>{title}</td>
      {roles.map((item) => (
        <td key={item._id}>
          <input
            type="checkbox"
            id={item._id}
            onChange={onHandlePermissionAll}
            disabled={disabled}
            checked={[
              ...Object.values(permissionAll.dashboard),
              ...Object.values(permissionAll.categories),
              ...Object.values(permissionAll.products),
              ...Object.values(permissionAll.orders),
              ...Object.values(permissionAll.blogs),
              ...Object.values(permissionAll.roles),
              ...Object.values(permissionAll.permissions),
              ...Object.values(permissionAll.accounts),
              ...Object.values(permissionAll.settings),
            ].every((permission) => item.permissions.includes(permission))}
          />
        </td>
      ))}
    </tr>
  );
};

export default RowPermissionAll;
