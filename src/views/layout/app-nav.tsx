import { Flex } from "@liftedinit/ui"
import { NetworkMenu } from "features/network"
import { AccountsMenu } from "features/accounts"

export function AppNav() {
  return (
    <Flex justify="space-between" alignItems="center" p={2} overflow="hidden">
      <AccountsMenu />
      <NetworkMenu />
    </Flex>
  )
}
