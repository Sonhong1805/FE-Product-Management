"use client";
import React, { useEffect, useRef, useState } from "react";
import { Button, Container, Form, Tab, Tabs } from "react-bootstrap";
import { CiCirclePlus } from "react-icons/ci";
import Select, { SingleValue } from "react-select";
import Modal from "react-modal";
import { IoMdClose } from "react-icons/io";
import CategoriesService from "@/services/categories";
import { SubmitHandler, useForm } from "react-hook-form";
import Swal from "sweetalert2";
import { useAppSelector } from "@/lib/hooks";
import { featuredOptions } from "@/options/feature";
import { statusOptions } from "@/options/status";
import withBase from "@/hocs/withBase";
import generateBreadcrumbs from "@/helpers/generateBreadcrumbs";
import setOrDeleteParam from "@/helpers/setOrDeleteParam";
import "./style.scss";
import CategoryPagination from "./CategoryPagination";
import Loading from "@/components/Loading";

const Page = (props: IWithBaseProps) => {
  const { searchParams, router, pathname } = props;
  const userPermissions = useAppSelector(
    (state) => state.user.userInfo.role.permissions
  );
  const [modalIsOpen, setIsOpen] = useState(false);
  const [categories, setCategories] = useState<ICategory[]>([]);
  const originalCategoriesRef = useRef<ICategory[]>([]);
  const [selectedSlug, setSelectedSlug] = useState<string>("");
  const [selectedSlugs, setSelectedSlugs] = useState<string[]>([]);
  const [selectedFeatured, setSelectedFeatured] = useState<Option | null>(null);
  const keywordsRef = useRef<HTMLInputElement | null>(null);
  const findStatus = statusOptions.find((option) =>
    option.value.includes(searchParams.get("status") + "")
  );
  const [selectedStatus, setSelectedStatus] = useState<Option | null>(
    findStatus || null
  );
  const [optionsCategories, setOptionsCategories] = useState<Option[]>([]);
  const [parentOption, setParentOption] = useState<Option | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const fetchCategoriesData = async () => {
    const response = await CategoriesService.index();
    if (response?.success && response.data) {
      const categories: ICategory[] = response.data;
      const newCategories =
        categories.map((item) => ({
          ...item,
          breadcrumbs: generateBreadcrumbs(categories, item.slug),
        })) || [];
      const filteredCategories = newCategories.filter(filterCategories) || [];
      setCategories(
        filteredCategories.length > 0 ? filteredCategories : newCategories
      );
      originalCategoriesRef.current = newCategories || [];
    }
  };
  useEffect(() => {
    setLoading(true);
    const delayDebounce = setTimeout(async () => {
      fetchCategoriesData();
      setLoading(false);
    }, 1000);
    return () => clearTimeout(delayDebounce);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const defaltOption = { label: "-- Chọn danh mục cha --", value: "" };
    const categoriesOptions = originalCategoriesRef.current.map((category) => {
      return { label: category.title, value: category.slug };
    });

    setOptionsCategories([defaltOption, ...categoriesOptions]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [originalCategoriesRef.current]);

  const setParamsToURL = () => {
    const params = new URLSearchParams(searchParams.toString());
    setOrDeleteParam(params, "keywords", keywordsRef.current?.value);
    setOrDeleteParam(
      params,
      "status",
      selectedStatus?.value && selectedStatus?.value.split(",")[1]
    );
    router.push(pathname + "?" + params.toString());
  };

  const filterCategories = (category: ICategory) => {
    const isKeywords = keywordsRef.current
      ? category.title
          .toLowerCase()
          .includes(keywordsRef.current.value.toLowerCase())
      : true;
    const isStatus = selectedStatus
      ? category.status === JSON.parse(selectedStatus?.value.split(",")[1] + "")
      : true;

    return isKeywords && isStatus;
  };

  useEffect(() => {
    setParamsToURL();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [keywordsRef.current?.value, searchParams]);

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
    if (selectedSlug) {
      const response = await CategoriesService.update({
        slug: selectedSlug,
        title: data.title,
        parent_slug: data.parent_slug,
      });
      if (response && response.data) {
        const categories: ICategory[] = response.data;
        const newCategories = categories.map((item) => ({
          ...item,
          breadcrumbs: generateBreadcrumbs(categories, item.slug),
        }));
        setCategories(newCategories || []);
        originalCategoriesRef.current = newCategories || [];
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
        const categories: ICategory[] = response.data;
        const newCategories = categories.map((item) => ({
          ...item,
          breadcrumbs: generateBreadcrumbs(categories, item.slug),
        }));
        setCategories(newCategories || []);
        originalCategoriesRef.current = newCategories || [];
        closeModal();
        reset();
        Swal.fire({
          position: "center",
          icon: "success",
          title: response?.message,
          showConfirmButton: false,
          timer: 2000,
        });
      } else {
        Swal.fire({
          position: "center",
          icon: "error",
          title: response?.message,
          showConfirmButton: false,
          timer: 2000,
        });
      }
    }
  };

  function openModal() {
    setIsOpen(true);
    const defaltOption = { label: "-- Chọn danh mục cha --", value: "" };
    const categoriesOptions = originalCategoriesRef.current.map((category) => {
      return { label: category.title, value: category.slug };
    });
    setOptionsCategories([defaltOption, ...categoriesOptions]);
  }

  function closeModal() {
    setIsOpen(false);
    setSelectedSlug("");
    setParentOption(null);
    reset();
  }

  const updateCategory = async (slug: string) => {
    openModal();
    const response = await CategoriesService.detail(slug);
    if (response?.success) {
      setValue("title", response.data?.title || "");
      setValue("parent_slug", response.data?.parent_slug || "");

      const defaltOption = { label: "-- Chọn danh mục cha --", value: "" };
      const categoriesOptions = originalCategoriesRef.current.map(
        (category) => {
          return { label: category.title, value: category.slug };
        }
      );

      const parentCategory = categoriesOptions.find(
        (option: Option) => option.value === response.data?.parent_slug
      );
      setParentOption(parentCategory || null);
      const filteredCategories = categoriesOptions.filter(
        (category) => category.value !== response.data?.slug
      );
      setOptionsCategories([defaltOption, ...filteredCategories]);
      setSelectedSlug(slug);
    }
  };

  const deleteCategory = async (slug: string) => {
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
        const response = await CategoriesService.delete(slug);
        if (response?.success && response.data) {
          const categories: ICategory[] = response.data;
          const newCategories = categories.map((item) => ({
            ...item,
            breadcrumbs: generateBreadcrumbs(categories, item.slug),
          }));
          setCategories(newCategories || []);
          originalCategoriesRef.current = newCategories || [];
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
    if (selectedSlugs.length > 0 && selectedFeatured) {
      const response = await CategoriesService.changeFeature({
        slugs: selectedSlugs,
        feature: selectedFeatured.value,
      });
      if (response?.success && response.data) {
        const categories: ICategory[] = response.data;
        const newCategories = categories.map((item) => ({
          ...item,
          breadcrumbs: generateBreadcrumbs(categories, item.slug),
        }));
        setCategories(newCategories || []);
        originalCategoriesRef.current = newCategories || [];
        Swal.fire({
          icon: response?.success ? "success" : "error",
          title: response?.message,
          showConfirmButton: false,
          timer: 2000,
        });
      }
    }
  };

  const handleSearch = () => {
    const filteredCategories =
      originalCategoriesRef.current.filter(filterCategories) || [];
    setCategories(filteredCategories.length > 0 ? filteredCategories : []);
    setParamsToURL();
  };

  const handleSelectedOptionCategories = (newValue: SingleValue<Option>) => {
    setParentOption(newValue);
    setValue("parent_slug", newValue?.value + "");
  };

  return (
    <Container>
      {loading && <Loading />}
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
        defaultActiveKey="search"
        id="uncontrolled-tab-example"
        className="mb-3">
        <Tab eventKey="search" title="Tìm kiếm">
          <div className="d-flex w-50">
            <Form.Control
              className="flex-fill me-2 w-auto"
              type="text"
              defaultValue={searchParams.get("keywords") || ""}
              placeholder="Nhập tên danh mục"
              name="title"
              ref={keywordsRef}
            />
            <Select
              className="basic-single me-2"
              classNamePrefix="select"
              placeholder="-- Chọn trạng thái --"
              name="status"
              isClearable={true}
              defaultValue={
                selectedStatus && selectedStatus.value ? selectedStatus : null
              }
              options={statusOptions}
              onChange={(option) => setSelectedStatus(option)}
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
              options={featuredOptions}
              onChange={handleChangeOptionsFeatured}
            />
            <Button variant="outline-primary" onClick={handleFeatured}>
              Áp dụng
            </Button>
          </div>
        </Tab>
      </Tabs>
      <CategoryPagination
        itemsPerPage={6}
        items={categories}
        selectedSlugs={selectedSlugs}
        setSelectedSlugs={setSelectedSlugs}
        onUpdateCategory={updateCategory}
        onDeleteCategory={deleteCategory}
      />
      <Modal
        isOpen={modalIsOpen}
        ariaHideApp={false}
        onRequestClose={closeModal}
        className={"modal-style"}
        contentLabel="Example Modal">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h4>{selectedSlug ? "Cập nhật danh mục" : "Thêm mới danh mục"}</h4>
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
            <Select
              className="basic-single me-2"
              classNamePrefix="select"
              placeholder="-- Chọn danh mục cha --"
              name="parent_slug"
              isClearable={true}
              isSearchable={true}
              value={parentOption ? parentOption : null}
              options={optionsCategories}
              onChange={handleSelectedOptionCategories}
            />
          </Form.Group>
          <Button variant="outline-primary" type="submit" className="w-100">
            {selectedSlug ? "Cập nhật" : "Thêm mới"}
          </Button>
        </Form>
      </Modal>
    </Container>
  );
};

export default withBase(Page);
