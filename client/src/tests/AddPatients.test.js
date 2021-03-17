import React from "react";
import AddPatients from "../components/AddPatients";
import renderer from "react-test-renderer";
import { wrapProvider } from "./util";
import { BrowserRouter } from 'react-router-dom';

it ("AddPatients snapshot matches", () => {
  const tree = renderer.create(wrapProvider(<BrowserRouter><AddPatients /></BrowserRouter>));
  expect(tree).toMatchSnapshot();
});
