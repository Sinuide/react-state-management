import React, {
  createContext,
  useContext,
  useState,
  type Dispatch,
  type PropsWithChildren,
  type SetStateAction,
} from "react"

type Context = {
  a: number
  setA: Dispatch<SetStateAction<number>>
  b: number
  setB: Dispatch<SetStateAction<number>>
}

const StoreContext = createContext<Context>({} as Context)

const StoreProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [a, setA] = useState<number>(0)
  const [b, setB] = useState<number>(0)

  return (
    <StoreContext.Provider value={{ a, setA, b, setB }}>
      {children}
    </StoreContext.Provider>
  )
}

const A: React.FC = () => {
  const { a, setA } = useContext(StoreContext)
  console.count("render A")
  // Notice how A is re rendered even when only updating 'b'

  return (
    <div>
      <div>Value 'a': {a}</div>
      <button onClick={() => setA((prev) => prev + 1)}>Increment a</button>
    </div>
  )
}

const B: React.FC = () => {
  const { b, setB } = useContext(StoreContext)
  console.count("render B")
  // Same here

  return (
    <div>
      <div>Value 'b': {b}</div>
      <button onClick={() => setB((prev) => prev + 1)}>Increment b</button>
    </div>
  )
}

export const SharedState: React.FC = () => (
  <StoreProvider>
    <div>
      <A />
      <B />
    </div>
  </StoreProvider>
)
