import React, { useState } from "react";
import { DatePicker } from "react-rainbow-components";

export default function RainbowDatepicker({dates, setDates}) {

  function onChange(dates) {
    setDates(dates);
  }
  const containerStyles = {
    maxWidth: 250,
  };

  return (
    <div className="rainbow-align-content_center rainbow-m-vertical_large rainbow-p-horizontal_small rainbow-m_auto" style={containerStyles} >
      <DatePicker
        id="datePicker-1"
        selectionType="range"
        placeholder="Select range of dates"
        variant="single"
        formatStyle="medium"
        value={dates}
        onChange={onChange}
        label="DatePicker Label"
      />
    </div>
  );
}