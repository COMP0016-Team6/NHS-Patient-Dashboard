import React from "react";
import Login from "../components/Login";
import renderer from "react-test-renderer";
import { wrapProvider } from "./util";
import { BrowserRouter } from 'react-router-dom';

it ("login snapshot matches", () => {
  const tree = renderer.create(wrapProvider(<BrowserRouter><Login /></BrowserRouter>));
  expect(tree).toMatchSnapshot();
});
