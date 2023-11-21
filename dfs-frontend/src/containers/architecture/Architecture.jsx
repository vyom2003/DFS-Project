import React from "react";
import { FlexSection, Heading, SubHeading } from "../../GlobalStyles";
import { Link } from "react-router-dom";

const Architecture = () => {
  return (
    <>
      <div className="bg-white">
        <div className={FlexSection}>
          <h1 className={Heading}>Data Foundation Ecosystem</h1>
          <h3 className={SubHeading}>Gundimeda Venugopal and Vikram Pudi</h3><br></br>
          <div className="shadow mt-4">
            <div className="shadow-sm ">
              <h5 className={SubHeading}>Introduction</h5>
            </div>
            <div className="card-body text-[1rem]">
              <ul className="list-disc mx-4 text-justify">
                <li>
                  The Data Foundation Systems goal is to enable researchers to
                  create, annotate, anonymize, publish and use datasets to build
                  AI models, data visualations and analytics reports and manage
                  dataset/model versions for heathcare, mobility, smart cities,
                  energy and other domains in the Indian context.
                </li>
              </ul>
              <ul className="list-disc mx-4 text-justify">
                <li>
                  To achieve this objective, Data Foundation Servers, Petabyte
                  Object Storage and GPU powered AI model building/execution
                  infrastructure are setup.
                </li>
              </ul>
              <ul className="list-disc mx-4 text-justify">
                <li>
                  Building tools and frameworks to enable researchers publish
                  and effectively use datasets is another key objective. Generic
                  Data ingestion, Data query/extraction, Data Annotation (Image,
                  Medical images, Video, Image Text, Text and Audio) and Data
                  nononymization tools are planed taking few open source
                  tools/ideas as a base and enhance these tools to fullfill the
                  Data Foundation needs.
                </li>
              </ul>
              <ul className="list-disc mx-4 text-justify">
                <li>
                  Docker and JupyterHub notebook based cutomized re- source
                  allocation ecosystem planned to efficiently use system
                  resouces (GPU, CPU, Memory, disk space and object storage).
                </li>
              </ul>
            </div>
          </div>

          <div className="shadow mt-4">
            <div className=" shadow-sm">
              <h5 className={SubHeading}>System Building Approach</h5>
            </div>
            <div className="card-body text-[1rem]">
              <p className="text-justify">
                <b>
                  Innovative models for system building are evolved as
                  recruiting developers from the Industry is a challenge.
                </b>
              </p>
              <ul className="list-disc mx-4 text-justify">
                <li>
                  A Hands-on Semester Course: “Data Foundation Systems” (Spring
                  2022) 144 students registered. 40+ project Multiple proof of
                  concepts related to Data Foundation completed.
                </li>
              </ul>
              <ul className="list-disc mx-4 text-justify">
                <li>
                  Data Foundation Summer Internship program (with IIITH and
                  Srishti 2022 External students) 20+ students contributed to
                  Data Foundation Core System Development, Integration and
                  Testing A Data Foundation Core Ecosystem has been made
                  available for IIITH Researchers to use.
                </li>
              </ul>
              <ul className="list-disc mx-4 text-justify">
                <li>
                  A Learner – Contributor Model to engage IIITH students to
                  support Data Foundation Projects has been created. Learners:
                  Learners can learn at their own pace to contribute to Data
                  Foundation technology POCs. Students who complete relevant
                  POCs would get Data Foundation Certificates. Contributors:
                  Contribute to Data Foundation System components and they Data
                  Foundation developers. A Stipend would be paid and theywould
                  conform to effort and timelines. Key Learners/Contributors
                  would get recommendation letters.
                </li>
              </ul>
              <ul className="list-disc mx-4 text-justify">
                <li>Hiring external interns for Data Foundation projects.</li>
              </ul>
            </div>
          </div>

          <div className="shadow mt-4">
            <div className=" shadow-sm">
              <h5 className={SubHeading}>Data Foundation Data Flow</h5>
            </div>
            <div className="card-body text-[1rem]">
              <p className="text-justify">
                A researcher’s journey to publishing a new dataset starts with
                Data Collection process followed by Data Validation, Data cleans
                ing, Data anonymization, Data annotation and data filtering
                before it is publcihed as a Dataset. Once the dataset is
                published, Researchers can use the dataset to build and publish
                AI models, Research Studies, Research papers and applications.
              </p>
              <div className="text-center">
                <img
                  className="img-fluid"
                  src="/static/images/architecture/3-DFDFlow.jpeg"
                  alt="logo"
                  responsive
                />
              </div>
            </div>
          </div>

          <div className="shadow mt-4">
            <div className=" shadow-sm">
              <h5 className={SubHeading}>Data Foundation Ecosystem</h5>
            </div>
            <div className="card-body text-[1rem]">
              <p className="text-justify">
                The Data Foundation Ecosystem is split into three broad
                sub-systems: a) A Dataset Platform Website (which delivers
                datasets). This ecosystem would be built and managed by iHUB
                Data Foundation Team. b) Multiple Dataset Server Website(s)
                (that support Dataset Creation Manangement, Annotation,
                anonymization and publishing) Data owners/publishers would build
                and own these platform(s)/web site(s). c) Data Foundation Tools
                / Frameworks (that would use/Enhance/build New Open Source tools
                and frameworks to support common tasks) and shared
                Infrastructure/Ecosystens Tools and Frameworks Examples: Data
                Ingestion tool, Annotation and Anonymization Tools.
              </p>
              <div className="text-center">
                <img className="img-fluid" src="/static/images/architecture/4-DFE.jpeg" alt="logo" responsive />
              </div>
            </div>
          </div>

          <div className="shadow mt-4">
            <div className=" shadow-sm">
              <h5 className={SubHeading}>Data Foundation Website</h5>
            </div>
            <div className="card-body text-[1rem]">
              <p className="text-justify">
                <b>
                  Web site{" "}
                  <Link
                    className="text-red-600"
                    href="https://datafoundation.iiit.ac.in/"
                  >
                    https://datafoundation.iiit.ac.in/
                  </Link>{" "}
                  features:
                </b>
              </p>
              <ul className="list-disc mx-4 text-justify">
                <li>User Profile Management and Authentication</li>
                <li>My Datasets (User specific work list items)</li>
                <li>Publishing of Dataset and its versions</li>
                <li>Dataset Listing, Download and Dataset details</li>
                <li>Private Dataset access workflow (publisher approval)</li>
                <li>Dataset Upload, Verification and Approval workflow</li>
                <li>Domain and Dataset specific Data Usage Agreement</li>
                <li>Publishing of Dataset AI Models/studies and Versions</li>
                <li>MinIO Storage and GPU Compute Ecosystem</li>
              </ul>
            </div>
          </div>

          <div className="shadow mt-4">
            <div className=" shadow-sm">
              <h5 className={SubHeading}>Technology Stack</h5>
            </div>
            <div className="card-body text-[1rem]">
              <p className="text-justify">
                <b>Web Site: HTML5, CSS3, ReactJS, JS, Bootstrap:</b>
              </p>
              <ul className="list-disc mx-4 text-justify">
                <li>
                  <b>Backend frameworks:</b> NodeJS (web services), Python (data
                  processing).
                </li>
                <li>
                  <b>Storage:</b> MinIO Object Storage (Local S3 style storage),
                  File and Block storage.
                </li>
                <li>
                  <b>Databases:</b> MySQL, MongoDB
                </li>
                <li>
                  <b>Source Code:</b> GitHub
                </li>
              </ul>
              <div className="text-center">
                <img
                  className="img-fluid"
                  src="/static/images/architecture/5-Technology-stack.png"
                  alt="logo"
                  responsive
                />
              </div>
            </div>
          </div>

          <div className="shadow mt-4">
            <div className=" shadow-sm">
              <h5 className={SubHeading}>Data Foundation Website</h5>
            </div>
            <div className="card-body text-[1rem]">
              <p className="text-justify">
                Data Foundation web site enables researchers to Register,
                Publish datasets through an approval process (upload, dataset
                validation and approve) and it supports dataset catalog
                lmanagement, version management, downloads and usage tracking.
                The Ecosystem supports both public and private datasets.
                Researchers can create AI models and their versions using these
                datasets.
              </p>

              <div className="text-center">
                <img className="img-fluid" src="/static/images/architecture/6-DPWA.jpeg" alt="logo" responsive />
              </div>
            </div>
          </div>

          <div className="shadow mt-4">
            <div className=" shadow-sm">
              <h5 className={SubHeading}>Data Foundation Data Server(s)</h5>
            </div>
            <div className="card-body text-[1rem]">
              <p className="text-justify">
                Data owners/publishers build data server platform(s)/web site(s)
                using the Data foundation provided/own/other tools/ frameworks
                to support raw data ingestion, curation, anonymization,
                annotation, search/filtering, datasets creation and their
                version management. The created datasets would be published
                through Data Foundation web site. Also, they may offer API based
                search services for fine grained data access for extrenal
                researchers.
              </p>
              <div className="text-center">
                <img className="img-fluid" src="/static/images/architecture/7-DSW-CMA.jpeg" alt="logo" responsive />
              </div>
            </div>
          </div>

          <div className="shadow mt-4">
            <div className=" shadow-sm">
              <h5 className={SubHeading}>Hardware Ecosystem</h5>
            </div>
            <div className="card-body text-[1rem]">
              <ul className="list-disc mx-4 text-justify">
                <li>
                  <b>Web servers:</b> Two web servers for Data Foundation, One
                  web server each for Mobility and Healthcare.
                </li>
                <li>
                  <b>Shared Storage Ecosystem:</b> 840 TB (Available) + 840 TB
                  (ordered) Object Storage.
                </li>
                <li>
                  <b>Shared GPU Compute Ecosystem:</b> 20 GPU Nodes (each
                  contaiining 4 NVIDIA GeForce 3080 Ti GPU).
                </li>
                <li>
                  <b>Source Code:</b> GitHub
                </li>
              </ul>
            </div>
          </div>

          <div className="text-center mt-4">

            <p className="text-center">
              <b>Contact Information</b> <br />
              Data Foundation, IHUB-DATA, IIIT Hyderabad
              <br />
              Phone: +91-40–66531787, Email:
              gundimeda.venugopal@ihub-data.iiit.ac.in
              <br />
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Architecture;
