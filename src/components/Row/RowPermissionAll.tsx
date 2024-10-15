import { permissionAll } from "@/constants/permission";
import { ChangeEvent } from "react";

interface IProps {
  roles: IRole[];
  title: string;
  onHandlePermissionAll: (e: ChangeEvent<HTMLInputElement>) => void;
}
const RowPermissionAll = (props: IProps) => {
  const { roles, title, onHandlePermissionAll } = props;
  return (
    <tr>
      <td>{title}</td>
      {roles.map((item) => (
        <td key={item._id}>
          <input
            type="checkbox"
            id={item._id}
            onChange={onHandlePermissionAll}
            checked={[
              ...Object.values(permissionAll.categories),
              ...Object.values(permissionAll.products),
            ].every((permission) => item.permissions.includes(permission))}
          />
        </td>
      ))}
    </tr>
  );
};

export default RowPermissionAll;
