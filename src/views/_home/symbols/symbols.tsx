import { HStack, Stack, Text } from "components";

export function Symbols({
  symbolsWithBalance,
  ...props
}: {
  symbolsWithBalance?: { name: string; balance: string }[];
  [k: string]: any;
}) {
  return (
    <Stack spacing={3} {...props}>
      {symbolsWithBalance?.map((symbol) => {
        return (
          <HStack
            justify="space-between"
            shadow="md"
            p={4}
            bg="gray.50"
            key={symbol.name}
            borderWidth={1}
          >
            <Text fontSize="2xl" casing="uppercase">
              {symbol.name}
            </Text>
            <Text fontSize="2xl">{symbol.balance}</Text>
          </HStack>
        );
      })}
    </Stack>
  );
}
