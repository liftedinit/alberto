import {
  AccountFeatureTypes,
  AccountMultisigArgument,
  AddFeaturesEvent,
} from "many-js"
import {
  Box,
  DataField,
  EditIcon,
  Heading,
  HStack,
  Modal,
  Text,
  TxnExpireText,
} from "components"
import { BaseTxnListItem } from "./base-txn-list-item"
import { BaseTxnDetails } from "./base-txn-details"
import { AccountRoles } from "features/accounts"
import { getHoursMinutesSecondsFromSeconds } from "helper/convert"

export function AddFeaturesTxnListItem({ txn }: { txn: AddFeaturesEvent }) {
  return (
    <BaseTxnListItem
      icon={<EditIcon boxSize={5} />}
      txnTypeName="Add Features"
      txnTime={txn?.time?.toLocaleString()}
      txnDetails={
        <BaseTxnDetails>
          {({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => (
            <AddFeaturesEventDetailsModal
              isOpen={isOpen}
              onClose={onClose}
              roles={txn?.roles}
              features={txn?.features}
            />
          )}
        </BaseTxnDetails>
      }
    />
  )
}

function AddFeaturesEventDetailsModal({
  onClose,
  isOpen,
  roles,
  features,
}: {
  onClose: () => void
  isOpen: boolean
  roles: AddFeaturesEvent["roles"]
  features: AddFeaturesEvent["features"]
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
          <Text>Add Features</Text>
        </HStack>
        {roles ? (
          <Box mb={4}>
            <Heading size="md" mb={2}>
              Roles
            </Heading>
            <AccountRoles roles={roles} />
          </Box>
        ) : null}
        {features ? (
          <Box>
            <Heading size="md" mb={2}>
              Features
            </Heading>
            <AccountFeatures features={features} />
          </Box>
        ) : null}
      </Modal.Body>
    </Modal>
  )
}

function AccountFeatures({
  features,
}: {
  features: AddFeaturesEvent["features"]
}) {
  const accountLedgerFeature = features?.get(
    AccountFeatureTypes[AccountFeatureTypes.accountLedger],
  )
  const multisigFeature = features?.get(
    AccountFeatureTypes[AccountFeatureTypes.accountMultisig],
  ) as Map<string, unknown>
  const threshold = multisigFeature?.get(
    AccountMultisigArgument[AccountMultisigArgument.threshold],
  ) as number
  const expireInSecs = getHoursMinutesSecondsFromSeconds(
    (multisigFeature?.get(
      AccountMultisigArgument[AccountMultisigArgument.expireInSecs],
    ) as number) ?? 0,
  )
  const executeAutomatically = multisigFeature?.get(
    AccountMultisigArgument[AccountMultisigArgument.executeAutomatically],
  )

  return (
    <>
      {accountLedgerFeature ? (
        <DataField label="Account Ledger" value="Yes" />
      ) : null}
      {multisigFeature ? (
        <>
          <DataField label="Required Approvers" value={threshold} />
          <DataField label="Transaction Expiration">
            <TxnExpireText
              hours={expireInSecs.hours}
              minutes={expireInSecs.minutes}
              seconds={expireInSecs.seconds}
            />
          </DataField>
          <DataField
            label="Execute Automatically"
            value={executeAutomatically === true ? "Yes" : "No"}
          />
        </>
      ) : null}
    </>
  )
}
