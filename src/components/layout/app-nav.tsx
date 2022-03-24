import { HStack } from "components"
import { NetworkMenu } from "features/network"
import { AccountsMenu } from "features/accounts"

export function AppNav() {
  return (
    <HStack justify="space-between" alignItems="center" w="100%">
      <AccountsMenu />
      <NetworkMenu />
    </HStack>
  )
}
