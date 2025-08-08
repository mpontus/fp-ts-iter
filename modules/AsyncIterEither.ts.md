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

- [Alt](#alt)
  - [alt](#alt)
  - [altW](#altw)
- [Apply](#apply)
  - [ap](#ap)
  - [apW](#apw)
- [Combinators](#combinators)
  - [chainFirst](#chainfirst)
  - [chainFirstW](#chainfirstw)
  - [concat](#concat)
  - [concatW](#concatw)
- [Constructors](#constructors)
  - [empty](#empty)
  - [fromAsyncIterable](#fromasynciterable)
  - [fromIterable](#fromiterable)
  - [left](#left)
  - [of](#of)
  - [right](#right)
  - [throwError](#throwerror)
- [Conversions](#conversions)
  - [fromEither](#fromeither)
  - [fromIO](#fromio)
  - [fromTask](#fromtask)
  - [fromTaskEither](#fromtaskeither)
  - [reduce](#reduce)
  - [toArray](#toarray)
- [Do notation](#do-notation)
  - [Do](#do)
  - [apS](#aps)
  - [bind](#bind)
  - [bindTo](#bindto)
- [Error handling](#error-handling)
  - [mapLeft](#mapleft)
- [Filterable](#filterable)
  - [filter](#filter)
  - [filterMap](#filtermap)
- [Functor](#functor)
  - [map](#map)
- [Instances](#instances)
  - [Alt](#alt-1)
  - [Applicative](#applicative)
  - [Apply](#apply-1)
  - [Bifunctor](#bifunctor)
  - [Chain](#chain)
  - [FromEither](#fromeither)
  - [FromIO](#fromio)
  - [FromTask](#fromtask)
  - [Functor](#functor-1)
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
- [Lifting](#lifting)
  - [fromAsyncIterableK](#fromasynciterablek)
  - [fromEitherK](#fromeitherk)
  - [fromIOK](#fromiok)
  - [fromIterableK](#fromiterablek)
  - [fromTaskEitherK](#fromtaskeitherk)
  - [fromTaskK](#fromtaskk)
- [Model](#model)
  - [AsyncIterEither (type alias)](#asyncitereither-type-alias)
- [Monad](#monad-1)
  - [chain](#chain)
  - [chainW](#chainw)
- [Pattern matching](#pattern-matching)
  - [fold](#fold)
- [Type lambdas](#type-lambdas)
  - [URI](#uri)
  - [URI (type alias)](#uri-type-alias)

---

# Alt

## alt

Returns an `AsyncIterEither` that yields elements of the first
`AsyncIterEither` followed by the elements of the second `AsyncIterEither`.

**Signature**

```ts
export declare const alt: <E, A>(
  that: Lazy<AsyncIterEither<E, A>>
) => (fa: AsyncIterEither<E, A>) => AsyncIterEither<E, A>
```

Added in v0.1.1

## altW

Returns an `AsyncIterEither` that yields elements of the first
`AsyncIterEither` followed by the elements of the second `AsyncIterEither`.

**Signature**

```ts
export declare const altW: <E2, B>(
  that: Lazy<AsyncIterEither<E2, B>>
) => <E1, A>(fa: AsyncIterEither<E1, A>) => AsyncIterEither<E2, B | A>
```

Added in v0.1.1

# Apply

## ap

Returns an `AsyncIterEither` that yields the result of applying each function
in the first `AsyncIterEither` to the elements of the second `AsyncIterEither`.

**Signature**

```ts
export declare const ap: <E, A>(
  fa: AsyncIterEither<E, A>
) => <B>(fab: AsyncIterEither<E, (a: A) => B>) => AsyncIterEither<E, B>
```

Added in v0.1.1

## apW

Returns an `AsyncIterEither` that yields the result of applying each function
in the first `AsyncIterEither` to the elements of the second `AsyncIterEither`.

**Signature**

```ts
export declare const apW: <D, A>(
  fa: AsyncIterEither<D, A>
) => <E, B>(fab: AsyncIterEither<E, (a: A) => B>) => AsyncIterEither<D | E, B>
```

Added in v0.1.1

# Combinators

## chainFirst

Composes computations in sequence, using the return value of one computation
to determine the next computation and keeping only the result of the first.

**Signature**

```ts
export declare const chainFirst: <A, E, B>(
  f: (a: A) => AsyncIterEither<E, B>
) => (ma: AsyncIterEither<E, A>) => AsyncIterEither<E, A>
```

Added in v0.1.1

## chainFirstW

Composes computations in sequence, using the return value of one computation
to determine the next computation and keeping only the result of the first.

**Signature**

```ts
export declare const chainFirstW: <A, D, B>(
  f: (a: A) => AsyncIterEither<D, B>
) => <E>(ma: AsyncIterEither<E, A>) => AsyncIterEither<D | E, A>
```

Added in v0.1.1

## concat

Returns an `AsyncIterEither` that combines the values of both provided
`AsyncIterEither`s.

**Signature**

```ts
export declare const concat: <E, A>(
  second: AsyncIterEither<E, A>
) => (first: AsyncIterEither<E, A>) => AsyncIterEither<E, A>
```

Added in v0.1.1

## concatW

Returns an `AsyncIterEither` that combines the values of both provided
`AsyncIterEither`s.

**Signature**

```ts
export declare const concatW: <D, B>(
  second: AsyncIterEither<D, B>
) => <E, A>(first: AsyncIterEither<E, A>) => AsyncIterEither<D | E, B | A>
```

Added in v0.1.1

# Constructors

## empty

An empty `AsyncIterEither`.

**Signature**

```ts
export declare const empty: AsyncIterEither<never, never>
```

Added in v0.1.1

## fromAsyncIterable

Returns an `AsyncIterEither` that yields the elements of the provided
`AsyncIterable` as Right values.

**Signature**

```ts
export declare const fromAsyncIterable: <E = never, A = never>(iter: AsyncIterable<A>) => AsyncIterEither<E, A>
```

Added in v0.1.1

## fromIterable

Returns an `AsyncIterEither` that yields the elements of the provided
`Iterable` as Right values.

**Signature**

```ts
export declare const fromIterable: <E = never, A = unknown>(iter: Iterable<A>) => AsyncIterEither<E, A>
```

**Example**

```ts
import { pipe } from 'fp-ts/lib/function'
import * as AIE from 'fp-ts-iter/AsyncIterEither'
import * as E from 'fp-ts/Either'

async function test() {
  assert.deepStrictEqual(await pipe(AIE.fromIterable(['a', 'b', 'c']), AIE.toArray)(), E.right(['a', 'b', 'c']))
}

test()
```

Added in v0.1.1

## left

Returns an `AsyncIterEither` containing only the provided error value.

**Signature**

```ts
export declare const left: <E = never, A = never>(e: E) => AI.AsyncIter<E.Either<E, A>>
```

Added in v0.1.1

## of

Returns an `AsyncIterEither` containing the provided success values.

**Signature**

```ts
export declare const of: <E = never, A = never>(...values: A[]) => AsyncIterEither<E, A>
```

Added in v0.1.1

## right

Returns an `AsyncIterEither` containing only the provided success value.

**Signature**

```ts
export declare const right: <E = never, A = never>(a: A) => AI.AsyncIter<E.Either<E, A>>
```

Added in v0.1.1

## throwError

Returns an `AsyncIterEither` containing only the provided error value.

**Signature**

```ts
export declare const throwError: <E, A>(e: E) => AsyncIterEither<E, A>
```

Added in v0.1.1

# Conversions

## fromEither

Provides a way to create an `AsyncIterEither` from a `Either`.

**Signature**

```ts
export declare const fromEither: <E, A>(fa: E.Either<E, A>) => AsyncIterEither<E, A>
```

Added in v0.1.1

## fromIO

Returns an `AsyncIterEither` which yields the result of the `IO` execution.

**Signature**

```ts
export declare const fromIO: <E, A>(fa: IO<A>) => AsyncIterEither<E, A>
```

Added in v0.1.1

## fromTask

Returns an `AsyncIterEither` which yields the result of the `Task` execution.

**Signature**

```ts
export declare const fromTask: <E, A>(task: T.Task<A>) => AsyncIterEither<E, A>
```

Added in v0.1.1

## fromTaskEither

Returns an `AsyncIterEither` which yields the result of the `TaskEither` execution.

**Signature**

```ts
export declare const fromTaskEither: <E, A>(task: TaskEither<E, A>) => AsyncIterEither<E, A>
```

Added in v0.1.1

## reduce

Returns a `TaskEither` containing the combined value produced by applying the
function to the Right elements of the `AsyncIterEither`.

**Signature**

```ts
export declare const reduce: <E, A, B>(b: B, f: (b: B, a: A) => B) => (iter: AsyncIterEither<E, A>) => TaskEither<E, B>
```

Added in v0.1.1

## toArray

Returns a `TaskEither` of array containing the Right elements of the provided
`AsyncIterEither`.

**Signature**

```ts
export declare const toArray: <E, A>(iter: AsyncIterEither<E, A>) => TaskEither<E, A[]>
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

# Error handling

## mapLeft

Returns an `AsyncIterEither` which yields the result of applying the function
to the Left values of the `AsyncIterEither`.

**Signature**

```ts
export declare const mapLeft: <E, G, A>(f: (a: E) => G) => (iter: AsyncIterEither<E, A>) => AsyncIterEither<G, A>
```

Added in v0.1.1

# Filterable

## filter

Omit elements of an `AsyncIterEither` that fail to satisfy a predicate.

**Signature**

```ts
export declare const filter: {
  <E, A, B extends A>(refinement: Refinement<A, B>): (fa: AsyncIterEither<E, A>) => AsyncIterEither<E, B>
  <E, A>(predicate: Predicate<A>): (fa: AsyncIterEither<E, A>) => AsyncIterEither<E, A>
}
```

**Example**

```ts
import { pipe } from 'fp-ts/function'
import * as AIE from 'fp-ts-iter/AsyncIterEither'
import * as E from 'fp-ts/Either'

const isEven = (n: number) => n % 2 === 0

async function test() {
  const result = await pipe(AIE.of(1, 2, 3, 4), AIE.filter(isEven), AIE.toArray)()
  assert.deepStrictEqual(result, E.right([2, 4]))
}
```

Added in v0.1.1

## filterMap

Omit the elements of an `AsyncIterEither` according to a mapping function.

**Signature**

```ts
export declare const filterMap: <E, A, B>(
  f: (a: A) => O.Option<B>
) => (fa: AsyncIterEither<E, A>) => AsyncIterEither<E, B>
```

**Example**

```ts
import { pipe } from 'fp-ts/function'
import * as AIE from 'fp-ts-iter/AsyncIterEither'
import * as E from 'fp-ts/Either'
import * as O from 'fp-ts/Option'

const parsePositive = (s: string): O.Option<number> => {
  const n = parseInt(s, 10)
  return n > 0 ? O.some(n) : O.none
}

async function test() {
  const result = await pipe(AIE.of('5', '0', '10'), AIE.filterMap(parsePositive), AIE.toArray)()
  assert.deepStrictEqual(result, E.right([5, 10]))
}
```

Added in v0.1.1

# Functor

## map

Returns an `AsyncIterEither` which yields the result of applying the function
to the Right values of the `AsyncIterEither`.

**Signature**

```ts
export declare const map: <E, A, B>(f: (a: A) => B) => (iter: AsyncIterEither<E, A>) => AsyncIterEither<E, B>
```

**Example**

```ts
import { pipe } from 'fp-ts/function'
import * as AIE from 'fp-ts-iter/AsyncIterEither'
import * as E from 'fp-ts/Either'

const double = (n: number) => n * 2

async function test() {
  const result = await pipe(AIE.of(1, 2, 3), AIE.map(double), AIE.toArray)()
  assert.deepStrictEqual(result, E.right([2, 4, 6]))
}
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

Transforms a `Promise` that may reject to an `AsyncIterEither` that yields
either error or success values instead of rejecting.

**Signature**

```ts
export declare const tryCatch: <E, A>(
  f: Lazy<AsyncIterable<A>>,
  onRejected: (reason: unknown) => E
) => AsyncIterEither<E, A>
```

Added in v0.1.1

## tryCatchK

Converts a function returning an `AsyncIterable` to one returning an `AsyncIterEither`.

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

Returns an `AsyncIterEither` which yields the elements from the
`AsyncIterable`s produced by applying a provided function to the elements of
the first `AsyncIterEither`.

**Signature**

```ts
export declare const chainAsyncIterableK: <E, A, B>(
  f: (a: A) => AsyncIterable<B>
) => (iter: AsyncIterEither<E, A>) => AsyncIterEither<E, B>
```

Added in v0.1.1

## chainEitherK

Returns an `AsyncIterEither` which yields values of `Either`s produced by
applying the function to each element of the first `AsyncIterEither`.

**Signature**

```ts
export declare const chainEitherK: <E, A, B>(
  f: (a: A) => E.Either<E, B>
) => (iter: AsyncIterEither<E, A>) => AsyncIterEither<E, B>
```

Added in v0.1.1

## chainIterableK

Returns an `AsyncIterEither` which yields the elements from the `Iterable`s
produced by applying a provided function to the elements of the first
`AsyncIterEither`.

**Signature**

```ts
export declare const chainIterableK: <A, B>(
  f: (a: A) => Iterable<B>
) => <E>(iter: AsyncIterEither<E, A>) => AsyncIterEither<E, B>
```

Added in v0.1.1

## chainTaskEitherK

Returns an `AsyncIterEither` which yields values of `TaskEither`s produced by
applying the function to each element of the first `AsyncIterEither`.

**Signature**

```ts
export declare const chainTaskEitherK: <E, A, B>(
  f: (a: A) => TaskEither<E, B>
) => (iter: AsyncIterEither<E, A>) => AsyncIterEither<E, B>
```

Added in v0.1.1

## chainTaskK

Returns an `AsyncIterEither` which yields values of `Task`s produced by
applying the function to each element of the first `AsyncIterEither`.

**Signature**

```ts
export declare const chainTaskK: <E, A, B>(
  f: (a: A) => T.Task<B>
) => (iter: AsyncIterEither<E, A>) => AsyncIterEither<E, B>
```

Added in v0.1.1

# Lifting

## fromAsyncIterableK

Returns an `AsyncIterEither` constructor that passes its arguements to the
provided generator function and returns `AsyncIterEither` that yields the
values from the resulting `AsyncIterable`.

**Signature**

```ts
export declare const fromAsyncIterableK: <E, A extends readonly unknown[], B>(
  f: (...a: A) => AsyncIterable<B>
) => (...a: A) => AsyncIterEither<E, B>
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

## fromIOK

**Signature**

```ts
export declare const fromIOK: <E, A extends readonly unknown[], B>(
  f: (...a: A) => IO<B>
) => (...a: A) => AsyncIterEither<E, B>
```

Added in v0.1.1

## fromIterableK

Returns an `AsyncIterEither` constructor that passes its arguements to the
provided generator function and returns `AsyncIterEither` that yields the
values from the resulting `Iterable`.

**Signature**

```ts
export declare const fromIterableK: <E, A extends readonly unknown[], B>(
  f: (...a: A) => Iterable<B>
) => (...a: A) => AsyncIterEither<E, B>
```

Added in v0.1.1

## fromTaskEitherK

Returns an `AsyncIterEither` consructor that passes its arguements to the
`TaskEither` constructor, and returns `AsyncIterEither` that yields the value
from the resulting `TaskEither`.

**Signature**

```ts
export declare const fromTaskEitherK: <E, A extends readonly unknown[], B>(
  f: (...a: A) => TaskEither<E, B>
) => (...a: A) => AsyncIterEither<E, B>
```

Added in v0.1.1

## fromTaskK

Returns an `AsyncIterEither` constructor that passes its arguements to the
`Task` constructor, and returns `AsyncIterEither` that yields the value from
the resulting `Task`.

**Signature**

```ts
export declare const fromTaskK: <E, A extends readonly unknown[], B>(
  f: (...a: A) => T.Task<B>
) => (...a: A) => AsyncIterEither<E, B>
```

Added in v0.1.1

# Model

## AsyncIterEither (type alias)

**Signature**

```ts
export type AsyncIterEither<E, A> = AsyncIter<Either<E, A>>
```

Added in v0.1.1

# Monad

## chain

Returns an `AsyncIterEither` which yields elements of the `AsyncIterEither`
produced by applying the function to the elements of the first `AsyncIterEither`.

**Signature**

```ts
export declare const chain: <E, A, B>(
  cb: (item: A) => AsyncIterEither<E, B>
) => (iter: AsyncIterEither<E, A>) => AsyncIterEither<E, B>
```

**Example**

```ts
import { pipe } from 'fp-ts/function'
import * as AIE from 'fp-ts-iter/AsyncIterEither'
import * as E from 'fp-ts/Either'

const duplicate = (s: string) => AIE.of(s, s.toUpperCase())

async function test() {
  const result = await pipe(AIE.of('hello'), AIE.chain(duplicate), AIE.toArray)()
  assert.deepStrictEqual(result, E.right(['hello', 'HELLO']))
}
```

Added in v0.1.1

## chainW

Returns an `AsyncIterEither` which yields elements of the `AsyncIterEither`
produced by applying the function to the elements of the first `AsyncIterEither`.

**Signature**

```ts
export declare const chainW: <E, A, B>(
  f: (a: A) => AsyncIterEither<E, B>
) => <D>(fa: AsyncIterEither<D, A>) => AsyncIterEither<E | D, B>
```

**Example**

```ts
import { pipe } from 'fp-ts/function'
import * as AIE from 'fp-ts-iter/AsyncIterEither'
import * as E from 'fp-ts/Either'

const double = (n: number) => AIE.right(n * 2)
const stringify = (n: number) => AIE.right(String(n))

async function test() {
  const result = await pipe(AIE.of(21), AIE.chainW(double), AIE.chainW(stringify), AIE.toArray)()
  assert.deepStrictEqual(result, E.right(['42']))
}
```

Added in v0.1.1

# Pattern matching

## fold

Pattern matching for `AsyncIterEither`. Transforms an `AsyncIterEither<E, A>`
into an `AsyncIter<B>` by applying the appropriate handler function.

**Signature**

```ts
export declare const fold: <E, A, B>(
  onLeft: (e: E) => AI.AsyncIter<B>,
  onRight: (a: A) => AI.AsyncIter<B>
) => (ma: AsyncIterEither<E, A>) => AI.AsyncIter<B>
```

**Example**

```ts
import { pipe } from 'fp-ts/function'
import * as AIE from 'fp-ts-iter/AsyncIterEither'
import * as AI from 'fp-ts-iter/AsyncIter'
import * as E from 'fp-ts/Either'

const handleError = (error: string) => AI.of(`Error: ${error}`)
const handleSuccess = (value: number) => AI.of(`Success: ${value}`)

async function test() {
  const success = AIE.right(42)
  const failure = AIE.left('not found')
  const result1 = await pipe(success, AIE.fold(handleError, handleSuccess), AI.toArray)()
  const result2 = await pipe(failure, AIE.fold(handleError, handleSuccess), AI.toArray)()
  assert.deepStrictEqual(result1, ['Success: 42'])
  assert.deepStrictEqual(result2, ['Error: not found'])
}
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
