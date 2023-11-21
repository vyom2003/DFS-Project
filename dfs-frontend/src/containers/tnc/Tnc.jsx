import React, { useState, useContext } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import creds from "../../creds";
import MDEditor from "@uiw/react-md-editor";
import { useEffect } from "react";
import DatasetDetails from "../../components/DatasetDetails";
import { ToastContext } from "../../App";
import { TOAST_VARIANTS } from "../../packages/toasts/constants";
import { Button } from "../../components/styled/Buttons";

const url = creds.backendUrl;

export default function TncEdit() {
  const { target_id } = useParams();
  const [md_data, setValue] = useState("");
  const [loading, setLoading] = useState(false);

  const { addToast } = useContext(ToastContext);

  useEffect(() => {
    setLoading(true);
    axios
      .get(url + "tnc?target_id=" + target_id)
      .then((res) => {
        if (res.data.error) {
          addToast({
            message: "unable to fetch recent tnc file",
            variant: TOAST_VARIANTS.ERROR,
          });
        } else {
          setValue(res.data.data[0] ? res.data.data[0].md_data : "");
        }
        setLoading(false);
      })
      .catch((err) => {
        addToast({
          message: "unable to fetch recent tnc file",
          variant: TOAST_VARIANTS.ERROR,
        });
        setLoading(false);
      });
  }, [target_id, setValue, addToast]);
  if (loading) return <h1>Loading</h1>;
  return (
    <>
      <DatasetDetails id={target_id} />
      <div className="container" data-color-mode="light">
        <h3>Terms and conditions : {"<DATASET DETAILS WILL BE ADDED HERE>"}</h3>

        <MDEditor.Markdown
          source={md_data}
          style={{ whiteSpace: "pre-wrap", padding: "1rem" }}
        />
      </div>
    </>
  );
}
