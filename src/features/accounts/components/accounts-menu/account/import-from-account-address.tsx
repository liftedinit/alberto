import React from "react"
import { AccountInfoData } from "many-js"
import {
  Box,
  Button,
  ChevronLeftIcon,
  FormControl,
  HStack,
  IconButton,
  Input,
  Modal,
  SearchIcon,
} from "components"
import { useGetAccountInfo, useCreateAccount } from "features/accounts/api"
import { AccountInfo } from "features/accounts"

import { AddAccountMethodProps } from "../add-account-modal"
import { useDebounce } from "hooks"

export function ImportFromAccountAddress({
  setAddMethod,
  onSuccess,
  setShowDefaultFooter,
}: AddAccountMethodProps & { setShowDefaultFooter: (show: boolean) => void }) {
  const inputRef = React.useRef<HTMLInputElement>(null)
  const [accountAddress, setAccountAddress] = React.useState("")
  const debouncedAcctAddress = useDebounce(accountAddress)
  const formRef = React.useRef<HTMLFormElement>(null)
  const [accountInfo, setAccountInfo] = React.useState<
    AccountInfoData | undefined
  >()

  const { data, isLoading } = useGetAccountInfo(debouncedAcctAddress)

  const { mutate: doCreateAccount } = useCreateAccount()

  function doCreate() {
    doCreateAccount(undefined, {
      onSuccess: d => {
        console.log("doCreateAccount succcess", d)
      },
    })
  }

  function onImportClick(e: React.SyntheticEvent<HTMLButtonElement>) {
    e.preventDefault()
    console.log("import clicked >>>>>>>>>>>>", data)
  }

  React.useEffect(() => {
    setShowDefaultFooter(false)
    return () => setShowDefaultFooter(true)
  }, [setShowDefaultFooter])

  return (
    <>
      <Modal.Header>Import From Account Address</Modal.Header>
      <Modal.Body>
        <Button
          variant="link"
          onClick={() => setAddMethod("")}
          leftIcon={<ChevronLeftIcon />}
        >
          Back
        </Button>
        <Button size="sm" onClick={doCreate} rounded="full">
          C
        </Button>
        <FormControl isRequired>
          <HStack>
            <Input
              name="account"
              id="account"
              size="sm"
              variant="filled"
              ref={inputRef}
              maxLength={75}
              minLength={50}
              placeholder="Account address"
              onChange={e => setAccountAddress(e.target.value)}
            />
            <Box>
              <IconButton
                type="submit"
                rounded="full"
                size="sm"
                // isLoading={isLoading}
                aria-label="search account"
                icon={<SearchIcon boxSize={5} />}
              />
            </Box>
          </HStack>
        </FormControl>
        <AccountInfo accountInfo={data?.accountInfo} />
      </Modal.Body>
      <Modal.Footer>
        <Button
          disabled={!accountInfo}
          colorScheme="brand.teal"
          onClick={onImportClick}
        >
          Import
        </Button>
      </Modal.Footer>
    </>
  )
}
