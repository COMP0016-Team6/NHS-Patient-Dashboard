import React from "react";
import Register from "../components/Register";
import { render } from '@testing-library/react';
import { wrapProvider } from "./util";
import { BrowserRouter } from "react-router-dom";

it ("register snapshot matches", () => {
  const tree = render(wrapProvider(<BrowserRouter><Register /></BrowserRouter>));
  expect(tree).toMatchSnapshot();
});
