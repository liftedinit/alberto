import { MigrationBanner } from "features/token-migration/components/migration-banner"
import { renderChildren } from "test/render"
import { screen } from "@testing-library/react"

describe("MigrationBanner", () => {
  it("renders MigrationBanner without crashing", () => {
    renderChildren(<MigrationBanner />)
    expect(screen.getByTestId("migration-banner")).toBeInTheDocument()
  })
})
