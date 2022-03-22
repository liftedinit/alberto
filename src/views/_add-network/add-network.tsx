import { Link as RouterLink } from "react-router-dom";
import {
  Button,
  ContainerWrapper,
  FormControl,
  FormLabel,
  Flex,
  Heading,
  Input,
  Layout,
  Stack,
  Text,
  useBreakpointValue,
} from "components";

export function AddNetwork() {
  const isBase = useBreakpointValue({ base: 1, md: 2 }) === 1
  console.log({ isBase })

  return <div>add network</div>

  // return (
  //   <Layout withNav={false}>
  //     <Layout.Nav>
  //       <Flex justify="flex-end">
  //         <Button variant="link" as={RouterLink} to="/networks">
  //           <Text>Back</Text>
  //         </Button>
  //       </Flex>
  //     </Layout.Nav>
  //     <Layout.Main py={4} px={isBase ? 4 : 0}>
  //       <ContainerWrapper>
  //         <Heading mb={2} size="lg">
  //           Add a network
  //         </Heading>
  //         <Stack
  //           spacing={3}
  //           alignItems="stretch"
  //           p={isBase ? 0 : 8}
  //           shadow={isBase ? "none" : "lg"}
  //         >
  //           <FormControl>
  //             <FormLabel htmlFor="name">Name</FormLabel>
  //             <Input id="name" variant="filled" />
  //           </FormControl>
  //           <FormControl>
  //             <FormLabel htmlFor="url">URL</FormLabel>
  //             <Input id="url" variant="filled" />
  //           </FormControl>
  //           <Flex justify={isBase ? "flex-start" : "flex-end"} w="100%">
  //             <Button colorScheme="green" isFullWidth={isBase}>
  //               <Text casing="uppercase">Save</Text>
  //             </Button>
  //           </Flex>
  //         </Stack>
  //       </ContainerWrapper>
  //     </Layout.Main>
  //   </Layout>
  // )
}
