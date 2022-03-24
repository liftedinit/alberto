import React from "react";
import { RiBankLine } from "react-icons/ri";
import { IoSettingsOutline, IoWalletOutline } from "react-icons/io5";
import { FaExchangeAlt } from "react-icons/fa";
import { IoHomeOutline } from "react-icons/io5";
import { Center, Icon, Image, Link, Stack, Show, StackProps } from "components"
import cubeImg from "assets/cube.png"
import { useIsBaseBreakpoint } from "hooks"

export function AppMenu() {
  const isBase = useIsBaseBreakpoint()
  const iconsRef = React.useRef([
    IoHomeOutline,
    IoWalletOutline,
    FaExchangeAlt,
    RiBankLine,
    IoSettingsOutline,
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
    w: 8,
    h: 8,
  }

  return (
    <Stack alignItems="stretch" {...stackProps}>
      <Show above="md">
        <Image src={cubeImg} />
      </Show>
      {iconsRef.current.map((TabIcon, idx) => (
        <Center as={Link} {...centerProps} key={idx} p={3}>
          <Icon as={TabIcon} {...iconStyles} />
        </Center>
      ))}
    </Stack>
  )
}
