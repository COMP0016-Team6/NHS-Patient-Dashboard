import React from "react";
import SearchBar from "../components/SearchBar";
import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { clinicianWrapper } from "./util";

it ("SearchBar snapshot matches", () => {
  const tree = render(clinicianWrapper(<BrowserRouter><SearchBar /></BrowserRouter>));
  expect(tree).toMatchSnapshot();
});
