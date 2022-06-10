import { Icon as BaseIcon, IconProps } from "components"
import { MdContentCopy } from "react-icons/md"
import { HiOutlineRefresh } from "react-icons/hi"
import { BiDownload } from "react-icons/bi"
import { IoIosPaperPlane, IoMdPaperPlane } from "react-icons/io"
import {
  IoWallet,
  IoWalletOutline,
  IoSettingsSharp,
  IoSearch,
  IoSettingsOutline,
  IoTimeOutline,
} from "react-icons/io5"
import {
  FaAddressBook,
  FaRegAddressBook,
  FaCheckCircle,
  FaUserCircle,
  FaUndo,
  FaTimes,
  FaTimesCircle,
  FaPlayCircle,
  FaMinusCircle,
  FaAddressCard,
  FaRegAddressCard,
} from "react-icons/fa"
import { CgUsb } from "react-icons/cg"
import {
  FiChevronDown,
  FiEdit,
  FiChevronRight,
  FiChevronLeft,
  FiPlus,
} from "react-icons/fi"

const Icon: typeof BaseIcon = (props: IconProps) => {
  return <BaseIcon boxSize={6} {...props} />
}

export function ReceiveIcon(props: IconProps) {
  return <Icon as={BiDownload} {...props} />
}

export function SendIcon(props: IconProps) {
  return <Icon as={IoIosPaperPlane} {...props} />
}

export function SendOutlineIcon(props: IconProps) {
  return <Icon as={IoMdPaperPlane} {...props} />
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

export function ChevronLeftIcon(props: IconProps) {
  return <Icon as={FiChevronLeft} {...props} />
}

export function ChevronRightIcon(props: IconProps) {
  return <Icon as={FiChevronRight} {...props} />
}

export function CloseIcon(props: IconProps) {
  return <Icon as={FaTimes} {...props} />
}

export function TimesCircleIcon(props: IconProps) {
  return <Icon as={FaTimesCircle} {...props} />
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
  return <Icon as={HiOutlineRefresh} {...props} />
}

export function AccountsIcon(props: IconProps) {
  return <Icon as={FaAddressCard} {...props} />
}

export function AccountsOutlineIcon(props: IconProps) {
  return <Icon as={FaRegAddressCard} {...props} />
}

export function PlusIcon(props: IconProps) {
  return <Icon as={FiPlus} {...props} />
}

export function PendingIcon(props: IconProps) {
  return <Icon as={IoTimeOutline} {...props} />
}

export function CheckCircleIcon(props: IconProps) {
  return <Icon as={FaCheckCircle} {...props} />
}

export function UndoIcon(props: IconProps) {
  return <Icon as={FaUndo} {...props} />
}

export function ExecuteIcon(props: IconProps) {
  return <Icon as={FaPlayCircle} {...props} />
}

export function MinusCircleIcon(props: IconProps) {
  return <Icon as={FaMinusCircle} {...props} />
}
