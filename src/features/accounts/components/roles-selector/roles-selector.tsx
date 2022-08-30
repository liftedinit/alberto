import {
  Button,
  Checkbox,
  Modal,
  OptionCard,
  useDisclosure,
  VStack,
} from "components"
import { AccountRole } from "@liftedinit/many-js"

type Props = {
  onRoleClicked: (onClose: () => void, roles: string[]) => void
  rolesList: Role[]
  selectedRoles: string[]
  children: (onOpen: () => void) => void
}

export function RolesSelector({
  selectedRoles,
  onRoleClicked,
  rolesList = [],
  children,
}: Props) {
  const { isOpen, onOpen, onClose } = useDisclosure()

  return (
    <>
      {children(onOpen)}
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        footer={
          <>
            <Button onClick={onClose}>Done</Button>
          </>
        }
        header="Roles"
        scrollBehavior="inside"
      >
        <Modal.Body pt={0}>
          <RolesList
            rolesList={rolesList}
            selectedRoles={selectedRoles}
            onRoleSelected={(r: string) => {
              const shouldRemove = selectedRoles.includes(r)
              let result = selectedRoles.slice()
              result = shouldRemove
                ? result.filter(role => role !== r)
                : result.concat(r)
              onRoleClicked(onClose, result)
            }}
          />
        </Modal.Body>
      </Modal>
    </>
  )
}

export type Role = { label: string; description: string; value: string }

function RolesList({
  onRoleSelected,
  selectedRoles,
  rolesList,
}: {
  onRoleSelected: (roles: string) => void
  selectedRoles: string[]
  rolesList: Role[]
}) {
  return (
    <VStack alignItems="flex-start" data-testid="roles list">
      {rolesList.map(role => {
        const checked = selectedRoles.includes(role.value)
        return (
          <OptionCard
            key={role.label}
            label={role.label}
            description={role.description}
            onClick={e => {
              e.preventDefault()
              onRoleSelected(role.value)
            }}
          >
            <Checkbox
              colorScheme="brand.teal"
              aria-label="account multisig feature"
              isChecked={checked}
              data-testid={`${role.label} role`}
              onChange={() => {
                onRoleSelected(role.value)
              }}
            />
          </OptionCard>
        )
      })}
    </VStack>
  )
}

export function getRolesList({
  hasLedgerFeature,
  hasMultisigFeature,
}: {
  hasLedgerFeature: boolean
  hasMultisigFeature: boolean
}): Role[] {
  const roles: Role[] = [
    {
      label: "Owner",
      description: "Can perform regular ledger transactions.",
      value: AccountRole[AccountRole.owner],
    },
  ]

  if (hasMultisigFeature) {
    roles.push(
      {
        label: "Multisig Submit",
        description:
          "Can submit new transactions and withdraw own submitted transactions.",
        value: AccountRole[AccountRole.canMultisigSubmit],
      },
      {
        label: "Multisig Approve",
        description: "Can approve transactions and revoke their own approvals.",
        value: AccountRole[AccountRole.canMultisigApprove],
      },
    )
  }

  if (hasLedgerFeature) {
    roles.push({
      label: "Ledger Transact",
      description:
        "Can perform regular transactions that would be possible from their identities, from this account.",
      value: AccountRole[AccountRole.canLedgerTransact],
    })
  }
  return roles
}
