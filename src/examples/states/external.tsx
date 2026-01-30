import type React from "react"
import { useSyncExternalStore } from "react"

type State = { count: number }
let state: State = { count: 0 }

const listeners = new Set<() => void>()

const setState = (next: State) => {
  state = next
  listeners.forEach((listener) => listener())
}

const useExternalStore = () =>
  useSyncExternalStore<State>(
    (listener) => {
      listeners.add(listener)
      return () => listeners.delete(listener)
    },
    () => state,
  )

export const ExternalState: React.FC = () => {
  const state = useExternalStore()

  return (
    <div>
      <div>Count: {state.count}</div>
      <button onClick={() => setState({ count: state.count + 1 })}>
        Increment
      </button>
    </div>
  )
}
