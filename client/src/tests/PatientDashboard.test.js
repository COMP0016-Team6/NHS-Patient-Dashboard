import React from "react";
import PatientDashboard from "../components/PatientDashboard";
import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { patientWrapper } from "./util";

it ("PatientDashboard snapshot matches", () => {
  const tree = render(patientWrapper(<BrowserRouter><PatientDashboard /></BrowserRouter>));
  expect(tree).toMatchSnapshot();
});
