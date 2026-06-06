export function ensure(target, targetName) {
  return {
    hasFunction: (name) => {
      const match = typeof target[name] === "function"

      if (!match)
        throw new Error(`Dependency Injection error: ${targetName} expected to support '${name}' function`)
    }
  }
}

export default { ensure }