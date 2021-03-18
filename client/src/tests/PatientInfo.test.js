import React from "react";
import PatientInfo from "../components/PatientInfo";
import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { patientWrapper } from "./util";

it ("PatientInfo snapshot matches", () => {
  const tree = render(patientWrapper(<BrowserRouter><PatientInfo /></BrowserRouter>));
  expect(tree).toMatchSnapshot();
});