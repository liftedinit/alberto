import React from "react"
import {
  Box,
  Button,
  ChevronRightIcon,
  Flex,
  Modal,
  ScaleFade,
  Text,
  Tab,
  Tabs,
  TabList,
  VStack,
} from "components"
import { SeedWords } from "./seed-words"
import { CreateAccount } from "./create-account"
import { PemFile } from "./pem-file"
import { HardwareAuthenticator } from "./hardware-authenticator"

export enum AddAccountMethodTypes {
  createSeed,
  createAuthenticator,
  importSeed,
  importPem,
  importAuthenticator,
  importAccountAddress,
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
  const [showDefaultFooter, setShowDefaultFooter] =
    React.useState<boolean>(true)

  function onSuccess() {
    onClose()
  }

  const hasAddMethod = typeof addMethod === "number"

  React.useEffect(() => {
    setAddMethod("")
  }, [isOpen])

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size={hasAddMethod ? "xl" : "md"}
      data-testid="add-account-form-container"
      closeOnOverlayClick={hasAddMethod ? false : true}
      closeOnEsc={hasAddMethod ? false : true}
    >
      {!hasAddMethod && (
        <ScaleFade in={true} initialScale={0.9}>
          <AddAccountMethods
            onAddMethodClick={methodType => {
              setAddMethod(methodType)
            }}
          />
        </ScaleFade>
      )}
      {hasAddMethod && (
        <ScaleFade in={true} initialScale={0.9}>
          {addMethod === AddAccountMethodTypes.createSeed && (
            <CreateAccount setAddMethod={setAddMethod} onSuccess={onSuccess} />
          )}
          {addMethod === AddAccountMethodTypes.importSeed && (
            <SeedWords setAddMethod={setAddMethod} onSuccess={onSuccess} />
          )}
          {addMethod === AddAccountMethodTypes.importPem && (
            <PemFile setAddMethod={setAddMethod} onSuccess={onSuccess} />
          )}
          {(addMethod === AddAccountMethodTypes.importAuthenticator ||
            addMethod === AddAccountMethodTypes.createAuthenticator) && (
            <HardwareAuthenticator
              addMethod={addMethod}
              setAddMethod={setAddMethod}
              onSuccess={onSuccess}
              setShowDefaultFooter={setShowDefaultFooter}
            />
          )}
          {showDefaultFooter && (
            <Modal.Footer>
              <Flex justifyContent="flex-end">
                <Button type="submit" form="add-account-form">
                  Save
                </Button>
              </Flex>
            </Modal.Footer>
          )}
        </ScaleFade>
      )}
    </Modal>
  )
}

enum TabNames {
  create,
  import,
}

function AddAccountMethods({
  onAddMethodClick,
}: {
  onAddMethodClick: (method: AddAccountMethodTypes) => void
}) {
  const [activeTab, setActiveTab] = React.useState(TabNames.create)
  const tabs = ["Create New", "Import"]
  return (
    <>
      <Modal.Header>Add Account</Modal.Header>
      <Modal.Body>
        <Tabs
          mb={4}
          onChange={index =>
            setActiveTab(index === 0 ? TabNames.create : TabNames.import)
          }
        >
          <TabList>
            {tabs.map(name => (
              <Tab key={name} w={{ base: "full", md: "auto" }}>
                {name}
              </Tab>
            ))}
          </TabList>
        </Tabs>

        {activeTab === TabNames.create && (
          <CreateAccountOptions onAddMethodClick={onAddMethodClick} />
        )}
        {activeTab === TabNames.import && (
          <ImportAcountOptions onAddMethodClick={onAddMethodClick} />
        )}
      </Modal.Body>
      <Modal.Footer />
    </>
  )
}

const createCards = [
  {
    title: "Seed Phrase",
    onClickArg: AddAccountMethodTypes.createSeed,
  },
  {
    title: "Hardware Authenticator",
    onClickArg: AddAccountMethodTypes.createAuthenticator,
  },
]

function CreateAccountOptions({
  onAddMethodClick,
}: {
  onAddMethodClick: (method: AddAccountMethodTypes) => void
}) {
  return (
    <VStack alignItems="flex-start" w="full">
      {createCards.map((c, idx) => {
        return (
          <AddAccountCard
            key={idx}
            title={c.title}
            onClick={() => onAddMethodClick(c.onClickArg)}
          />
        )
      })}
    </VStack>
  )
}

const importCards = [
  {
    title: "Seed Phrase",
    onClickArg: AddAccountMethodTypes.importSeed,
  },
  {
    title: "PEM File",
    onClickArg: AddAccountMethodTypes.importPem,
  },
  {
    title: "Hardware Authenticator",
    onClickArg: AddAccountMethodTypes.importAuthenticator,
  },
]
function ImportAcountOptions({
  onAddMethodClick,
}: {
  onAddMethodClick: (method: AddAccountMethodTypes) => void
}) {
  return (
    <VStack alignItems="flex-start" w="full">
      {importCards.map((c, idx) => {
        return (
          <AddAccountCard
            key={idx}
            title={c.title}
            onClick={() => onAddMethodClick(c.onClickArg)}
          />
        )
      })}
    </VStack>
  )
}

function AddAccountCard({
  title,
  onClick,
}: {
  title: string | React.ReactNode
  onClick: () => void
}) {
  return (
    <Flex
      shadow="md"
      alignItems="center"
      w="full"
      px={3}
      py={2}
      onClick={onClick}
      cursor="pointer"
      justifyContent="space-between"
    >
      <Text fontWeight="medium">{title}</Text>
      <Box>
        <ChevronRightIcon />
      </Box>
    </Flex>
  )
}