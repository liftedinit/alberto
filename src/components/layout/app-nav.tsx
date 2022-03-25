import { HStack } from "components"
import { NetworkMenu } from "features/network"
import { AccountsMenu } from "features/accounts"

export function AppNav() {
  return (
    <HStack
      justify="space-between"
      alignItems="center"
      w="100%"
      h="100%"
      px={4}
      shadow="base"
    >
      <AccountsMenu />
      <NetworkMenu />
    </HStack>
  )
}
