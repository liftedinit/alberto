import React from "react"
import { useLocation, Link as RouterLink } from "react-router-dom"
import {
  AccountsIcon,
  AccountsOutlineIcon,
  AddressBookIcon,
  AddressBookOutlineIcon,
  Box,
  Heading,
  HStack,
  Icon,
  Image,
  Link,
  SendIcon,
  SendOutlineIcon,
  Stack,
  Show,
  StackProps,
  Text,
  WalletIcon,
  WalletOutlineIcon,
  useIsBaseBreakpoint,
} from "@liftedinit/ui"
import { logoSvg } from "@liftedinit/ui"
import { FaExchangeAlt } from "react-icons/fa" // TODO: This should be in @liftedinit/ui
import { IconProps } from "@chakra-ui/react"

// TODO: This should be in @liftedinit/ui
export function ExchangeIcon(props: IconProps) {
  return <Icon as={FaExchangeAlt} {...props} />
}

export function AppMenu() {
  const location = useLocation()
  const isBase = useIsBaseBreakpoint()
  const iconsRef = React.useRef([
    {
      name: "Wallet",
      pathname: "/",
      activeIcon: WalletIcon,
      icon: WalletOutlineIcon,
    },
    {
      name: "Send",
      pathname: "/send",
      activeIcon: SendIcon,
      icon: SendOutlineIcon,
    },
    {
      name: "Contacts",
      pathname: "/contacts",
      activeIcon: AddressBookIcon,
      icon: AddressBookOutlineIcon,
    },
    {
      name: "Accounts",
      pathname: "/accounts",
      activeIcon: AccountsIcon,
      icon: AccountsOutlineIcon,
      matcher: (pathname: string, currentPathname: string) =>
        pathname.startsWith(currentPathname),
    },
    {
      name: "Token Migration",
      pathname: "/token-migration-portal",
      activeIcon: ExchangeIcon,
      icon: ExchangeIcon,
      matcher: (pathname: string, currentPathname: string) =>
        pathname.startsWith(currentPathname),
    },
  ])
  const stackProps: StackProps = isBase
    ? {
        direction: "row",
        spacing: 0,
        justifyContent: "space-evenly",
      }
    : {
        spacing: 8,
        direction: "column",
        justifyContent: "flex-start",
        shadow: "lg",
        h: "100%",
      }

  return (
    <Stack alignItems="stretch" {...stackProps} bgColor="white">
      <Show above="md">
        <HStack mt="46px" spacing="4" ml="8" mb="4">
          <Image h="67px" src={logoSvg} />
          <Heading size="md" fontWeight="normal">
            Alberto
          </Heading>
        </HStack>
      </Show>
      {iconsRef.current.map(
        ({ name, icon, activeIcon, pathname, matcher }, idx) => {
          const isActive = matcher
            ? matcher(location.pathname, pathname)
            : pathname === location.pathname
          return (
            <Box
              display="flex"
              key={idx}
              justifyContent={isBase ? "center" : undefined}
              flexGrow={isBase ? 1 : undefined}
              p={isBase ? 0 : undefined}
              height={isBase ? "60px" : "auto"}
              pl={isBase ? "0" : "7"}
              borderEndWidth={isActive && !isBase ? "4px" : "0px"}
              borderEndColor={
                isActive && !isBase ? "brand.teal.500" : undefined
              }
              alignItems="center"
            >
              <Link
                as={RouterLink}
                to={pathname}
                rounded="full"
                p={isBase ? 2 : 0}
                _focus={{
                  boxShadow: "none",
                }}
              >
                <Stack
                  key={idx}
                  alignItems="center"
                  direction={["column", "row"]}
                  justifyContent="center"
                  spacing={isBase ? "0" : "5"}
                >
                  <Icon
                    color={isActive ? "brand.teal.500" : "gray.600"}
                    boxSize={6}
                    as={isActive ? activeIcon : icon}
                  />
                  {isBase ? null : (
                    <Text
                      fontSize="lg"
                      fontWeight={isActive ? "medium" : "normal"}
                      color={isActive ? "brand.black" : "gray.600"}
                    >
                      {name}
                    </Text>
                  )}
                </Stack>
              </Link>
            </Box>
          )
        },
      )}
    </Stack>
  )
}
