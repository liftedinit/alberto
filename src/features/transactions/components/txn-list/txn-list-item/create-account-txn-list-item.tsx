import {
  AccountInfoData,
  CreateAccountEvent,
  GetAccountInfoResponse,
} from "many-js"
import { Modal, PlusCircleIcon, HStack, Text } from "components"
import { BaseTxnListItem } from "./base-txn-list-item"
import { BaseTxnDetails } from "./base-txn-details"
import { AccountInfo } from "features/accounts"

export function CreateAccountTxnListItem({ txn }: { txn: CreateAccountEvent }) {
  const { time, account, roles, description } = txn
  const data = {
    accountInfo: {
      description,
      roles,
    } as AccountInfoData,
  }
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
              accountInfo={data}
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
  accountInfo,
}: {
  onClose: () => void
  isOpen: boolean
  accountAddress?: string
  accountInfo?: GetAccountInfoResponse
}) {
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
        <AccountInfo
          address={accountAddress}
          accountInfo={accountInfo?.accountInfo}
        />
      </Modal.Body>
    </Modal>
  )
}
