import React from "react"
import { screen } from "@testing-library/react"
import { TokenMigrationPortal } from "../token-migration-portal"
import { TokenMigrationMenu } from "../token-migration-menu"
import { renderChildren } from "../../../test/render"
import { Route, Routes } from "react-router-dom"

describe("TokenMigrationPortal View", () => {
  it("renders TokenMigrationPortal and TokenMigrationMenu without crashing", () => {
    renderChildren(
      <Routes>
        <Route
          path={"/token-migration-portal"}
          element={<TokenMigrationPortal />}
        >
          <Route index element={<TokenMigrationMenu />} />
        </Route>
      </Routes>,
      ["/token-migration-portal"],
    )
    expect(screen.getByTestId("token-migration-menu")).toBeInTheDocument()
    expect(
      screen.getByTestId("token-migration-portal-header-breadcrumb"),
    ).toBeInTheDocument()
  })
})
