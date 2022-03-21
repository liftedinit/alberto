import React from "react";
import { RiBankLine } from "react-icons/ri";
import { IoSettingsOutline, IoWalletOutline } from "react-icons/io5";
import { FaExchangeAlt } from "react-icons/fa";
import { IoHomeOutline } from "react-icons/io5";
import {
  Center,
  Icon,
  Stack,
  StackProps,
  useBreakpointValue,
} from "components";

export function AppMenu() {
  const isBase = useBreakpointValue({ base: "base", md: "md" }) === "base";
  const iconsRef = React.useRef([
    IoHomeOutline,
    IoWalletOutline,
    // AiOutlineDollarCircle,
    FaExchangeAlt,
    RiBankLine,
    IoSettingsOutline,
  ]);
  const stackProps: StackProps = isBase
    ? {
        direction: "row",
        spacing: 0,
        h: "56px",
        justifyContent: "space-evenly",
      }
    : {
        pt: 16,
        spacing: 12,
        direction: "column",
        justifyContent: "flex-start",
        shadow: "md",
        borderInlineEndRadius: "lg",
        h: "100%",
      };
  const centerProps = isBase
    ? {
        borderWidth: 1,
        flexGrow: 1,
      }
    : { borderWidth: "0" };

  const iconStyles = {
    w: 8,
    h: 8,
  };

  return (
    <Stack alignItems="stretch" {...stackProps}>
      {iconsRef.current.map((TabIcon, idx) => (
        <Center {...centerProps} key={idx} p={3}>
          <Icon as={TabIcon} {...iconStyles} />
        </Center>
      ))}
    </Stack>
  );
}
