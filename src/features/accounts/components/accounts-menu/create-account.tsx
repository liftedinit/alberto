import React from "react"
import {
  Button,
  CopyToClipboard,
  ChevronLeftIcon,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Modal,
  SimpleGrid,
  Text,
  useToast,
} from "shared/components"
import { useAccountsStore } from "features/accounts"
import { Ed25519KeyPairIdentity } from "@liftedinit/many-js"
import { AddAccountMethodProps } from "./add-account-modal"

interface FormElements extends HTMLFormControlsCollection {
  name: HTMLInputElement
}

export function CreateAccount({
  setAddMethod,
  onSuccess,
}: AddAccountMethodProps) {
  const mnemonic = React.useRef(Ed25519KeyPairIdentity.getMnemonic())
  const [identity] = React.useState<Ed25519KeyPairIdentity>(
    Ed25519KeyPairIdentity.fromMnemonic(mnemonic.current),
  )

  const toast = useToast()
  const { createAccount } = useAccountsStore(({ createAccount }) => ({
    createAccount,
  }))

  async function onSave(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.target as HTMLFormElement
    const { name: nameInput } = form.elements as FormElements
    const name = nameInput.value.trim()
    if (!name) {
      nameInput.value = ""
      form.reportValidity()
      return
    }
    await createAccount({
      name,
      identity,
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
              maxLength={75}
            />
          </FormControl>
          <Flex mt={3} gap={4}>
            <FormLabel>Seed Words</FormLabel>
          </Flex>
          <SimpleGrid
            spacing={1}
            columns={{ base: 3, sm: 4 }}
            max-width="400px"
            borderWidth="1px"
            textAlign="center"
            p={4}
            pos="relative"
            rounded="md"
          >
            <CopyToClipboard
              toCopy={mnemonic.current}
              containerProps={{ position: "absolute", top: 1, right: 1 }}
            />
            {mnemonic.current.split(" ").map((word, idx) => (
              <Text aria-label="seed-word" key={word + idx} fontSize="lg">
                {word}
              </Text>
            ))}
          </SimpleGrid>
        </form>
      </Modal.Body>
    </>
  )
}
