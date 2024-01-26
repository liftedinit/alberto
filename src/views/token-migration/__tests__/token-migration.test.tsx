import React from "react"
import { render, screen } from "@testing-library/react"
import { TokenMigrationPortal } from "../token-migration-portal"
import { MemoryRouter, Route, Routes } from "react-router-dom"
import { TokenMigrationMenu } from "../token-migration-menu"

describe("TokenMigrationPortal View", () => {
  test("renders TokenMigrationPortal and TokenMigrationMenu without crashing", () => {
    render(
      <MemoryRouter initialEntries={["/token-migration-portal"]}>
        <Routes>
          <Route
            path={"/token-migration-portal"}
            element={<TokenMigrationPortal />}
          >
            <Route index element={<TokenMigrationMenu />} />
          </Route>
        </Routes>
      </MemoryRouter>,
    )
    expect(screen.getByTestId("token-migration-menu")).toBeInTheDocument()
    expect(
      screen.getByTestId("token-migration-portal-header-breadcrumb"),
    ).toBeInTheDocument()
  })
})
