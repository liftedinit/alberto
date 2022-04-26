import React from "react"
import {
  Button,
  CopyIcon,
  CopyToClipboard,
  Container,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Modal,
  SimpleGrid,
  Text,
  useToast,
} from "components"
import { useAccountsStore } from "features/accounts"
import { Ed25519KeyPairIdentity, KeyPair } from "many-js"
import { AddAccountMethodProps } from "./add-account-modal"

interface FormElements extends HTMLFormControlsCollection {
  name: HTMLInputElement
}

export function CreateAccount({
  setAddMethod,
  onSuccess,
}: AddAccountMethodProps) {
  const mnemonic = React.useRef(KeyPair.getMnemonic())
  const keys = React.useRef(KeyPair.fromMnemonic(mnemonic.current))

  const toast = useToast()
  const { createAccount } = useAccountsStore(({ createAccount }) => ({
    createAccount,
  }))

  function onSave(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.target as HTMLFormElement
    const { name: nameInput } = form.elements as FormElements
    const name = nameInput.value.trim()
    if (!name) {
      nameInput.value = ""
      form.reportValidity()
      return
    }
    createAccount({
      name,
      identity: new Ed25519KeyPairIdentity(
        keys.current.publicKey,
        keys.current.privateKey,
      ),
    })
    toast({
      title: "Create Account",
      description: "New account was created.",
      status: "success",
    })
    onSuccess()
  }

  return (
    <>
      <Modal.Header>Create An Account</Modal.Header>
      <Modal.Body>
        <Button variant="link" onClick={() => setAddMethod("")}>
          Back
        </Button>
        <Container>
          <form id="add-account-form" onSubmit={onSave}>
            <FormControl isRequired>
              <FormLabel htmlFor="name">Name</FormLabel>
              <Input
                autoFocus
                name="name"
                id="name"
                variant="filled"
                maxLength={75}
              />
            </FormControl>
            <Flex mt={3} gap={4}>
              <FormLabel>Seed Words</FormLabel>
              <CopyToClipboard toCopy={mnemonic.current}>
                {({ onCopy }) => {
                  return (
                    <Button
                      size="xs"
                      onClick={onCopy}
                      rightIcon={<CopyIcon boxSize={4} />}
                    >
                      Copy Seed Words
                    </Button>
                  )
                }}
              </CopyToClipboard>
            </Flex>
            <SimpleGrid spacing={1} columns={{ base: 4 }} max-width="400px">
              {mnemonic.current.split(" ").map(word => (
                <Text data-testid="seed-word" key={word} fontSize="lg">
                  {word}
                </Text>
              ))}
            </SimpleGrid>
          </form>
        </Container>
      </Modal.Body>
    </>
  )
}
