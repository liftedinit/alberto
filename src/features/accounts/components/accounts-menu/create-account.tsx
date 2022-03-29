import React from "react"
import {
  Button,
  FormControl,
  FormLabel,
  Input,
  Modal,
  SimpleGrid,
  Text,
  useToast,
  ContainerWrapper,
} from "components"
import { useAccountsStore } from "../../store"
import { KeyPair } from "many-js"
import { Account } from "features/accounts"
import { AddAccountMethodProps } from "./add-account-modal"

export function CreateAccount({
  setAddMethod,
  onSuccess,
}: AddAccountMethodProps) {
  const toast = useToast()
  const { createAccount } = useAccountsStore(({ createAccount }) => ({
    createAccount,
  }))
  const [seedWords, setSeedWords] = React.useState("")
  const [account, setAccount] = React.useState<Account>({ name: "" })

  function onSave(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    createAccount(account)
    toast({
      title: "Create Account",
      description: "New account was created.",
      status: "success",
    })
    onSuccess()
  }

  React.useEffect(() => {
    const mnemonic = KeyPair.getMnemonic()
    const keys = KeyPair.fromMnemonic(mnemonic)
    setAccount(s => ({ ...s, keys }))
    setSeedWords(mnemonic)
  }, [])

  return (
    <>
      <Modal.Header>Create An Account</Modal.Header>
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
                onChange={e => {
                  const val = e.target.value
                  setAccount(s => ({ ...s, name: val }))
                }}
                value={account.name}
              />
            </FormControl>
            <FormLabel mt={6}>Seed words</FormLabel>
            <SimpleGrid spacing={1} columns={{ base: 4 }} max-width="400px">
              {!!seedWords &&
                seedWords.split(" ").map(word => (
                  <Text data-testid="seed-word" key={word} fontSize="lg">
                    {word}
                  </Text>
                ))}
            </SimpleGrid>
          </form>
        </ContainerWrapper>
      </Modal.Body>
    </>
  )
}
