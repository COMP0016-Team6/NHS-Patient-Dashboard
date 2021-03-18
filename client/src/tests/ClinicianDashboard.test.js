import React from "react";
import ClinicianDashboard from "../components/ClinicianDashboard";
import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { clinicianWrapper } from "./util";

it ("ClinicianDashboard snapshot matches", () => {
  const tree = render(clinicianWrapper(<BrowserRouter><ClinicianDashboard /></BrowserRouter>));
  expect(tree).toMatchSnapshot();
});
