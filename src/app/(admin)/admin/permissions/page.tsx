"use client";
import Loading from "@/components/Loading";
import RowPermissionAll from "@/components/Row/RowPermissionAll";
import RowPermissionChild from "@/components/Row/RowPermissionChild";
import RowPermissionParent from "@/components/Row/RowPermissionParent";
import { permissionAll } from "@/constants/permission";
import { permissions } from "@/constants/permissions";
import { useAppSelector } from "@/lib/hooks";
import RolesService from "@/services/roles";
import React, { ChangeEvent, useEffect, useRef, useState } from "react";
import { Container, Table } from "react-bootstrap";

const Page = () => {
  const userPermissions = useAppSelector(
    (state) => state.user.userInfo.role.permissions
  );
  const [roles, setRoles] = useState<IRole[]>([]);
  const isFirstRender = useRef(true);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchRolesData = async () => {
    const response = await RolesService.index(null);
    if (response?.success && response.data) {
      const roles = response.data as IRole[];
      const sortedRoles = roles.sort((a: IRole, b: IRole) => {
        const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return dateA - dateB;
      });
      setRoles(sortedRoles || []);
    }
  };
  useEffect(() => {
    setLoading(true);
    const delayDebounce = setTimeout(async () => {
      fetchRolesData();
      setLoading(false);
    }, 1000);
    return () => clearTimeout(delayDebounce);
  }, []);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
    } else {
      const updatePermissions = async () => {
        await RolesService.updatePermissions(roles);
      };
      updatePermissions();
    }
  }, [roles]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setRoles((prev: IRole[]) => {
      const record = prev.find((item: IRole) => item._id === id) as IRole;
      const exist = record.permissions.includes(value);
      if (exist) {
        record.permissions = record.permissions.filter(
          (permission: string) => permission !== value
        );
      } else {
        record.permissions = [...record.permissions, value];
      }
      return [...prev];
    });
  };

  const handleSelectedAll = (e: ChangeEvent<HTMLInputElement>) => {
    const { id, value, checked } = e.target;
    if (value in permissionAll) {
      setRoles((prev: IRole[]) =>
        prev.map((item: IRole) => {
          if (item._id === id) {
            const relatedPermissions = Object.values(
              permissionAll[value as keyof IPermissionAll]
            );
            if (checked) {
              item.permissions = [
                ...new Set([...item.permissions, ...relatedPermissions]),
              ];
            } else {
              item.permissions = item.permissions.filter(
                (permission: string) => !relatedPermissions.includes(permission)
              );
            }
          }
          return item;
        })
      );
    }
  };

  const handlePermissionAll = (e: ChangeEvent<HTMLInputElement>) => {
    const { id, checked } = e.target;
    setRoles((prev: IRole[]) =>
      prev.map((item: IRole) => {
        if (item._id === id) {
          const allPermissions = [
            ...Object.values(permissionAll.dashboard),
            ...Object.values(permissionAll.categories),
            ...Object.values(permissionAll.products),
            ...Object.values(permissionAll.orders),
            ...Object.values(permissionAll.blogs),
            ...Object.values(permissionAll.roles),
            ...Object.values(permissionAll.permissions),
            ...Object.values(permissionAll.accounts),
            ...Object.values(permissionAll.settings),
          ];

          if (checked) {
            item.permissions = [
              ...new Set([...item.permissions, ...allPermissions]),
            ];
          } else {
            item.permissions = item.permissions.filter(
              (permission) => !allPermissions.includes(permission)
            );
          }
        }
        return item;
      })
    );
  };

  return (
    <Container>
      {loading && <Loading />}
      <div className="mb-4">
        <h2>Phân quyền tài khoản</h2>
      </div>
      <Table
        bordered
        hover
        className="mt-3 mb-5 w-100"
        style={{ tableLayout: "fixed" }}>
        <thead className="table-info">
          <tr>
            <th>Quyền hạn</th>
            {roles.map((item: IRole) => (
              <th key={item._id}>{item.title}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          <RowPermissionAll
            title="Chọn tất cả"
            roles={roles}
            onHandlePermissionAll={handlePermissionAll}
            disabled={!userPermissions.includes("permissions_update")}
          />
          {permissions.map(({ title, module, actions }) => (
            <React.Fragment key={title}>
              <RowPermissionParent
                title={title}
                value={module}
                onHandleSelectedAll={handleSelectedAll}
                roles={roles}
                disabled={!userPermissions.includes("permissions_update")}
              />
              {actions.map(({ title, permission }) => (
                <RowPermissionChild
                  key={title}
                  title={title}
                  roles={roles}
                  onHandleChange={handleChange}
                  permission={permission}
                  disabled={!userPermissions.includes("permissions_update")}
                />
              ))}
            </React.Fragment>
          ))}
        </tbody>
      </Table>
    </Container>
  );
};

export default Page;
