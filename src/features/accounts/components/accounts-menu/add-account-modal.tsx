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
  Tab,
  Tabs,
  TabList,
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

  React.useEffect(() => {
    setAddMethod("")
  }, [isOpen])

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="4xl"
      data-testid="add-account-form-container"
      closeOnOverlayClick={addMethod ? false : true}
      closeOnEsc={addMethod ? false : true}
    >
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
              <ContainerWrapper>
                <Flex justifyContent="flex-end">
                  <Button type="submit" form="add-account-form">
                    Save
                  </Button>
                </Flex>
              </ContainerWrapper>
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
          colorScheme="brand.teal"
          mb={3}
          onChange={index =>
            setActiveTab(index === 0 ? TabNames.create : TabNames.import)
          }
        >
          <TabList>
            {tabs.map(name => (
              <Tab
                key={name}
                w={{ base: "full", md: "auto" }}
                fontWeight="medium"
              >
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
    label: "create seed phrase",
  },
  {
    title: "Hardware Authenticator",
    label: "create hardware authenticator",
    onClickArg: AddAccountMethodTypes.createAuthenticator,
  },
]

function CreateAccountOptions({
  onAddMethodClick,
}: {
  onAddMethodClick: (method: AddAccountMethodTypes) => void
}) {
  return (
    <SimpleGrid
      columns={{ base: 1, md: 3 }}
      spacing={4}
      transition="ease-in-out"
      transitionProperty="all"
      transitionDuration="3s"
    >
      {createCards.map((c, idx) => {
        return (
          <AddAccountCard
            key={idx}
            title={c.title}
            label={c.label}
            description="Some description of how this works maybe?"
            ctaText="create"
            onClick={() => onAddMethodClick(c.onClickArg)}
          />
        )
      })}
    </SimpleGrid>
  )
}

const importCards = [
  {
    title: "Seed Phrase",
    onClickArg: AddAccountMethodTypes.importSeed,
    label: "import seed phrase",
  },
  {
    title: "PEM File",
    onClickArg: AddAccountMethodTypes.importPem,
    label: "import pem file",
  },
  {
    title: "Hardware Authenticator",
    onClickArg: AddAccountMethodTypes.importAuthenticator,
    label: "import hardware authenticator",
  },
]
function ImportAcountOptions({
  onAddMethodClick,
}: {
  onAddMethodClick: (method: AddAccountMethodTypes) => void
}) {
  return (
    <SimpleGrid
      columns={{ base: 1, md: 3 }}
      spacing={4}
      transition="ease-in-out"
      transitionProperty="all"
      transitionDuration="3s"
    >
      {importCards.map((c, idx) => {
        return (
          <AddAccountCard
            key={idx}
            title={c.title}
            label={c.label}
            description="Some description of how this works maybe?"
            ctaText="import"
            onClick={() => onAddMethodClick(c.onClickArg)}
          />
        )
      })}
    </SimpleGrid>
  )
}

function AddAccountCard({
  title,
  label,
  description,
  onClick,
  ctaText,
}: {
  title: string | React.ReactNode
  label: string
  description: string
  onClick: () => void
  ctaText: string
}) {
  return (
    <Box shadow="md" p={4}>
      <Heading mb={3} size="md">
        {title}
      </Heading>
      <Text>{description}</Text>
      <Button
        mt={4}
        aria-label={label}
        isFullWidth
        textTransform="uppercase"
        onClick={onClick}
      >
        {ctaText}
      </Button>
    </Box>
  )
}