import React from "react"
import {
  IconButton,
  Modal,
  PlusIcon,
  Tab,
  Tabs,
  TabList,
  useDisclosure,
} from "@liftedinit/ui"
import { SearchAccount } from "./search-account"
import { CreateAccount } from "./create-account"

export type OnAccountSelected = (address: string) => void

type DisclosureRenderProps = {
  onOpen: () => void
  onClose: () => void
  isOpen: boolean
}

type AccountSelectorProps = {
  onAccountSelected: OnAccountSelected
  children?:
    | React.ReactNode
    | ((props: DisclosureRenderProps) => React.ReactNode)
}

export function AccountSelector({
  onAccountSelected,
  children,
}: AccountSelectorProps) {
  const { onClose, isOpen, onOpen } = useDisclosure()

  return (
    <>
      {typeof children === "function" ? (
        (children as (props: DisclosureRenderProps) => React.ReactNode)({
          onOpen,
          onClose,
          isOpen,
        })
      ) : (
        <IconButton
          rounded="full"
          size="sm"
          aria-label="import account"
          icon={<PlusIcon boxSize={6} />}
          onClick={onOpen}
        />
      )}
      <AddAccountModal
        onClose={onClose}
        isOpen={isOpen}
        onAccountSelected={onAccountSelected}
      />
    </>
  )
}

function AddAccountModal({
  onClose,
  isOpen,
  onAccountSelected,
}: {
  onClose: () => void
  isOpen: boolean
  onAccountSelected: OnAccountSelected
}) {
  const [tab, setTab] = React.useState(0)

  React.useEffect(() => {
    if (!isOpen) {
      setTab(0)
    }
  }, [isOpen])

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      header="Add Account"
      scrollBehavior="inside"
      size={tab === 1 ? "xl" : undefined}
      footer={<></>}
      closeOnOverlayClick={false}
      closeOnEsc={tab !== 1}
    >
      <Modal.Body>
        <Tabs mb={4} onChange={tabIdx => setTab(tabIdx)}>
          <TabList>
            <Tab>Search</Tab>
            <Tab>Create</Tab>
          </TabList>
        </Tabs>
        {tab === 0 ? (
          <SearchAccount
            onAccountSelected={address => {
              onAccountSelected(address)
              onClose()
            }}
          />
        ) : null}
        {tab === 1 ? <CreateAccount /> : null}
      </Modal.Body>
    </Modal>
  )
}
