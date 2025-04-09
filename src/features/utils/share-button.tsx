import { Button, ButtonProps, CopyToClipboard, LinkIcon } from "@liftedinit/ui"

export function ShareLocationButton({
  path,
  label,
  ...props
}: ButtonProps & {
  path: string
  label: string
}) {
  return (
    <CopyToClipboard
      msg="Link copied!"
      toCopy={window.location.origin + `${path}`}
    >
      {({ onCopy }) => (
        <Button
          size="sm"
          variant="link"
          onClick={onCopy}
          leftIcon={<LinkIcon boxSize={4} />}
          {...props}
        >
          {label}
        </Button>
      )}
    </CopyToClipboard>
  )
}
