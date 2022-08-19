export const validateAddress = (val: string) => {
  console.log({ formatVal: val })
  return (
    (/^m[0-9a-z]*$/.test(val) && val.length === 50) ||
    "Address should start with m and be 50 characters long"
  )
}
