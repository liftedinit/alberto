import type { CreateAccountTransaction } from "many-js"
import { Modal, PlusCircleIcon, HStack, Text } from "components"
import { BaseTxnListItem } from "./base-txn-list-item"
import { BaseTxnDetails } from "./base-txn-details"
import { AccountInfo, useGetAccountInfo } from "features/accounts"

export function CreateAccountTxnListItem({
  txnData,
}: {
  txnData: CreateAccountTransaction
}) {
  const { time, account } = txnData
  return (
    <BaseTxnListItem
      icon={<PlusCircleIcon />}
      txnTypeName="Create Account"
      txnTime={time?.toLocaleString()}
      txnDetails={
        <BaseTxnDetails>
          {({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => (
            <CreateAccountTxnDetailsModal
              isOpen={isOpen}
              onClose={onClose}
              accountAddress={account}
            />
          )}
        </BaseTxnDetails>
      }
    />
  )
}

function CreateAccountTxnDetailsModal({
  onClose,
  isOpen,
  accountAddress,
}: {
  onClose: () => void
  isOpen: boolean
  accountAddress?: string
}) {
  const { data } = useGetAccountInfo(accountAddress)

  return (
    <Modal
      header="Transaction Details"
      onClose={onClose}
      isOpen={isOpen}
      footer={<></>}
    >
      <Modal.Body>
        <HStack>
          <PlusCircleIcon boxSize={8} />
          <Text>Create Account</Text>
        </HStack>
        <AccountInfo accountInfo={data?.accountInfo} />
      </Modal.Body>
    </Modal>
  )
}
