import {
  createContext,
  memo,
  useCallback,
  useContext,
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
}

const StoreContext = createContext<Context>({} as Context)

const StoreProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [state, setState] = useState<State>({
    countA: 0,
    countB: 0,
  })

  const dispatch = useCallback(
    (action: Action) => setState((prev) => action(prev)),
    [],
  )

  const getState = useCallback(() => state, [state])

  return (
    <StoreContext.Provider value={{ dispatch, getState }}>
      {children}
    </StoreContext.Provider>
  )
}

function useStore<T>(selector: (state: State) => T): T
function useStore(): Context
function useStore<T>(selector?: (state: State) => T) {
  const store = useContext(StoreContext)

  if (!selector) {
    return store
  }

  return selector(store.getState())
}

const CounterA: React.FC = memo(() => {
  const countA = useStore((state) => state.countA)
  console.count("memo CounterA")

  return <div>Count A: {countA}</div>
})

const CounterB: React.FC = memo(() => {
  const countB = useStore((state) => state.countB)
  console.count("memo CounterB")

  return <div>Count B: {countB}</div>
})

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

export const Memoized: React.FC = () => (
  <StoreProvider>
    <CounterA />
    <CounterB />
    <Buttons />
  </StoreProvider>
)
