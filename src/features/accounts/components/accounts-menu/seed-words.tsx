import React from "react"
import {
  Button,
  ChevronLeftIcon,
  FormControl,
  FormLabel,
  Input,
  Modal,
  Textarea,
  useToast,
} from "@liftedinit/ui"
import { useAccountsStore, doesAccountExist } from "features/accounts"
import { Ed25519KeyPairIdentity } from "@liftedinit/many-js"
import { AddAccountMethodProps, toastTitle } from "./add-account-modal"

export function SeedWords({ setAddMethod, onSuccess }: AddAccountMethodProps) {
  const toast = useToast()
  const { createAccount, accounts } = useAccountsStore(
    ({ createAccount, byId }) => ({
      createAccount,
      accounts: Array.from(byId),
    }),
  )
  const [account, setAccount] = React.useState<{
    name: string
    mnemonic: string
  }>({ name: "", mnemonic: "" })

  async function onSave(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    let identity: Ed25519KeyPairIdentity | undefined
    try {
      identity = Ed25519KeyPairIdentity.fromMnemonic(account.mnemonic)
    } catch {
      return toast({
        title: toastTitle,
        status: "warning",
        description: "Invalid mnemonic",
      })
    }
    const address = (await identity.getAddress()).toString()
    const exists = await doesAccountExist(address, accounts)
    if (exists) {
      return toast({
        title: toastTitle,
        status: "warning",
        description: "Account already exists.",
      })
    }

    await createAccount({
      name: account.name,
      identity,
    })
    toast({
      title: toastTitle,
      status: "success",
      description: "New account was created.",
    })
    onSuccess()
  }
  return (
    <>
      <Modal.Header>Import From Seed Words</Modal.Header>
      <Modal.Body>
        <Button
          variant="link"
          onClick={() => setAddMethod("")}
          leftIcon={<ChevronLeftIcon />}
        >
          Back
        </Button>
        <form id="add-account-form" onSubmit={onSave}>
          <FormControl isRequired>
            <FormLabel htmlFor="name">Name</FormLabel>
            <Input
              autoFocus
              name="name"
              id="name"
              variant="filled"
              onChange={e => setAccount(s => ({ ...s, name: e.target.value }))}
              value={account.name ?? ""}
            />
          </FormControl>
          <FormControl isRequired>
            <FormLabel mt={6}>Seed Words</FormLabel>
            <Textarea
              value={account.mnemonic}
              variant="filled"
              onChange={e => {
                const val = e.target.value
                setAccount(s => ({
                  ...s,
                  mnemonic: val,
                }))
              }}
            />
          </FormControl>
        </form>
      </Modal.Body>
    </>
  )
}
