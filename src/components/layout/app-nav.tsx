import { Link as RouterLink } from "react-router-dom";
import { GiHamburgerMenu } from "react-icons/gi";
import {
  Box,
  Circle,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerOverlay,
  HStack,
  IconButton,
  Link,
  Text,
  useBreakpointValue,
  useDisclosure,
  VStack,
} from "components";
import { useNetworkStore } from "features/network";
import { useAccountsStore } from "features/accounts";

export function AppNav() {
  const network = useNetworkStore((s) => s.byId.get(s.activeId));
  const account = useAccountsStore((s) => s.byId.get(s.activeId));
  return (
    <HStack justify="space-between" alignItems="center" w="100%">
      <HStack>
        <Link as={RouterLink} to="/accounts">
          <Text casing="uppercase" fontSize="sm" fontWeight="semibold">
            {account?.name}
          </Text>
        </Link>
      </HStack>
      <HStack alignItems="center">
        <Circle bg="green.400" size="10px" />
        <Link as={RouterLink} to="/networks">
          <Text fontSize="sm" casing="uppercase" fontWeight="semibold">
            {network?.name}
          </Text>
        </Link>
        {/* <SlideMenu /> */}
      </HStack>
    </HStack>
  );
}

function SlideMenu() {
  const showSlideMenuToggle = useBreakpointValue({
    base: true,
    md: false,
  });
  const { isOpen, onOpen, onClose } = useDisclosure();
  if (!showSlideMenuToggle) return null;
  return (
    <>
      <IconButton
        aria-label="open side menu"
        variant="ghost"
        onClick={onOpen}
        p={0}
      >
        <GiHamburgerMenu />
      </IconButton>
      <Drawer isOpen={isOpen} placement="right" onClose={onClose} size="xs">
        <DrawerOverlay />
        <DrawerContent>
          <DrawerBody>
            <VStack spacing={10}>
              {["thing 1", "thing 2", "thing 3", "thing 4", "thing 5"].map(
                (text) => (
                  <Box key={text}>{text}</Box>
                )
              )}
            </VStack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
}
