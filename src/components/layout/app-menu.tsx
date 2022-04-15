import React from "react"
import { useLocation, Link as RouterLink } from "react-router-dom"
import {
  AddressBookIcon,
  AddressBookOutlineIcon,
  Center,
  Icon,
  Image,
  Link,
  SendIcon,
  SendOutlineIcon,
  SettingsIcon,
  SettingsOutlineIcon,
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
      pathname: "/settings",
      activeIcon: SettingsIcon,
      icon: SettingsOutlineIcon,
    },
  ])
  const stackProps: StackProps = isBase
    ? {
        direction: "row",
        spacing: 0,
        justifyContent: "space-evenly",
      }
    : {
        spacing: 10,
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
      {iconsRef.current.map(({ icon, activeIcon, pathname }, idx) => {
        const isActive = pathname === location.pathname
        return (
          <Center {...centerProps} key={idx} p={3}>
            <Link
              as={RouterLink}
              to={pathname}
              display="flex"
              _focus={{ border: "none" }}
            >
              <Icon
                color={isActive ? "brand.teal.500" : undefined}
                w={{ base: 8, md: 9 }}
                h={{ base: 8, md: 9 }}
                as={isActive ? activeIcon : icon}
              />
            </Link>
          </Center>
        )
      })}
    </Stack>
  )
}
