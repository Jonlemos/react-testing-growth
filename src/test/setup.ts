import '@testing-library/jest-dom'

const buildLocalStorageMock = () => {
  const store = new Map<string, string>()

  const methods = {
    getItem: (key: string) => store.get(key) ?? null,
    setItem: (key: string, value: string) => { store.set(key, value) },
    removeItem: (key: string) => { store.delete(key) },
    clear: () => { store.clear() },
    key: (index: number) => [...store.keys()][index] ?? null,
    get length() { return store.size },
  }

  return new Proxy(methods, {
    ownKeys: () => [...store.keys()],
    getOwnPropertyDescriptor: (_target, key) => {
      if (store.has(key as string)) {
        return { value: store.get(key as string), enumerable: true, configurable: true, writable: true }
      }
      return Reflect.getOwnPropertyDescriptor(_target, key)
    },
  })
}

Object.defineProperty(window, 'localStorage', {
  value: buildLocalStorageMock(),
  writable: true,
})
