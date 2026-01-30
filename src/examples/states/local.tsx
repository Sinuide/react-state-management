import type React from "react"
import { useState } from "react"

export const LocalState: React.FC = () => {
  const [count, setCount] = useState<number>(0)

  return (
    <div>
      <div>Count: {count}</div>
      <button onClick={() => setCount((prev) => prev + 1)}>Increment</button>
    </div>
  )
}
