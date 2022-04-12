import React from "react"
import { useLocation, Link as RouterLink } from "react-router-dom"
import {
  Center,
  Icon,
  Image,
  Link,
  SendIcon,
  SettingsIcon,
  Stack,
  Show,
  StackProps,
  WalletIcon,
} from "components"
import cubeImg from "assets/cube.png"
import { useIsBaseBreakpoint } from "hooks"

export function AppMenu() {
  const location = useLocation()
  const isBase = useIsBaseBreakpoint()
  const iconsRef = React.useRef([
    {
      pathname: "/",
      icon: WalletIcon,
    },
    {
      pathname: "/send",
      icon: SendIcon,
    },
    {
      pathname: "/settings",
      icon: SettingsIcon,
    },
  ])
  const stackProps: StackProps = isBase
    ? {
        direction: "row",
        spacing: 0,
        h: "56px",
        justifyContent: "space-evenly",
      }
    : {
        spacing: 12,
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

  const iconStyles = {
    w: 9,
    h: 9,
  }

  return (
    <Stack alignItems="stretch" {...stackProps}>
      <Show above="md">
        <Image src={cubeImg} />
      </Show>
      {iconsRef.current.map(({ icon: NavIcon, pathname }, idx) => (
        <Center {...centerProps} key={idx} p={3}>
          <Link as={RouterLink} to={pathname}>
            <Icon
              color={
                pathname === location.pathname ? "brand.teal.500" : undefined
              }
              as={NavIcon}
              {...iconStyles}
            />
          </Link>
        </Center>
      ))}
    </Stack>
  )
}
