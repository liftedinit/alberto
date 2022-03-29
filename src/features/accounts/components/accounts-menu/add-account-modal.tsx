import React from "react"
import {
  Box,
  Button,
  ContainerWrapper,
  Flex,
  Heading,
  Modal,
  ScaleFade,
  SimpleGrid,
  Text,
} from "components"
import { SeedWords } from "./seed-words"
import { CreateAccount } from "./create-account"
import { PemFile } from "./pem-file"

enum AddAccountMethodTypes {
  create = "create",
  seed = "seed",
  pem = "pem",
}

export const toastTitle = "Add Account"
export type AddMethodState = AddAccountMethodTypes | ""
export type AddAccountMethodProps = {
  setAddMethod: React.Dispatch<AddMethodState>
  onSuccess: () => void
}

export function AddAccountModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean
  onClose: () => void
}) {
  const [addMethod, setAddMethod] = React.useState<AddMethodState>("")

  function onSuccess() {
    onClose()
  }

  React.useEffect(() => {
    setAddMethod("")
  }, [isOpen])

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="4xl">
      {addMethod === "" && (
        <ScaleFade in={true} initialScale={0.9}>
          <AddAccountMethods
            onAddMethodClick={methodType => {
              setAddMethod(methodType)
            }}
          />
        </ScaleFade>
      )}
      {addMethod !== "" && (
        <ScaleFade in={true} initialScale={0.9}>
          {addMethod === AddAccountMethodTypes.create && (
            <CreateAccount setAddMethod={setAddMethod} onSuccess={onSuccess} />
          )}
          {addMethod === AddAccountMethodTypes.seed && (
            <SeedWords setAddMethod={setAddMethod} onSuccess={onSuccess} />
          )}
          {addMethod === AddAccountMethodTypes.pem && (
            <PemFile setAddMethod={setAddMethod} onSuccess={onSuccess} />
          )}
          <Modal.Footer>
            <ContainerWrapper>
              <Flex justifyContent="flex-end">
                <Button type="submit" form="add-account-form">
                  Save
                </Button>
              </Flex>
            </ContainerWrapper>
          </Modal.Footer>
        </ScaleFade>
      )}
    </Modal>
  )
}

function AddAccountMethods({
  onAddMethodClick,
}: {
  onAddMethodClick: (method: AddAccountMethodTypes) => void
}) {
  return (
    <>
      <Modal.Header>Add Account</Modal.Header>
      <Modal.Body>
        <SimpleGrid
          columns={{ base: 1, md: 3 }}
          spacing={4}
          transition="ease-in-out"
          transitionProperty="all"
          transitionDuration="3s"
        >
          <Box
            shadow="md"
            p={4}
            transition="ease-in-out"
            transitionProperty="all"
            transitionDuration="1s"
          >
            <Heading mb={3} size="md">
              Create A New Account
            </Heading>
            <Text>Some description of how this works maybe?</Text>
            <Button
              mt={4}
              isFullWidth
              textTransform="uppercase"
              onClick={() => onAddMethodClick(AddAccountMethodTypes.create)}
            >
              create new
            </Button>
          </Box>
          <Box shadow="md" p={4}>
            <Heading mb={3} size="md">
              Import Seed Words
            </Heading>
            <Text>Some description of how this works maybe?</Text>
            <Button
              mt={4}
              isFullWidth
              textTransform="uppercase"
              onClick={() => onAddMethodClick(AddAccountMethodTypes.seed)}
            >
              import
            </Button>
          </Box>
          <Box shadow="md" p={4}>
            <Heading mb={3} size="md">
              Import PEM File
            </Heading>
            <Text>Some description of how this works maybe?</Text>
            <Button
              mt={4}
              isFullWidth
              textTransform="uppercase"
              onClick={() => onAddMethodClick(AddAccountMethodTypes.pem)}
            >
              import
            </Button>
          </Box>
        </SimpleGrid>
      </Modal.Body>
      <Modal.Footer />
    </>
  )
}
