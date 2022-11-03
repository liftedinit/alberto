import { Flex, CopyIcon, Icon, useClipboard, Tooltip } from "shared/components"
export function CopyToClipboard({
  toCopy,
  msg,
  iconProps = {},
  children,
  containerProps = {},
}: {
  toCopy: string
  msg?: string
  iconProps?: {}
  children?: React.ReactNode | (({ onCopy }: { onCopy: () => void }) => void)
  containerProps?: {}
}) {
  const { hasCopied, onCopy } = useClipboard(toCopy)
  return (
    <Tooltip isOpen={hasCopied} label={msg ?? "Copied to clipboard"}>
      {typeof children === "function" ? (
        children({ onCopy })
      ) : (
        <Flex {...containerProps}>
          {children}
          <Icon
            as={CopyIcon}
            boxSize={5}
            onClick={e => {
              e.stopPropagation()
              onCopy()
            }}
            cursor="pointer"
            aria-label="copy to clipboard button"
            {...iconProps}
          />
        </Flex>
      )}
    </Tooltip>
  )
}
