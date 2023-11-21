import React from "react";
import { Thead, Tbody, Tr, Th, Td } from "react-super-responsive-table";
import Table from "react-bootstrap/Table";
export default function ExpandedVersionTable(props) {
  return (
    <Table className="mb-2 table-bordered table-striped w-screen table-fixed">
      <Tbody>
        <tr>
          <Td className="px-3 py-1 break-words bg-table-shade text-fn-blue">
            File Type
          </Td>
          <Td className="px-3 py-1 break-words bg-white">{props.fileType}</Td>
        </tr>
        <tr>
          <Td className="px-3 py-1 break-words bg-table-shade text-fn-blue">
            Upfilename
          </Td>
          <Td className="px-3 py-1 break-words bg-white">{props.upfilename}</Td>
        </tr>
        <tr>
          <Td className="px-3 py-1 break-words bg-table-shade text-fn-blue">
          UpfilenameMD
          </Td>
          <Td className="px-3 py-1 break-words bg-white">{props.upfilenameMD}</Td>
        </tr>
        <tr>
          <Td className="px-3 py-1 break-words bg-table-shade text-fn-blue">
            DatabaseID
          </Td>
          <Td className="px-3 py-1 break-words bg-white">{props.databaseId}</Td>
        </tr>
        <tr>
          <Td className="px-3 py-1 break-words bg-table-shade text-fn-blue">
            Database VersionID
          </Td>
          <Td className="px-3 py-1 break-words bg-white">
            {props.databaseVersionId}
          </Td>
        </tr>
        <tr>
          <Td className="px-3 py-1 break-words bg-table-shade text-fn-blue">
            Comments
          </Td>
          <Td className="px-3 py-1 break-words bg-white">{props.comments}</Td>
        </tr>
        <tr>
          <Td className="px-3 py-1 break-words bg-table-shade text-fn-blue">
            Version Name
          </Td>
          <Td className="px-3 py-1 break-words bg-white">{props.versionName}</Td>
        </tr>
        <tr>
          <Td className="px-3 py-1 break-words bg-table-shade text-fn-blue">
            Reference
          </Td>
          <Td className="px-3 py-1 break-words bg-white">
            {props.reference}
          </Td>
        </tr>
        <tr>
          <Td className="px-3 py-1 break-words bg-table-shade text-fn-blue">
            Created Date
          </Td>
          <Td className="px-3 py-1 break-words bg-white">{props.createdDate}</Td>
        </tr>
        <tr>
          <Td className="px-3 py-1 break-words bg-table-shade text-fn-blue">
            Last Edit
          </Td>
          <Td className="px-3 py-1 break-words bg-white">{props.lastEdit}</Td>
        </tr>
        <tr>
          <Td className="px-3 py-1 break-words bg-table-shade text-fn-blue">
           Publication Names
          </Td>
          <Td className="px-3 py-1 break-words bg-white">{props.publicationName}</Td>
        </tr>
        <tr>
          <Td className="px-3 py-1 break-words bg-table-shade text-fn-blue">
            Publication Links
          </Td>
          <Td className="px-3 py-1 break-words bg-white">{props.publicationLinks}</Td>
        </tr>
      </Tbody>
    </Table>
  );
}
