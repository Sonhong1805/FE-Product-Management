"use client";

import { convertFileList } from "@/helpers/convertFileList";
import { convertSlug } from "@/helpers/convertSlug";
import withBase from "@/hocs/withBase";
import { colorsOptions } from "@/options/colors";
import { labelsOptions } from "@/options/labels";
import { tagsOptions } from "@/options/tags";
import CategoriesService from "@/services/categories";
import ProductsService from "@/services/products";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import React, {
  ChangeEvent,
  Dispatch,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";
import { Button, Container, Form } from "react-bootstrap";
import { SubmitHandler, useForm } from "react-hook-form";
import { BiExit } from "react-icons/bi";
import { IoIosCloseCircleOutline } from "react-icons/io";
import Select, { ActionMeta, MultiValue, SingleValue } from "react-select";
import makeAnimated from "react-select/animated";
import Swal from "sweetalert2";
import { colourStyles } from "@/constants/colourStyles";
const animatedComponents = makeAnimated();
const Editor = dynamic(() => import("@/components/Editor/Editor"), {
  ssr: false,
  loading: () => <p>Loading...</p>,
});
import "../style.scss";
import { FiEye } from "react-icons/fi";
import Viewer from "viewerjs";

const Page = (props: IWithBaseProps) => {
  const { router, searchParams } = props;
  const [categoryOptions, setCategoryOptions] = useState<Option[]>([]);
  const [thumbnailPreview, setThumbnailPreview] = useState("");
  const [imagesPreview, setImagesPreview] = useState<string[]>([]);
  const [defaultTags, setDefaultTags] = useState<Option[] | null>([
    tagsOptions[0],
    tagsOptions[1],
  ]);
  const [defaultColors, setDefaultColors] = useState<Option[] | null>([
    colorsOptions[0],
    colorsOptions[1],
  ]);
  const [defaultCategory, setDefaultCategory] = useState<Option>();
  const [defaultLabel, setDefaultLabel] = useState<Option>();
  const [previewSlug, setPreviewSlug] = useState("");

  const thumbnailRef = useRef<HTMLDivElement | null>(null);
  const galleryRef = useRef<HTMLDivElement | null>(null);

  const viewerInstanceRef = useRef<Viewer | null>(null);

  useEffect(() => {
    let Viewer;
    import("viewerjs").then((module) => {
      Viewer = module.default;

      if (thumbnailRef.current) {
        viewerInstanceRef.current = new Viewer(thumbnailRef.current, {
          // Thêm các tùy chọn cho ảnh đơn nếu cần
        });
      }

      if (galleryRef.current) {
        viewerInstanceRef.current = new Viewer(galleryRef.current, {});
      }
    });

    return () => {
      if (viewerInstanceRef.current) viewerInstanceRef.current.destroy();
    };
  }, [imagesPreview]);

  const openGallery = async (index: number) => {
    if (viewerInstanceRef.current) {
      viewerInstanceRef.current.destroy();
    }

    const { default: Viewer } = await import("viewerjs");
    viewerInstanceRef.current = new Viewer(
      galleryRef.current as HTMLDivElement,
      {
        initialViewIndex: index,
      }
    );

    viewerInstanceRef.current.show();
  };

  useEffect(() => {
    const fetchCategories = async () => {
      const response = await CategoriesService.index();
      if (response.success && response.data) {
        const options = response.data.map((category) => ({
          value: category._id,
          label: category.title,
        }));
        setCategoryOptions(options);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchProductDetail = async () => {
      const response = await ProductsService.detail(
        searchParams.get("slug") as string
      );
      if (response.success && response.data) {
        const {
          _id,
          title,
          thumbnail,
          images,
          category,
          price,
          discount,
          descriptions,
          quantity,
          tags,
          label,
          description,
          colors,
        } = response.data as IProductInputs;
        setValue("_id", _id);
        setValue("title", title);
        const categoryOption: Option = {
          value: category?.slug || "",
          label: category?.title || "",
        };
        const labelOption: Option = {
          label: label?.label || "",
          value: label?.value || "",
        };

        setDefaultCategory(categoryOption || { value: "", label: "" });
        setDefaultLabel(labelOption || { value: "", label: "" });
        setValue("category", (category?._id as any) || "");
        setValue("label", label);
        setValue("thumbnail", thumbnail);
        setValue("description", description);
        setValue("images", images);
        setValue("price", price);
        setValue("discount", discount);
        setValue("quantity", quantity);
        setValue("descriptions", descriptions);
        setDefaultTags(tags);
        setValue(
          "tags",
          tags && tags.length > 0 ? tags : [tagsOptions[0], tagsOptions[1]]
        );
        setDefaultColors(colors);
        setValue(
          "colors",
          colors && colors.length > 0
            ? colors
            : [colorsOptions[0], colorsOptions[1]]
        );
      }
    };
    fetchProductDetail();
  }, [searchParams]);

  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    watch,
    formState: { errors },
  } = useForm<IProductInputs>({
    defaultValues: {
      tags: [tagsOptions[0], tagsOptions[1]],
      colors: [colorsOptions[0], colorsOptions[1]],
    },
  });
  const onSubmit: SubmitHandler<IProductInputs> = async (
    data: IProductInputs
  ) => {
    if (!data.slug) data.slug = previewSlug;
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (key === "images" && value instanceof FileList) {
        for (let i = 0; i < value.length; i++) {
          formData.append("images", value[i]);
        }
      } else if (key === "thumbnail" && value instanceof FileList) {
        formData.append("thumbnail", value[0] || "");
      } else if (
        ["tags", "colors", "label"].includes(key) ||
        (key === "images" && Array.isArray(value))
      ) {
        formData.append(key, JSON.stringify(value));
      } else {
        formData.append(key, value as string);
      }
    });
    if (watch("_id")) {
      const response = await ProductsService.update(watch("_id"), formData);
      if (response.success) {
        Swal.fire({
          position: "center",
          icon: "success",
          title: response?.message,
          showConfirmButton: false,
          timer: 2000,
        });
        router.push("/admin/products");
      }
    } else {
      const response = await ProductsService.create(formData);
      if (response.success) {
        Swal.fire({
          position: "center",
          icon: "success",
          title: response?.message,
          showConfirmButton: false,
          timer: 2000,
        });
        router.push("/admin/products");
      }
    }
  };

  useEffect(() => {
    if (watch("title")) {
      setPreviewSlug(convertSlug(convertSlug(watch("title"))));
    } else {
      setPreviewSlug("");
    }
  }, [watch("title")]);

  const handleThumbnailChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setThumbnailPreview(previewUrl);
    }
  };

  const handleImagesChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const previewUrls = Array.from(files).map((file) =>
        URL.createObjectURL(file)
      );
      setImagesPreview(previewUrls);
    }
  };

  const removeImagesPreview = (imageIndex: number) => {
    const currentImages = getValues("images");
    if (Array.isArray(currentImages)) {
      const updatedImages = currentImages.filter(
        (_, index: number) => index !== imageIndex
      );
      setValue("images", updatedImages);
    } else if (currentImages instanceof FileList) {
      const updatedFilesArray = Array.from(currentImages).filter(
        (_, index) => index !== imageIndex
      );
      const updatedFileList = convertFileList(updatedFilesArray);
      setValue("images", updatedFileList);
    }

    const updatedPreviews = imagesPreview.filter(
      (_, index) => index !== imageIndex
    );
    setImagesPreview(updatedPreviews);
  };

  const getValueMultiOptions = (
    newValue: MultiValue<Option>,
    value: keyof IProductInputs,
    setDefaultValue: Dispatch<SetStateAction<Option[] | null>>
  ) => {
    const selectedOptions: Option[] = newValue.map((option) => ({
      ...option,
    }));
    if (selectedOptions.length === 0) {
      setValue(value, null);
      setDefaultValue([]);
    } else {
      setValue(value, selectedOptions);
      setDefaultValue(selectedOptions);
    }
  };

  const handleValueSelectChange = (
    newValue: MultiValue<Option>,
    value: keyof IProductInputs,
    setDefaultValue: Dispatch<SetStateAction<Option[] | null>>
  ) => {
    getValueMultiOptions(newValue, value, setDefaultValue);
    setDefaultValue(Array.from(newValue));
  };

  const getCategoryOptions = (
    newValue: SingleValue<Option> | MultiValue<Option> | null,
    actionMeta: ActionMeta<Option>
  ) => {
    if (newValue && !Array.isArray(newValue)) {
      setValue("category", (newValue as Option).value as any);
      setDefaultCategory(newValue as Option);
    } else {
      setValue("category", "" as any);
      setDefaultCategory({ value: "", label: "" });
    }
  };
  const getLabelOptions = (
    newValue: SingleValue<Option> | MultiValue<Option> | null,
    actionMeta: ActionMeta<Option>
  ) => {
    if (newValue && !Array.isArray(newValue)) {
      setValue("label", newValue as Option as any);
      setDefaultLabel(newValue as Option);
    } else {
      setValue("label", { value: "", label: "" } as any);
      setDefaultLabel({ value: "", label: "" });
    }
  };

  const getValueDescription = (html: string) => setValue("descriptions", html);

  return (
    <Container>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>{watch("_id") ? "Chỉnh sửa sản phẩm" : "Thêm mới sản phẩm"}</h2>
        <Button
          variant="warning"
          className="center gap-2"
          aria-hidden="false"
          onClick={() => router.push("/admin/products")}>
          <BiExit size={20} /> <span>Trở về</span>
        </Button>
      </div>
      <Form onSubmit={handleSubmit(onSubmit)} className="mb-5">
        <div className="d-flex gap-5">
          <div className="w-50">
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>Tên sản phẩm</Form.Label>
              <Form.Control
                placeholder="Nhập tên sản phẩm"
                {...register("title", { required: true })}
              />
              {errors.title && (
                <span className="text-danger">Vui lòng nhập tên sản phẩm</span>
              )}
            </Form.Group>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>Mô tả ngắn sản phẩm (for SEO)</Form.Label>
              <Form.Control
                placeholder="Nhập mô tả ngắn cho sản phẩm"
                {...register("description", { required: true })}
              />
              {errors.description && (
                <span className="text-danger">
                  Vui lòng nhập mô tả ngắn cho sản phẩm
                </span>
              )}
            </Form.Group>
            <div className="d-flex mb-3 gap-3 flex-wrap">
              <Form.Group
                className="flex-fill"
                controlId="exampleForm.ControlInput1">
                <Form.Label>Danh mục</Form.Label>
                <Select
                  closeMenuOnSelect={true}
                  components={animatedComponents}
                  placeholder="-- Chọn danh mục sản phẩm --"
                  value={defaultCategory?.value ? defaultCategory : null}
                  isClearable={true}
                  isSearchable={true}
                  options={categoryOptions}
                  onChange={getCategoryOptions}
                />
              </Form.Group>
              <Form.Group
                className="flex-fill"
                controlId="exampleForm.ControlInput1">
                <Form.Label>Nhãn</Form.Label>
                <Select
                  closeMenuOnSelect={true}
                  components={animatedComponents}
                  placeholder="-- Chọn nhãn sản phẩm --"
                  value={defaultLabel?.value ? defaultLabel : null}
                  isClearable={true}
                  isSearchable={true}
                  options={labelsOptions}
                  onChange={getLabelOptions}
                />
              </Form.Group>
            </div>
            <Form.Group
              className="flex-fill mb-3"
              controlId="exampleForm.ControlInput1">
              <Form.Label>Giá (VNĐ)</Form.Label>
              <Form.Control
                type="number"
                defaultValue={0}
                min={0}
                placeholder="Nhập giá sản phẩm"
                {...register("price", {
                  valueAsNumber: true,
                })}
              />
            </Form.Group>
            <div className="d-flex mb-3 gap-3 flex-wrap">
              <Form.Group
                className="flex-fill"
                controlId="exampleForm.ControlInput1">
                <Form.Label>Phần trăm giảm giá (??%)</Form.Label>
                <Form.Control
                  type="number"
                  defaultValue={0}
                  min={0}
                  placeholder="Nhập phần trăm giảm giá"
                  {...register("discount", {
                    valueAsNumber: true,
                  })}
                />
              </Form.Group>
              <Form.Group
                className="flex-fill"
                controlId="exampleForm.ControlInput1">
                <Form.Label>Số lượng</Form.Label>
                <Form.Control
                  type="number"
                  defaultValue={0}
                  min={0}
                  placeholder="Nhập số lượng"
                  {...register("quantity", {
                    valueAsNumber: true,
                  })}
                />
              </Form.Group>
            </div>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>Màu sắc sản phẩm</Form.Label>
              <Select
                closeMenuOnSelect={false}
                components={animatedComponents}
                placeholder="-- Chọn màu sắc cho sản phẩm --"
                value={
                  defaultColors && defaultColors.length > 0
                    ? defaultColors
                    : null
                }
                isMulti
                options={colorsOptions}
                onChange={(newValue) =>
                  handleValueSelectChange(newValue, "colors", setDefaultColors)
                }
                styles={colourStyles}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>Từ khoá phổ biến</Form.Label>
              <Select
                closeMenuOnSelect={false}
                components={animatedComponents}
                placeholder="-- Chọn tag cho sản phẩm --"
                value={
                  defaultTags && defaultTags.length > 0 ? defaultTags : null
                }
                isMulti
                options={tagsOptions}
                onChange={(newValue) =>
                  handleValueSelectChange(newValue, "tags", setDefaultTags)
                }
              />
            </Form.Group>
          </div>
          <div className="w-50">
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>Slug sản phẩm</Form.Label>
              <Form.Control
                placeholder={
                  previewSlug ||
                  "Slug sản phẩm sẽ hiển thị ở đây hoặc thay đổi trực tiếp"
                }
                {...register("slug")}
              />
            </Form.Group>
            <div ref={thumbnailRef}>
              <Image
                src={
                  watch("_id") && watch("thumbnail")
                    ? thumbnailPreview || getValues("thumbnail") + ""
                    : thumbnailPreview || "/image/no-image.png"
                }
                width={257}
                height={257}
                alt="thumbnail"
                priority={true}
                style={{ objectFit: "contain" }}
              />
            </div>

            <Form.Group controlId="formFile" className="mb-3">
              <Form.Label>Thêm ảnh</Form.Label>
              <Form.Control
                type="file"
                {...register("thumbnail")}
                onChange={handleThumbnailChange}
              />
            </Form.Group>

            <Form.Group controlId="formFileMultiple" className="mb-3">
              <Form.Label>Thêm bộ ảnh (tối đa 10 ảnh)</Form.Label>
              <Form.Control
                type="file"
                multiple
                {...register("images")}
                onChange={handleImagesChange}
              />
            </Form.Group>
          </div>
        </div>
        <div className="d-flex gap-3 flex-wrap mb-3" ref={galleryRef}>
          {(watch("_id") && imagesPreview.length > 0
            ? imagesPreview
            : watch("_id")
            ? Array.from(getValues("images") as string[])
            : imagesPreview
          ).map((image: string | File, index: number) => (
            <div className="gallery" key={index}>
              <div className="gallery-icons">
                <FiEye
                  color="#FFFFFF"
                  size={24}
                  cursor={"pointer"}
                  onClick={() => openGallery(index)}
                />
                <IoIosCloseCircleOutline
                  color="#FFFFFF"
                  size={24}
                  cursor={"pointer"}
                  onClick={() => removeImagesPreview(index)}
                />
              </div>
              <Image
                src={image as string}
                width={200}
                height={200}
                priority={true}
                style={{ objectFit: "contain" }}
                alt="images"
              />
            </div>
          ))}
        </div>
        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
          {watch("_id") && (
            <Editor
              title="Nhập mô tả"
              value={getValues("descriptions")}
              onGetValue={getValueDescription}
            />
          )}
          {!watch("_id") && (
            <Editor
              title="Nhập mô tả"
              value={""}
              onGetValue={getValueDescription}
            />
          )}
        </Form.Group>
        <Form.Group
          className="mb-3 text-center"
          controlId="exampleForm.ControlInput1">
          <Button
            variant="outline-primary"
            className="w-25 m-auto"
            type="submit">
            {watch("_id") ? "Cập nhật" : "Thêm mới"}
          </Button>
        </Form.Group>
      </Form>
    </Container>
  );
};

export default withBase(Page);
