import React from "react"
import { FiChevronDown } from "react-icons/fi"
import { useNetworkStore } from "../store"
import {
  Box,
  Button,
  Circle,
  FormControl,
  FormLabel,
  HStack,
  Input,
  Modal,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  Stack,
  Text,
  useToast,
  UseToastOptions,
  useDisclosure,
} from "components"
import { NetworkId, NetworkParams } from "../types"

type EditNetwork = [NetworkId, NetworkParams]

export function NetworkMenu() {
  const [editingNetwork, setEditingNetwork] = React.useState<
    EditNetwork | undefined
  >(undefined)
  const { isOpen, onClose, onOpen } = useDisclosure()
  function onEditNetwork(network: EditNetwork) {
    setEditingNetwork(network)
    onOpen()
  }
  const { activeNetwork, networks, activeId, setActiveId } = useNetworkStore(
    s => ({
      networks: Array.from(s.byId).sort((a, b) => {
        const [, { name: nameA }] = a
        const [, { name: nameB }] = b
        const nameALower = nameA.toLowerCase()
        const nameBLower = nameB.toLowerCase()
        return nameALower === nameBLower ? 0 : nameALower < nameBLower ? -1 : 1
      }),
      activeId: s.activeId,
      activeNetwork: s.byId.get(s.activeId),
      setActiveId: s.setActiveId,
    }),
  )
  console.log({ activeNetwork, networks, isOpen, activeId })

  return (
    <Box>
      <Menu>
        <MenuButton
          as={Button}
          rightIcon={<FiChevronDown />}
          size="sm"
          minWidth="100px"
        >
          <HStack justifyContent="center">
            <Circle bg="green.400" size="10px" />
            <Text fontSize="sm" casing="uppercase" fontWeight="medium">
              {activeNetwork?.name}
            </Text>
          </HStack>
        </MenuButton>
        <MenuList>
          <Box overflow="auto" maxHeight="40vh">
            <NetworkMenuItem
              activeId={activeId}
              id={activeId}
              network={activeNetwork!}
              onEditNetwork={onEditNetwork}
            />
            {networks.map(([id, network]) =>
              id === activeId ? null : (
                <NetworkMenuItem
                  key={id}
                  activeId={activeId}
                  id={id}
                  network={network}
                  setActiveId={setActiveId}
                  onEditNetwork={onEditNetwork}
                />
              ),
            )}
          </Box>
          <MenuDivider mt={0} />
          <MenuItem as={Box} _hover={{ backgroundColor: "transparent" }}>
            <Button
              isFullWidth
              onClick={() => {
                setEditingNetwork(undefined)
                onOpen()
              }}
            >
              Add Network
            </Button>
          </MenuItem>
        </MenuList>
        <NetworkDetailsModal
          isOpen={isOpen}
          onClose={onClose}
          network={editingNetwork}
        />
      </Menu>
    </Box>
  )
}

function NetworkMenuItem({
  activeId,
  id,
  network,
  setActiveId,
  onEditNetwork,
}: {
  activeId: NetworkId
  id: NetworkId
  network: NetworkParams
  setActiveId?: (id: NetworkId) => void
  onEditNetwork: (network: EditNetwork) => void
}) {
  const [showEdit, setShowEdit] = React.useState(false)
  return (
    <MenuItem
      as={Box}
      justifyContent="space-between"
      onMouseEnter={() => !showEdit && setShowEdit(true)}
      onMouseLeave={() => showEdit && setShowEdit(false)}
    >
      {activeId === id ? (
        <HStack>
          <Circle bg="green.400" size="10px" />
          <Text casing="uppercase">{network.name}</Text>
        </HStack>
      ) : (
        <Button
          variant="link"
          onClick={() => setActiveId?.(id)}
          title="Set network active"
        >
          <Text casing="uppercase">{network?.name}</Text>
        </Button>
      )}
      <Button
        visibility={showEdit ? "visible" : "hidden"}
        variant="link"
        onClick={() => onEditNetwork([id, network])}
      >
        Edit
      </Button>
    </MenuItem>
  )
}

const commonToastOptions: UseToastOptions = {
  duration: 5000,
  variant: "subtle",
  isClosable: true,
  position: "top",
}

function NetworkDetailsModal({
  isOpen,
  onClose,
  network,
}: {
  isOpen: boolean
  onClose: () => void
  network?: [NetworkId, NetworkParams]
}) {
  const IS_UPDATE = !!network
  const [formValues, setFormValues] = React.useState({ name: "", url: "" })
  const toast = useToast()
  const { createNetwork, updateNetwork, byId } = useNetworkStore(s => ({
    createNetwork: s.createNetwork,
    updateNetwork: s.updateNetwork,
    byId: s.byId,
  }))
  function onChange(e: React.FormEvent<HTMLInputElement>) {
    console.log("e", e.currentTarget)
    const { name, value } = e.currentTarget
    console.log({ name, value })
    setFormValues(s => ({
      ...s,
      [name]: value,
    }))
  }
  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const name = formValues.name.trim()
    const url = formValues.url.trim()
    if (IS_UPDATE) {
      updateNetwork(network[0], { name, url })
      toast({
        title: "Update Network",
        description: "Network was updated.",
        status: "success",
        ...commonToastOptions,
      })
      onClose()
      return
    }
    // creating new
    const exists = Array.from(byId).some(
      ([, networkParams]) => networkParams.url === url,
    )
    if (exists) {
      toast({
        title: "Add Network",
        description: "Network already exists.",
        status: "warning",
        ...commonToastOptions,
      })
      return
    }

    createNetwork({ name, url })
    onClose()
    toast({
      title: "Add Network",
      description: "New network added. This network is now active.",
      status: "success",
      ...commonToastOptions,
    })
  }
  React.useEffect(() => {
    if (network) {
      setFormValues(network[1])
    }
    return () => {
      setFormValues({ name: "", url: "" })
    }
  }, [network])
  console.log({ formValues, network })

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      header={`${network ? "Update" : "Create A"} Network`}
    >
      <form onSubmit={handleSubmit}>
        <Modal.Body>
          <Stack spacing={3} alignItems="stretch">
            <FormControl>
              <FormLabel htmlFor="name">Name</FormLabel>
              <Input
                autoFocus
                name="name"
                required
                id="name"
                variant="filled"
                onChange={onChange}
                value={formValues.name}
              />
            </FormControl>
            <FormControl>
              <FormLabel htmlFor="url">URL</FormLabel>
              <Input
                name="url"
                onChange={onChange}
                required
                id="url"
                variant="filled"
                value={formValues.url}
              />
            </FormControl>
          </Stack>
        </Modal.Body>
        <Modal.Footer>
          <HStack justifyContent="flex-end">
            <Button onClick={onClose}>Cancel</Button>
            <Button type="submit">Save</Button>
          </HStack>
        </Modal.Footer>
      </form>
    </Modal>
  )
}
