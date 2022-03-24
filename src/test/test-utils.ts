import { render as rtlRender } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { AppProvider } from "providers/app"
import React from "react"

export function render(ui: any, options = {}) {
  return {
    ...rtlRender(ui, {
      wrapper: AppProvider as React.FunctionComponent,
      ...options,
    }),
  }
}

export * from "@testing-library/react"
export { userEvent, rtlRender }
