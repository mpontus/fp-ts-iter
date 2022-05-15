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
  - [apC](#apc)
- [Combinators](#combinators)
  - [apFirst](#apfirst)
  - [apFirstC](#apfirstc)
  - [apSecond](#apsecond)
  - [apSecondC](#apsecondc)
  - [chainFirst](#chainfirst)
  - [chainFirstC](#chainfirstc)
  - [chainFirstIOK](#chainfirstiok)
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
  - [fromIterable](#fromiterable)
  - [fromIterableK](#fromiterablek)
- [Destructors](#destructors)
  - [foldMap](#foldmap)
  - [reduce](#reduce)
  - [toArray](#toarray)
  - [toReadonlyArray](#toreadonlyarray)
- [Filterable](#filterable)
  - [filter](#filter)
  - [filterMap](#filtermap)
  - [partition](#partition)
  - [partitionMap](#partitionmap)
- [FromTask](#fromtask)
  - [fromTask](#fromtask)
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
  - [FromTask](#fromtask-1)
  - [Functor](#functor-1)
  - [Monad](#monad)
  - [MonadIO](#monadio)
  - [MonadTask](#monadtask)
  - [Pointed](#pointed)
  - [URI](#uri)
  - [URI (type alias)](#uri-type-alias)
  - [getApplicativeC](#getapplicativec)
  - [getApplyC](#getapplyc)
  - [getChainC](#getchainc)
  - [getMonadC](#getmonadc)
  - [getMonadIOC](#getmonadioc)
  - [getMonadTaskC](#getmonadtaskc)
  - [getMonoid](#getmonoid)
  - [getSemigroup](#getsemigroup)
- [Model](#model)
  - [AsyncIter (interface)](#asynciter-interface)
- [Monad](#monad-1)
  - [chain](#chain)
  - [chainC](#chainc)
- [Natural transformations](#natural-transformations)
  - [fromIO](#fromio)
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

Added in v0.1.0

## altW

Returns an `AsyncIter` that yields elements of the first `AsyncIter` followed
by the elements of the second `AsyncIter`.

**Signature**

```ts
export declare const altW: <B>(that: Lazy<AsyncIter<B>>) => <A>(fa: AsyncIter<A>) => AsyncIter<B | A>
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

Added in v0.1.0

## apC

Concurrent version of `ap`, which runs the specified number of promises in parallel.

**Signature**

```ts
export declare const apC: (
  concurrency: number
) => <A>(fa: AsyncIter<A>) => <B>(fab: AsyncIter<(a: A) => B>) => AsyncIter<B>
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

## apFirstC

Concurrent version of `apFirst`.

**Signature**

```ts
export declare const apFirstC: (concurrency: number) => typeof apFirst
```

Added in v0.1.0

## apSecond

Combine effectful actions of two `AsyncIter`s keeping only the results of the second.

**Signature**

```ts
export declare const apSecond: <B>(second: AsyncIter<B>) => <A>(first: AsyncIter<A>) => AsyncIter<B>
```

Added in v0.1.0

## apSecondC

Concurrent version of `apSecond`.

**Signature**

```ts
export declare const apSecondC: (concurrency: number) => typeof apSecond
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

## chainFirstC

Concurrent version of `chainFirst`.

**Signature**

```ts
export declare const chainFirstC: (
  concurrency: number
) => <A, B>(f: (a: A) => AsyncIter<B>) => (first: AsyncIter<A>) => AsyncIter<A>
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
export declare const fromIOK: <A extends readonly unknown[], B>(f: (...a: A) => IO<B>) => (...a: A) => AsyncIter<B>
```

Added in v0.1.0

## fromTaskK

Returns an `AsyncIter` constructor that passes its arguments to the `Task`
constructor, and produces an `AsyncIter` that only yields the value of the
produced `Task`.

**Signature**

```ts
export declare const fromTaskK: <A extends readonly unknown[], B>(
  f: (...a: A) => T.Task<B>
) => (...a: A) => AsyncIter<B>
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

## fromIterable

Returns an `AsyncIter` that yields the elements of the provided `Iterable`.

**Signature**

```ts
export declare const fromIterable: <A>(iter: Iterable<A>) => AsyncIter<A>
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

Added in v0.1.0

# Destructors

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

# FromTask

## fromTask

Return an `AsyncIter` which yields only the value of the provided `Task`.

**Signature**

```ts
export declare const fromTask: NaturalTransformation11<'Task', 'AsyncIter'>
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

## URI

**Signature**

```ts
export declare const URI: 'AsyncIter'
```

Added in v0.1.0

## URI (type alias)

**Signature**

```ts
export type URI = typeof URI
```

Added in v0.1.0

## getApplicativeC

Returns concurrent version of `Applicative` type class.

**Signature**

```ts
export declare const getApplicativeC: (concurrency: number) => Applicative1<URI>
```

Added in v0.1.0

## getApplyC

Returns concurrent version of `Apply` type class.

**Signature**

```ts
export declare const getApplyC: (concurrency: number) => Apply1<URI>
```

Added in v0.1.0

## getChainC

Returns concurrent version of `Chain` type class.

**Signature**

```ts
export declare const getChainC: (concurrency: number) => Chain1<URI>
```

Added in v0.1.0

## getMonadC

Returns concurrent version of `Monad` type class.

**Signature**

```ts
export declare const getMonadC: (concurrency: number) => Monad1<URI>
```

Added in v0.1.0

## getMonadIOC

Returns concurrent version of `MonadIO` type class.

**Signature**

```ts
export declare const getMonadIOC: (concurrency: number) => MonadIO1<URI>
```

Added in v0.1.0

## getMonadTaskC

Returns concurrent version of `MonadTask` type class.

**Signature**

```ts
export declare const getMonadTaskC: (concurrency: number) => MonadTask1<URI>
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

# Model

## AsyncIter (interface)

**Signature**

```ts
export interface AsyncIter<A> {
  (): AsyncIterable<A>
}
```

Added in v0.1.0

# Monad

## chain

Returns an `AsyncIter` that yields the elements of each `AsyncIter` produced
by applying the function to the elements of the first `AsyncIter`.

**Signature**

```ts
export declare const chain: <A, B>(f: (a: A) => AsyncIter<B>) => (ma: AsyncIter<A>) => AsyncIter<B>
```

Added in v0.1.0

## chainC

Concurrent version of `chain`, which runs the specified number of promises in parallel.

**Signature**

```ts
export declare const chainC: (
  concurrency: number
) => <A, B>(f: (a: A) => AsyncIter<B>) => (ma: AsyncIter<A>) => AsyncIter<B>
```

Added in v0.1.0

# Natural transformations

## fromIO

Return an `AsyncIter` which yields only the value of the provided `IO`.

**Signature**

```ts
export declare const fromIO: NaturalTransformation11<'IO', 'AsyncIter'>
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
