import { Icon as BaseIcon, IconProps } from "components"
import { MdContentCopy } from "react-icons/md"
import { HiOutlineRefresh } from "react-icons/hi"
import { BiDownload } from "react-icons/bi"
import {
  IoWallet,
  IoWalletOutline,
  IoSettingsSharp,
  IoSearch,
  IoSettingsOutline,
} from "react-icons/io5"
import {
  FaAddressBook,
  FaRegAddressBook,
  FaUserCircle,
  FaRegPaperPlane,
  FaPaperPlane,
} from "react-icons/fa"
import { CgUsb } from "react-icons/cg"
import { FiChevronDown, FiEdit, FiX } from "react-icons/fi"

const Icon: typeof BaseIcon = (props: IconProps) => {
  return <BaseIcon boxSize={6} {...props} />
}

export function ReceiveIcon(props: IconProps) {
  return <Icon as={BiDownload} {...props} />
}

export function SendIcon(props: IconProps) {
  return <Icon as={FaPaperPlane} {...props} />
}

export function SendOutlineIcon(props: IconProps) {
  return <Icon as={FaRegPaperPlane} {...props} />
}

export function SettingsIcon(props: IconProps) {
  return <Icon as={IoSettingsSharp} {...props} />
}

export function SettingsOutlineIcon(props: IconProps) {
  return <Icon as={IoSettingsOutline} {...props} />
}

export function WalletIcon(props: IconProps) {
  return <Icon as={IoWallet} {...props} />
}

export function WalletOutlineIcon(props: IconProps) {
  return <Icon as={IoWalletOutline} {...props} />
}

export function AddressBookIcon(props: IconProps) {
  return <Icon as={FaAddressBook} {...props} />
}
export function AddressBookOutlineIcon(props: IconProps) {
  return <Icon as={FaRegAddressBook} {...props} />
}

export function UserIcon(props: IconProps) {
  return <Icon as={FaUserCircle} {...props} />
}

export function EditIcon(props: IconProps) {
  return <Icon as={FiEdit} {...props} />
}

export function ChevronDownIcon(props: IconProps) {
  return <Icon as={FiChevronDown} {...props} />
}

export function CloseIcon(props: IconProps) {
  return <Icon as={FiX} {...props} />
}

export function SearchIcon(props: IconProps) {
  return <Icon as={IoSearch} {...props} />
}

export function UsbIcon(props: IconProps) {
  return <Icon as={CgUsb} {...props} />
}

export function CopyIcon(props: IconProps) {
  return <Icon as={MdContentCopy} {...props} />
}

export function RefreshIcon(props: IconProps) {
  return <BaseIcon as={HiOutlineRefresh} {...props} />
}