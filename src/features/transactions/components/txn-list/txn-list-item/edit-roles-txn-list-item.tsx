import { AddRolesEvent, EventType, RemoveRolesEvent } from "many-js"
import {
  Box,
  EditIcon,
  Heading,
  HStack,
  Modal,
  Text,
  UserPlusIcon,
  UserMinusIcon,
} from "components"
import { BaseTxnListItem } from "./base-txn-list-item"
import { BaseTxnDetails } from "./base-txn-details"
import { AccountRoles } from "features/accounts"

export function EditRolesTxnListItem({
  txn,
}: {
  txn: AddRolesEvent | RemoveRolesEvent
}) {
  const txnTypeName =
    txn.type === EventType.accountAddRoles ? "Add Roles" : "Remove Roles"
  const Icon =
    txn.type === EventType.accountAddRoles ? UserPlusIcon : UserMinusIcon
  return (
    <BaseTxnListItem
      icon={<Icon boxSize={5} />}
      txnTypeName={txnTypeName}
      txnTime={txn?.time?.toLocaleString()}
      txnDetails={
        <BaseTxnDetails>
          {({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => (
            <EditRolesEventDetailsModal
              isOpen={isOpen}
              onClose={onClose}
              roles={txn?.roles}
              txnTypeName={txnTypeName}
            />
          )}
        </BaseTxnDetails>
      }
    />
  )
}

function EditRolesEventDetailsModal({
  onClose,
  isOpen,
  roles,
  txnTypeName,
}: {
  onClose: () => void
  isOpen: boolean
  roles: AddRolesEvent["roles"] | RemoveRolesEvent["roles"]
  txnTypeName: string
}) {
  return (
    <Modal
      header="Transaction Details"
      onClose={onClose}
      isOpen={isOpen}
      footer={<></>}
    >
      <Modal.Body>
        <HStack mb={6}>
          <EditIcon boxSize={6} />
          <Text>{txnTypeName}</Text>
        </HStack>
        {roles ? (
          <Box mb={4}>
            <Heading size="md" mb={2}>
              Roles
            </Heading>
            <AccountRoles roles={roles} />
          </Box>
        ) : null}
      </Modal.Body>
    </Modal>
  )
}
