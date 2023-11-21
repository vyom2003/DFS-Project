import React, { useState, useContext } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import creds from "../../creds";
import MDEditor from "@uiw/react-md-editor";
import { useEffect } from "react";
import { ToastContext } from "../../App";
import { TOAST_VARIANTS } from "../../packages/toasts/constants";
import { Button } from "../../components/styled/Buttons";

const url = creds.backendUrl;

const TEMPLATE_A = `# **Sample Data Use Agreement (DUA)**

*Note: This is a sample DUA for datasets that have de-identified human subject data*

This is an agreement (“Agreement”) between you, the downloader (“Downloader”), and the owner of the materials (“Publisher”) governing the use of the materials (“Materials”) to be downloaded.

## I. Acceptance of this Agreement

By downloading or otherwise accessing the Materials, Downloader represents his/her acceptance of the terms of this Agreement.

## II. Modification of this Agreement

Publishers may modify the terms of this Agreement at any time. However, any modifications to this Agreement will only be effective for downloads subsequent to such modification. No modifications will supersede any previous terms that were in effect at the time of the Downloader’s download.

## III. Use of the Materials

Use of the Materials include but are not limited to:

- Viewing parts or the whole of the content included in the Materials
- Comparing data or content from the Materials with data or content in other Materials
- Verifying research results with the content included in the Materials
- Extracting and/or appropriating any part of the content included in the Materials for use in other projects, publications, research, or other related work products.

## Representations

**A.** In Use of the Materials, Downloader represents that:

- Downloader is not bound by any pre-existing legal obligations or other applicable laws that prevent Downloader from downloading or using the Materials.
- Downloader will not use the Materials in any way prohibited by applicable laws.
- Downloader has no knowledge of and will therefore not be responsible for any restrictions regarding the use of Materials beyond what is described in this Agreement.
- Downloader has no knowledge of and will therefore not be responsible for any inaccuracies and any other such problems with regards to the content of the Materials and the accompanying citation information.

**B.** Restrictions In his/her Use of the Materials, Downloaders cannot:

- Obtain information from the Materials that results in Downloader or any third party(ies) directly or indirectly identifying any research subjects with the aid of other information acquired elsewhere.
- Produce connections or links among the information included in Publisher’s datasets (including information in the Materials), or between the information included in Publisher’s datasets (including information in the Materials) and other third-party information that could be used to identify any individuals or organizations, not limited to research subjects.
- Extract information from the Materials that could aid Downloader in gaining knowledge about or obtaining any means of contacting any subjects already known to Downloader.

## IV. Representations and Warranties

**PUBLISHER REPRESENTS** THAT PUBLISHER HAS ALL RIGHTS REQUIRED TO MAKE AVAILABLE AND DISTRIBUTE THE MATERIALS. EXCEPT FOR SUCH REPRESENTATION, THE MATERIALS IS PROVIDED “AS IS” AND “AS AVAILABLE” AND WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING, BUT NOT LIMITED TO, NON-INFRINGEMENT, MERCHANTABILITY, AND FITNESS FOR A PARTICULAR PURPOSE, AND ANY WARRANTIES IMPLIED BY ANY COURSE OF PERFORMANCE OR USAGE OF TRADE, ALL OF WHICH ARE EXPRESSLY DISCLAIMED.

WITHOUT LIMITING THE FOREGOING, PUBLISHER DOES NOT WARRANT THAT:

(A) THE MATERIALS ARE ACCURATE, COMPLETE, RELIABLE OR CORRECT
(B) THE MATERIALS FILES WILL BE SECURE
(C) THE MATERIALS WILL BE AVAILABLE AT ANY PARTICULAR TIME OR LOCATION
(D) ANY DEFECTS OR ERRORS WILL BE CORRECTED
(E) THE MATERIALS AND ACCOMPANYING FILES ARE FREE OF HARMFUL COMPONENTS OR
(F) THE RESULTS OF USING THE MATERIALS WILL MEET DOWNLOADER’S REQUIREMENTS. DOWNLOADER’S USE OF THE MATERIALS IS SOLELY AT DOWNLOADER’S OWN RISK.

## V. Limitation of Liability

IN NO EVENT SHALL PUBLISHER BE LIABLE UNDER CONTRACT, TORT, STRICT LIABILITY, NEGLIGENCE, OR ANY OTHER LEGAL THEORY WITH RESPECT TO THE MATERIALS:

(I) FOR ANY DIRECT DAMAGES, OR
(II) FOR ANY LOST PROFITS OR SPECIAL, INDIRECT, INCIDENTAL, PUNITIVE, OR CONSEQUENTIAL DAMAGES OF ANY KIND WHATSOEVER.

## VI. Indemnification

Downloader will indemnify and hold Publisher harmless from and against any and all loss, cost, expense, liability, or damage, including, without limitation, all reasonable attorneys’ fees and court costs, arising from the:

(i) Downloader’s misuse of the Materials
(ii) Downloader’s violation of the terms of this Agreement or
(iii) infringement by Downloader or any third party of any intellectual property or other right of any person or entity contained in the Materials. Such losses, costs, expenses, damages, or liabilities shall include, without limitation, all actual, general, special, and consequential damages.

## VII. Dispute Resolution

Downloader and Publisher agree that any cause of action arising out of or related to the download or use of the Materials must commence within one (1) year after the cause of action arose otherwise, such cause of action is permanently barred.

This Agreement shall be governed by and interpreted in accordance with the Indian Information Technology Act (excluding the conflict of laws rules thereof). All disputes under this Agreement will be resolved in the applicable government laws. Downloader consents to the jurisdiction of such courts and waives any jurisdictional or venue defenses otherwise available.

## VIII. Integration and Severability

This Agreement represents the entire agreement between Downloader and Publisher with respect to the downloading and use of the Materials, and supersedes all prior or contemporaneous communications and proposals (whether oral, written, or electronic) between Downloader and Publisher with respect to downloading or using the Materials. If any provision of this Agreement is found to be unenforceable or invalid, that provision will be limited or eliminated to the minimum extent necessary so that the Agreement will otherwise remain in full force and effect and enforceable.

## IX. Miscellaneous

Publisher may assign, transfer, or delegate any of its rights and obligations hereunder without consent. No agency, partnership, joint venture, or employment relationship is created as a result of the Agreement, and neither party has any authority of any kind to bind the other in any respect outside of the terms described within this Agreement. In any action or proceeding to enforce rights under the Agreement, the prevailing party will be entitled to recover costs and attorneys’ fees.`;

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
          message: "SERVER ERROR",
          variant: TOAST_VARIANTS.ERROR,
        });
        setLoading(false);
      });
  }, [target_id, setValue, addToast]);
  const edit = () => {
    setLoading(true);
    axios
      .post(
        `${url}tnc?target_id=${target_id}&dataset_level=DATASET`,
        { md_data },
        {
          headers: {
            Authorization:
              "Bearer " + JSON.parse(localStorage.getItem("dfs-user"))["token"],
          },
        }
      )
      .then((res) => {
        if (res.data.error) {
          addToast({
            message: "SERVER ERROR ON EDIT",
            variant: TOAST_VARIANTS.ERROR,
          });
        } else
          addToast({
            message: "edited successfully",
            variant: TOAST_VARIANTS.SUCCESS,
          });
      })
      .catch((err) => {
        switch (err?.response?.data) {
          case "USER_NOT_AUTHOR":
            addToast({
              message:
                "Permission Denied. Only author of the file/dataset can edit its tnc",
              variant: TOAST_VARIANTS.ERROR,
            });
            return;
          default:
            addToast({
              message: "ERROR UPDATING DOCS " + JSON.stringify(err.message),
              variant: TOAST_VARIANTS.ERROR,
            });
        }
      })
      .finally(() => setLoading(false));
  };
  if (loading) return <h1>Loading</h1>;
  return (
    <div className="container" data-color-mode="light">
      <div className="container">
        <MDEditor
          value={md_data}
          onChange={(val) => setValue(val.replaceAll(";", "").replaceAll("'", ""))}
          height="50vh"
        />
        {/* <MDEditor.Markdown source={value} style={{ whiteSpace: 'pre-wrap' }} /> */}
        <br />
        Prefill templates:
        <Button.Yellow className="ml-1" onClick={() => setValue(TEMPLATE_A)}>
          Template A
        </Button.Yellow>
        <br />
        <button className="btn btn-outline-primary" onClick={edit}>
          EDIT
        </button>
      </div>
    </div>
  );
}
