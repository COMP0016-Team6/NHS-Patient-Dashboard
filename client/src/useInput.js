import React, { useState } from 'react';

export function useInput({
    defaultValue = '',
    placeholder = '',
    type = 'text',
    ref = null,
    maxlength = null,
    properties = {},
    } = {}) {
    let [value, setValue] = useState(defaultValue);

    const field = (
        <input
            value={value}
            type={type}
            placeholder={placeholder}
            onChange={e => setValue(e.target.value)}
            ref={ref}
            maxLength={maxlength}
            className="form-control my-3"
            {...properties}
        />
    );

    return [value, field, setValue];
}