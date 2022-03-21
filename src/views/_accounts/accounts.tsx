import { Link as RouterLink } from "react-router-dom";
import {
  Button,
  Circle,
  ContainerWrapper,
  Flex,
  Heading,
  HStack,
  Layout,
  Stack,
  Text,
  useBreakpointValue,
  VStack,
} from "components";
import { useAccountsStore } from "features/accounts";
import { displayId } from "helper/common";

export function Accounts() {
  const isBase = useBreakpointValue({ base: true, md: false });
  const { accounts, activeId } = useAccountsStore((s) => ({
    accounts: Array.from(s.byId),
    activeId: s.activeId,
  }));
  console.log({ accounts });

  return (
    <Layout withNav={false}>
      <Layout.Nav>
        <Flex justify="flex-end">
          <Button variant="link" as={RouterLink} to="/">
            <Text>Back</Text>
          </Button>
        </Flex>
      </Layout.Nav>
      <Layout.Main px={isBase ? 4 : 0} py={4}>
        <ContainerWrapper>
          <Heading fontWeight="semibold" size="lg" mb={4}>
            Accounts
          </Heading>
          <Stack spacing={3} alignItems="center">
            {accounts.map(([id, account]) => {
              return (
                <HStack
                  justify="space-between"
                  shadow="md"
                  w="100%"
                  py={2}
                  px={3}
                  bg="gray.50"
                  key={account.name}
                  borderWidth={1}
                >
                  <VStack spacing={0} alignItems="flex-start">
                    <Text fontWeight="semibold" fontSize="md">
                      {account.name}
                    </Text>
                    <Text fontSize="sm">{displayId(account)}</Text>
                  </VStack>
                  {activeId === id && <Circle bg="green.400" size="16px" />}
                </HStack>
              );
            })}
            <Button
              as={RouterLink}
              to="/accounts/add"
              width={isBase ? "100%" : "auto"}
              colorScheme="green"
            >
              <Text casing="uppercase">add an account</Text>
            </Button>
          </Stack>
        </ContainerWrapper>
      </Layout.Main>
    </Layout>
  );
}
