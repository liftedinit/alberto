import React from "react"
import { useLocation, Link as RouterLink } from "react-router-dom"
import {
  AccountsIcon,
  AccountsOutlineIcon,
  AddressBookIcon,
  AddressBookOutlineIcon,
  Center,
  Icon,
  Image,
  Link,
  SendIcon,
  SendOutlineIcon,
  Stack,
  Show,
  StackProps,
  WalletIcon,
  WalletOutlineIcon,
} from "components"
import cubeImg from "assets/cube.png"
import { useIsBaseBreakpoint } from "hooks"

export function AppMenu() {
  const location = useLocation()
  const isBase = useIsBaseBreakpoint()
  const iconsRef = React.useRef([
    {
      pathname: "/",
      activeIcon: WalletIcon,
      icon: WalletOutlineIcon,
    },
    {
      pathname: "/send",
      activeIcon: SendIcon,
      icon: SendOutlineIcon,
    },
    {
      pathname: "/contacts",
      activeIcon: AddressBookIcon,
      icon: AddressBookOutlineIcon,
    },
    {
      pathname: "/accounts",
      activeIcon: AccountsIcon,
      icon: AccountsOutlineIcon,
      matcher: (pathname: string, currentPathname: string) =>
        pathname.startsWith(currentPathname),
    },

    // {
    //   pathname: "/settings",
    //   activeIcon: SettingsIcon,
    //   icon: SettingsOutlineIcon,
    // },
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
        borderInlineEndRadius: "lg",
        h: "100%",
      }
  const centerProps = isBase
    ? {
        flexGrow: 1,
      }
    : { borderWidth: "0" }

  return (
    <Stack alignItems="stretch" {...stackProps}>
      <Show above="md">
        <Image src={cubeImg} />
      </Show>
      {iconsRef.current.map(({ icon, activeIcon, pathname, matcher }, idx) => {
        const isActive = matcher
          ? matcher(location.pathname, pathname)
          : pathname === location.pathname
        return (
          <Center {...centerProps} key={idx} p={2} rounded="full">
            <Link
              as={RouterLink}
              to={pathname}
              display="flex"
              rounded="full"
              p={2}
              _focus={{ border: "none" }}
            >
              <Icon
                color={isActive ? "brand.teal.500" : undefined}
                boxSize={isBase ? 8 : 9}
                as={isActive ? activeIcon : icon}
              />
            </Link>
          </Center>
        )
      })}
    </Stack>
  )
}
