export const validateAddressMessage =
  "Address should start with m and have a minimum of 50 characters"

export function validateAddress(val: string): true | string {
  return (
    (/^m[0-9a-z]*$/.test(val) && val.length >= 50) || validateAddressMessage
  )
}
