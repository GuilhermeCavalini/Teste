import React from "react";

interface Props {
  label: string;
  onClick: () => void;
}

export default function SubmitButton({ label, onClick }: Props) {
  return (
    <button className="button" onClick={onClick}>
      {label}
    </button>
  );
}
