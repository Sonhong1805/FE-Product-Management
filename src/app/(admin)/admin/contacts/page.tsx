"use client";
import withBase from "@/hocs/withBase";
import moment from "moment";
import React, { SyntheticEvent, useEffect, useState } from "react";
import {
  Badge,
  Button,
  Container,
  Form,
  Tab,
  Table,
  Tabs,
} from "react-bootstrap";
import { TfiTrash } from "react-icons/tfi";
import Select from "react-select";
import Swal from "sweetalert2";
import { useAppSelector } from "@/lib/hooks";
import Loading from "@/components/Loading";
import { fetchContacts } from "@/lib/features/contact/contactThunk";
import { deletedContact } from "@/lib/features/contact/contactSlice";
import ContactsService from "@/services/contacts";
import { FiEye } from "react-icons/fi";
import { answersOptions } from "@/options/status";
import setOrDeleteParam from "@/helpers/setOrDeleteParam";

const Page = (props: IWithBaseProps) => {
  const userPermissions = useAppSelector(
    (state) => state.user.userInfo.role.permissions
  );
  const { router, pathname, searchParams, dispatch } = props;
  const contacts = useAppSelector((state) => state.contacts.data);
  const [loading, setLoading] = useState<boolean>(false);
  const [keywords, setKeywords] = useState<string>("");
  const [defaultStatus, setDefaultStatus] = useState<Option | null>(null);

  const findStatus = answersOptions.find((option) =>
    option.value.includes(searchParams.get("status") + "")
  );

  const [selectedStatus, setSelectedStatus] = useState<Option | null>(
    findStatus ?? null
  );

  const fetchContactsData = async () => {
    await dispatch(
      fetchContacts({
        ...(keywords && { keywords }),
        ...(selectedStatus !== null && selectedStatus?.value
          ? {
              [selectedStatus?.value?.split(",")[0]]:
                selectedStatus?.value?.split(",")[1],
            }
          : {}),
      })
    );
  };

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    setOrDeleteParam(params, "keywords", keywords + "");
    setOrDeleteParam(
      params,
      "status",
      selectedStatus?.value && selectedStatus?.value.split(",")[1]
    );

    setLoading(true);
    const delayDebounce = setTimeout(async () => {
      fetchContactsData();
      setLoading(false);
      router.push(pathname + "?" + params.toString());
    }, 1000);
    return () => clearTimeout(delayDebounce);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [keywords, selectedStatus]);

  const deleteContact = async (id: string) => {
    Swal.fire({
      text: "Bạn có chắc muốn xoá liên hệ này?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Xoá",
      cancelButtonText: "Huỷ",
    }).then(async (result) => {
      if (result.isConfirmed) {
        const response = await ContactsService.delete(id);
        if (response?.success) {
          dispatch(deletedContact(id));
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

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    const target = e.target as typeof e.target & {
      keywords: { value: string };
    };
    const keywordsValue = target.keywords.value;
    setKeywords(keywordsValue);
    setSelectedStatus(defaultStatus);
  };

  return (
    <Container>
      {loading && <Loading />}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Quản lý liên hệ</h2>
      </div>
      <Tabs
        defaultActiveKey="search"
        id="uncontrolled-tab-example"
        className="mb-3">
        <Tab eventKey="search" title="Tìm kiếm">
          <Form onSubmit={handleSubmit} className="w-50 d-flex">
            <Form.Group className="me-2 flex-fill">
              <Form.Control
                type="text"
                name="keywords"
                placeholder="Nhập họ tên, email hoặc chủ đề"
              />
            </Form.Group>
            <Form.Group>
              <Select
                className="basic-single flex-fill me-2"
                classNamePrefix="select"
                placeholder="-- Chọn trạng thái --"
                isClearable={true}
                isSearchable={true}
                defaultValue={selectedStatus}
                name="status"
                options={answersOptions}
                onChange={(option) => setDefaultStatus(option)}
              />
            </Form.Group>
            <Button variant="outline-success" type="submit">
              Tìm kiếm
            </Button>
          </Form>
        </Tab>
      </Tabs>
      <Table striped bordered hover className="mt-3 caption-top">
        <caption>Danh sách liên hệ</caption>
        <thead className="table-info">
          <tr>
            <th>STT</th>
            <th>Họ tên</th>
            <th>Email</th>
            <th>Chủ đề</th>
            <th>Trạng thái</th>
            <th>Ngày gửi</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {contacts.length ? (
            contacts.map((contact: IContact, index: number) => (
              <tr key={contact._id}>
                {/* <td>
                  <Form.Check
                    type={"checkbox"}
                    checked={selectedIds.includes(contact._id)}
                    onChange={() => dispatch(selectedIdsChanged(contact._id))}
                  />
                </td> */}
                <td>{index + 1}</td>
                <td>{contact.fullName}</td>
                <td>{contact.email}</td>
                <td>{contact.topic}</td>
                <td>
                  <Badge bg={contact.status ? "success" : "secondary"}>
                    {contact.status ? "Đã trả lời" : "Chưa trả lời"}
                  </Badge>
                </td>
                <td>{moment(contact.createdAt).format("DD-MM-YYYY")}</td>
                <td>
                  <div className="d-flex gap-2">
                    {userPermissions.includes("contacts_view") && (
                      <Button
                        variant="outline-success"
                        className="center"
                        onClick={() =>
                          router.push("/admin/contacts/view?id=" + contact._id)
                        }>
                        <FiEye />
                      </Button>
                    )}
                    {userPermissions.includes("contacts_delete") && (
                      <Button
                        variant="outline-danger"
                        className="center"
                        onClick={() => deleteContact(contact._id)}>
                        <TfiTrash />
                      </Button>
                    )}
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr className="text-center">
              <td colSpan={8}>Chưa có liên hệ nào</td>
            </tr>
          )}
        </tbody>
      </Table>
    </Container>
  );
};

export default withBase(Page);
