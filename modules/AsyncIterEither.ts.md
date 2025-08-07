---
title: AsyncIterEither.ts
nav_order: 2
parent: Modules
---

## AsyncIterEither overview

```ts
interface AsyncIterEither<E, A> extends AsyncIter<Either<E, A>> {}
```

`AsyncIterEither<E, A>` represents an async iterator that yields values of
type `Either<E, A>`, where `E` represents the error type and `A` represents
the success type.

Added in v0.1.1

---

<h2 class="text-delta">Table of contents</h2>

- [Constructors](#constructors)
  - [left](#left)
  - [of](#of)
  - [right](#right)
  - [throwError](#throwerror)
- [Do notation](#do-notation)
  - [Do](#do)
  - [apS](#aps)
  - [bind](#bind)
  - [bindTo](#bindto)
- [Instances](#instances)
  - [Alt](#alt)
  - [Applicative](#applicative)
  - [Apply](#apply)
  - [Bifunctor](#bifunctor)
  - [Chain](#chain)
  - [FromEither](#fromeither)
  - [FromIO](#fromio)
  - [FromTask](#fromtask)
  - [Functor](#functor)
  - [Monad](#monad)
  - [MonadIO](#monadio)
  - [MonadTask](#monadtask)
  - [MonadThrow](#monadthrow)
  - [Pointed](#pointed)
- [Interop](#interop)
  - [tryCatch](#trycatch)
  - [tryCatchK](#trycatchk)
- [Legacy](#legacy)
  - [chainAsyncIterableK](#chainasynciterablek)
  - [chainEitherK](#chaineitherk)
  - [chainIterableK](#chainiterablek)
  - [chainTaskEitherK](#chaintaskeitherk)
  - [chainTaskK](#chaintaskk)
- [Model](#model)
  - [AsyncIterEither (type alias)](#asyncitereither-type-alias)
- [Type lambdas](#type-lambdas)
  - [URI](#uri)
  - [URI (type alias)](#uri-type-alias)
- [utils](#utils)
  - [alt](#alt)
  - [altW](#altw)
  - [ap](#ap)
  - [apW](#apw)
  - [chain](#chain)
  - [chainFirst](#chainfirst)
  - [chainFirstW](#chainfirstw)
  - [chainW](#chainw)
  - [concat](#concat)
  - [concatW](#concatw)
  - [empty](#empty)
  - [filter](#filter)
  - [filterMap](#filtermap)
  - [fold](#fold)
  - [fromAsyncIterable](#fromasynciterable)
  - [fromAsyncIterableK](#fromasynciterablek)
  - [fromEither](#fromeither)
  - [fromEitherK](#fromeitherk)
  - [fromIO](#fromio)
  - [fromIOK](#fromiok)
  - [fromIterable](#fromiterable)
  - [fromIterableK](#fromiterablek)
  - [fromTask](#fromtask)
  - [fromTaskEither](#fromtaskeither)
  - [fromTaskEitherK](#fromtaskeitherk)
  - [fromTaskK](#fromtaskk)
  - [map](#map)
  - [mapLeft](#mapleft)
  - [reduce](#reduce)
  - [toArray](#toarray)

---

# Constructors

## left

**Signature**

```ts
export declare const left: <E = never, A = never>(e: E) => AI.AsyncIter<E.Either<E, A>>
```

Added in v0.1.1

## of

**Signature**

```ts
export declare const of: <E = never, A = never>(...values: A[]) => AsyncIterEither<E, A>
```

Added in v0.1.1

## right

**Signature**

```ts
export declare const right: <E = never, A = never>(a: A) => AI.AsyncIter<E.Either<E, A>>
```

Added in v0.1.1

## throwError

**Signature**

```ts
export declare const throwError: <E, A>(e: E) => AsyncIterEither<E, A>
```

Added in v0.1.1

# Do notation

## Do

**Signature**

```ts
export declare const Do: AsyncIterEither<never, {}>
```

Added in v0.1.1

## apS

**Signature**

```ts
export declare const apS: <N, A, E, B>(
  name: Exclude<N, keyof A>,
  fb: AsyncIterEither<E, B>
) => (fa: AsyncIterEither<E, A>) => AsyncIterEither<E, { readonly [K in N | keyof A]: K extends keyof A ? A[K] : B }>
```

Added in v0.1.1

## bind

**Signature**

```ts
export declare const bind: <N, A, E, B>(
  name: Exclude<N, keyof A>,
  f: (a: A) => AsyncIterEither<E, B>
) => (ma: AsyncIterEither<E, A>) => AsyncIterEither<E, { readonly [K in N | keyof A]: K extends keyof A ? A[K] : B }>
```

Added in v0.1.1

## bindTo

**Signature**

```ts
export declare const bindTo: <N>(
  name: N
) => <E, A>(fa: AsyncIterEither<E, A>) => AsyncIterEither<E, { readonly [K in N]: A }>
```

Added in v0.1.1

# Instances

## Alt

**Signature**

```ts
export declare const Alt: Alt2<'AsyncIterEither'>
```

Added in v0.1.1

## Applicative

**Signature**

```ts
export declare const Applicative: Applicative2<'AsyncIterEither'>
```

Added in v0.1.1

## Apply

**Signature**

```ts
export declare const Apply: Apply2<'AsyncIterEither'>
```

Added in v0.1.1

## Bifunctor

**Signature**

```ts
export declare const Bifunctor: Bifunctor2<'AsyncIterEither'>
```

Added in v0.1.1

## Chain

**Signature**

```ts
export declare const Chain: Chain2<'AsyncIterEither'>
```

Added in v0.1.1

## FromEither

**Signature**

```ts
export declare const FromEither: FromEither2<'AsyncIterEither'>
```

Added in v0.1.1

## FromIO

**Signature**

```ts
export declare const FromIO: FromIO2<'AsyncIterEither'>
```

Added in v0.1.1

## FromTask

**Signature**

```ts
export declare const FromTask: FromTask2<'AsyncIterEither'>
```

Added in v0.1.1

## Functor

**Signature**

```ts
export declare const Functor: Functor2<'AsyncIterEither'>
```

Added in v0.1.1

## Monad

**Signature**

```ts
export declare const Monad: Monad2<'AsyncIterEither'>
```

Added in v0.1.1

## MonadIO

**Signature**

```ts
export declare const MonadIO: MonadIO2<'AsyncIterEither'>
```

Added in v0.1.1

## MonadTask

**Signature**

```ts
export declare const MonadTask: MonadTask2<'AsyncIterEither'>
```

Added in v0.1.1

## MonadThrow

**Signature**

```ts
export declare const MonadThrow: MonadThrow2<'AsyncIterEither'>
```

Added in v0.1.1

## Pointed

**Signature**

```ts
export declare const Pointed: Pointed2<'AsyncIterEither'>
```

Added in v0.1.1

# Interop

## tryCatch

**Signature**

```ts
export declare const tryCatch: <E, A>(
  f: Lazy<AsyncIterable<A>>,
  onRejected: (reason: unknown) => E
) => AsyncIterEither<E, A>
```

Added in v0.1.1

## tryCatchK

**Signature**

```ts
export declare const tryCatchK: <E, A extends readonly unknown[], B>(
  f: (...a: A) => AsyncIterable<B>,
  onRejected: (reason: unknown) => E
) => (...a: A) => AsyncIterEither<E, B>
```

Added in v0.1.1

# Legacy

## chainAsyncIterableK

**Signature**

```ts
export declare const chainAsyncIterableK: <E, A, B>(
  f: (a: A) => AsyncIterable<B>
) => (iter: AsyncIterEither<E, A>) => AsyncIterEither<E, B>
```

Added in v0.1.1

## chainEitherK

**Signature**

```ts
export declare const chainEitherK: <E, A, B>(
  f: (a: A) => E.Either<E, B>
) => (iter: AsyncIterEither<E, A>) => AsyncIterEither<E, B>
```

Added in v0.1.1

## chainIterableK

**Signature**

```ts
export declare const chainIterableK: <A, B>(
  f: (a: A) => Iterable<B>
) => <E>(iter: AsyncIterEither<E, A>) => AsyncIterEither<E, B>
```

Added in v0.1.1

## chainTaskEitherK

**Signature**

```ts
export declare const chainTaskEitherK: <E, A, B>(
  f: (a: A) => TaskEither<E, B>
) => (iter: AsyncIterEither<E, A>) => AsyncIterEither<E, B>
```

Added in v0.1.1

## chainTaskK

**Signature**

```ts
export declare const chainTaskK: <E, A, B>(
  f: (a: A) => T.Task<B>
) => (iter: AsyncIterEither<E, A>) => AsyncIterEither<E, B>
```

Added in v0.1.1

# Model

## AsyncIterEither (type alias)

**Signature**

```ts
export type AsyncIterEither<E, A> = AsyncIter<Either<E, A>>
```

Added in v0.1.1

# Type lambdas

## URI

**Signature**

```ts
export declare const URI: 'AsyncIterEither'
```

Added in v0.1.1

## URI (type alias)

**Signature**

```ts
export type URI = typeof URI
```

Added in v0.1.1

# utils

## alt

**Signature**

```ts
export declare const alt: <E, A>(
  that: Lazy<AsyncIterEither<E, A>>
) => (fa: AsyncIterEither<E, A>) => AsyncIterEither<E, A>
```

Added in v0.1.1

## altW

**Signature**

```ts
export declare const altW: <E2, B>(
  that: Lazy<AsyncIterEither<E2, B>>
) => <E1, A>(fa: AsyncIterEither<E1, A>) => AsyncIterEither<E2, B | A>
```

Added in v0.1.1

## ap

**Signature**

```ts
export declare const ap: <E, A>(
  fa: AsyncIterEither<E, A>
) => <B>(fab: AsyncIterEither<E, (a: A) => B>) => AsyncIterEither<E, B>
```

Added in v0.1.1

## apW

**Signature**

```ts
export declare const apW: <D, A>(
  fa: AsyncIterEither<D, A>
) => <E, B>(fab: AsyncIterEither<E, (a: A) => B>) => AsyncIterEither<D | E, B>
```

Added in v0.1.1

## chain

**Signature**

```ts
export declare const chain: <E, A, B>(
  cb: (item: A) => AsyncIterEither<E, B>
) => (iter: AsyncIterEither<E, A>) => AsyncIterEither<E, B>
```

Added in v0.1.1

## chainFirst

**Signature**

```ts
export declare const chainFirst: <A, E, B>(
  f: (a: A) => AsyncIterEither<E, B>
) => (ma: AsyncIterEither<E, A>) => AsyncIterEither<E, A>
```

Added in v0.1.1

## chainFirstW

**Signature**

```ts
export declare const chainFirstW: <A, D, B>(
  f: (a: A) => AsyncIterEither<D, B>
) => <E>(ma: AsyncIterEither<E, A>) => AsyncIterEither<D | E, A>
```

Added in v0.1.1

## chainW

**Signature**

```ts
export declare const chainW: <E, A, B>(
  f: (a: A) => AsyncIterEither<E, B>
) => <D>(fa: AsyncIterEither<D, A>) => AsyncIterEither<E | D, B>
```

Added in v0.1.1

## concat

**Signature**

```ts
export declare const concat: <E, A>(
  second: AsyncIterEither<E, A>
) => (first: AsyncIterEither<E, A>) => AsyncIterEither<E, A>
```

Added in v0.1.1

## concatW

**Signature**

```ts
export declare const concatW: <D, B>(
  second: AsyncIterEither<D, B>
) => <E, A>(first: AsyncIterEither<E, A>) => AsyncIterEither<D | E, B | A>
```

Added in v0.1.1

## empty

**Signature**

```ts
export declare const empty: AsyncIterEither<never, never>
```

Added in v0.1.1

## filter

**Signature**

```ts
export declare const filter: {
  <E, A, B extends A>(refinement: Refinement<A, B>): (fa: AsyncIterEither<E, A>) => AsyncIterEither<E, B>
  <E, A>(predicate: Predicate<A>): (fa: AsyncIterEither<E, A>) => AsyncIterEither<E, A>
}
```

Added in v0.1.1

## filterMap

**Signature**

```ts
export declare const filterMap: <E, A, B>(
  f: (a: A) => O.Option<B>
) => (fa: AsyncIterEither<E, A>) => AsyncIterEither<E, B>
```

Added in v0.1.1

## fold

**Signature**

```ts
export declare const fold: <E, A, B>(
  onLeft: (e: E) => AI.AsyncIter<B>,
  onRight: (a: A) => AI.AsyncIter<B>
) => (ma: AsyncIterEither<E, A>) => AI.AsyncIter<B>
```

Added in v0.1.1

## fromAsyncIterable

**Signature**

```ts
export declare const fromAsyncIterable: <E = never, A = never>(iter: AsyncIterable<A>) => AsyncIterEither<E, A>
```

Added in v0.1.1

## fromAsyncIterableK

**Signature**

```ts
export declare const fromAsyncIterableK: <E, A extends readonly unknown[], B>(
  f: (...a: A) => AsyncIterable<B>
) => (...a: A) => AsyncIterEither<E, B>
```

Added in v0.1.1

## fromEither

**Signature**

```ts
export declare const fromEither: <E, A>(task: E.Either<E, A>) => AsyncIterEither<E, A>
```

Added in v0.1.1

## fromEitherK

**Signature**

```ts
export declare const fromEitherK: <E, A extends readonly unknown[], B>(
  f: (...a: A) => E.Either<E, B>
) => (...a: A) => AsyncIterEither<E, B>
```

Added in v0.1.1

## fromIO

**Signature**

```ts
export declare const fromIO: <E, A>(task: IO<A>) => AsyncIterEither<E, A>
```

Added in v0.1.1

## fromIOK

**Signature**

```ts
export declare const fromIOK: <E, A extends readonly unknown[], B>(
  f: (...a: A) => IO<B>
) => (...a: A) => AsyncIterEither<E, B>
```

Added in v0.1.1

## fromIterable

**Signature**

```ts
export declare const fromIterable: <E = never, A = unknown>(iter: Iterable<A>) => AsyncIterEither<E, A>
```

Added in v0.1.1

## fromIterableK

**Signature**

```ts
export declare const fromIterableK: <E, A extends readonly unknown[], B>(
  f: (...a: A) => Iterable<B>
) => (...a: A) => AsyncIterEither<E, B>
```

Added in v0.1.1

## fromTask

**Signature**

```ts
export declare const fromTask: <E, A>(task: T.Task<A>) => AsyncIterEither<E, A>
```

Added in v0.1.1

## fromTaskEither

**Signature**

```ts
export declare const fromTaskEither: <E, A>(task: TaskEither<E, A>) => AsyncIterEither<E, A>
```

Added in v0.1.1

## fromTaskEitherK

**Signature**

```ts
export declare const fromTaskEitherK: <E, A extends readonly unknown[], B>(
  f: (...a: A) => TaskEither<E, B>
) => (...a: A) => AsyncIterEither<E, B>
```

Added in v0.1.1

## fromTaskK

**Signature**

```ts
export declare const fromTaskK: <E, A extends readonly unknown[], B>(
  f: (...a: A) => T.Task<B>
) => (...a: A) => AsyncIterEither<E, B>
```

Added in v0.1.1

## map

**Signature**

```ts
export declare const map: <E, A, B>(f: (a: A) => B) => (iter: AsyncIterEither<E, A>) => AsyncIterEither<E, B>
```

Added in v0.1.1

## mapLeft

**Signature**

```ts
export declare const mapLeft: <E, G, A>(f: (a: E) => G) => (iter: AsyncIterEither<E, A>) => AsyncIterEither<G, A>
```

Added in v0.1.1

## reduce

**Signature**

```ts
export declare const reduce: <E, A, B>(b: B, f: (b: B, a: A) => B) => (iter: AsyncIterEither<E, A>) => TaskEither<E, B>
```

Added in v0.1.1

## toArray

**Signature**

```ts
export declare const toArray: <E, A>(iter: AsyncIterEither<E, A>) => TaskEither<E, A[]>
```

Added in v0.1.1
