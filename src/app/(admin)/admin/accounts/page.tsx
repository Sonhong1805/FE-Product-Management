"use client";
import withBase from "@/hocs/withBase";
import AccountsService from "@/services/accounts";
import RolesService from "@/services/roles";
import moment from "moment";
import React, { useEffect, useState } from "react";
import {
  Badge,
  Button,
  Container,
  Form,
  Tab,
  Table,
  Tabs,
} from "react-bootstrap";
import { SubmitHandler, useForm } from "react-hook-form";
import { CiCirclePlus } from "react-icons/ci";
import { TfiTrash } from "react-icons/tfi";
import { TiEdit } from "react-icons/ti";
import Select, { SingleValue } from "react-select";
import Swal from "sweetalert2";
import { MdPassword } from "react-icons/md";
import { useAppSelector } from "@/lib/hooks";
import Pagination from "@/components/Pagination";
import {
  deletedAccount,
  handlePagination,
  handleQueries,
  saveRole,
  selectedIdsChanged,
  seletedIdsChangedAll,
  updateFeature,
} from "@/lib/features/account/accountSlice";
import { fetchAccounts } from "@/lib/features/account/accountThunk";
import Loading from "@/components/Loading";
import { FiEye } from "react-icons/fi";
import { featuredOptions } from "@/options/feature";
import setOrDeleteParam from "@/helpers/setOrDeleteParam";
import { statusOptions } from "@/options/status";

const Page = (props: IWithBaseProps) => {
  const userPermissions = useAppSelector(
    (state) => state.user.userInfo.role.permissions
  );
  const userId = useAppSelector((state) => state.user.userInfo._id);
  const { router, pathname, searchParams, rangeCount, dispatch } = props;
  const [selectedFeatured, setSelectedFeatured] = useState<Option | null>(null);
  const [roleOptions, setRoleOptions] = useState<Option[]>([]);
  const accounts = useAppSelector((state) => state.accounts.data);
  const pagination = useAppSelector((state) => state.accounts.pagination);
  const selectedIds = useAppSelector((state) => state.accounts.selectedIds);
  const queries = useAppSelector((state) => state.accounts.queries);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchRoles = async () => {
      const response = await RolesService.index(null);
      if (response.success && response.data) {
        const rolesOptions = response.data.map((role: IRole) => ({
          value: role._id,
          label: role.title,
        }));
        setRoleOptions(rolesOptions);
        const findRole = rolesOptions.find(
          (option) => option.value === searchParams.get("role")
        );
        if (findRole?.value) {
          setValue("role", findRole);
          dispatch(saveRole(findRole));
        } else {
          setValue("role", null);
        }
      }
    };
    fetchRoles();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchAccountsData = async () => {
    await dispatch(
      fetchAccounts({
        page: pagination.page,
        limit: pagination.limit,
        ...(queries.keywords && { fullname: queries.keywords }),
        ...(queries.status !== null && queries.status?.value
          ? {
              [queries.status?.value?.split(",")[0]]:
                queries.status?.value?.split(",")[1],
            }
          : {}),
        ...(queries.role !== null && queries.role?.value
          ? {
              role: queries.role?.value,
            }
          : {}),
      })
    );
  };

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    setOrDeleteParam(params, "page", pagination.page);
    setOrDeleteParam(params, "name", queries.keywords);
    setOrDeleteParam(
      params,
      "status",
      queries.status?.value && queries.status?.value.split(",")[1]
    );
    setOrDeleteParam(
      params,
      "role",
      queries.role?.value && queries.role?.value
    );

    setLoading(true);
    const delayDebounce = setTimeout(async () => {
      fetchAccountsData();
      setLoading(false);
      router.push(pathname + "?" + params.toString());
    }, 1000);
    return () => clearTimeout(delayDebounce);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queries, pagination.page]);

  const handleChangeOptionsFeatured = (option: Option | null) => {
    setSelectedFeatured(option);
  };

  const deleteAccount = async (id: string) => {
    Swal.fire({
      text: "Bạn có chắc muốn xoá tài khoản này?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Xoá",
      cancelButtonText: "Huỷ",
    }).then(async (result) => {
      if (result.isConfirmed) {
        const response = await AccountsService.delete(id);
        if (response?.success) {
          dispatch(deletedAccount(id));
          Swal.fire({
            icon: "success",
            title: response?.message,
            showConfirmButton: false,
            timer: 2000,
          });
        }
      }
    });
  };

  const handleFeatured = async () => {
    if (selectedIds.length > 0 && selectedFeatured) {
      const response = await AccountsService.changeFeature({
        ids: selectedIds,
        feature: selectedFeatured.value,
      });
      if (response?.success) {
        await dispatch(
          updateFeature({
            ids: selectedIds,
            feature: selectedFeatured.value,
          })
        );
        Swal.fire({
          icon: response?.success ? "success" : "error",
          title: response?.message,
          showConfirmButton: false,
          timer: 2000,
        });
      }
    }
  };

  const { register, handleSubmit, setValue, watch } = useForm<IAccountsQueries>(
    {
      defaultValues: {
        keywords: queries.keywords,
        role: queries.role,
      },
    }
  );
  const onSubmit: SubmitHandler<IAccountsQueries> = async (
    data: IAccountsQueries
  ) => {
    dispatch(handlePagination({ ...pagination, page: 1 }));
    dispatch(
      handleQueries({
        ...queries,
        keywords: data.keywords,
        status: data.status,
        role: data.role,
      })
    );
  };

  return (
    <Container>
      {loading && <Loading />}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Quản lý tài khoản</h2>
        {userPermissions.includes("accounts_create") && (
          <Button
            variant="outline-success"
            className="center gap-2"
            aria-hidden="false"
            onClick={() => router.push("/admin/accounts/create")}>
            <CiCirclePlus size={20} /> <span>Thêm mới</span>
          </Button>
        )}
      </div>
      <Tabs
        defaultActiveKey="search"
        id="uncontrolled-tab-example"
        className="mb-3">
        <Tab eventKey="search" title="Tìm kiếm">
          <Form className="d-flex w-75" onSubmit={handleSubmit(onSubmit)}>
            <Form.Group className="me-2 flex-fill">
              <Form.Control
                type="text"
                placeholder="Nhập họ tên hoặc email"
                {...register("keywords")}
              />
            </Form.Group>
            <Select
              className="basic-single me-2"
              classNamePrefix="select"
              placeholder="-- Chọn vai trò --"
              name="role"
              isClearable={true}
              value={watch("role") ? watch("role") : null}
              options={roleOptions}
              onChange={(option: SingleValue<Option>) =>
                setValue("role", option as Option)
              }
            />
            <Select
              className="basic-single me-2"
              classNamePrefix="select"
              placeholder="-- Chọn trạng thái --"
              name="status"
              isClearable={true}
              defaultValue={
                queries.status && queries.status.value ? queries.status : null
              }
              options={statusOptions}
              onChange={(option: SingleValue<Option>) =>
                setValue("status", option as Option)
              }
            />
            <Button variant="outline-success" type="submit">
              Tìm kiếm
            </Button>
          </Form>
        </Tab>
        {userPermissions.includes("accounts_update") && (
          <Tab eventKey="feartured" title="Tính năng">
            <Form className="d-flex">
              <div className="d-flex w-50">
                <Select
                  className="basic-single flex-fill me-2"
                  classNamePrefix="select"
                  placeholder="-- Chọn tính năng muốn áp dụng --"
                  isClearable={true}
                  isSearchable={true}
                  name="featured"
                  options={featuredOptions}
                  onChange={handleChangeOptionsFeatured}
                />
                <Button variant="outline-primary" onClick={handleFeatured}>
                  Áp dụng
                </Button>
              </div>
            </Form>
          </Tab>
        )}
      </Tabs>
      <Table striped bordered hover className="mt-3 caption-top">
        <caption>Danh sách tài khoản</caption>
        <thead className="table-info">
          <tr>
            <th>
              <Form.Check
                type={"checkbox"}
                checked={
                  selectedIds.length > 0 &&
                  selectedIds.length === accounts.length
                }
                onChange={() => dispatch(seletedIdsChangedAll())}
              />
            </th>
            <th>STT</th>
            <th>Họ tên</th>
            <th>Email</th>
            <th>Vai trò</th>
            <th>Trạng thái</th>
            <th>Cập nhật</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {accounts.length ? (
            accounts.map((account: IUser, index: number) => (
              <tr key={account._id}>
                <td>
                  <Form.Check
                    type={"checkbox"}
                    checked={selectedIds.includes(account._id)}
                    onChange={() => dispatch(selectedIdsChanged(account._id))}
                  />
                </td>
                <td>{(pagination.page - 1) * pagination.limit + index + 1}</td>
                <td>{account.fullname}</td>
                <td>{account.email}</td>
                <td>{account.role?.title}</td>
                <td>
                  <Badge bg={account.status ? "success" : "danger"}>
                    {account.status ? "Hoạt động" : "Dừng hoạt động"}
                  </Badge>
                </td>
                <td>{moment(account.updatedAt).format("DD-MM-YYYY")}</td>
                <td>
                  {account.email !== "admin@gmail.com" ? (
                    <div className="d-grid grid-2 gap-2">
                      {userPermissions.includes("accounts_view") && (
                        <Button
                          variant="outline-success"
                          className="center"
                          onClick={() =>
                            router.push(
                              "/admin/accounts/view?id=" + account._id
                            )
                          }>
                          <FiEye />
                        </Button>
                      )}
                      {(userPermissions.includes("accounts_update") ||
                        account._id === userId) && (
                        <Button
                          variant="outline-warning"
                          className="center"
                          onClick={() =>
                            router.push(
                              "/admin/accounts/create?id=" + account._id
                            )
                          }>
                          <TiEdit />
                        </Button>
                      )}
                      {userPermissions.includes("accounts_delete") && (
                        <Button
                          variant="outline-danger"
                          className="center"
                          onClick={() => deleteAccount(account._id)}>
                          <TfiTrash />
                        </Button>
                      )}
                      {(userPermissions.includes("accounts_update") ||
                        account._id === userId) && (
                        <Button
                          variant="outline-secondary"
                          className="center"
                          onClick={() =>
                            router.push(
                              `/admin/accounts/password/${account._id}`
                            )
                          }>
                          <MdPassword />
                        </Button>
                      )}
                    </div>
                  ) : (
                    <div>
                      {userPermissions.includes("accounts_view") && (
                        <Button
                          variant="outline-success"
                          className="center"
                          onClick={() =>
                            router.push(
                              "/admin/accounts/view?id=" + account._id
                            )
                          }>
                          <FiEye />
                        </Button>
                      )}
                    </div>
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr className="text-center">
              <td colSpan={8}>Chưa có tài khoản nào</td>
            </tr>
          )}
        </tbody>
      </Table>
      <div className="d-flex justify-content-between align-items-center mb-5">
        <div>
          Hiển thị {rangeCount<IUser>(accounts, pagination)}
          trên {pagination.totalItems} kết quả.
        </div>
        <Pagination
          pagination={pagination}
          siblingCount={1}
          onHandlePagination={handlePagination}
        />
      </div>
    </Container>
  );
};

export default withBase(Page);
