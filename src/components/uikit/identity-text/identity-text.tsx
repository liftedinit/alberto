import { Text } from "components"
import { makeShortId } from "helper/common"

export function IdentityText({ fullIdentity }: { fullIdentity: string }) {
  return (
    <Text
      onCopy={e => {
        e.clipboardData.setData("text/plain", fullIdentity)
        e.preventDefault()
      }}
    >
      {makeShortId(fullIdentity)}
    </Text>
  )
}
