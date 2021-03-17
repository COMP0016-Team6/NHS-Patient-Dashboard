import React, { useState } from 'react';
import TextField from '@material-ui/core/TextField';
import TextareaAutosize from '@material-ui/core/TextareaAutosize';

export function useInput({
  defaultValue = '',
  placeholder = '',
  type = 'text',
  maxlength = null,
  properties = {},
  } = {}) {
  let [value, setValue] = useState(defaultValue);

  const field = (
    <TextField
      value={value}
      type={type}
      label={placeholder}
      onChange={e => setValue(e.target.value)}
      maxLength={maxlength}
      className="form-control my-3"
      style={{ color: "#61dafb" }}
      {...properties}
    />
  );

  return [value, field, setValue];
}

export function useTextArea({
  defaultValue = '',
  placeholder = '',
  type = 'text',
  maxlength = null,
  properties = {},
  } = {}) {
  let [value, setValue] = useState(defaultValue);

  const field = (
    <TextareaAutosize
      value={value}
      type={type}
      placeholder={placeholder}
      onChange={e => setValue(e.target.value)}
      maxLength={maxlength}
      className="form-control my-3"
      {...properties}
    />
  );

  return [value, field, setValue];
}
