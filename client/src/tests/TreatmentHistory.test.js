import React from "react";
import TreatmentHistory from "../components/TreatmentHistory";
import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { patientWrapper } from "./util";

it ("TreatmentHistory snapshot matches", () => {
  const tree = render(patientWrapper(<BrowserRouter><TreatmentHistory /></BrowserRouter>));
  expect(tree).toMatchSnapshot();
});
