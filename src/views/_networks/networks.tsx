import { Link as RouterLink } from "react-router-dom";
import {
  Button,
  Circle,
  ContainerWrapper,
  Heading,
  HStack,
  Layout,
  Stack,
  Text,
  useBreakpointValue,
  VStack,
} from "components";
import { useNetworkStore } from "features/network";

export function Networks() {
  const isBase = useBreakpointValue({ base: true, md: false });
  const { networks, activeId } = useNetworkStore((s) => ({
    networks: Array.from(s.byId),
    activeId: s.activeId,
  }));
  console.log({ networks });

  return (
    <Layout withNav={false}>
      <Layout.Nav>
        <HStack justify="flex-end">
          <Button variant="link" as={RouterLink} to="/">
            <Text>Back</Text>
          </Button>
        </HStack>
      </Layout.Nav>
      <Layout.Main
        py={4}
        px={isBase ? 4 : 0}
        display="flex"
        flexDirection="column"
      >
        <ContainerWrapper>
          <Heading size="lg" fontWeight="semibold" mb={4}>
            Networks
          </Heading>
          <Stack spacing={3}>
            {networks.map(([id, network]) => {
              return (
                <HStack
                  justify="space-between"
                  shadow="md"
                  w="100%"
                  py={2}
                  px={3}
                  bg="gray.50"
                  key={network.name}
                  borderWidth={1}
                >
                  <VStack spacing={0} alignItems="flex-start">
                    <Text fontWeight="semibold" fontSize="md">
                      {network.name}
                    </Text>
                    <Text fontSize="sm">{network.url}</Text>
                  </VStack>
                  {activeId === id && <Circle bg="green.400" size="16px" />}
                </HStack>
              );
            })}
          </Stack>
        </ContainerWrapper>
        <Button
          mt={8}
          alignSelf="center"
          as={RouterLink}
          to="/networks/add"
          width={isBase ? "100%" : "auto"}
          colorScheme="green"
        >
          <Text casing="uppercase">Add A Network</Text>
        </Button>
      </Layout.Main>
    </Layout>
  );
}
