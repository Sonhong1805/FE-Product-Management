"use client";
import withBase from "@/hocs/withBase";
import { adminAccountsFeaturedOptions } from "@/options/featured";
import { adminAccountsFilteredOptions } from "@/options/filter";
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
  selectedIdsChanged,
  seletedIdsChangedAll,
  updateFeature,
} from "@/lib/features/account/accountSlice";
import { fetchAccounts } from "@/lib/features/account/accountThunk";
import Loading from "@/components/Loading/Loading";

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
  const selectedIds = useAppSelector((state) => state.products.selectedIds);
  const queries = useAppSelector((state) => state.accounts.queries);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    const setOrDeleteParam = (
      key: string,
      value: string | number | boolean
    ) => {
      if (value) {
        params.set(key, value.toString());
      } else {
        params.delete(key);
      }
    };

    setOrDeleteParam("page", pagination.page);
    setOrDeleteParam("fullname", queries.keywords);
    setOrDeleteParam("role", queries.role?.label as string);

    const storageParamsRoleKey = localStorage
      .getItem("roleFilterValue")
      ?.split(",")[0] as string;
    if (queries.role && queries.role.value) {
      const filterLabel = queries.role.label;
      const filterValue = queries.role.value;
      const [filterKey] = queries.role.value.split(",");
      if (filterKey !== storageParamsRoleKey) {
        params.delete("role");
        params.set("role", filterLabel);
        localStorage.setItem("roleFilterValue", filterValue);
        localStorage.setItem("roleFilterLabel", filterLabel);
      } else {
        params.set("role", filterLabel);
        localStorage.setItem("roleFilterValue", filterValue);
        localStorage.setItem("roleFilterLabel", filterLabel);
      }
    } else {
      params.delete("role");
      localStorage.removeItem("roleFilterValue");
      localStorage.removeItem("roleFilterLabel");
    }

    const storageParamsAccountKey = localStorage
      .getItem("accountFilterValue")
      ?.split(",")[0] as string;
    if (queries.filter && queries.filter.value) {
      const filterLabel = queries.filter.label;
      const filterValue = queries.filter.value;
      const [filterKey] = queries.filter.value.split(",");
      if (filterKey !== storageParamsAccountKey) {
        params.delete(storageParamsAccountKey);
        params.set(filterKey, filterLabel);
        localStorage.setItem("accountFilterValue", filterValue);
        localStorage.setItem("accountFilterLabel", filterLabel);
      } else {
        params.set(filterKey, filterLabel);
        localStorage.setItem("accountFilterValue", filterValue);
        localStorage.setItem("accountFilterLabel", filterLabel);
      }
    } else {
      params.delete(storageParamsAccountKey);
      localStorage.removeItem("accountFilterValue");
      localStorage.removeItem("accountFilterLabel");
    }

    (async () => {
      setLoading(true);
      await dispatch(
        fetchAccounts({
          page: pagination.page,
          limit: pagination.limit,
          ...(queries.keywords && { fullname: queries.keywords }),
          ...(queries.filter !== null
            ? {
                [queries.filter?.value?.split(",")[0]]:
                  queries.filter?.value?.split(",")[1],
              }
            : {}),
          ...(queries.role !== null && queries.role.value
            ? {
                role: queries.role?.value,
              }
            : {}),
        })
      );
      setLoading(false);
    })();
    router.push(pathname + "?" + params.toString());
  }, [queries, pagination.page]);

  useEffect(() => {
    const fetchRoles = async () => {
      const response = await RolesService.index(null);
      if (response.success && response.data) {
        const options = response.data.map((role: IRole) => ({
          value: role._id,
          label: role.title,
        }));
        setRoleOptions(options);
      }
    };
    fetchRoles();
  }, []);

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

  const { register, handleSubmit, setValue } = useForm<IAccountsQueries>({
    defaultValues: {
      keywords: queries.keywords,
    },
  });
  const onSubmit: SubmitHandler<IAccountsQueries> = async (
    data: IAccountsQueries
  ) => {
    dispatch(handlePagination({ ...pagination, page: 1 }));
    const filterKey = localStorage
      .getItem("accountFilterValue")
      ?.split(",")[0] as string;
    if (!data.filter || !data.filter.value) {
      if (filterKey) {
        dispatch(
          handleQueries({
            ...queries,
            filter: {
              value: "",
              label: "",
            },
          })
        );
      } else {
        dispatch(
          handleQueries({
            ...queries,
            keywords: data.keywords,
            role: data.role,
          })
        );
      }
    } else {
      dispatch(
        handleQueries({
          ...queries,
          keywords: data.keywords,
          filter: data.filter,
          role: data.role,
        })
      );
    }
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
            <Form.Group className="me-2">
              <Select
                className="basic-single me-2"
                classNamePrefix="select"
                placeholder="-- Chọn vai trò --"
                name="roles"
                isClearable={true}
                defaultValue={
                  queries.role && queries.role.value ? queries.role : null
                }
                options={roleOptions}
                onChange={(option: SingleValue<Option>) =>
                  setValue("role", option as Option)
                }
              />
            </Form.Group>
            <Select
              className="basic-single me-2"
              classNamePrefix="select"
              placeholder="-- Chọn trạng thái --"
              name="filter"
              isClearable={true}
              defaultValue={
                queries.filter && queries.filter.value ? queries.filter : null
              }
              options={adminAccountsFilteredOptions}
              onChange={(option: SingleValue<Option>) =>
                setValue("filter", option as Option)
              }
            />
            <Button variant="outline-success" type="submit">
              Tìm kiếm
            </Button>
          </Form>
        </Tab>
        <Tab eventKey="feartured" title="Tính năng">
          <Form className="d-flex">
            <div className="d-flex w-50 ">
              <Select
                className="basic-single flex-fill me-2"
                classNamePrefix="select"
                placeholder="-- Chọn tính năng muốn áp dụng --"
                isClearable={true}
                isSearchable={true}
                name="featured"
                options={adminAccountsFeaturedOptions}
                onChange={handleChangeOptionsFeatured}
              />
              <Button variant="outline-primary" onClick={handleFeatured}>
                Áp dụng
              </Button>
            </div>
          </Form>
        </Tab>
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
                  <div className="d-flex gap-2">
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
                          router.push(`/admin/accounts/password/${account._id}`)
                        }>
                        <MdPassword />
                      </Button>
                    )}
                  </div>
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
          Hiển thị {rangeCount(accounts, pagination)}
          trên {pagination.totalItems} kết quả.
        </div>
        <Pagination
          pagination={pagination}
          onHandlePagination={handlePagination}
        />
      </div>
    </Container>
  );
};

export default withBase(Page);
