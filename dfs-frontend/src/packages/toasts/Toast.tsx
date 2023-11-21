import React from "react";
import { CustomToast, ToastData } from "./ToastComponent";

export const ToastComponent = ({
  toastData,
  deleteToast,
}: {
  toastData: ToastData[];
  deleteToast: ({ index }: { index: number }) => void;
}) => {
  return (
    <div className="sticky top-10 z-50">
      <div className="fixed bottom-5 right-5">
        <CustomToast toastData={toastData} deleteToast={deleteToast} />
      </div>
    </div>
  );
};
