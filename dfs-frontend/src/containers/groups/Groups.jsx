import React, { useState, useContext } from "react";
import { InputField } from "../../components/styled/Forms";
import { MyGroups } from "../../components/groups/MyGroups";
import { Button } from "../../components/styled/Buttons";
import { PlainText, Heading } from "../../components/styled/Text";
import axios from "axios";
import { url } from "../../creds";
import { ToastContext } from "../../App";
import { TOAST_VARIANTS } from "../../packages/toasts/constants";


export default function Groups() {
  const [creator, setCreator] = useState(false);
  const [mode, setMode] = useState("view");
  const [groupName, setNewGroup] = useState("");

  const { addToast } = useContext(ToastContext);

  return (
    <>
      <div className="flex flex-col gap-y-7 my-7 w-full px-10">
        <div className="w-full bg-white rounded-xl p-6">
          {mode === "view" ? (
            <>
              <Heading size={1} className="mb-4">
                My Groups
              </Heading>
              <div className="flex">
                <form className="flex items-center flex-1">
                  <input
                    type='checkbox'
                    className="w-4 h-4"
                    value={creator}
                    onChange={(e) => setCreator(e.target.value)}
                  />
                  <label class="m-0 ml-2 mb-px">
                    Show groups created by me
                  </label>
                </form>
                <Button.Blue onClick={() => setMode("add")}>
                  Create a new group
                </Button.Blue>
              </div>
              <div className="mt-2">
                <MyGroups creator={creator} />
              </div>
            </>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                axios
                  .post(
                    url + "create-group",
                    {},
                    {
                      params: {
                        groupName,
                      },
                      headers: {
                        Authorization:
                          "Bearer " +
                          JSON.parse(localStorage.getItem("dfs-user"))["token"],
                      },
                    }
                  )
                  .then((res) => {
                    if (res.data.error) {
                      e.preventDefault();
                      addToast({
                        message: res.data.data,
                        variant: TOAST_VARIANTS.WARNING
                      })
                    } else {
                      e.preventDefault();
                      addToast({
                        message: "Group Created Successfully",
                        variant: TOAST_VARIANTS.SUCCESS
                      })
                    }
                  })
                  .catch((err) => {
                    e.preventDefault();
                    addToast({
                      message: "Error creating group",
                      variant: TOAST_VARIANTS.WARNING
                    })
                  })
                  .finally(() => {
                    setMode("view");
                  });
              }}
            >
              <div className="flex">
                <Heading size={2} className="mb-4 flex-1">
                  Create a new group
                </Heading>
                <Button.Green
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    setMode("view");
                  }}
                  className="min-h-min"
                >
                  Go Back
                </Button.Green>
              </div>

              <PlainText className="mb-0">Group Name</PlainText>
              <InputField
                placeholder="Enter a group name"
                required
                value={groupName}
                onChange={(e) => setNewGroup(e.target.value)}
              />
              <div className="text-right mt-2">
                <Button.Blue>Create</Button.Blue>
              </div>
            </form>
          )}
        </div>
      </div>
    </>
  );
}
