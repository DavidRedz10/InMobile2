import React from "react";
import { Input } from '@chakra-ui/react'

export const InputBox = ({ label, setAttribute }) => {
  return (
    <div className="mb-3" >
      <label>{label}</label>
    <input
      className="form-input w-full rounded"
      name="subject"
      type="text"
      placeholder="Descripcion"
      onChange={(e) => setAttribute(e.target.value)}
      required
    />
  </div>
  );
};