"use client";
import React, { useEffect, useRef, useState } from "react";
import { Button, Container, Form, Tab, Table, Tabs } from "react-bootstrap";
import { CiCirclePlus } from "react-icons/ci";
import Select from "react-select";
import Modal from "react-modal";
import { IoMdClose } from "react-icons/io";
import CategoriesService from "@/services/categories";
import { SubmitHandler, useForm } from "react-hook-form";
import Swal from "sweetalert2";
import { nested } from "@/helpers/createNested";
import OptionsNested from "@/components/Option/OptionsNested";
import getIdsNested from "@/helpers/getIdsNested";
import { adminCategoriesFeaturedOptions } from "@/options/featured";
import { adminCategoriesFilteredOptions } from "@/options/filter";
import { nonAccentVietnamese } from "@/helpers/nonAccentVietnamese";
import RowNested from "@/components/Row/RowNested";
import { useAppSelector } from "@/lib/hooks";

const Page = () => {
  const userPermissions = useAppSelector(
    (state) => state.user.userInfo.role.permissions
  );
  const [modalIsOpen, setIsOpen] = useState(false);
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [selectedId, setSelectedId] = useState<string>("");
  const [selectedIds, setSelectedIds] = useState<(string | number)[]>([]);
  const [selectedFeatured, setSelectedFeatured] = useState<Option | null>(null);
  const [selectedFilterd, setSelectedFilterd] = useState<Option | null>(null);
  const keywordsRef = useRef<HTMLInputElement | null>(null);

  const fetchCategories = async () => {
    const response = await CategoriesService.index();
    if (response?.success && response.data) {
      const nestedData = nested(response.data);
      setCategories(nestedData || []);
    }
  };
  useEffect(() => {
    fetchCategories();
  }, []);

  const addCategoryToChildren = (
    categories: ICategory[],
    newCategory: ICategory
  ): ICategory[] => {
    return categories.map((category: ICategory) => {
      if (category._id === newCategory.parent_slug) {
        return {
          ...category,
          children: [...(category.children || []), newCategory],
        };
      }
      if (category.children) {
        return {
          ...category,
          children: addCategoryToChildren(category.children, newCategory),
        };
      }
      return category;
    });
  };

  const deleteCategoryToChildren = (
    categories: ICategory[],
    id: string
  ): ICategory[] => {
    return categories
      .filter((category) => category._id !== id)
      .map((category) => {
        if (category.children) {
          return {
            ...category,
            children: deleteCategoryToChildren(category.children, id),
          };
        }
        return category;
      });
  };

  const updateCategoryToChildren = (
    categories: ICategory[],
    newData: ICategory
  ): ICategory[] => {
    return categories.map((category) => {
      if (category._id === newData._id) {
        return {
          ...category,
          ...newData,
        };
      }

      if (category.children && category.children.length > 0) {
        return {
          ...category,
          children: updateCategoryToChildren(category.children, newData),
        };
      }

      return category;
    });
  };

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<ICategoryInputs>({
    defaultValues: {
      title: "",
      parent_slug: "",
    },
  });
  const onSubmit: SubmitHandler<ICategoryInputs> = async (
    data: ICategoryInputs
  ) => {
    if (selectedId) {
      const response = await CategoriesService.update({
        id: selectedId,
        title: data.title,
        parent_id: data.parent_slug,
      });
      if (response && response.data) {
        // const newData: ICategory = response.data;
        // setCategories((prev) => updateCategoryToChildren(prev, newData));
        fetchCategories();
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
      const response = await CategoriesService.create(data);
      if (response?.success && response.data) {
        const newCategory: ICategory = response.data;
        setCategories((prev) => {
          if (!newCategory.parent_slug) {
            return [newCategory, ...prev];
          }
          return addCategoryToChildren(prev, newCategory);
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

  const updateCategory = async (id: string) => {
    openModal();
    const response = await CategoriesService.detail(id);
    if (response?.success) {
      setValue("title", response.data?.title || "");
      setValue("parent_slug", response.data?.parent_slug || "");
      setSelectedId(id);
    }
  };

  const deleteCategory = async (id: string) => {
    Swal.fire({
      text: "Bạn có chắc muốn xoá danh mục này?\n(⚠Việc xoá danh mục cha sẽ xoá cả danh mục con)",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Xoá",
      cancelButtonText: "Huỷ",
    }).then(async (result) => {
      if (result.isConfirmed) {
        const response = await CategoriesService.delete(id);
        if (response?.success) {
          setCategories((prev) => deleteCategoryToChildren(prev, id || ""));
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
      const response = await CategoriesService.changeFeature({
        ids: selectedIds,
        feature: selectedFeatured.value,
      });
      if (response?.success) {
        fetchCategories();
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
    if (selectedIds.length === getIdsNested(categories).length) {
      setSelectedIds([]);
    } else {
      const ids: (string | number)[] = getIdsNested(categories);
      setSelectedIds(ids);
    }
  };

  const flattenCategories = (categories: ICategory[]): ICategory[] => {
    return categories.reduce((acc: ICategory[], category: ICategory) => {
      const flattened = [...acc, category];
      if (category.children && category.children.length > 0) {
        return [...flattened, ...flattenCategories(category.children)];
      }
      return flattened;
    }, []);
  };

  // const handleSearch = () => {
  //   const keywords = keywordsRef.current?.value?.trim().toLowerCase();
  //   let key: keyof ICategory | "" = "",
  //     value: boolean | null = null;

  //   if (selectedFilterd?.value) {
  //     const filterParts = selectedFilterd.value.split("-");
  //     key = filterParts[0] as keyof ICategory;
  //     value = filterParts[1] === "true";
  //   }

  //   const flatCategories = flattenCategories(categoriesTemp);

  //   const filteredCategories = flatCategories.filter((category: ICategory) => {
  //     const isKeywordMatch = keywords
  //       ? nonAccentVietnamese(category.title.toLowerCase()).includes(
  //           nonAccentVietnamese(keywords)
  //         )
  //       : true;

  //     const isFilterMatch = key ? category[key] === value : true;

  //     return isKeywordMatch && isFilterMatch;
  //   });

  //   setCategories(filteredCategories);
  // };

  return (
    <Container>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Quản lý danh mục</h2>
        {userPermissions.includes("categories_create") && (
          <Button
            variant="outline-success"
            className="center gap-2"
            aria-hidden="false"
            onClick={openModal}>
            <CiCirclePlus size={20} /> <span>Thêm mới</span>
          </Button>
        )}
      </div>
      <Tabs
        defaultActiveKey="featured"
        id="uncontrolled-tab-example"
        className="mb-3">
        {/* <Tab eventKey="search" title="Tìm kiếm">
          <div className="d-flex w-75">
            <Form.Control
              className="flex-fill me-2 w-auto"
              type="text"
              placeholder="Nhập tên danh mục"
              name="title"
              ref={keywordsRef}
            />
            <Select
              className="basic-single flex-fill me-2"
              classNamePrefix="select"
              placeholder="-- Chọn bộ lọc --"
              name="filter"
              isClearable={true}
              options={adminCategoryFilteredOptions}
              onChange={(option) => setSelectedFilterd(option)}
            />
            <Button variant="outline-success" onClick={handleSearch}>
              Tìm kiếm
            </Button>
          </div>
        </Tab> */}
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
              options={adminCategoriesFeaturedOptions}
              onChange={handleChangeOptionsFeatured}
            />
            <Button variant="outline-primary" onClick={handleFeatured}>
              Áp dụng
            </Button>
          </div>
        </Tab>
      </Tabs>
      <Table striped bordered hover className="mt-3 mb-5 caption-top">
        <caption>Danh sách danh mục sản phẩm</caption>
        <thead className="table-info">
          <tr>
            <th>
              <Form.Check
                type={"checkbox"}
                checked={
                  selectedIds.length > 0 &&
                  selectedIds.length === getIdsNested(categories).length
                }
                onChange={handleSeletedAll}
              />
            </th>
            <th>Tên danh mục</th>
            <th>Breadcrumbs</th>
            <th>Trạng thái</th>
            <th>Cập nhật</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          <RowNested
            categories={categories}
            parentPath=""
            onUpdateCategory={updateCategory}
            onDeleteCategory={deleteCategory}
            selectedIds={selectedIds}
            setSelectedIds={setSelectedIds}
          />
        </tbody>
      </Table>
      <Modal
        isOpen={modalIsOpen}
        ariaHideApp={false}
        onRequestClose={closeModal}
        className={"modal-style"}
        contentLabel="Example Modal">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h4>{selectedId ? "Cập nhật danh mục" : "Thêm mới danh mục"}</h4>
          <IoMdClose size={25} cursor={"pointer"} onClick={closeModal} />
        </div>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
            <Form.Label>Tên danh mục</Form.Label>
            <Form.Control
              type="text"
              placeholder="Nhập tên danh mục"
              {...register("title", { required: true })}
            />
            {errors.title && (
              <span className="text-danger">Vui lòng nhập tên danh mục</span>
            )}
          </Form.Group>
          <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
            <Form.Label>Danh mục cha</Form.Label>
            <Form.Select
              aria-label="Default select example"
              className="mb-3"
              {...register("parent_slug")}>
              <option value={""}>-- Chọn danh mục cha --</option>
              <OptionsNested
                categories={categories}
                title={""}
                selectedId={selectedId}
              />
            </Form.Select>
          </Form.Group>
          <Button variant="outline-primary" type="submit" className="w-100">
            {selectedId ? "Cập nhật" : "Thêm mới"}
          </Button>
        </Form>
      </Modal>
    </Container>
  );
};

export default Page;
