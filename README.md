# React State Management

Mettre des exemples codes

Hypothèse de solution : reducer (useReducer) -> store (useContext) -> selector

Problèmes classiques :

- re renders inutiles
- props drilling
- couplage composants
- partage logique
- partage etat

-> Stores (~context)

Les catégories états :

- local (useState)
- dérivé (useMemo)
- partagé (useContext)
- externe (useSyncExternalStore)

Ce que React attends :

- Immutabilité / Stabilité référentielle
- Prévisibilité
- Cohérence pendant le render (snapshot)

Concurrent rendering (React 18) aka React comme contrainte, pas comme feature :

ℹ️ Le but du concurrent rendering est de permettre à React d'interrompre, reporter, ou paralléliser des renders pour optimiser la réactivité de l'interface.

- concurrent rendering (React fibers)
  -> time slicing (mécanisme central)

Conséquences du time slicing :
-> interrupt render
-> branch state
-> tearing (temp/final)

Concepts importants des stores :

- unit testing
- timewalking
- fine grained

Ephemere vs persistent -> Qui contrôle le cycle de vie de l'état ? (ownership, source of truth)

- ephemere : controllé par l'arbre React -> ❤️ React 18
- persistent : source externe (hors du contrôle du render de react) -> ⚠️ tearing

-> synchronisation en arrière plan

- storage -> store
- ui -> store -> async storage
- jamais storage -> ui -> storage

-> store + adapter pour persistence

L'objectif des stores n'est pas la persistence, mais de l'encapsuler dans un état éphémère.

Solution finale : reducer (useReducer) -> store (useContext) -> subscribe (fine-grained ici !) -> selector

Si context + selector suffisait, Zustand n'existerait pas.  
Le vrai problème est la propagation des changements d'état, pas l'état lui même.

https://github.com/dai-shi/will-this-react-global-state-work-in-concurrent-rendering

Sources et inspirations :

- https://blog.axlight.com/ -> zustand, jotai, valtio 🤯
- https://blog.axlight.com/posts/why-use-sync-external-store-is-not-used-in-jotai/
