import React from "react";
import { DatePicker } from "react-rainbow-components";

export default function RainbowDatepicker({dates, setDates, single=false}) {
  
  function maxMinYears(dt, n) {
    return new Date(dt.setFullYear(dt.getFullYear() + n));      
  }

  return (
    <div className="rainbow-align-content_center rainbow-m-vertical_large rainbow-p-horizontal_small rainbow-m_auto" style={{maxWidth: 250}} >
      <DatePicker
        id="datePicker-1"
        selectionType={single? "single" : "range"}
        placeholder={single? "Date of Birth *" : "Select range of dates"}
        variant="single"
        formatStyle="medium"
        maxDate={new Date()}
        minDate={single? maxMinYears(new Date(), -80) : maxMinYears(new Date(), -40)}
        value={dates}
        onChange={(dates) => setDates(dates)}
      />
    </div>
  );
}