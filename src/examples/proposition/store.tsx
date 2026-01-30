import {
  createContext,
  useContext,
  useEffect,
  useRef,
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
  // We add a subscription to notify components directly
  subscribe: (listener: () => void) => () => void
}

const StoreContext = createContext<Context>({} as Context)

const StoreProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [state, setState] = useState<State>({
    countA: 0,
    countB: 0,
  })

  // Listeners added as ref to keep track of them across renders
  const listeners = useRef(new Set<() => void>())

  // Since any change in the provider would provoke a full render
  // We use a state that will never update
  const [store] = useState(() => ({
    getState: () => state,

    dispatch: (action: Action) => {
      setState((prev) => action(prev))
    },

    subscribe: (listener: () => void) => {
      listeners.current.add(listener)
      return () => {
        listeners.current.delete(listener)
      }
    },
  }))

  // Ok, so this one is a bit unorthodox
  // Here, we are simply telling to react "this is safe in my case"
  // By default, React can't know if this mutation is safe
  // But WE do, by design
  // It's kind of what react does in useSyncExternalStorage
  // eslint-disable-next-line react-hooks/immutability
  store.getState = () => state

  // Here we track state and notify listeners, instead of letting React do it
  useEffect(() => {
    listeners.current.forEach((listener) => listener())
  }, [state])

  return <StoreContext.Provider value={store}>{children}</StoreContext.Provider>
}

function useStore<T>(selector: (state: State) => T): T
function useStore(): Context
function useStore<T>(selector?: (state: State) => T) {
  const store = useContext(StoreContext)

  // Instead of returning store state, we create a local state
  const [selected, setSelected] = useState(
    selector ? selector(store.getState()) : store,
  )

  // Then, if selector is provided, we subscribe to changes
  useEffect(() => {
    // If no selector, we dont need to subscribe
    if (!selector) return

    // The listener will check for value changes
    // We update the local state ONLY if we have a change
    const check = () => {
      const next = selector(store.getState())
      if (next !== selected) {
        setSelected(next)
      }
    }

    // Then we subscribe to updates
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
  console.count("fine grained CounterA")

  return <div>Count A: {countA}</div>
}

const CounterB: React.FC = () => {
  const countB = useStore((state) => state.countB)
  console.count("fine grained CounterB")

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

export const Store: React.FC = () => (
  <StoreProvider>
    <CounterA />
    <CounterB />
    <Buttons />
  </StoreProvider>
)
