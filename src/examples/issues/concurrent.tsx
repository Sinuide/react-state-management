/* eslint-disable react-hooks/purity */
import type React from "react"
import { startTransition } from "react"
import { atom, useAtomValue, useSetAtom } from "jotai"

const store = atom({
  counter: 0,
})

const Counter: React.FC = () => {
  const { counter } = useAtomValue(store)

  // Simulate heavy processing with the while loop
  const start = performance.now()
  // eslint-disable-next-line no-empty
  while (performance.now() - start < 20) {}

  return <div className={`colored-counter color-${counter % 5}`}>{counter}</div>
}

const Controller: React.FC = () => {
  const dispatch = useSetAtom(store)
  const add = () => {
    // startTransition makes rendering low priority
    // Allows interrupting
    startTransition(() => {
      dispatch((state) => ({
        counter: state.counter + 1,
      }))
    })
  }

  return <button onClick={add}>+1</button>
}

export const Concurrent: React.FC = () => (
  <div>
    <Controller />
    <div className="tearing-counters">
      {Array(15)
        .fill(0)
        .map((_, index) => (
          <Counter key={index} />
        ))}
    </div>
  </div>
)
