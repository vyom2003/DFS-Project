import React from "react";
import { PlainText } from "../styled/Text";
import { Button as StyledButton } from "../styled/Buttons";
import { MODAL_VARIANTS } from "./constants";

const ActionButton = ({ intent, onClick, children }) => {
  switch (intent) {
    case MODAL_VARIANTS.DANGER:
      return <StyledButton.Red
        onClick={onClick}
      >{children}</StyledButton.Red>
    case MODAL_VARIANTS.CONFIRMATION:
      return <StyledButton.Green
        onClick={onClick}
      >{children}</StyledButton.Green>
    default:
      return <StyledButton.Gray
        onClick={onClick}
      >{children}</StyledButton.Gray>
  }
}

export function ConfirmationModal({ intent, message, customConfirmLabel = "Confirm", customCancelLabel = "Cancel", onSuccess, onCancel }) {
  return (
    <div className="fixed z-10 inset-0 overflow-y-auto">
      <div className="flex items-center justify-center">

        <div className="fixed inset-0 transition-opacity">
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>

        <span className="hidden sm:inline-block h-screen" />

        <div
          className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all">

          <div className="bg-white px-4 pt-3">
            <PlainText className="text-gray-700">
              {message}
            </PlainText>
          </div>
          <div className="bg-gray-100 px-4 py-3 flex justify-end space-x-4">
            <StyledButton.Gray onClick={onCancel}>
              {customCancelLabel}
            </StyledButton.Gray>
            <ActionButton intent={intent} onClick={onSuccess}>
              {customConfirmLabel}
            </ActionButton>
          </div>
        </div>
      </div>
    </div>
  )
}
