import React from "react";
import DatePicker from "../components/DatePicker";
import renderer from "react-test-renderer";
import { wrapProvider } from "./util";

it ("DatePicker snapshot matches", () => {
  const tree = renderer.create(wrapProvider(<DatePicker />));
  expect(tree).toMatchSnapshot();
});
