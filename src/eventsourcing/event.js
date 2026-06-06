export const Event = (type, version) => {
  const createBuilder = (payload = {}, headers = {}) => ({

    addPayload: (newPayload) => createBuilder({ ...payload, ...newPayload }, headers),
    
    addHeader: (newHeader) => createBuilder(payload, { ...headers, ...newHeader }),

    build: () => ({
      event: type,
      timestamp: (new Date()).getTime(),
      payload,
      meta: { schemaVersion: version, ...headers },
    })
  })

  return createBuilder()
}
