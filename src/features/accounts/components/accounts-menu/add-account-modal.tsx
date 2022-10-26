import {
  Box,
  Button,
  ChevronRightIcon,
  Flex,
  Modal,
  ScaleFade,
  Tab,
  TabList,
  Tabs,
  VStack,
} from "components"
import React from "react"

import { SocialLogin } from "../social-login"
import { CreateAccount } from "./create-account"
import { HardwareAuthenticator } from "./hardware-authenticator"
import { PemFile } from "./pem-file"
import { SeedWords } from "./seed-words"

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
            onSuccess={onSuccess}
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
  onSuccess,
}: {
  onAddMethodClick: (method: AddAccountMethodTypes) => void
  onSuccess: () => void
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
        <SocialLogin onSuccess={onSuccess} />
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
    label: "Seed Phrase",
    title: "create new seed phrase",
    onClickArg: AddAccountMethodTypes.createSeed,
  },
  {
    label: "Hardware Authenticator",
    title: "create new with hardware authenticator",
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
            label={c.label}
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
    label: "Seed Phrase",
    onClickArg: AddAccountMethodTypes.importSeed,
    title: "import with seed phrase",
  },
  {
    label: "PEM File",
    onClickArg: AddAccountMethodTypes.importPem,
    title: "import with pem file",
  },
  {
    label: "Hardware Authenticator",
    title: "import with hardware authenticator",
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
            label={c.label}
            title={c.title}
            onClick={() => onAddMethodClick(c.onClickArg)}
          />
        )
      })}
    </VStack>
  )
}

function AddAccountCard({
  label,
  title,
  onClick,
}: {
  label: string | React.ReactNode
  title?: string
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
      justifyContent="space-between"
      as="button"
      title={title}
      fontWeight="medium"
    >
      {label}
      <Box>
        <ChevronRightIcon />
      </Box>
    </Flex>
  )
}
