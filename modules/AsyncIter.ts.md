---
title: AsyncIter.ts
nav_order: 1
parent: Modules
---

## AsyncIter overview

```ts
interface AsyncIter<A> {
  (): AsyncIterable<A>
}
```

`AsyncIter<A>` represents an async generator function with no arguments or
`Lazy<AsyncIterable<A>>`.

Added in v0.1.0

---

<h2 class="text-delta">Table of contents</h2>

- [Alt](#alt)
  - [alt](#alt)
  - [altW](#altw)
- [Apply](#apply)
  - [ap](#ap)
  - [apPar](#appar)
- [Combinators](#combinators)
  - [apFirst](#apfirst)
  - [apFirstPar](#apfirstpar)
  - [apSecond](#apsecond)
  - [apSecondPar](#apsecondpar)
  - [chainFirst](#chainfirst)
  - [chainFirstIOK](#chainfirstiok)
  - [chainFirstPar](#chainfirstpar)
  - [chainFirstTaskK](#chainfirsttaskk)
  - [chainIOK](#chainiok)
  - [chainTaskK](#chaintaskk)
  - [concat](#concat)
  - [concatW](#concatw)
  - [flap](#flap)
  - [flatten](#flatten)
  - [fromIOK](#fromiok)
  - [fromTaskK](#fromtaskk)
  - [replay](#replay)
  - [scan](#scan)
- [Compactable](#compactable)
  - [compact](#compact)
  - [separate](#separate)
- [Constructors](#constructors)
  - [fromAsyncIterable](#fromasynciterable)
  - [fromAsyncIterableK](#fromasynciterablek)
  - [fromIO](#fromio)
  - [fromIterable](#fromiterable)
  - [fromIterableK](#fromiterablek)
  - [fromTask](#fromtask)
- [Conversions](#conversions)
  - [foldMap](#foldmap)
  - [reduce](#reduce)
  - [toArray](#toarray)
  - [toReadonlyArray](#toreadonlyarray)
- [Do notation](#do-notation)
  - [Do](#do)
  - [apS](#aps)
  - [bind](#bind)
  - [bindTo](#bindto)
- [Filterable](#filterable)
  - [filter](#filter)
  - [filterMap](#filtermap)
  - [partition](#partition)
  - [partitionMap](#partitionmap)
- [Functor](#functor)
  - [map](#map)
- [Instances](#instances)
  - [Alt](#alt-1)
  - [Alternative](#alternative)
  - [Applicative](#applicative)
  - [Apply](#apply-1)
  - [Chain](#chain)
  - [Compactable](#compactable-1)
  - [Filterable](#filterable-1)
  - [FromIO](#fromio)
  - [FromTask](#fromtask)
  - [Functor](#functor-1)
  - [Monad](#monad)
  - [MonadIO](#monadio)
  - [MonadTask](#monadtask)
  - [Pointed](#pointed)
  - [getApplicativePar](#getapplicativepar)
  - [getApplyPar](#getapplypar)
  - [getChainPar](#getchainpar)
  - [getMonadIOPar](#getmonadiopar)
  - [getMonadPar](#getmonadpar)
  - [getMonadTaskPar](#getmonadtaskpar)
  - [getMonoid](#getmonoid)
  - [getSemigroup](#getsemigroup)
- [Legacy](#legacy)
  - [chainAsyncIterableK](#chainasynciterablek)
  - [chainIterableK](#chainiterablek)
  - [concurrent](#concurrent)
- [Monad](#monad-1)
  - [chain](#chain)
  - [chainPar](#chainpar)
- [Pointed](#pointed-1)
  - [of](#of)
- [Zero](#zero)
  - [zero](#zero)
- [utils](#utils)
  - [empty](#empty)

---

# Alt

## alt

Returns an `AsyncIter` that yields elements of the first `AsyncIter` followed
by the elements of the second `AsyncIter`.

**Signature**

```ts
export declare const alt: <A>(that: Lazy<AsyncIter<A>>) => (fa: AsyncIter<A>) => AsyncIter<A>
```

**Example**

```ts
import { pipe } from 'fp-ts/lib/function'
import { asyncIter as AI } from 'fp-ts-iter'

async function test() {
  assert.deepStrictEqual(
    await pipe(
      AI.fromIterable([1, 2, 3]),
      AI.alt(() => AI.fromIterable([4, 5, 6])),
      AI.toArray
    )(),
    [1, 2, 3, 4, 5, 6]
  )
}

test()
```

Added in v0.1.0

## altW

Returns an `AsyncIter` that yields elements of the first `AsyncIter` followed
by the elements of the second `AsyncIter`.

**Signature**

```ts
export declare const altW: <B>(that: Lazy<AsyncIter<B>>) => <A>(fa: AsyncIter<A>) => AsyncIter<B | A>
```

**Example**

```ts
import { pipe } from 'fp-ts/lib/function'
import { asyncIter as AI } from 'fp-ts-iter'

async function test() {
  assert.deepStrictEqual(
    await pipe(
      AI.fromIterable([1, 2, 3]),
      AI.altW(() => AI.fromIterable(['a', 'b', 'c'])),
      AI.toArray
    )(),
    [1, 2, 3, 'a', 'b', 'c']
  )
}

test()
```

Added in v0.1.0

# Apply

## ap

Returns an `AsyncIter` that yields the results of applying each function in
the first `AsyncIter` to the elements of the second `AsyncIter`.

**Signature**

```ts
export declare const ap: <A>(fa: AsyncIter<A>) => <B>(fab: AsyncIter<(a: A) => B>) => AsyncIter<B>
```

**Example**

```ts
import { pipe } from 'fp-ts/lib/function'
import { asyncIter as AI } from 'fp-ts-iter'

async function test() {
  assert.deepStrictEqual(
    await pipe(
      async function* () {
        yield (n: number) => n + 3
        yield (n: number) => n * 4
      },
      AI.ap(async function* () {
        yield 2
        yield 3
        yield 4
      }),
      AI.toArray
    )(),
    [5, 6, 7, 8, 12, 16]
  )
}

test()
```

Added in v0.1.0

## apPar

Concurrent version of `ap`, which runs the specified number of promises in parallel.

**Signature**

```ts
export declare const apPar: (
  concurrency: number
) => <A>(fa: AsyncIter<A>) => <B>(fab: AsyncIter<(a: A) => B>) => AsyncIter<B>
```

**Example**

```ts
import { pipe } from 'fp-ts/lib/function'
import { asyncIter as AI } from 'fp-ts-iter'

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

async function test() {
  assert.deepStrictEqual(
    await pipe(
      async function* () {
        yield (n: number) => n + 3
        yield (n: number) => n * 4
      },
      AI.apPar(2)(async function* () {
        await delay(100)
        yield 2
        await delay(100)
        yield 4
      }),
      AI.toArray
    )(),
    [5, 8, 7, 16]
  )
}

test()
```

Added in v0.1.0

# Combinators

## apFirst

Combine effectful actions of two `AsyncIter`s keeping only the results of the first.

**Signature**

```ts
export declare const apFirst: <B>(second: AsyncIter<B>) => <A>(first: AsyncIter<A>) => AsyncIter<A>
```

Added in v0.1.0

## apFirstPar

Concurrent version of `apFirst`.

**Signature**

```ts
export declare const apFirstPar: (concurrency: number) => typeof apFirst
```

Added in v0.1.0

## apSecond

Combine effectful actions of two `AsyncIter`s keeping only the results of the second.

**Signature**

```ts
export declare const apSecond: <B>(second: AsyncIter<B>) => <A>(first: AsyncIter<A>) => AsyncIter<B>
```

Added in v0.1.0

## apSecondPar

Concurrent version of `apSecond`.

**Signature**

```ts
export declare const apSecondPar: (concurrency: number) => typeof apSecond
```

Added in v0.1.0

## chainFirst

Composes computations in sequence, using the return value of one computation
to determine the next computation and keeping only the result of the first.

**Signature**

```ts
export declare const chainFirst: <A, B>(f: (a: A) => AsyncIter<B>) => (first: AsyncIter<A>) => AsyncIter<A>
```

Added in v0.1.0

## chainFirstIOK

Composes computations in sequence, using the return value of one computation
to determine the next computation and keeping only the result of the first.

**Signature**

```ts
export declare const chainFirstIOK: <A, B>(f: (a: A) => IO<B>) => (first: AsyncIter<A>) => AsyncIter<A>
```

Added in v0.1.0

## chainFirstPar

Concurrent version of `chainFirst`.

**Signature**

```ts
export declare const chainFirstPar: (concurrency: number) => typeof chainFirst
```

Added in v0.1.0

## chainFirstTaskK

Composes computations in sequence, using the return value of one computation
to determine the next computation and keeping only the result of the first.

**Signature**

```ts
export declare const chainFirstTaskK: <A, B>(f: (a: A) => T.Task<B>) => (first: AsyncIter<A>) => AsyncIter<A>
```

Added in v0.1.0

## chainIOK

Return an `AsyncIter` which yields values of `IO`s produced by applying the
function to each element of the first `AsyncIter`.

**Signature**

```ts
export declare const chainIOK: <A, B>(f: (a: A) => IO<B>) => (first: AsyncIter<A>) => AsyncIter<B>
```

Added in v0.1.0

## chainTaskK

Return an `AsyncIter` which yields the values from the `IO`s produced by
applying a provided function to the elements of the first `AsyncIter`.

**Signature**

```ts
export declare const chainTaskK: <A, B>(f: (a: A) => T.Task<B>) => (first: AsyncIter<A>) => AsyncIter<B>
```

Added in v0.1.0

## concat

Returns an `AsyncIter` that combines the values of both provided `AsyncIter`s.

**Signature**

```ts
export declare const concat: <A>(second: AsyncIter<A>) => (first: AsyncIter<A>) => AsyncIter<A>
```

Added in v0.1.0

## concatW

Returns an `AsyncIter` that combines the values of both provided `AsyncIter`s.

**Signature**

```ts
export declare const concatW: <B>(second: AsyncIter<B>) => <A>(first: AsyncIter<A>) => AsyncIter<B | A>
```

Added in v0.1.0

## flap

Returns an `AsyncIter` that yields values produced by applying functions
emitted by the first `AsyncIter` to the provided value.

**Signature**

```ts
export declare const flap: <A>(a: A) => <B>(fab: AsyncIter<(a: A) => B>) => AsyncIter<B>
```

Added in v0.1.0

## flatten

Returns an `AsyncIter` that yields the elements from each `AsyncIter`
produced by the first `AsyncIter`.

**Signature**

```ts
export declare const flatten: <A>(mma: AsyncIter<AsyncIter<A>>) => AsyncIter<A>
```

Added in v0.1.0

## fromIOK

Returns an `AsyncIter` constructor that passes its arguments to the `IO`
constructor, and produces an `AsyncIter` that only yields the value of the
produced `IO`.

**Signature**

```ts
export declare const fromIOK: <A, B>(f: (...a: A) => IO<B>) => (...a: A) => AsyncIter<B>
```

Added in v0.1.0

## fromTaskK

Returns an `AsyncIter` constructor that passes its arguments to the `Task`
constructor, and produces an `AsyncIter` that only yields the value of the
produced `Task`.

**Signature**

```ts
export declare const fromTaskK: <A, B>(f: (...a: A) => T.Task<B>) => (...a: A) => AsyncIter<B>
```

Added in v0.1.0

## replay

Replay emitted values for each subscriber

**Signature**

```ts
export declare function replay<A>(iter: AsyncIter<A>): AsyncIter<A>
```

Added in v0.1.0

## scan

Returns an `AsyncIter` that yields the values produced by applying the
function to the elements of the `AsyncIter`, passing it the result of the
previous call, starting with the initial value.

**Signature**

```ts
export declare const scan: <A, B>(b: B, f: (b: B, a: A) => B) => (iter: AsyncIter<A>) => AsyncIter<B>
```

Added in v0.1.0

# Compactable

## compact

Transform `AsyncIter<Option<A>>` to `AsyncIter<A>`

**Signature**

```ts
export declare const compact: <A>(fa: AsyncIter<O.Option<A>>) => AsyncIter<A>
```

Added in v0.1.0

## separate

Separate `AsyncIter<Either<E, A>>` into `AsyncIter<E>` and `AsyncIter<A>`

**Signature**

```ts
export declare const separate: <A, B>(fa: AsyncIter<E.Either<A, B>>) => Separated<AsyncIter<A>, AsyncIter<B>>
```

Added in v0.1.0

# Constructors

## fromAsyncIterable

Returns an `AsyncIter` that yields the elements of the provided `AsyncIterable`.

**Signature**

```ts
export declare const fromAsyncIterable: <A>(iter: AsyncIterable<A>) => AsyncIter<A>
```

Added in v0.1.0

## fromAsyncIterableK

Returns a function that passes its arguments to the provided constructor and
returns an `AsyncIter` that yields the elements from the resulting `AsyncIterable`.

**Signature**

```ts
export declare const fromAsyncIterableK: <A extends readonly unknown[], B>(
  f: (...a: A) => AsyncIterable<B>
) => (...a: A) => AsyncIter<B>
```

Added in v0.1.0

## fromIO

Return an `AsyncIter` which yields only the value of the provided `IO`.

**Signature**

```ts
export declare const fromIO: NaturalTransformation11<'IO', 'AsyncIter'>
```

Added in v0.1.0

## fromIterable

Returns an `AsyncIter` that yields the elements of the provided `Iterable`.

**Signature**

```ts
export declare const fromIterable: <A>(iter: Iterable<A>) => AsyncIter<A>
```

**Example**

```ts
import { pipe } from 'fp-ts/lib/function'
import { asyncIter as AI } from 'fp-ts-iter'

async function test() {
  assert.deepStrictEqual(await pipe(AI.fromIterable(['a', 'b', 'c']), AI.toArray)(), ['a', 'b', 'c'])
}

test()
```

Added in v0.1.0

## fromIterableK

Returns a function that passes its arguments to the provided constructor and
returns an `AsyncIter` that yields the elements from the resulting `Iterable`.

**Signature**

```ts
export declare const fromIterableK: <A extends readonly unknown[], B>(
  f: (...a: A) => Iterable<B>
) => (...a: A) => AsyncIter<B>
```

**Example**

```ts
import { pipe } from 'fp-ts/lib/function'
import { asyncIter as AI } from 'fp-ts-iter'

async function test() {
  assert.deepStrictEqual(
    await pipe(
      'a b c',
      AI.fromIterableK((s) => s.split(' ')),
      AI.toArray
    )(),
    ['a', 'b', 'c']
  )
}

test()
```

Added in v0.1.0

## fromTask

Return an `AsyncIter` which yields only the value of the provided `Task`.

**Signature**

```ts
export declare const fromTask: NaturalTransformation11<'Task', 'AsyncIter'>
```

Added in v0.1.0

# Conversions

## foldMap

Returns a `Task` containing the combined value produced by applying the
function to the elements of the `AsyncIter`.

**Signature**

```ts
export declare const foldMap: <M>(M: Monoid<M>) => <A>(f: (a: A) => M) => (fa: AsyncIter<A>) => T.Task<M>
```

Added in v0.1.0

## reduce

Returns a `Task` containing the last value produced by applying the function
to each element of the `AsyncIter`, passing it the result of the previous
call, starting with the initial value.

**Signature**

```ts
export declare const reduce: <A, B>(b: B, f: (b: B, a: A) => B) => (fa: AsyncIter<A>) => T.Task<B>
```

Added in v0.1.0

## toArray

Returns a `Task` of array containing the elements of the provided `AsyncIter`.

**Signature**

```ts
export declare const toArray: <A>(as: AsyncIter<A>) => T.Task<A[]>
```

Added in v0.1.0

## toReadonlyArray

Returns a `Task` of readonly array containing the elements of the provided `AsyncIter`.

**Signature**

```ts
export declare const toReadonlyArray: <A>(iter: AsyncIter<A>) => T.Task<readonly A[]>
```

Added in v0.1.0

# Do notation

## Do

**Signature**

```ts
export declare const Do: AsyncIter<{}>
```

Added in v0.1.1

## apS

**Signature**

```ts
export declare const apS: <N, A, B>(
  name: Exclude<N, keyof A>,
  fb: AsyncIter<B>
) => (fa: AsyncIter<A>) => AsyncIter<{ readonly [K in N | keyof A]: K extends keyof A ? A[K] : B }>
```

Added in v0.1.1

## bind

**Signature**

```ts
export declare const bind: <N, A, B>(
  name: Exclude<N, keyof A>,
  f: (a: A) => AsyncIter<B>
) => (ma: AsyncIter<A>) => AsyncIter<{ readonly [K in N | keyof A]: K extends keyof A ? A[K] : B }>
```

Added in v0.1.1

## bindTo

**Signature**

```ts
export declare const bindTo: <N>(name: N) => <A>(fa: AsyncIter<A>) => AsyncIter<{ readonly [K in N]: A }>
```

Added in v0.1.1

# Filterable

## filter

Omit elements of an `AsyncIter` that fail to satisfy a predicate.

**Signature**

```ts
export declare const filter: {
  <A, B extends A>(refinement: Refinement<A, B>): (iter: AsyncIter<A>) => AsyncIter<B>
  <A>(predicate: Predicate<A>): (iter: AsyncIter<A>) => AsyncIter<A>
}
```

Added in v0.1.0

## filterMap

Omit the elements of an `AsyncIter` according to a mapping function.

**Signature**

```ts
export declare const filterMap: <A, B>(f: (a: A) => O.Option<B>) => (fa: AsyncIter<A>) => AsyncIter<B>
```

Added in v0.1.0

## partition

Separate elements of an `AsyncIter` into two `AsyncIter`s according to a predicate.

**Signature**

```ts
export declare const partition: {
  <A, B extends A>(refinement: Refinement<A, B>): (fa: AsyncIter<A>) => Separated<AsyncIter<A>, AsyncIter<B>>
  <A>(predicate: Predicate<A>): (fa: AsyncIter<A>) => Separated<AsyncIter<A>, AsyncIter<A>>
}
```

Added in v0.1.0

## partitionMap

Separate elements of an `AsyncIter` into two `AsyncIter`s according to a
mapping function.

**Signature**

```ts
export declare const partitionMap: <A, B, C>(
  f: (a: A) => E.Either<B, C>
) => (fa: AsyncIter<A>) => Separated<AsyncIter<B>, AsyncIter<C>>
```

Added in v0.1.0

# Functor

## map

Returns an `AsyncIter` that yields the results of applying the function to
the elements of the first `AsyncIter`.

**Signature**

```ts
export declare const map: <A, B>(f: (a: A) => B) => (fa: AsyncIter<A>) => AsyncIter<B>
```

**Example**

```ts
import { pipe } from 'fp-ts/lib/function'
import { asyncIter as AI } from 'fp-ts-iter'

async function test() {
  assert.deepStrictEqual(
    await pipe(
      async function* () {
        yield 2
        yield 3
      },
      AI.map((a) => a * 2),
      AI.toArray
    )(),
    [4, 6]
  )
}

test()
```

Added in v0.1.0

# Instances

## Alt

Instance of `Alt` type class.

**Signature**

```ts
export declare const Alt: Alt1<'AsyncIter'>
```

Added in v0.1.0

## Alternative

Instance of `Alternative` type class.

**Signature**

```ts
export declare const Alternative: Alternative1<'AsyncIter'>
```

Added in v0.1.0

## Applicative

Instance of `Applicative` type class.

**Signature**

```ts
export declare const Applicative: Applicative1<'AsyncIter'>
```

Added in v0.1.0

## Apply

Instance of `Apply` type class.

**Signature**

```ts
export declare const Apply: Apply1<'AsyncIter'>
```

Added in v0.1.0

## Chain

Instance of `Chain` type class.

**Signature**

```ts
export declare const Chain: Chain1<'AsyncIter'>
```

Added in v0.1.0

## Compactable

Instance of `Compactable` type class.

**Signature**

```ts
export declare const Compactable: Compactable1<'AsyncIter'>
```

Added in v0.1.0

## Filterable

Instance of `Filterable` type class.

**Signature**

```ts
export declare const Filterable: Filterable1<'AsyncIter'>
```

Added in v0.1.0

## FromIO

Instance of `FromIO` type class.

**Signature**

```ts
export declare const FromIO: FromIO1<'AsyncIter'>
```

Added in v0.1.0

## FromTask

Instance of `FromTask` type class.

**Signature**

```ts
export declare const FromTask: FromTask1<'AsyncIter'>
```

Added in v0.1.0

## Functor

Instance of `Pointed` type class.

**Signature**

```ts
export declare const Functor: Functor1<'AsyncIter'>
```

Added in v0.1.0

## Monad

Instance of `Monad` type class.

**Signature**

```ts
export declare const Monad: Monad1<'AsyncIter'>
```

Added in v0.1.0

## MonadIO

Instance of `MonadIO` type class.

**Signature**

```ts
export declare const MonadIO: MonadIO1<'AsyncIter'>
```

Added in v0.1.0

## MonadTask

Instance of `MonadTask` type class.

**Signature**

```ts
export declare const MonadTask: MonadTask1<'AsyncIter'>
```

Added in v0.1.0

## Pointed

Instance of `Pointed` type class.

**Signature**

```ts
export declare const Pointed: Pointed1<'AsyncIter'>
```

Added in v0.1.0

## getApplicativePar

Returns concurrent version of `Applicative` type class.

**Signature**

```ts
export declare const getApplicativePar: (concurrency: number) => Applicative1<URI>
```

Added in v0.1.0

## getApplyPar

Returns concurrent version of `Apply` type class.

**Signature**

```ts
export declare const getApplyPar: (concurrency: number) => Apply1<URI>
```

Added in v0.1.0

## getChainPar

Returns concurrent version of `Chain` type class.

**Signature**

```ts
export declare const getChainPar: (concurrency: number) => Chain1<URI>
```

Added in v0.1.0

## getMonadIOPar

Returns concurrent version of `MonadIO` type class.

**Signature**

```ts
export declare const getMonadIOPar: (concurrency: number) => MonadIO1<URI>
```

Added in v0.1.0

## getMonadPar

Returns concurrent version of `Monad` type class.

**Signature**

```ts
export declare const getMonadPar: (concurrency: number) => Monad1<URI>
```

Added in v0.1.0

## getMonadTaskPar

Returns concurrent version of `MonadTask` type class.

**Signature**

```ts
export declare const getMonadTaskPar: (concurrency: number) => MonadTask1<URI>
```

Added in v0.1.0

## getMonoid

Returns an instance of `Monoid` type class for `AsyncIter`.

**Signature**

```ts
export declare const getMonoid: <A = never>() => Monoid<AsyncIter<A>>
```

Added in v0.1.0

## getSemigroup

Returns an instance of `Semigroup` type class for `AsyncIter`.

**Signature**

```ts
export declare const getSemigroup: <A = never>() => Semigroup<AsyncIter<A>>
```

Added in v0.1.0

# Legacy

## chainAsyncIterableK

**Signature**

```ts
export declare const chainAsyncIterableK: <A, B>(f: (a: A) => AsyncIterable<B>) => (iter: AsyncIter<A>) => AsyncIter<B>
```

Added in v0.1.1

## chainIterableK

**Signature**

```ts
export declare const chainIterableK: <A, B>(f: (a: A) => Iterable<B>) => (iter: AsyncIter<A>) => AsyncIter<B>
```

Added in v0.1.1

## concurrent

Returns concurrent version of the functions in the `Chain` module.

**Signature**

```ts
export declare function concurrent(concurrency: number): {
  chain: typeof chain
  chainTaskK: typeof chainTaskK
  chainIterableK: typeof chainIterableK
  chainAsyncIterableK: typeof chainAsyncIterableK
}
```

Added in v0.1.1

# Monad

## chain

Returns an `AsyncIter` that yields the elements of each `AsyncIter` produced
by applying the function to the elements of the first `AsyncIter`.

**Signature**

```ts
export declare const chain: <A, B>(f: (a: A) => AsyncIter<B>) => (ma: AsyncIter<A>) => AsyncIter<B>
```

**Example**

```ts
import { pipe } from 'fp-ts/lib/function'
import { asyncIter as AI } from 'fp-ts-iter'

async function test() {
  assert.deepStrictEqual(
    await pipe(
      async function* () {
        yield 2
        yield 3
      },
      AI.chain(
        (n: number) =>
          async function* () {
            yield n * 2
            yield n * 3
            yield n * 4
          }
      ),
      AI.toArray
    )(),
    [4, 6, 8, 6, 9, 12]
  )
}

test()
```

Added in v0.1.0

## chainPar

Concurrent version of `chain`, which runs the specified number of promises in parallel.

**Signature**

```ts
export declare const chainPar: (
  concurrency: number
) => <A, B>(f: (a: A) => AsyncIter<B>) => (ma: AsyncIter<A>) => AsyncIter<B>
```

Added in v0.1.0

# Pointed

## of

Returns an `AsyncIter` containing only the provided value.

**Signature**

```ts
export declare const of: <A>(a: A) => AsyncIter<A>
```

Added in v0.1.0

# Zero

## zero

Returns a constructor for an empty `AsyncIter`.

**Signature**

```ts
export declare const zero: <A>() => AsyncIter<A>
```

Added in v0.1.0

# utils

## empty

An empty instance

**Signature**

```ts
export declare const empty: AsyncIter<never>
```

Added in v0.1.0
