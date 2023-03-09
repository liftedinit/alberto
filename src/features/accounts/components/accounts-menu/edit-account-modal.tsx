import React from "react"
import {
  Button,
  FormHelperText,
  FormControl,
  FormLabel,
  HStack,
  Input,
  Modal,
  useToast,
} from "@liftedinit/ui"
import { AddressText } from "features/accounts"
import { useAccountsStore, AccountId, Account } from "../../index"
import { AnonymousIdentity } from "@liftedinit/many-js"

export function EditAccountModal({
  isOpen,
  onClose,
  account,
}: {
  isOpen: boolean
  onClose: () => void
  account: [number, Account]
}) {
  const accountData = account?.[1]
  const [name, setName] = React.useState("")
  const [address, setAddress] = React.useState("")
  const toast = useToast()
  const addressStr = accountData?.address ?? ""
  const isAnonymous = accountData?.identity instanceof AnonymousIdentity
  const { updateAccount, deleteAccount, byId } = useAccountsStore(
    ({ updateAccount, deleteAccount, byId }) => ({
      updateAccount,
      deleteAccount,
      byId,
    }),
  )

  function onSave(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!byId.has(account[0])) return
    updateAccount(account[0], {
      name,
      identity: accountData.identity,
    })
    toast({
      title: "Update Account",
      description: "Account was updated",
      status: "success",
    })
    onClose()
  }

  function onDelete(id: AccountId) {
    if (!byId.has(id)) return
    deleteAccount(id)
    toast({
      title: "Remove Account",
      description: "Account was removed.",
      status: "success",
    })
    onClose()
  }

  React.useEffect(() => {
    if (!isOpen) {
      setName("")
      setAddress("")
    } else {
      accountData && setName(accountData?.name)
    }
  }, [isOpen, accountData])

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      header="Update Account"
      data-testid="update-account-container"
      footer={
        <HStack justifyContent="flex-end">
          <Button form="update-account-form" type="submit">
            Save
          </Button>
        </HStack>
      }
    >
      <Modal.Body>
        <form
          onSubmit={onSave}
          data-testid="update-account-form"
          id="update-account-form"
        >
          <FormControl isRequired>
            <FormLabel htmlFor="name">Name</FormLabel>
            <Input
              autoFocus
              name="name"
              id="name"
              variant="filled"
              onChange={e => setName(e.target.value)}
              value={name}
            />
          </FormControl>
          {isAnonymous ? null : (
            <>
              <FormLabel mt={3}>Address</FormLabel>
              <AddressText
                addressText={accountData?.address ?? ""}
                h="40px"
                isFullText
              />
            </>
          )}
        </form>
        {isAnonymous ? null : (
          <form data-testid="remove-account-form" id="remove-account-form">
            <FormControl mt={3} id="addressInput">
              <FormLabel htmlFor="addressInput" color="red">
                Remove Account
              </FormLabel>
              <HStack spacing={0}>
                <Input
                  name="addressInput"
                  required
                  variant="filled"
                  onChange={e => setAddress(e.currentTarget.value)}
                  value={address}
                  borderTopRightRadius={0}
                  borderBottomRightRadius={0}
                />
                <Button
                  borderTopLeftRadius={0}
                  borderBottomLeftRadius={0}
                  colorScheme="red"
                  disabled={!addressStr || address !== addressStr}
                  onClick={() => onDelete(account[0])}
                  aria-label="remove account"
                >
                  Remove
                </Button>
              </HStack>
              <FormHelperText color="red">
                Enter the full address from above and click remove to remove
                this account.
              </FormHelperText>
            </FormControl>
          </form>
        )}
      </Modal.Body>
    </Modal>
  )
}
