import {
  createContext,
  useContext,
  useEffect,
  useState,
  type PropsWithChildren,
} from "react"
import type React from "react"

type State = {
  countA: number
  countB: number
}

type Action = (state: State) => State

type Context = {
  getState: () => State
  dispatch: (action: Action) => void
  subscribe: (listener: () => void) => () => void
}

const StoreContext = createContext<Context>({} as Context)

// We can also use a completely external store and remove almost everything from the context
// And this is (almost) Zustand
const createStore = (initialState: State) => {
  let state = initialState
  const listeners = new Set<() => void>()

  return {
    getState: () => state,
    dispatch: (action: Action) => {
      state = action(state)
      listeners.forEach((listener) => listener())
    },
    subscribe: (listener: () => void) => {
      listeners.add(listener)
      return () => listeners.delete(listener)
    },
  }
}

// Here the provider is a simple pipe
const StoreProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [store] = useState(() => createStore({ countA: 0, countB: 0 }))

  return <StoreContext.Provider value={store}>{children}</StoreContext.Provider>
}

function useStore<T>(selector: (state: State) => T): T
function useStore(): Context
function useStore<T>(selector?: (state: State) => T) {
  const store = useContext(StoreContext)

  const [selected, setSelected] = useState(
    selector ? selector(store.getState()) : store,
  )

  useEffect(() => {
    if (!selector) return

    const check = () => {
      const next = selector(store.getState())
      if (next !== selected) {
        setSelected(next)
      }
    }

    const unsubscribe = store.subscribe(check)

    return unsubscribe
  }, [store, selector, selected])

  if (!selector) {
    return store
  }

  return selected
}

const CounterA: React.FC = () => {
  const countA = useStore((state) => state.countA)
  console.count("external store CounterA")

  return <div>Count A: {countA}</div>
}

const CounterB: React.FC = () => {
  const countB = useStore((state) => state.countB)
  console.count("external store CounterB")

  return <div>Count B: {countB}</div>
}

const Buttons: React.FC = () => {
  const { dispatch } = useStore()

  return (
    <div>
      <div>
        Count A
        <div className="button-group">
          <button
            onClick={() =>
              dispatch((state) => ({ ...state, countA: state.countA - 1 }))
            }
          >
            Decrement
          </button>
          <button
            onClick={() =>
              dispatch((state) => ({ ...state, countA: state.countA + 1 }))
            }
          >
            Increment
          </button>
        </div>
      </div>
      <div>
        Count B
        <div className="button-group">
          <button
            onClick={() =>
              dispatch((state) => ({ ...state, countA: state.countB - 1 }))
            }
          >
            Decrement
          </button>
          <button
            onClick={() =>
              dispatch((state) => ({ ...state, countA: state.countB + 1 }))
            }
          >
            Increment
          </button>
        </div>
      </div>
    </div>
  )
}

export const CreateStore: React.FC = () => (
  <StoreProvider>
    <CounterA />
    <CounterB />
    <Buttons />
  </StoreProvider>
)
