import { AiOutlineCopy } from "react-icons/ai"
import { Flex, Icon, useClipboard, Tooltip } from "components"
export function CopyToClipboard({
  toCopy,
  msg,
  iconProps = {},
  children,
}: {
  toCopy: string
  msg?: string
  iconProps?: {}
  children?: React.ReactNode
}) {
  const { hasCopied, onCopy } = useClipboard(toCopy)
  return (
    <Tooltip isOpen={hasCopied} label={msg ?? "Copied to clipboard"}>
      {typeof children === "function" ? (
        children({ onCopy })
      ) : (
        <Flex>
          <Icon
            as={AiOutlineCopy}
            w={5}
            h={5}
            onClick={onCopy}
            cursor="pointer"
            aria-label="copy to clipboard button"
            {...iconProps}
          />
        </Flex>
      )}
    </Tooltip>
  )
}
