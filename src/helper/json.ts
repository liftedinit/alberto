export function replacer(key: string, value: any) {
  if (value instanceof Map) {
    return {
      dataType: "Map",
      value: Array.from(value.entries()),
    }
  }
  return value
}

export function reviver(key: string, value: any) {
  if (typeof value === "object" && value !== null) {
    if (value.dataType === "Map") {
      return new Map(value.value)
    } else if (
      value instanceof Object &&
      value.type === "Buffer" &&
      value.data
    ) {
      return Buffer.from(value.data)
    }
  }
  return value
}
