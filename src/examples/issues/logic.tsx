import type React from "react"
import { useState } from "react"

const CompA: React.FC = () => {
  const [count, setCount] = useState<number>(0)

  return (
    <div>
      <div>Count A: {count}</div>
      <button onClick={() => setCount((prev) => prev + 1)}>Increment</button>
    </div>
  )
}

const CompB: React.FC = () => {
  const [count, setCount] = useState<number>(10)

  return (
    <div>
      <div>Count B: {count}</div>
      <button onClick={() => setCount((prev) => prev + 1)}>Increment</button>
    </div>
  )
}

export const Logic: React.FC = () => (
  <div>
    <CompA />
    <CompB />
  </div>
)
