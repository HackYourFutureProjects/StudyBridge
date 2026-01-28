import React from "react";
import { render, screen } from "@testing-library/react";

import Home from "../Home.tsx";
import TEST_ID_HOME from "../Home.testid.ts";

describe("Home", () => {
  it("Renders without a problem", async () => {
    render(<Home />);

    expect(screen.getByTestId(TEST_ID_HOME.container)).toBeInTheDocument();
  });
});
