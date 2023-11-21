import AllVersions from "../../components/datasets/allVersions";
import UserStats from "../userStats/UserStats";
import React, { useState, Suspense } from "react";
import { Heading } from "../../components/styled/Text";
import { Button } from "../../components/styled/Buttons";

const divStyle = {
  width: "90vw",
  background: "white",
  padding: "1ch",
  borderRadius: "1ch",
  marginTop: "0rem",
  marginBottom: "2rem",
};

export default function DatasetVersionPage() {
  const [showUserStats, setShowUserStats] = useState(false);

  const toggleUserStats = () => {
    setShowUserStats(!showUserStats);
  };

  return (
    <>
      <AllVersions />
      <div style={divStyle}>
        <div className="-mx-4 sm:-mx-8 px-4 sm:px-8 overflow-x-auto">
          <div className="flex justify-between items-center h-full">
            <div></div> {/* This empty div creates space on the left */}
            <Button.Blue
              onClick={toggleUserStats}
              className="py-2 px-6 mx-8 my-3"
            >
              {showUserStats ? "Hide User Stats" : "Show User Stats"}
            </Button.Blue>
          </div>
          {showUserStats ? <Suspense fallback={() => null}>
             <UserStats />
          </Suspense> : null }
        </div>
      </div>
    </>
  );
}
