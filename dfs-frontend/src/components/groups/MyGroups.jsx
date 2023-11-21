import axios from "axios";
import React, { useEffect, useState } from "react";
import { url } from "../../creds";
import { Button } from "../styled/Buttons";
import { Link } from "react-router-dom";

const TD_CLASS = "px-3 py-3 border-b border-gray-200 bg-white text-sm";
export const MyGroups = ({ creator }) => {
  const [data, setData] = useState([]);
  useEffect(() => {
    axios
      .get(url + "groups", {
        headers: {
          Authorization:
            "Bearer " + JSON.parse(localStorage.getItem("dfs-user"))["token"],
        },
      })
      .then((res) => {
        setData(res.data.data);
      });
  }, [setData, creator]);
  return (
    <div style={{ overflowX: "auto" }}>
      {data.length > 0 ? (
        <table className="min-w-full leading-normal table-bordered table-striped">
          <thead>
            <tr>
              <th className="px-3 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Group Id
              </th>
              <th className="px-3 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Group Name
              </th>
              <th className="px-3 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Role
              </th>
              <th className="px-3 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {data.map((row, index) => (
              <tr key={index} className={TD_CLASS}>
                <td className="px-3 py-2">{row.group_id}</td>
                <td className="px-3 py-2">{row.group_name}</td>
                <td className="px-3 py-2">{row.user_role}</td>
                <td className="px-3 py-2">
                  {/* <Link
                    to={"/group/" + row.group_id}
                    state={{ from: "normal" }}
                  >
                    <Button.Blue>View</Button.Blue>
                  </Link> */}
                  <Link
                    to={"/discussions/" + row.group_id}
                    state={{ from: "normal" }}
                  >
                    <Button.Blue>View</Button.Blue>
                  </Link>
                  {row.user_role === "CREATOR" ? (
                    <Link
                      to={"/group/" + row.group_id}
                      state={{ from: "creater" }}
                    >
                      <Button.Red>Manage</Button.Red>
                    </Link>
                  ) : null}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>
          Groups you {creator ? "created" : "have acces to"} will appear here.
        </p>
      )}
    </div>
  );
};
