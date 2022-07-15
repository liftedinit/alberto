import React from "react"
import {
  Button,
  Center,
  Flex,
  FormControl,
  Input,
  Spinner,
  Text,
} from "components"
import { AccountInfo, useGetAccountInfo } from "features/accounts"
import { useDebounce } from "hooks"
import { OnAccountSelected } from "../account-selector"

export function SearchAccount({
  onAccountSelected,
}: {
  onAccountSelected: OnAccountSelected
}) {
  const [accountAddress, setAccountAddress] = React.useState("")
  const debouncedAcctAddress = useDebounce(accountAddress)
  const { data, isLoading, isFetching } =
    useGetAccountInfo(debouncedAcctAddress)

  function onImportClick() {
    data?.accountInfo &&
      onAccountSelected(debouncedAcctAddress, data.accountInfo)
  }

  return (
    <>
      <FormControl isRequired mb={4}>
        <Input
          name="account"
          id="account"
          size="sm"
          variant="filled"
          maxLength={100}
          minLength={50}
          onChange={e => setAccountAddress(e.target.value.trim())}
          placeholder="Account address"
        />
      </FormControl>
      {isFetching && (
        <Center mt={4}>
          <Spinner size="lg" justifySelf="center" alignSelf="center" />
        </Center>
      )}
      {!isFetching && !isLoading && !data && (
        <Center mt={4}>
          <Text>No account was found.</Text>
        </Center>
      )}
      <AccountInfo accountInfo={data?.accountInfo} />

      {data?.accountInfo ? (
        <Flex justifyContent="flex-end">
          <Button
            size="sm"
            colorScheme="brand.teal"
            onClick={onImportClick}
            mt={4}
          >
            Add Account
          </Button>
        </Flex>
      ) : null}
    </>
  )
}
