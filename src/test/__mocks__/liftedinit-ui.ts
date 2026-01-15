// Mock for @liftedinit/ui that bypasses asset imports in tests
// Re-export everything from sub-modules using internal aliases
export * from "__lifted-ui-components__"
export * from "__lifted-ui-helpers__"
export * from "__lifted-ui-hooks__"
export * from "__lifted-ui-lib__"
export { ThemeProvider, theme } from "__lifted-ui-theme__"

// Mock the asset exports
export const cubePng = "mock-cube.png"
export const logoSvg = "mock-logo.svg"
