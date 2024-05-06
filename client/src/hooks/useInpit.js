import { useState } from "react";

export function useInput(defaultValue, validationFn) {
  const [enteredValue, setEnteredValue] = useState(defaultValue);
  const [didEdit, setDidEdit] = useState(false);

  const valueIsValid = validationFn(enteredValue);

  function handleInputChange(event) {
    setEnteredValue(event.target.value);
    setDidEdit(false);
  }

  function handleInputBlur() {
    setDidEdit(true);
  }
  function handleErrorDismiss() {
    setDidEdit(false);
  }
  function resetInput() {
    setEnteredValue("");
    setDidEdit(false);
  }
  return {
    value: enteredValue,
    handleInputChange,
    handleInputBlur,
    handleErrorDismiss,
    resetInput,
    hasError: didEdit && !valueIsValid,
  };
}
