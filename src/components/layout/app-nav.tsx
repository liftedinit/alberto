// import { GiHamburgerMenu } from "react-icons/gi"
import { HStack } from "components"
import { NetworkMenu } from "features/network"
import { AccountsMenu } from "features/accounts"

export function AppNav() {
  return (
    <HStack justify="space-between" alignItems="center" w="100%">
      <AccountsMenu />
      <NetworkMenu />
    </HStack>
  )
}

// function SlideMenu() {
//   const showSlideMenuToggle = useBreakpointValue({
//     base: true,
//     md: false,
//   })
//   const { isOpen, onOpen, onClose } = useDisclosure()
//   if (!showSlideMenuToggle) return null
//   return (
//     <>
//       <IconButton
//         aria-label="open side menu"
//         variant="ghost"
//         onClick={onOpen}
//         p={0}
//       >
//         <GiHamburgerMenu />
//       </IconButton>
//       <Drawer isOpen={isOpen} placement="right" onClose={onClose} size="xs">
//         <DrawerOverlay />
//         <DrawerContent>
//           <DrawerBody>
//             <VStack spacing={10}>
//               {["thing 1", "thing 2", "thing 3", "thing 4", "thing 5"].map(
//                 text => (
//                   <Box key={text}>{text}</Box>
//                 ),
//               )}
//             </VStack>
//           </DrawerBody>
//         </DrawerContent>
//       </Drawer>
//     </>
//   )
// }
