import React from "react"
import {
  Button,
  FormControl,
  FormLabel,
  Input,
  Modal,
  Textarea,
  useToast,
  ContainerWrapper,
} from "components"
import { useAccountsStore } from "features/accounts"
import { Ed25519KeyPairIdentity, KeyPair } from "many-js"
import { doesAccountExist } from "features/accounts/utils"
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
    let keysFromMnemonic: KeyPair | undefined
    try {
      keysFromMnemonic = KeyPair.fromMnemonic(account.mnemonic)
    } catch {
      return toast({
        title: toastTitle,
        status: "warning",
        description: "Invalid mnemonic",
      })
    }
    const identity = new Ed25519KeyPairIdentity(
      keysFromMnemonic!.publicKey,
      keysFromMnemonic!.privateKey,
    )
    const exists = await doesAccountExist(identity.publicKey, accounts)
    if (exists) {
      return toast({
        title: toastTitle,
        status: "warning",
        description: "Account already exists.",
      })
    }

    createAccount({
      name: account.name,
      identity: new Ed25519KeyPairIdentity(
        keysFromMnemonic.publicKey,
        keysFromMnemonic.privateKey,
      ),
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
        <Button variant="link" onClick={() => setAddMethod("")}>
          Back
        </Button>
        <ContainerWrapper>
          <form id="add-account-form" onSubmit={onSave}>
            <FormControl isRequired>
              <FormLabel htmlFor="name">Name</FormLabel>
              <Input
                autoFocus
                name="name"
                id="name"
                variant="filled"
                onChange={e =>
                  setAccount(s => ({ ...s, name: e.target.value }))
                }
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
        </ContainerWrapper>
      </Modal.Body>
    </>
  )
}
