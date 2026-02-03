---
marp: true
theme: default
paginate: true
class: invert
---

# React Advanced State Management

---

## Sommaire

- Hypothèse de solution
- Problèmes classiques
- Catégories d'état
- Ce que React attends
- Concepts importants des stores
- Proposition finale

---

## Hypothèse de solution

En utilisant les briques disponibles si possible

```
selector -> store (useContext) -> reducer (useReducer)
```

---

## Problèmes classiques

- Re-renders inutiles
- Props drilling
- Couplage composants
- Partage état
- Partage logique

➡ Stores

---

### Re-renders inutiles

```
Context (a, b)
-> ComponentA (a)
-> ComponentB (b)

- Update b

=> render ComponentA
=> render ComponentB
```

---

### Props drilling

```
Component (a, b, c) // use a
  -> Child (b, c) // use b
    -> Grandchild (c) // use c
```

---

### Couplage des composants

```
Component (a, b, c) // define a, b and c
  -> Container (b, c) // use none
    -> Child (b, c) // use b and c
```

---

### Partage d'état

```
Parent (count, setCount) // define state
-> ChildA (count, setCount) // use state
-> ChildB (count, setCount) // use state
```

---

### Partage de logique

```
Parent (count, setCount) // define state
-> ChildA (increment) // define increment
-> ChildB (increment) // define another increment
```

> L'exemple n'est pas très explicite, mais donne l'idée générale

---

## Catégories d'état

- **Local** → `useState`
- **Dérivé** → `useMemo`
- **Partagé** → `useContext`
- **Externe** → `useSyncExternalStore`

---

### Etat local

```
Component
  [state, setState] = useState
```

---

### Etat dérivé

```
Component (state)
  derived = useMemo(state)
```

---

### Etat partagé

```
Context
  [state] = useState

Component
  state = useContext
```

---

### Etat externe

```
listeners
externalState

Component
  state = useSyncExternalStore(listeners, externalState)
```

> Cet exemple présente l'idée générale. Un cas bien plus concret est disponible dans les exemples.

---

## Ce que React attend

- Immutabilité / stabilité référentielle
- Prévisibilité
- Cohérence pendant le render (snapshot)
- Nouveautés du Concurrent Rendering

---

### Immutabilité / stabilité référentielle

```
Component
  [state, setState]

state === state

setState(newState)
```

> On ne change pas directement la valeur d'un état.

---

### Prévisibilité

```
Component (props)

Component (a) === Component (a)
Component (b) === Component (b)
```

> React attends des fonctions pures. Il conserve l'information des hooks internes (rule of hooks) qui sont assimilables a des props à cet effet.

---

### Cohérence pendant le render

```
Component
  [state, setState]

setState(newState)
=> render -> Snapshot (state)

--------render------->
   state === state
```

> Un état ne doit pas changer au cours d'un render.

---

### Concurrent Rendering (React 18)

###### _React comme contrainte, pas comme feature_

Le concurrent rendering à pour objectif de permettre à React d'interrompre, reporter, ou paralléliser des renders pour optimiser la réactivité.

- Concurrent rendering  
  → **Time slicing** (mécanisme central)

> Le Time Slicing divise le rendu en unités de travail (`Fiber`) avec un temps aloué. Si le traitement est trop long, le reste est suspendu (`Suspense`).
> Des tâches peuvent être indiquées comme basse priorité et interruptibles (`useTransition`).

---

### Conséquences du Time Slicing

- Interrupt render
- Branch state
- Tearing (temp/final)

---

#### Interrupt render

```
Component
  Suspense fallback=Skeleton
    HeavyChild

=> update

--------render------->
Skeleton -> HeavyChild
```

---

#### Branch state

```
Component
  [state]
  HeavyChildA (state)
  HeavyChildB (state)

=> update state (1 -> 2)

-> render interrompu après HeavyChildA
HeavyChildA (2) - branch state
HeavyChildB (1) - main state encore visible
```

> React attendras le rendu complet avant de l'appliquer au DOM. Pas de tearing visible à l'utilisateur si tout se passe bien.

---

#### Tearing

```
Component
  [state]
  HeavyChildA (state)
  HeavyChildB (state)

=> update state (1 -> 2)

-------------render------------->
HeavyChildA (1)
--------HeavyChildA (2)
HeavyChildB (1)
--------------------HeavyChildB(2)
```

> Comme pour le branch state, React évitera d'afficher le tearing à l'utilisateur en s'assurant de ne commiter que des branches complètes.

---

## Concepts importants des stores

- Unit testing
- Timewalking
- Fine-grained
- Éphémère vs Persistant
- Synchronisation

> Le timewalking est un sujet à part entière, qu'on verra peut être une autre fois.

---

### Fine-grained

```
Store (a, b)

App
  ComponentA (Store.a)
  ComponentB (Store.b)

=> update Store.a

-> render ComponentA uniquement
```

---

### Éphémère vs Persistant

**Qui contrôle le cycle de vie de l'état ?** (ownership vs source of truth)

- **Éphémère** : contrôlé par l'arbre React → ❤️ React 18
- **Persistant** : source externe (hors contrôle du render) → ⚠️ Tearing

➡ useSyncExternalStore pour donner le contrôle à React

---

### Synchronisation en arrière-plan

- Storage → store
- UI → store → async storage
- Jamais storage → UI → storage

➡ Adapter pour persistence

---

### Objectif des stores

L'objectif n'est **pas la persistance**, mais **l'encapsulation dans un état éphémère**.

---

## Solution finale

Avant

```
selector -> store (useContext) -> reducer (useReducer)
```

Après

```
selector -> provider (useContext) -> subscribe -> store (external) -> reducer (action)
```

> Si context + selector suffisait, les librairies de gestion d'état n'existeraient pas.  
> Le vrai problème est **la propagation des changements d'état**, pas l'état lui-même.

---

## Ressources & Inspirations

- [Rule of Hooks](https://react.dev/reference/rules/rules-of-hooks)
- [Concurrent React](https://react.dev/blog/2022/03/29/react-v18#what-is-concurrent-react)
- [useSyncExternalStore](https://react.dev/reference/react/useSyncExternalStore)
- [Will this React global state work in concurrent rendering](https://github.com/dai-shi/will-this-react-global-state-work-in-concurrent-rendering)
- [Pourquoi `useSyncExternalStore` n’est pas utilisé dans Jotai](https://blog.axlight.com/posts/why-use-sync-external-store-is-not-used-in-jotai/)
- [Axlight Blog](https://blog.axlight.com/) → Zustand, Jotai, Valtio 🤯
