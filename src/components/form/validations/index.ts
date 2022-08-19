export const validateAddress = (val: string) => {
  return (
    (/^m[0-9a-z]*$/.test(val) && val.length >= 50) ||
    "Address should start with m and have a minimum of 50 characters"
  )
}
