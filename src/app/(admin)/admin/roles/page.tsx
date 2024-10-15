"use client";
import React, { useEffect, useRef, useState } from "react";
import {
  Badge,
  Button,
  Container,
  Form,
  Tab,
  Table,
  Tabs,
} from "react-bootstrap";
import { CiCirclePlus } from "react-icons/ci";
import Select from "react-select";
import Modal from "react-modal";
import { IoMdClose } from "react-icons/io";
import { SubmitHandler, useForm } from "react-hook-form";
import Swal from "sweetalert2";
import { adminRolesFeaturedOptions } from "@/options/featured";
import { TiEdit } from "react-icons/ti";
import { TfiTrash } from "react-icons/tfi";
import RolesService from "@/services/roles";
import { adminRolesFilteredOptions } from "@/options/filter";
import moment from "moment";
import withBase from "@/hocs/withBase";

const Page = (props: any) => {
  const { searchParams, router, pathname } = props;
  const [modalIsOpen, setIsOpen] = useState(false);
  const [roles, setRoles] = useState<IRole[]>([]);
  const [selectedId, setSelectedId] = useState<string>("");
  const [selectedIds, setSelectedIds] = useState<(string | number)[]>([]);
  const [selectedFeatured, setSelectedFeatured] = useState<Option | null>(null);
  const [selectedFilterd, setSelectedFilterd] = useState<Option | null>(null);
  const keywordsRef = useRef<HTMLInputElement | null>(null);

  const [search, setSearch] = useState<IRoleSearch>({
    keywords: "",
    filter: {
      label: "",
      value: "",
    },
  });

  const fetchRoles = async () => {
    const response = await RolesService.index({
      ...(search.keywords && { title: search.keywords }),
      ...(search.filter !== null
        ? {
            [search.filter?.value?.split(",")[0]]:
              search.filter?.value?.split(",")[1],
          }
        : {}),
    });
    if (response?.success && response.data) {
      setRoles(response.data || []);
    }
  };
  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());

    if (search.keywords) {
      params.set("name", search.keywords);
    } else {
      params.delete("name");
    }

    if (search.filter && search.filter.value) {
      params.set("status", search.filter.label);
      localStorage.setItem("statusValue", search.filter.value);
    } else {
      params.delete("status");
      localStorage.removeItem("statusValue");
    }

    router.push(pathname + "?" + params.toString());
    fetchRoles();
  }, [search]);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<IRoleInputs>({
    defaultValues: {
      title: "",
      description: "",
    },
  });
  const onSubmit: SubmitHandler<IRoleInputs> = async (data: IRoleInputs) => {
    if (selectedId) {
      const response = await RolesService.update({
        id: selectedId,
        title: data.title,
        description: data.description,
      });
      if (response && response.data) {
        const newRole = response.data as IRole;
        setRoles((prev: IRole[]) => {
          return prev.map((role: IRole) => {
            if (role._id === newRole._id) {
              return {
                ...role,
                ...newRole,
              };
            }
            return role;
          });
        });

        closeModal();
        reset();
        Swal.fire({
          position: "center",
          icon: "success",
          title: response?.message,
          showConfirmButton: false,
          timer: 2000,
        });
      }
    } else {
      const response = await RolesService.create(data);
      if (response?.success && response.data) {
        const newRole: IRole = response.data as IRole;
        setRoles((prev) => [newRole, ...prev]);
        closeModal();
        reset();
        Swal.fire({
          position: "center",
          icon: "success",
          title: response?.message,
          showConfirmButton: false,
          timer: 2000,
        });
      }
    }
  };

  function openModal() {
    setIsOpen(true);
  }

  function closeModal() {
    setIsOpen(false);
    setSelectedId("");
    reset();
  }

  const updateRole = async (id: string) => {
    openModal();
    const response = await RolesService.detail(id);
    if (response?.success) {
      setValue("title", response.data?.title || "");
      setValue("description", response.data?.description || "");
      setSelectedId(id);
    }
  };

  const deleteRole = async (id: string) => {
    Swal.fire({
      text: "Bạn có chắc muốn xoá vai trò này?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Xoá",
      cancelButtonText: "Huỷ",
    }).then(async (result) => {
      if (result.isConfirmed) {
        const response = await RolesService.delete(id);
        if (response?.success) {
          setRoles((prev: IRole[]) =>
            prev.filter((role: IRole) => role._id !== response.data?._id)
          );
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

  const handleChangeOptionsFeatured = (option: Option | null) => {
    setSelectedFeatured(option);
  };

  const handleFeatured = async () => {
    if (selectedIds.length > 0 && selectedFeatured) {
      const response = await RolesService.changeFeature({
        ids: selectedIds,
        feature: selectedFeatured.value,
      });
      if (response?.success) {
        fetchRoles();
        Swal.fire({
          icon: response?.success ? "success" : "error",
          title: response?.message,
          showConfirmButton: false,
          timer: 2000,
        });
      }
    }
  };

  const handleSeletedAll = () => {
    if (selectedIds.length === roles.length) {
      setSelectedIds([]);
    } else {
      const ids: (string | number)[] = roles.map((role: IRole) => role._id);
      setSelectedIds(ids);
    }
  };

  const handleSelectedIds = (id: string) => {
    setSelectedIds((prev) => {
      if (prev.includes(id)) {
        return prev.filter((item) => item !== id);
      }
      return [...prev, id];
    });
  };

  const handleSearch = () => {
    setSearch({
      ...search,
      keywords: keywordsRef.current?.value as string,
      filter: selectedFilterd,
    });
  };

  return (
    <Container>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Quản lý vai trò</h2>
        <Button
          variant="outline-success"
          className="center gap-2"
          aria-hidden="false"
          onClick={openModal}>
          <CiCirclePlus size={20} /> <span>Thêm mới</span>
        </Button>
      </div>
      <Tabs
        defaultActiveKey="search"
        id="uncontrolled-tab-example"
        className="mb-3">
        <Tab eventKey="search" title="Tìm kiếm">
          <div className="d-flex w-50">
            <Form.Control
              className="flex-fill me-2 w-auto"
              type="text"
              placeholder="Nhập tên vai trò"
              name="title"
              ref={keywordsRef}
            />
            <Select
              className="basic-single flex-fill me-2"
              classNamePrefix="select"
              placeholder="-- Chọn bộ lọc --"
              name="filter"
              isClearable={true}
              options={adminRolesFilteredOptions}
              onChange={(option) => setSelectedFilterd(option)}
            />
            <Button variant="outline-success" onClick={handleSearch}>
              Tìm kiếm
            </Button>
          </div>
        </Tab>
        <Tab
          eventKey="featured"
          title="Tính năng"
          className="position-relative">
          <div className="d-flex w-50 ">
            <Select
              className="basic-single flex-fill me-2"
              classNamePrefix="select"
              placeholder="-- Chọn tính năng muốn áp dụng --"
              isClearable={true}
              isSearchable={true}
              name="featured"
              options={adminRolesFeaturedOptions}
              onChange={handleChangeOptionsFeatured}
            />
            <Button variant="outline-primary" onClick={handleFeatured}>
              Áp dụng
            </Button>
          </div>
        </Tab>
      </Tabs>
      <Table striped bordered hover className="mt-3 mb-5 caption-top">
        <caption>Danh sách vai trò</caption>
        <thead className="table-info">
          <tr>
            <th>
              <Form.Check
                type={"checkbox"}
                checked={
                  selectedIds.length > 0 && selectedIds.length === roles.length
                }
                onChange={handleSeletedAll}
              />
            </th>
            <th>Tên vai trò</th>
            <th style={{ width: "450px" }}>Mô tả ngắn</th>
            <th>Trạng thái</th>
            <th>Cập nhật</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {roles.length ? (
            roles.map((role: IRole) => (
              <tr key={role._id}>
                <td>
                  <Form.Check
                    type={"checkbox"}
                    checked={selectedIds.includes(role._id)}
                    onChange={() => handleSelectedIds(role._id)}
                  />
                </td>
                <td>{role.title}</td>
                <td>{role.description}</td>
                <td>
                  <Badge bg={role.status ? "success" : "danger"}>
                    {role.status ? "Hoạt động" : "Dừng hoạt động"}
                  </Badge>
                </td>
                <td>{moment(role.updatedAt).format("DD-MM-YYYY")}</td>
                <td>
                  <div className="d-flex gap-2">
                    <Button
                      variant="outline-warning"
                      className="center"
                      onClick={() => updateRole(role._id)}>
                      <TiEdit />
                    </Button>
                    <Button
                      variant="outline-danger"
                      className="center"
                      onClick={() => deleteRole(role._id)}>
                      <TfiTrash />
                    </Button>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr className="text-center">
              <td colSpan={6}>Chưa có vai trò nào</td>
            </tr>
          )}
        </tbody>
      </Table>
      <Modal
        isOpen={modalIsOpen}
        ariaHideApp={false}
        onRequestClose={closeModal}
        className={"modal-style modal-role"}
        contentLabel="Example Modal">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h4>{selectedId ? "Cập nhật vai trò" : "Thêm mới vai trò"}</h4>
          <IoMdClose size={25} cursor={"pointer"} onClick={closeModal} />
        </div>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
            <Form.Label>Tên vai trò</Form.Label>
            <Form.Control
              type="text"
              placeholder="Nhập tên vai trò"
              {...register("title", { required: true })}
            />
            {errors.title && (
              <span className="text-danger">Vui lòng nhập tên vai trò</span>
            )}
          </Form.Group>
          <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
            <Form.Label>Mô tả ngắn</Form.Label>
            <Form.Control as="textarea" rows={3} {...register("description")} />
          </Form.Group>
          <Button variant="outline-primary" type="submit" className="w-100">
            {selectedId ? "Cập nhật" : "Thêm mới"}
          </Button>
        </Form>
      </Modal>
    </Container>
  );
};

export default withBase(Page);
