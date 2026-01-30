import React, { useState } from "react"

import { CodeBlock } from "./CodeBlock"

import { LocalState } from "./examples/states/local"
import { DerivedState } from "./examples/states/derived"
import { SharedState } from "./examples/states/shared"
import { ExternalState } from "./examples/states/external"
import { Rerenders } from "./examples/issues/rerenders"
import { PropsDrilling } from "./examples/issues/props-drilling"
import { Coupling } from "./examples/issues/coupling"
import { Logic } from "./examples/issues/logic"
import { SharedState as SharedStateIssue } from "./examples/issues/shared-state"
import { Concurrent } from "./examples/issues/concurrent"
import { Store } from "./examples/proposition/store"
import { InitialHypothesis } from "./examples/proposition/store-without-fine-grained"
import { CreateStore } from "./examples/proposition/create-store"
import { Memoized } from "./examples/proposition/memo"

import localCode from "./examples/states/local?raw"
import derivedCode from "./examples/states/derived?raw"
import sharedCode from "./examples/states/shared?raw"
import externalCode from "./examples/states/external?raw"
import rerendersCode from "./examples/issues/rerenders?raw"
import propsDrillingCode from "./examples/issues/props-drilling?raw"
import couplingCode from "./examples/issues/coupling?raw"
import logicCode from "./examples/issues/logic?raw"
import sharedStateCode from "./examples/issues/shared-state?raw"
import concurrentCode from "./examples/issues/concurrent?raw"
import storeCode from "./examples/proposition/store?raw"
import hypothesisCode from "./examples/proposition/store-without-fine-grained?raw"
import createStoreCode from "./examples/proposition/create-store?raw"
import memoCode from "./examples/proposition/memo?raw"

const examples = {
  local: LocalState,
  derived: DerivedState,
  shared: SharedState,
  external: ExternalState,
  rerenders: Rerenders,
  "props drilling": PropsDrilling,
  coupling: Coupling,
  logic: Logic,
  "shared state": SharedStateIssue,
  concurrent: Concurrent,
  hypothesis: InitialHypothesis,
  memo: Memoized,
  proposition: Store,
  "create store": CreateStore,
}

const raws: Record<keyof typeof examples, string> = {
  local: localCode,
  derived: derivedCode,
  shared: sharedCode,
  external: externalCode,
  rerenders: rerendersCode,
  "props drilling": propsDrillingCode,
  coupling: couplingCode,
  logic: logicCode,
  "shared state": sharedStateCode,
  concurrent: concurrentCode,
  hypothesis: hypothesisCode,
  memo: memoCode,
  proposition: storeCode,
  "create store": createStoreCode,
}

type Keys = keyof typeof examples

const App: React.FC = () => {
  const [example, setExample] = useState<Keys | undefined>()

  const Component = example ? examples[example] : null

  return (
    <div className="samples">
      <div className="list">
        {Object.keys(examples).map((key) => (
          <div
            className={`option ${example === key ? "active" : ""}`}
            key={key}
            onClick={() => setExample(key as Keys)}
          >
            {key}
          </div>
        ))}
      </div>
      {Component && (
        <div className="displayed">
          <Component />
        </div>
      )}
      {example && raws[example] && <CodeBlock code={raws[example]} />}
    </div>
  )
}

export default App
