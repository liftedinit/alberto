import React from "react"
import { useNetworkStore } from "../../store"
import {
  Box,
  Button,
  Circle,
  ChevronDownIcon,
  EditIcon,
  Flex,
  FormControl,
  FormLabel,
  FormHelperText,
  HStack,
  Input,
  IconButton,
  Modal,
  Menu,
  MenuButton,
  MenuOptionGroup,
  MenuList,
  MenuItem,
  MenuDivider,
  Stack,
  Text,
  useToast,
  useDisclosure,
} from "components"
import { NetworkId, NetworkParams } from "../../types"

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

  return (
    <Flex alignItems="center" justifyContent="flex-end" minW="100px">
      <Menu autoSelect={false}>
        <MenuButton
          as={Button}
          rightIcon={<ChevronDownIcon />}
          lineHeight="normal"
          size="md"
          minWidth="100px"
          data-testid="active-network-menu-trigger"
          colorScheme="brand.black"
          variant="outline"
          leftIcon={
            activeNetwork ? <Circle bg="green.400" size="10px" /> : null
          }
        >
          <Text casing="uppercase" isTruncated fontWeight="semibold">
            {`${activeNetwork?.name ?? "no network selected"}`}
          </Text>
        </MenuButton>
        <MenuList maxW="100vw" zIndex={2}>
          <MenuOptionGroup title="Networks" />
          <Box overflow="auto" maxHeight="40vh">
            {activeNetwork ? (
              <NetworkMenuItem
                activeId={activeId}
                id={activeId}
                network={activeNetwork!}
                onEditNetwork={onEditNetwork}
              />
            ) : null}
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
    </Flex>
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
          <Text
            fontSize={{ base: "lg", md: "md" }}
            casing="uppercase"
            cursor="poiner"
          >
            {network.name}
          </Text>
        </HStack>
      ) : (
        <Button
          variant="link"
          onClick={() => setActiveId?.(id)}
          title="Set network active"
        >
          <Text
            fontSize={{ base: "lg", md: "md" }}
            casing="uppercase"
            cursor="poiner"
          >
            {network?.name}
          </Text>
        </Button>
      )}
      <IconButton
        variant="ghost"
        color="brand.black"
        aria-label="edit network"
        icon={<EditIcon boxSize={5} />}
        onClick={() => onEditNetwork([id, network])}
      />
    </MenuItem>
  )
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
  const [formValues, setFormValues] = React.useState({
    name: "",
    url: "",
  })
  const [deleteUrl, setDeleteUrl] = React.useState("")
  const toast = useToast()
  const { createNetwork, updateNetwork, deleteNetwork, byId } = useNetworkStore(
    ({ createNetwork, updateNetwork, deleteNetwork, byId }) => ({
      createNetwork,
      updateNetwork,
      deleteNetwork,
      byId,
    }),
  )
  function onChange(e: React.FormEvent<HTMLInputElement>) {
    const { name, value } = e.currentTarget
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
      })
      onClose()
      return
    }

    const exists = Array.from(byId).some(
      ([, networkParams]) => networkParams.url === url,
    )
    if (exists) {
      toast({
        title: "Add Network",
        description: "Network already exists.",
        status: "warning",
      })
      return
    }

    createNetwork({ name, url })
    toast({
      title: "Add Network",
      description: "New network added. This network is now active.",
      status: "success",
    })
    onClose()
  }

  function onDelete(id: NetworkId) {
    if (!byId.has(id)) return
    deleteNetwork(id)
    toast({
      title: "Remove Network",
      description: "Network was removed.",
      status: "success",
    })
    onClose()
  }

  React.useEffect(() => {
    if (network) {
      setFormValues(network[1])
    }
  }, [network])

  React.useEffect(() => {
    if (!isOpen) {
      setDeleteUrl("")
      setFormValues({ name: "", url: "" })
    }
  }, [isOpen])

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      header={`${network ? "Update" : "Create A"} Network`}
      data-testid="network-create-update-contents"
      footer={
        <HStack justifyContent="flex-end">
          <Button form="network-create-update-form" type="submit">
            Save
          </Button>
        </HStack>
      }
    >
      <Modal.Body>
        <form
          onSubmit={handleSubmit}
          data-testid="create-update-network-form"
          id="network-create-update-form"
        >
          <Stack spacing={3} alignItems="stretch">
            <FormControl isRequired>
              <FormLabel htmlFor="name">Name</FormLabel>
              <Input
                autoFocus
                name="name"
                id="name"
                variant="filled"
                onChange={onChange}
                value={formValues.name}
              />
            </FormControl>
            <FormControl isRequired>
              <FormLabel htmlFor="url">URL</FormLabel>
              <Input
                name="url"
                onChange={onChange}
                id="url"
                variant="filled"
                autoCapitalize="off"
                value={formValues.url}
              />
            </FormControl>
          </Stack>
        </form>
        {IS_UPDATE && (
          <form id="remove-network-form">
            <FormControl mt={3}>
              <FormLabel color="red" htmlFor="deleteUrl">
                Remove Network
              </FormLabel>
              <HStack spacing={0}>
                <Input
                  name="deleteUrl"
                  required
                  id="deleteUrl"
                  variant="filled"
                  onChange={e => setDeleteUrl(e.currentTarget.value)}
                  value={deleteUrl}
                  borderTopRightRadius={0}
                  borderBottomRightRadius={0}
                />
                <Button
                  borderTopLeftRadius={0}
                  borderBottomLeftRadius={0}
                  colorScheme="red"
                  disabled={deleteUrl !== formValues.url}
                  onClick={() => onDelete(network[0])}
                  data-testid="remove-network-btn"
                >
                  Remove
                </Button>
              </HStack>
              <FormHelperText color="red">
                Enter the URL and click remove to remove this network.
              </FormHelperText>
            </FormControl>
          </form>
        )}
      </Modal.Body>
    </Modal>
  )
}
