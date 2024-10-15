import React, { ChangeEvent } from "react";

interface IProps {
  title: string;
  roles: IRole[];
  onHandleChange: (e: ChangeEvent<HTMLInputElement>) => void;
  permission: string;
}
const RowPermissionChild = (props: IProps) => {
  const { title, roles, onHandleChange, permission } = props;
  return (
    <tr>
      <td>{title}</td>
      {roles.map((item) => (
        <td key={item._id}>
          <input
            type="checkbox"
            value={permission}
            id={item._id}
            onChange={onHandleChange}
            checked={item.permissions.includes(permission)}
          />
        </td>
      ))}
    </tr>
  );
};

export default RowPermissionChild;
