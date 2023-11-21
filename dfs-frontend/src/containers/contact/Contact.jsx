// import React from 'react';
import React, { useState, useContext } from "react";
import axios from "axios";
import { url } from "../../creds";
import Modal from "react-bootstrap/Modal";
import { Thead, Tbody, Tr, Th, Td } from "react-super-responsive-table";
import Table from "react-bootstrap/Table";
import { ContactInputField, SubHeading } from "../../GlobalStyles";
import { Button } from "../../components/styled/Buttons";

import { ToastContext } from "../../App";
import { TOAST_VARIANTS } from "../../packages/toasts/constants";

const Contact = () => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [click, setClick] = useState(0);
  const [message, setMessage] = useState("");
  const [md_data, setValue] = useState({});
  const [len, setLen] = useState(0);
  const user = localStorage.getItem("dfs-user")
    ? JSON.parse(localStorage.getItem("dfs-user"))
    : {};
  const form_class =
    "w-96 shadow-xl px-4 py-4 mx-4 my-4 border border-solid border-current rounded-lg bg-white";

  const { addToast } = useContext(ToastContext);
  const submit = (e) => {
    e.preventDefault();
    axios
      .post(url + "contact", { name: name, email: email, message: message })
      .then((res) => {
        setEmail("");
        setMessage("");
        setName("");
        setClick(0);
        setLen(1);
      })
      .catch((err) => {
        if (err.message)
          addToast({
            message: "SERVER ERROR",
            variant: TOAST_VARIANTS.WARNING
          })
        else
          addToast({
            message: "UNEXPECTED ERROR, PROBABLY SERVER UNAVAILABLE",
            variant: TOAST_VARIANTS.ERROR
          })
      });
  };
  const handleQueries = (e) => {
    setClick(1);

    e.preventDefault();

    axios
      .get(url + "view-contact-us-queries")
      .then((res) => {
        if (res.data.error) {
          console(res.data.error);
        } else {
          setValue(res.data.data ? res.data.data : "");
        }
      })
      .catch((err) => {
        if (err.message)
          addToast({
            message: "SERVER ERROR",
            variant: TOAST_VARIANTS.WARNING
          })
        else
          addToast({
            message: "UNEXPECTED ERROR, PROBABLY SERVER UNAVAILABLE",
            variant: TOAST_VARIANTS.ERROR
          })
      });
  };

  const handleClose = () => setClick(0);

  const handleDelete = (index, e) => {
    axios
      .post(url + "contactDelete", { email: e.target.value })
      .then((res) => {
        setValue(md_data.filter((v, i) => i !== index));
        setLen(0);
      })
      .catch((err) => {
        if (err.message)
          addToast({
            message: "SERVER ERROR",
            variant: TOAST_VARIANTS.WARNING
          })
        else
          addToast({
            message: "UNEXPECTED ERROR, PROBABLY SERVER UNAVAILABLE",
            variant: TOAST_VARIANTS.ERROR
          })
      });
  };

  return (
    <div className="bg-white my-7 rounded-xl">
      <div className="flex pr-8 pt-8 pl-24 pb-24" id="contact">
        <div className="flex flex-1 justify-center align-flex flex-column mr-20">
          <h1 className={`${SubHeading} text-center`} >
            Contact Us
          </h1>
          <div className={form_class}>
            <form onSubmit={submit}>
              <div className="form-outline mb-4">
                <label className="form-label text-base" for="form2Example1">
                  Name
                </label>
                <input
                  type="text"
                  id="form2Example1"
                  value={name}
                  className={
                    email === "" ? "form-control" : "form-control bg-slate-50"
                  }
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div className="form-outline mb-4">
                <label className="form-label text-base" for="form2Example2">
                  Email
                </label>
                <input
                  type="email"
                  id="form2Example2"
                  value={email}
                  className={
                    email === "" ? "form-control" : "form-control bg-slate-50"
                  }
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="form-outline mb-4">
                <label
                  className="w-80 form-label text-base"
                  for="form2Example2"
                >
                  Message
                </label>
                <textarea
                  name="message"
                  className="form-control bg-slate-50"
                  rows="5"
                  onChange={(e) => setMessage(e.target.value)}
                  value={message}
                />
              </div>

              <Button.Blue type="submit" className="w-full">
                Send
              </Button.Blue>
            </form>
          </div>

          {user?.user?.user_role === "admin" && (
            <Button.Blue
              disabled={md_data.length <= 0 && len === 0}
              title={
                md_data.length <= 0 && len === 0
                  ? "No New Queries"
                  : "View Queries"
              }
              className="w-1/3 ml-6"
              onClick={handleQueries}
            >
              View Queries
            </Button.Blue>
          )}
          {click === 1 && (
            <div>
              {(md_data.length > 0 || len === 1) && (
                <Modal
                  show={click}
                  size="lg"
                  aria-labelledby="contained-modal-title-vcenter"
                  centered
                  onHide={handleClose}
                >
                  <Modal.Header closeButton>
                    <Table className="min-w-full leading-normal table-bordered table-striped table-fixed">
                      <Thead>
                        <tr>
                          <Th className="px-3 py-3 break-words border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                            NAME
                          </Th>
                          <Th className="px-3 py-3 break-words border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                            EMAIL
                          </Th>
                          <Th className="px-3 py-3 break-words border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                            MESSAGE
                          </Th>
                          <Th className="px-3 py-3 break-words border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                            ACTIONS
                          </Th>
                        </tr>
                      </Thead>
                      <Tbody>
                        {md_data.map((data, index) => (
                          <tr>
                            <Td className="px-3 py-3 break-words border-b border-gray-200 bg-white text-sm">
                              <p className="text-gray-900 whitespace-no-wrap">
                                {data.NAME}
                              </p>
                            </Td>
                            <Td className="px-3 py-3 break-words border-b border-gray-200 bg-white text-sm">
                              <p className="text-gray-900 whitespace-no-wrap">
                                {data.EMAIL}
                              </p>
                            </Td>
                            <Td className="px-3 py-3 border-b break-words border-gray-200 bg-white text-sm">
                              <p className="text-gray-900 whitespace-no-wrap">
                                {data.MESSAGE}
                              </p>
                            </Td>
                            <Td className="px-3 py-3 border-b break-words border-gray-200 bg-white text-sm">
                              <Button.Red
                                value={data.EMAIL}
                                onClick={(e) => handleDelete(index, e)}
                              >
                                Delete
                              </Button.Red>
                            </Td>
                          </tr>
                        ))}
                      </Tbody>
                    </Table>
                  </Modal.Header>
                </Modal>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Contact;