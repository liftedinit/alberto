import { AccountInfoData } from "@liftedinit/many-js"
import {
  AddressText,
  Box,
  Divider,
  Flex,
  Heading,
  Text,
  VStack,
} from "components"
import { useContactsStore } from "features/contacts"
import { useAccountsStore } from "features/accounts"

export function AccountInfo({
  address,
  accountInfo,
}: {
  address?: string
  accountInfo?: AccountInfoData | undefined
}) {
  if (!accountInfo) return null
  return (
    <VStack spacing={4} alignItems="flex-start">
      <Box>
        <Heading size="sm" opacity={0.6} mb={2}>
          Name
        </Heading>
        <Text fontWeight="medium">{accountInfo?.description ?? ""}</Text>
        {address && (
          <AddressText p={0} bgColor={undefined} addressText={address} />
        )}
      </Box>

      <Box w="full">
        <Heading size="sm" opacity={0.6} mb={2}>
          Owners
        </Heading>
        <AccountRoles roles={accountInfo.roles} />
      </Box>
    </VStack>
  )
}

export function AccountRoles({ roles }: { roles: AccountInfoData["roles"] }) {
  const contacts = useContactsStore(s => s.byId)
  const accounts = useAccountsStore(s => Array.from(s.byId).map(a => a[1]))

  if (!roles || roles.size === 0) return <Text>No owners and roles.</Text>
  return (
    <VStack
      alignItems="flex-start"
      divider={<Divider />}
      rounded="md"
      borderWidth={1}
      borderColor="gray.200"
      py={2}
      spacing={4}
    >
      {roles
        ? Array.from(roles).map(role => {
            const [address, rolesList] = role
            const contactName =
              contacts.get(address)?.name ??
              accounts.find(acc => acc.address === address)?.name
            return (
              <Box w="full" key={address} px={4}>
                {contactName ? (
                  <Text fontWeight="medium" casing="capitalize">
                    {contactName}
                  </Text>
                ) : null}
                <AddressText bgColor={undefined} p={0} addressText={address} />
                <Flex gap={2} flexWrap="wrap" mt={1}>
                  {rolesList
                    ? rolesList.map((roleName: string) => {
                        return (
                          <Box
                            key={roleName}
                            rounded="md"
                            bgColor="gray.100"
                            px={2}
                          >
                            {roleName}
                          </Box>
                        )
                      })
                    : null}
                </Flex>
              </Box>
            )
          })
        : null}
    </VStack>
  )
}
