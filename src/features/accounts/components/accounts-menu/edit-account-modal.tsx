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
  AddressText,
  useAddressText,
} from "components"
import { useAccountsStore, AccountId, Account } from "../../index"
import { AnonymousIdentity } from "many-js"

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
  const [publicKey, setPublicKey] = React.useState("")
  const toast = useToast()
  const addressStr = useAddressText(accountData?.identity)
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
    updateAccount(account[0], { name, identity: accountData.identity })
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
    accountData && setName(accountData?.name)
  }, [accountData])

  React.useEffect(() => {
    if (!isOpen) {
      setName("")
      setPublicKey("")
    }
  }, [isOpen])

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
              <FormLabel mt={3}>Public Key</FormLabel>
              <AddressText identity={accountData?.identity} px={4} h="40px">
                {addressStr}
              </AddressText>
            </>
          )}
        </form>
        {isAnonymous ? null : (
          <form id="remove-account-form">
            <FormControl mt={3} id="publicKey">
              <FormLabel color="red">Remove Account</FormLabel>
              <HStack spacing={0}>
                <Input
                  name="publicKey"
                  data-testid="public key input"
                  required
                  // id="publicKey"
                  variant="filled"
                  onChange={e => setPublicKey(e.currentTarget.value)}
                  value={publicKey}
                  borderTopRightRadius={0}
                  borderBottomRightRadius={0}
                />
                <Button
                  borderTopLeftRadius={0}
                  borderBottomLeftRadius={0}
                  colorScheme="red"
                  disabled={!addressStr || publicKey !== addressStr}
                  onClick={() => onDelete(account[0])}
                  aria-label="remove account"
                >
                  Remove
                </Button>
              </HStack>
              <FormHelperText color="red">
                Enter the full public key from above and click remove to remove
                this account.
              </FormHelperText>
            </FormControl>
          </form>
        )}
      </Modal.Body>
    </Modal>
  )
}
