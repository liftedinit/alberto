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
} from "components"
import { useAccountsStore } from "features/accounts"
import { Ed25519KeyPairIdentity } from "many-js"
import { doesAccountExist } from "../../utils"
import { AddAccountMethodProps } from "./add-account-modal"

const toastTitle = "Add Account"
export function PemFile({ setAddMethod, onSuccess }: AddAccountMethodProps) {
  const toast = useToast()
  const { createAccount, accounts } = useAccountsStore(
    ({ createAccount, byId }) => ({
      createAccount,
      accounts: Array.from(byId),
    }),
  )
  const [pem, setPem] = React.useState("")
  const [name, setName] = React.useState("")

  async function onSave(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    let identity: Ed25519KeyPairIdentity | undefined
    try {
      identity = Ed25519KeyPairIdentity.fromPem(pem)
    } catch {
      return toast({
        title: toastTitle,
        status: "warning",
        description: "Invalid PEM",
      })
    }
    const address = await(await identity.getAddress()).toString()
    const exists = await doesAccountExist(address, accounts)

    if (exists) {
      return toast({
        title: toastTitle,
        status: "warning",
        description: "Account already exists.",
      })
    }

    createAccount({
      name,
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
      <Modal.Header>Import From PEM File</Modal.Header>
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
              onChange={e => setName(e.target.value)}
              value={name}
            />
          </FormControl>
          <FormControl isRequired>
            <FormLabel htmlFor="pem" mt={6}>
              PEM File
            </FormLabel>
            <Textarea
              value={pem}
              name="pem"
              id="pem"
              variant="filled"
              onChange={e => setPem(e.target.value)}
            />
          </FormControl>
        </form>
      </Modal.Body>
    </>
  )
}
