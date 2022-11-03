import { Alert, AlertIcon, AlertProps, Text } from "shared/components"

export function LedgerSafariWarning(props: AlertProps) {
  const userAgent = navigator.userAgent
  const isSafari = userAgent.includes("Safari") && !userAgent.includes("Chrome")
  return isSafari ? (
    <Alert status="warning" variant="subtle" rounded="md" {...props}>
      <AlertIcon />
      <Text fontSize="sm">
        Using a Ledger hardware wallet? It may have issues with Safari so we
        suggest to use a different browser.
      </Text>
    </Alert>
  ) : null
}
