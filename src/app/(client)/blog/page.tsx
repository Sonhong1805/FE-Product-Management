"use client";
import { topicsOptions } from "@/options/topics";
import React, { useEffect, useState } from "react";
import { Button, Col, Container, Form, InputGroup, Row } from "react-bootstrap";
import Image from "next/image";
import Link from "next/link";
import { fetchBlogs } from "@/lib/features/blog/blogThunk";
import { useAppSelector } from "@/lib/hooks";
import withBase from "@/hocs/withBase";
import Loading from "@/components/Loading";
import setOrDeleteParam from "@/helpers/setOrDeleteParam";
import { handlePagination, handleQueries } from "@/lib/features/blog/blogSlice";
import { SubmitHandler, useForm } from "react-hook-form";
import Pagination from "@/components/Pagination";
import { BsSearch } from "react-icons/bs";
import Breadcrumb from "@/components/Breadcrumb";

const Page = (props: IWithBaseProps) => {
  const { dispatch, searchParams, router, pathname, rangeCount } = props;
  const blogs = useAppSelector((state) => state.blogs.data);
  const pagination = useAppSelector((state) => state.blogs.pagination);
  const queries = useAppSelector((state) => state.blogs.queries);
  const [loading, setLoading] = useState<boolean>(false);
  const [keywords, setKeywords] = useState("");

  useEffect(() => {
    setKeywords(queries.keywords);
  }, [queries.keywords]);

  const fetchBlogsData = async () => {
    await dispatch(
      fetchBlogs({
        page: pagination.page,
        limit: 8,
        status: true,
        ...(queries.keywords && { title: queries.keywords }),
        ...(queries.topic !== null && queries.topic?.value
          ? {
              topic: queries.topic?.value,
            }
          : {}),
      })
    );
  };

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    setOrDeleteParam(params, "page", pagination.page);
    setOrDeleteParam(params, "name", queries.keywords);
    setOrDeleteParam(params, "topic", queries.topic && queries.topic?.value);

    setLoading(true);
    const delayDebounce = setTimeout(async () => {
      fetchBlogsData();
      setLoading(false);
      router.push(pathname + "?" + params.toString());
    }, 1000);
    return () => clearTimeout(delayDebounce);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queries, pagination.page]);

  const { register, handleSubmit } = useForm<IBlogsQueries>({
    defaultValues: {
      keywords: queries.keywords,
    },
  });
  const onSubmit: SubmitHandler<IBlogsQueries> = async (
    data: IBlogsQueries
  ) => {
    dispatch(handlePagination({ ...pagination, page: 1 }));
    dispatch(
      handleQueries({
        ...queries,
        keywords: data.keywords,
      })
    );
  };

  const handleChangeTopic = (topic: Option | null) => {
    dispatch(handlePagination({ ...pagination, page: 1 }));
    dispatch(
      handleQueries({
        ...queries,
        topic,
      })
    );
  };

  return (
    <>
      {loading && <Loading />}
      <Breadcrumb title="Bài viết" href="/blog" />
      <div className="bg-white">
        <Container>
          <h2 className="py-3">Bài viết</h2>
        </Container>
      </div>
      <div className="bg-body-secondary pb-5 pt-3">
        <Container className="bg-white p-3">
          <Row>
            <Col xs={3} className="border-end">
              <Form
                className="d-flex w-100 mb-4"
                onSubmit={handleSubmit(onSubmit)}>
                <Form.Group className="me-2 flex-fill">
                  <InputGroup>
                    <Form.Control
                      type="text"
                      placeholder="Nhập tiêu đề bài viết"
                      {...register("keywords")}
                    />
                    <InputGroup.Text
                      id="basic-addon2"
                      className="bg-danger p-0">
                      <Button variant="danger" type="submit">
                        <BsSearch size={20} className="text-light" />
                      </Button>
                    </InputGroup.Text>
                  </InputGroup>
                </Form.Group>
              </Form>
              <div className="topic">
                <h4 className="mb-3">Chủ đề</h4>
                <div className="topic__option">
                  <input
                    type="radio"
                    id="all"
                    name="topic"
                    onChange={() => handleChangeTopic(null)}
                    defaultChecked
                  />
                  <label htmlFor="all">Tất cả</label>
                </div>
                {topicsOptions.map((topic: Option) => (
                  <div className="topic__option" key={topic.value}>
                    <input
                      type="radio"
                      name="topic"
                      id={topic.value}
                      onChange={() => handleChangeTopic(topic)}
                    />
                    <label htmlFor={topic.value}>{topic.label}</label>
                  </div>
                ))}
              </div>
            </Col>
            <Col xs={9}>
              <div className="mb-3">
                {keywords.length > 0 && (
                  <div className="fs-5">
                    Kết quả tìm kiếm:{" "}
                    <strong>
                      <em>&quot; {keywords} &quot;</em>
                    </strong>
                  </div>
                )}
                <div>
                  Hiển thị {rangeCount(blogs, pagination)}
                  trên {pagination.totalItems} kết quả.
                </div>
              </div>
              <div className="d-grid grid-4 gap-2">
                {blogs.length > 0 ? (
                  blogs.map((blog) => (
                    <Link
                      href={`/blog/${blog.slug}`}
                      key={blog._id}
                      className="blog__card">
                      <figure className="m-0">
                        <Image
                          src={blog.thumbnail + "" || "/image/no-image.png"}
                          alt="thumbnail"
                          width={234}
                          height={132}
                          style={{ objectFit: "contain" }}
                        />
                      </figure>
                      <div className="blog__card--title">
                        <span>{blog.title}</span>
                      </div>
                    </Link>
                  ))
                ) : (
                  <div>Chưa có bài viết nào</div>
                )}
              </div>
              <div className="d-flex justify-content-center align-items-center my-5">
                <Pagination
                  pagination={pagination}
                  siblingCount={1}
                  onHandlePagination={handlePagination}
                />
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </>
  );
};

export default withBase(Page);
