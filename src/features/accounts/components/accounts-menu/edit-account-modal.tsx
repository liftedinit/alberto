import React from "react"
import {
  Button,
  Code,
  CopyToClipboard,
  FormHelperText,
  FormControl,
  FormLabel,
  HStack,
  Input,
  Modal,
  useToast,
} from "components"
import { useAccountsStore, AccountId } from "../../index"
import { AccountItemWithIdDisplayStrings } from "../accounts-menu"

export function EditAccountModal({
  isOpen,
  onClose,
  account,
}: {
  isOpen: boolean
  onClose: () => void
  account: AccountItemWithIdDisplayStrings
}) {
  const [name, setName] = React.useState("")
  const [publicKey, setPublicKey] = React.useState("")
  const toast = useToast()
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
    updateAccount(account[0], { name, keys: account[1].keys })
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
    if (account) {
      setName(account[1].name)
    }
  }, [account])

  React.useEffect(() => {
    if (!isOpen) {
      setName("")
      setPublicKey("")
    }
  }, [isOpen])

  if (!account) return null

  const accountData = account[1]

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
          <FormLabel mt={3}>Public Key</FormLabel>
          <HStack bgColor="gray.100" px={4} h="40px" rounded="md">
            <Code isTruncated fontWeight="normal" aria-label="full public key">
              {account[1].idDisplayStrings.full}
            </Code>
            <CopyToClipboard
              iconProps={{ "data-testid": "copy-to-clipboard-btn" }}
              toCopy={account[1].idDisplayStrings.full as string}
            />
          </HStack>
        </form>
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
                disabled={publicKey !== accountData?.idDisplayStrings?.full}
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
      </Modal.Body>
    </Modal>
  )
}
