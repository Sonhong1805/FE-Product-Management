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
import Pagination from "@/components/Pagination/Pagination";

const Page = (props: any) => {
  const { router, pathname, searchParams, rangeCount } = props;
  const [selectedIds, setSelectedIds] = useState<(string | number)[]>([]);
  const [accounts, setAccounts] = useState<IUser[]>([]);
  const [selectedFeatured, setSelectedFeatured] = useState<Option | null>(null);
  const [roleOptions, setRoleOptions] = useState<Option[]>([]);
  const [pagination, setPagination] = useState<IPagination>({
    limit: 5,
    page: 1,
    totalItems: 0,
    totalPages: 0,
  });
  const [search, setSearch] = useState<IAccountsSearch>({
    keywords: searchParams.get("fullname") || "",
    role: {
      label: searchParams.get("role") || "",
      value: localStorage.getItem("roleValue") || "",
    },
    filter: {
      label: searchParams.get("status") || "",
      value: localStorage.getItem("statusValue") || "",
    },
  });

  const fetchAccounts = async () => {
    const response = await AccountsService.index({
      page: pagination.page,
      limit: pagination.limit,
      ...(search.keywords && { fullname: search.keywords }),
      ...(search.filter && search.filter.value
        ? {
            [search.filter?.value?.split(",")[0]]:
              search.filter?.value?.split(",")[1],
          }
        : {}),
      ...(search.role &&
        search.role.value && {
          role: search.role.value,
        }),
    });
    if (response?.success && response?.data && response?.pagination) {
      setAccounts(response.data || []);
      setPagination(response.pagination);
    }
  };

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

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    if (pagination.page) {
      params.set("page", pagination.page.toString());
    }

    if (search.keywords) {
      params.set("fullname", search.keywords);
    } else {
      params.delete("fullname");
    }

    if (search.role && search.role.value) {
      params.set("role", search.role.label);
      localStorage.setItem("roleValue", search.role.value);
    } else {
      params.delete("role");
      localStorage.removeItem("roleValue");
    }

    if (search.filter && search.filter.value) {
      params.set("status", search.filter.label);
      localStorage.setItem("statusValue", search.filter.value);
    } else {
      params.delete("status");
      localStorage.removeItem("statusValue");
    }

    router.push(pathname + "?" + params.toString());
    fetchAccounts();
  }, [pagination.page, search]);

  const handleSeletedAll = () => {
    if (selectedIds.length === accounts.length) {
      setSelectedIds([]);
    } else {
      const ids: (string | number)[] = accounts.map(
        (account: IUser) => account._id
      );
      setSelectedIds(ids);
    }
  };

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
          setAccounts((prev: IUser[]) =>
            prev.filter((account: IUser) => account._id !== response.data?._id)
          );
          if (accounts.length === 1) {
            setPagination((prev) => ({
              ...prev,
              page: Math.max(prev.page - 1, 1),
              totalItems: prev.totalItems - 1,
            }));
          } else {
            setPagination((prev) => ({
              ...prev,
              totalItems: prev.totalItems - 1,
            }));
          }
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

  const handleSelectedIds = (id: string) => {
    setSelectedIds((prev) => {
      if (prev.includes(id)) {
        return prev.filter((item) => item !== id);
      }
      return [...prev, id];
    });
  };

  const handleFeatured = async () => {
    if (selectedIds.length > 0 && selectedFeatured) {
      const response = await AccountsService.changeFeature({
        ids: selectedIds,
        feature: selectedFeatured.value,
      });
      if (response?.success) {
        fetchAccounts();
        Swal.fire({
          icon: response?.success ? "success" : "error",
          title: response?.message,
          showConfirmButton: false,
          timer: 2000,
        });
      }
    }
  };

  const { register, handleSubmit, setValue } = useForm<IAccountsSearch>({
    defaultValues: {
      keywords: search.keywords,
    },
  });
  const onSubmit: SubmitHandler<IAccountsSearch> = async (
    data: IAccountsSearch
  ) => {
    setSearch({
      ...search,
      keywords: data.keywords,
      filter: data.filter,
      role: data.role,
    });
  };

  return (
    <Container>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Quản lý tài khoản</h2>
        <Button
          variant="outline-success"
          className="center gap-2"
          aria-hidden="false"
          onClick={() => router.push("/admin/accounts/create")}>
          <CiCirclePlus size={20} /> <span>Thêm mới</span>
        </Button>
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
                  search.role && search.role.value ? search.role : null
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
                search.filter && search.filter.value ? search.filter : null
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
                onChange={handleSeletedAll}
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
                    onChange={() => handleSelectedIds(account._id)}
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
                    <Button
                      variant="outline-warning"
                      className="center"
                      onClick={() =>
                        router.push("/admin/accounts/create?id=" + account._id)
                      }>
                      <TiEdit />
                    </Button>
                    <Button
                      variant="outline-danger"
                      className="center"
                      onClick={() => deleteAccount(account._id)}>
                      <TfiTrash />
                    </Button>
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
        <Pagination pagination={pagination} setPagination={setPagination} />
      </div>
    </Container>
  );
};

export default withBase(Page);