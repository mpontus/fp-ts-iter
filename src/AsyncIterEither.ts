/**
 * ```ts
 * interface AsyncIterEither<E, A> extends AsyncIter<Either<E, A>> {}
 * ```
 *
 * `AsyncIterEither<E, A>` represents an async iterator that yields values of
 * type `Either<E, A>`, where `E` represents the error type and `A` represents
 * the success type.
 *
 * @since 0.1.1
 */
import { array as A, either as E, option as O, task as T } from 'fp-ts'
import { Alt2 } from 'fp-ts/lib/Alt'
import { Applicative2 } from 'fp-ts/lib/Applicative'
import { Apply2, apS as apS_ } from 'fp-ts/lib/Apply'
import { Bifunctor2 } from 'fp-ts/lib/Bifunctor'
import { bind as bind_, Chain2 } from 'fp-ts/lib/Chain'
import { Either } from 'fp-ts/lib/Either'
import * as ET from 'fp-ts/lib/EitherT'
import { FromEither2 } from 'fp-ts/lib/FromEither'
import { FromIO2 } from 'fp-ts/lib/FromIO'
import { FromTask2 } from 'fp-ts/lib/FromTask'
import {
  constTrue,
  flow,
  Lazy,
  pipe,
  Predicate,
  Refinement,
} from 'fp-ts/lib/function'
import { bindTo as bindTo_, Functor2 } from 'fp-ts/lib/Functor'
import { IO } from 'fp-ts/lib/IO'
import { Monad2 } from 'fp-ts/lib/Monad'
import { MonadIO2 } from 'fp-ts/lib/MonadIO'
import { MonadTask2 } from 'fp-ts/lib/MonadTask'
import { MonadThrow2 } from 'fp-ts/lib/MonadThrow'
import { Option } from 'fp-ts/lib/Option'
import { Pointed2 } from 'fp-ts/lib/Pointed'
import { Task } from 'fp-ts/lib/Task'
import { TaskEither } from 'fp-ts/lib/TaskEither'
import * as AI from './AsyncIter'
import { AsyncIter } from './AsyncIter'

// -------------------------------------------------------------------------------------
// model
// -------------------------------------------------------------------------------------

/**
 * @since 0.1.1
 * @category Model
 */
export type AsyncIterEither<E, A> = AsyncIter<Either<E, A>>

// -------------------------------------------------------------------------------------
// type lambdas
// -------------------------------------------------------------------------------------

/**
 * @since 0.1.1
 * @category Type lambdas
 */
export const URI = 'AsyncIterEither'

/**
 * @since 0.1.1
 * @category Type lambdas
 */
export type URI = typeof URI

declare module 'fp-ts/lib/HKT' {
  interface URItoKind2<E, A> {
    readonly [URI]: AsyncIterEither<E, A>
  }
}

// -------------------------------------------------------------------------------------
// constructors
// -------------------------------------------------------------------------------------

/**
 * Returns an `AsyncIterEither` containing only the provided error value.
 *
 * @since 0.1.1
 * @category Constructors
 */
export const left = flow(E.left, AI.of)

/**
 * Returns an `AsyncIterEither` containing only the provided success value.
 *
 * @since 0.1.1
 * @category Constructors
 */
export const right = flow(E.right, AI.of)

/**
 * Returns an `AsyncIterEither` containing the provided success values.
 *
 * @since 0.1.1
 * @category Constructors
 */
export const of = <E = never, A = never>(
  ...values: A[]
): AsyncIterEither<E, A> => fromIterable(values)

/**
 * Returns an `AsyncIterEither` containing only the provided error value.
 *
 * @since 0.1.1
 * @category Constructors
 */
export const throwError: MonadThrow2<URI>['throwError'] = left

/**
 * Transforms a `Promise` that may reject to an `AsyncIterEither` that yields
 * either error or success values instead of rejecting.
 *
 * @since 0.1.1
 * @category Interop
 */
export const tryCatch = <E, A>(
  f: Lazy<AsyncIterable<A>>,
  onRejected: (reason: unknown) => E
): AsyncIterEither<E, A> =>
  async function* () {
    const iterable = f()
    const iterator = iterable[Symbol.asyncIterator]()

    while (true) {
      try {
        const result = await iterator.next()
        if (result.done) {
          return
        }
        yield E.right(result.value)
      } catch (reason) {
        yield E.left(onRejected(reason))
      }
    }
  }

/**
 * Converts a function returning an `AsyncIterable` to one returning an `AsyncIterEither`.
 *
 * @since 0.1.1
 * @category Interop
 */
export const tryCatchK =
  <E, A extends ReadonlyArray<unknown>, B>(
    f: (...a: A) => AsyncIterable<B>,
    onRejected: (reason: unknown) => E
  ): ((...a: A) => AsyncIterEither<E, B>) =>
  (...a) =>
    tryCatch(() => f(...a), onRejected)

// -------------------------------------------------------------------------------------
// conversions
// -------------------------------------------------------------------------------------

/**
 * Provides a way to create an `AsyncIterEither` from a `Either`.
 *
 * @since 0.1.1
 * @category Conversions
 */
export const fromEither: <E, A>(fa: Either<E, A>) => AsyncIterEither<E, A> =
  AI.of

/**
 * Returns an `AsyncIterEither` which yields the result of the `IO` execution.
 *
 * @since 0.1.1
 * @category Conversions
 */
export const fromIO: <E, A>(fa: IO<A>) => AsyncIterEither<E, A> = flow(
  AI.fromIO,
  AI.map(E.right)
)

/**
 * Returns an `AsyncIterEither` which yields the result of the `Task` execution.
 *
 * @since 0.1.1
 * @category Conversions
 */
export const fromTask: <E, A>(task: Task<A>) => AsyncIterEither<E, A> = flow(
  AI.fromTask,
  AI.map(E.right)
)

/**
 * Returns an `AsyncIterEither` which yields the result of the `TaskEither` execution.
 *
 * @since 0.1.1
 * @category Conversions
 */
export const fromTaskEither: <E, A>(
  task: TaskEither<E, A>
) => AsyncIterEither<E, A> = AI.fromTask

/**
 * Returns an `AsyncIterEither` that yields the elements of the provided
 * `Iterable` as Right values.
 *
 * @since 0.1.1
 * @category Constructors
 * @example
 *   import { pipe } from 'fp-ts/lib/function'
 *   import * as AIE from 'fp-ts-iter/AsyncIterEither'
 *   import * as E from 'fp-ts/Either'
 *
 *   async function test() {
 *     assert.deepStrictEqual(
 *       await pipe(AIE.fromIterable(['a', 'b', 'c']), AIE.toArray)(),
 *       E.right(['a', 'b', 'c'])
 *     )
 *   }
 *
 *   test()
 */
export const fromIterable: <E = never, A = unknown>(
  iter: Iterable<A>
) => AsyncIterEither<E, A> = flow(AI.fromIterable, AI.map(E.right))

/**
 * Returns an `AsyncIterEither` that yields the elements of the provided
 * `AsyncIterable` as Right values.
 *
 * @since 0.1.1
 * @category Constructors
 */
export const fromAsyncIterable: <E = never, A = never>(
  iter: AsyncIterable<A>
) => AsyncIterEither<E, A> = flow(AI.fromAsyncIterable, AI.map(E.right))

// -------------------------------------------------------------------------------------
// combinators
// -------------------------------------------------------------------------------------

/**
 * Returns an `AsyncIterEither` which yields elements of the `AsyncIterEither`
 * produced by applying the function to the elements of the first `AsyncIterEither`.
 *
 * @since 0.1.1
 * @category Monad
 * @example
 *   import { pipe } from 'fp-ts/function'
 *   import * as AIE from 'fp-ts-iter/AsyncIterEither'
 *   import * as E from 'fp-ts/Either'
 *
 *   const double = (n: number) => AIE.right(n * 2)
 *   const stringify = (n: number) => AIE.right(String(n))
 *
 *   async function test() {
 *     const result = await pipe(
 *       AIE.of(21),
 *       AIE.chainW(double),
 *       AIE.chainW(stringify),
 *       AIE.toArray
 *     )()
 *     assert.deepStrictEqual(result, E.right(['42']))
 *   }
 */
export const chainW =
  <E, A, B>(f: (a: A) => AsyncIterEither<E, B>) =>
  <D>(fa: AsyncIterEither<D, A>): AsyncIterEither<E | D, B> =>
    pipe(fa, AI.chain(E.fold<D, A, AsyncIterEither<D | E, B>>(left, f)))

/**
 * Returns an `AsyncIterEither` which yields elements of the `AsyncIterEither`
 * produced by applying the function to the elements of the first `AsyncIterEither`.
 *
 * @since 0.1.1
 * @category Monad
 * @example
 *   import { pipe } from 'fp-ts/function'
 *   import * as AIE from 'fp-ts-iter/AsyncIterEither'
 *   import * as E from 'fp-ts/Either'
 *
 *   const duplicate = (s: string) => AIE.of(s, s.toUpperCase())
 *
 *   async function test() {
 *     const result = await pipe(
 *       AIE.of('hello'),
 *       AIE.chain(duplicate),
 *       AIE.toArray
 *     )()
 *     assert.deepStrictEqual(result, E.right(['hello', 'HELLO']))
 *   }
 */
export const chain: <E, A, B>(
  cb: (item: A) => AsyncIterEither<E, B>
) => (iter: AsyncIterEither<E, A>) => AsyncIterEither<E, B> = chainW

/**
 * Returns an `AsyncIterEither` which yields the result of applying the function
 * to the Right values of the `AsyncIterEither`.
 *
 * @since 0.1.1
 * @category Functor
 * @example
 *   import { pipe } from 'fp-ts/function'
 *   import * as AIE from 'fp-ts-iter/AsyncIterEither'
 *   import * as E from 'fp-ts/Either'
 *
 *   const double = (n: number) => n * 2
 *
 *   async function test() {
 *     const result = await pipe(
 *       AIE.of(1, 2, 3),
 *       AIE.map(double),
 *       AIE.toArray
 *     )()
 *     assert.deepStrictEqual(result, E.right([2, 4, 6]))
 *   }
 */
export const map: <E, A, B>(
  f: (a: A) => B
) => (iter: AsyncIterEither<E, A>) => AsyncIterEither<E, B> = (f) =>
  AI.map(E.map(f))

/**
 * Returns an `AsyncIterEither` which yields the result of applying the function
 * to the Left values of the `AsyncIterEither`.
 *
 * @since 0.1.1
 * @category Error handling
 */
export const mapLeft: <E, G, A>(
  f: (a: E) => G
) => (iter: AsyncIterEither<E, A>) => AsyncIterEither<G, A> = (f) =>
  AI.map(E.mapLeft(f))

/**
 * Returns an `AsyncIterEither` that yields the result of applying each function
 * in the first `AsyncIterEither` to the elements of the second `AsyncIterEither`.
 *
 * @since 0.1.1
 * @category Apply
 */
export const apW: <D, A>(
  fa: AsyncIterEither<D, A>
) => <E, B>(
  fab: AsyncIterEither<E, (a: A) => B>
) => AsyncIterEither<E | D, B> = (fa) => chainW((f) => pipe(fa, map(f)))

/**
 * Returns an `AsyncIterEither` that yields the result of applying each function
 * in the first `AsyncIterEither` to the elements of the second `AsyncIterEither`.
 *
 * @since 0.1.1
 * @category Apply
 */
export const ap: <E, A>(
  fa: AsyncIterEither<E, A>
) => <B>(fab: AsyncIterEither<E, (a: A) => B>) => AsyncIterEither<E, B> = apW

// -------------------------------------------------------------------------------------
// lifting
// -------------------------------------------------------------------------------------

/**
 * @since 0.1.1
 * @category Lifting
 */
export const fromEitherK: <E, A extends ReadonlyArray<unknown>, B>(
  f: (...a: A) => Either<E, B>
) => (...a: A) => AsyncIterEither<E, B> = (f) => flow(f, fromEither)

/**
 * @since 0.1.1
 * @category Lifting
 */
export const fromIOK: <E, A extends ReadonlyArray<unknown>, B>(
  f: (...a: A) => IO<B>
) => (...a: A) => AsyncIterEither<E, B> =
  (f) =>
  (...a) =>
    fromIO(f(...a))

/**
 * Returns an `AsyncIterEither` constructor that passes its arguements to the
 * `Task` constructor, and returns `AsyncIterEither` that yields the value from
 * the resulting `Task`.
 *
 * @since 0.1.1
 * @category Lifting
 */
export const fromTaskK: <E, A extends ReadonlyArray<unknown>, B>(
  f: (...a: A) => Task<B>
) => (...a: A) => AsyncIterEither<E, B> =
  (f) =>
  (...a) =>
    fromTask(f(...a))

/**
 * Returns an `AsyncIterEither` consructor that passes its arguements to the
 * `TaskEither` constructor, and returns `AsyncIterEither` that yields the value
 * from the resulting `TaskEither`.
 *
 * @since 0.1.1
 * @category Lifting
 */
export const fromTaskEitherK: <E, A extends ReadonlyArray<unknown>, B>(
  f: (...a: A) => TaskEither<E, B>
) => (...a: A) => AsyncIterEither<E, B> = AI.fromTaskK

/**
 * Returns an `AsyncIterEither` constructor that passes its arguements to the
 * provided generator function and returns `AsyncIterEither` that yields the
 * values from the resulting `Iterable`.
 *
 * @since 0.1.1
 * @category Lifting
 */
export const fromIterableK: <E, A extends ReadonlyArray<unknown>, B>(
  f: (...a: A) => Iterable<B>
) => (...a: A) => AsyncIterEither<E, B> =
  (f) =>
  (...a) =>
    fromIterable(f(...a))

/**
 * Returns an `AsyncIterEither` constructor that passes its arguements to the
 * provided generator function and returns `AsyncIterEither` that yields the
 * values from the resulting `AsyncIterable`.
 *
 * @since 0.1.1
 * @category Lifting
 */
export const fromAsyncIterableK: <E, A extends ReadonlyArray<unknown>, B>(
  f: (...a: A) => AsyncIterable<B>
) => (...a: A) => AsyncIterEither<E, B> =
  (f) =>
  (...a) =>
    fromAsyncIterable(f(...a))

/**
 * Returns an `AsyncIterEither` that combines the values of both provided
 * `AsyncIterEither`s.
 *
 * @since 0.1.1
 * @category Combinators
 */
export const concatW: <D, B>(
  second: AsyncIterEither<D, B>
) => <E, A>(first: AsyncIterEither<E, A>) => AsyncIterEither<E | D, A | B> =
  AI.concatW

/**
 * Returns an `AsyncIterEither` that combines the values of both provided
 * `AsyncIterEither`s.
 *
 * @since 0.1.1
 * @category Combinators
 */
export const concat: <E, A>(
  second: AsyncIterEither<E, A>
) => (first: AsyncIterEither<E, A>) => AsyncIterEither<E, A> = concatW

/**
 * Composes computations in sequence, using the return value of one computation
 * to determine the next computation and keeping only the result of the first.
 *
 * @since 0.1.1
 * @category Combinators
 */
export const chainFirstW: <A, D, B>(
  f: (a: A) => AsyncIterEither<D, B>
) => <E>(ma: AsyncIterEither<E, A>) => AsyncIterEither<E | D, A> = (f) =>
  chainW((a) =>
    pipe(
      f(a),
      chainW(() => empty),
      concatW(of(a))
    )
  )

/**
 * Composes computations in sequence, using the return value of one computation
 * to determine the next computation and keeping only the result of the first.
 *
 * @since 0.1.1
 * @category Combinators
 */
export const chainFirst: <A, E, B>(
  f: (a: A) => AsyncIterEither<E, B>
) => (ma: AsyncIterEither<E, A>) => AsyncIterEither<E, A> = chainFirstW

/**
 * An empty `AsyncIterEither`.
 *
 * @since 0.1.1
 * @category Constructors
 */
export const empty: AsyncIterEither<never, never> = of()

/**
 * Pattern matching for `AsyncIterEither`. Transforms an `AsyncIterEither<E, A>`
 * into an `AsyncIter<B>` by applying the appropriate handler function.
 *
 * @since 0.1.1
 * @category Pattern matching
 * @example
 *   import { pipe } from 'fp-ts/function'
 *   import * as AIE from 'fp-ts-iter/AsyncIterEither'
 *   import * as AI from 'fp-ts-iter/AsyncIter'
 *   import * as E from 'fp-ts/Either'
 *
 *   const handleError = (error: string) => AI.of(`Error: ${error}`)
 *   const handleSuccess = (value: number) => AI.of(`Success: ${value}`)
 *
 *   async function test() {
 *     const success = AIE.right(42)
 *     const failure = AIE.left('not found')
 *     const result1 = await pipe(
 *       success,
 *       AIE.fold(handleError, handleSuccess),
 *       AI.toArray
 *     )()
 *     const result2 = await pipe(
 *       failure,
 *       AIE.fold(handleError, handleSuccess),
 *       AI.toArray
 *     )()
 *     assert.deepStrictEqual(result1, ['Success: 42'])
 *     assert.deepStrictEqual(result2, ['Error: not found'])
 *   }
 */
export const fold: <E, A, B>(
  onLeft: (e: E) => AsyncIter<B>,
  onRight: (a: A) => AsyncIter<B>
) => (ma: AsyncIterEither<E, A>) => AsyncIter<B> = (onLeft, onRight) =>
  AI.chain(E.fold(onLeft, onRight))

/**
 * Omit elements of an `AsyncIterEither` that fail to satisfy a predicate.
 *
 * @since 0.1.1
 * @category Filterable
 * @example
 *   import { pipe } from 'fp-ts/function'
 *   import * as AIE from 'fp-ts-iter/AsyncIterEither'
 *   import * as E from 'fp-ts/Either'
 *
 *   const isEven = (n: number) => n % 2 === 0
 *
 *   async function test() {
 *     const result = await pipe(
 *       AIE.of(1, 2, 3, 4),
 *       AIE.filter(isEven),
 *       AIE.toArray
 *     )()
 *     assert.deepStrictEqual(result, E.right([2, 4]))
 *   }
 */
export const filter: {
  <E, A, B extends A>(refinement: Refinement<A, B>): (
    fa: AsyncIterEither<E, A>
  ) => AsyncIterEither<E, B>
  <E, A>(predicate: Predicate<A>): (
    fa: AsyncIterEither<E, A>
  ) => AsyncIterEither<E, A>
} = <A>(predicate: Predicate<A>) => AI.filter(E.fold(constTrue, predicate))

/**
 * Omit the elements of an `AsyncIterEither` according to a mapping function.
 *
 * @since 0.1.1
 * @category Filterable
 * @example
 *   import { pipe } from 'fp-ts/function'
 *   import * as AIE from 'fp-ts-iter/AsyncIterEither'
 *   import * as E from 'fp-ts/Either'
 *   import * as O from 'fp-ts/Option'
 *
 *   const parsePositive = (s: string): O.Option<number> => {
 *     const n = parseInt(s, 10)
 *     return n > 0 ? O.some(n) : O.none
 *   }
 *
 *   async function test() {
 *     const result = await pipe(
 *       AIE.of('5', '0', '10'),
 *       AIE.filterMap(parsePositive),
 *       AIE.toArray
 *     )()
 *     assert.deepStrictEqual(result, E.right([5, 10]))
 *   }
 */
export const filterMap: <E, A, B>(
  f: (a: A) => Option<B>
) => (fa: AsyncIterEither<E, A>) => AsyncIterEither<E, B> = (f) =>
  AI.filterMap(E.fold((err) => O.some(E.left(err)), flow(f, O.map(E.right))))

/**
 * Returns an `AsyncIterEither` that yields elements of the first
 * `AsyncIterEither` followed by the elements of the second `AsyncIterEither`.
 *
 * @since 0.1.1
 * @category Alt
 */
export const alt: <E, A>(
  that: Lazy<AsyncIterEither<E, A>>
) => (fa: AsyncIterEither<E, A>) => AsyncIterEither<E, A> = ET.alt(AI.Monad)

/**
 * Returns an `AsyncIterEither` that yields elements of the first
 * `AsyncIterEither` followed by the elements of the second `AsyncIterEither`.
 *
 * @since 0.1.1
 * @category Alt
 */
export const altW: <E2, B>(
  that: Lazy<AsyncIterEither<E2, B>>
) => <E1, A>(fa: AsyncIterEither<E1, A>) => AsyncIterEither<E2, A | B> =
  alt as any

// -------------------------------------------------------------------------------------
// utils
// -------------------------------------------------------------------------------------

/**
 * Returns a `TaskEither` containing the combined value produced by applying the
 * function to the Right elements of the `AsyncIterEither`.
 *
 * @since 0.1.1
 * @category Conversions
 */
export const reduce: <E, A, B>(
  b: B,
  f: (b: B, a: A) => B
) => (iter: AsyncIterEither<E, A>) => TaskEither<E, B> = (b, f) =>
  AI.reduce(E.right(b), (b, a) =>
    pipe(
      b,
      E.chain((b) =>
        pipe(
          a,
          E.map((a) => f(b, a))
        )
      )
    )
  )

/**
 * Returns a `TaskEither` of array containing the Right elements of the provided
 * `AsyncIterEither`.
 *
 * @since 0.1.1
 * @category Conversions
 */
export const toArray: <E, A>(
  iter: AsyncIterEither<E, A>
) => TaskEither<E, A[]> = flow(AI.toArray, T.map(A.array.sequence(E.either)))

// -------------------------------------------------------------------------------------
// non-pipeables
// -------------------------------------------------------------------------------------

const _map: Functor2<URI>['map'] = (fa, f) => pipe(fa, map(f))
const _ap: Apply2<URI>['ap'] = (fab, fa) => pipe(fab, ap(fa))
const _chain: Chain2<URI>['chain'] = (ma, f) => pipe(ma, chain(f))
const _mapLeft: Bifunctor2<URI>['mapLeft'] = (fea, f) => pipe(fea, mapLeft(f))
const _bimap: Bifunctor2<URI>['bimap'] = (fea, f, g) =>
  pipe(fea, mapLeft(f), map(g))
const _alt: Alt2<URI>['alt'] = (fa, that) => pipe(fa, alt(that))

// -------------------------------------------------------------------------------------
// instances
// -------------------------------------------------------------------------------------

/**
 * @since 0.1.1
 * @category Instances
 */
export const Functor: Functor2<URI> = {
  URI,
  map: _map,
}

/**
 * @since 0.1.1
 * @category Instances
 */
export const Pointed: Pointed2<URI> = {
  URI,
  of,
}

/**
 * @since 0.1.1
 * @category Instances
 */
export const Apply: Apply2<URI> = {
  URI,
  map: _map,
  ap: _ap,
}

/**
 * @since 0.1.1
 * @category Instances
 */
export const Applicative: Applicative2<URI> = {
  URI,
  map: _map,
  ap: _ap,
  of,
}

/**
 * @since 0.1.1
 * @category Instances
 */
export const Chain: Chain2<URI> = {
  URI,
  map: _map,
  ap: _ap,
  chain: _chain,
}

/**
 * @since 0.1.1
 * @category Instances
 */
export const Monad: Monad2<URI> = {
  URI,
  map: _map,
  ap: _ap,
  chain: _chain,
  of,
}

/**
 * @since 0.1.1
 * @category Instances
 */
export const MonadIO: MonadIO2<URI> = {
  URI,
  map: _map,
  ap: _ap,
  chain: _chain,
  of,
  fromIO,
}

/**
 * @since 0.1.1
 * @category Instances
 */
export const MonadTask: MonadTask2<URI> = {
  URI,
  map: _map,
  ap: _ap,
  chain: _chain,
  of,
  fromIO,
  fromTask,
}

/**
 * @since 0.1.1
 * @category Instances
 */
export const MonadThrow: MonadThrow2<URI> = {
  URI,
  map: _map,
  ap: _ap,
  chain: _chain,
  of,
  throwError,
}

/**
 * @since 0.1.1
 * @category Instances
 */
export const FromEither: FromEither2<URI> = {
  URI,
  fromEither,
}

/**
 * @since 0.1.1
 * @category Instances
 */
export const FromIO: FromIO2<URI> = {
  URI,
  fromIO,
}

/**
 * @since 0.1.1
 * @category Instances
 */
export const FromTask: FromTask2<URI> = {
  URI,
  fromIO,
  fromTask,
}

/**
 * @since 0.1.1
 * @category Instances
 */
export const Bifunctor: Bifunctor2<URI> = {
  URI,
  bimap: _bimap,
  mapLeft: _mapLeft,
}

/**
 * @since 0.1.1
 * @category Instances
 */
export const Alt: Alt2<URI> = {
  URI,
  map: _map,
  alt: _alt,
}

// -------------------------------------------------------------------------------------
// do notation
// -------------------------------------------------------------------------------------

/**
 * @since 0.1.1
 * @category Do notation
 */
export const Do: AsyncIterEither<never, {}> = /*#__PURE__*/ of({})

/**
 * @since 0.1.1
 * @category Do notation
 */
export const bindTo = /*#__PURE__*/ bindTo_(Functor)

/**
 * @since 0.1.1
 * @category Do notation
 */
export const bind = /*#__PURE__*/ bind_(Chain)

/**
 * @since 0.1.1
 * @category Do notation
 */
export const apS = /*#__PURE__*/ apS_(Apply)

// -------------------------------------------------------------------------------------
// legacy
// -------------------------------------------------------------------------------------

/**
 * Returns an `AsyncIterEither` which yields values of `Either`s produced by
 * applying the function to each element of the first `AsyncIterEither`.
 *
 * @since 0.1.1
 * @category Legacy
 */
export const chainEitherK: <E, A, B>(
  f: (a: A) => Either<E, B>
) => (iter: AsyncIterEither<E, A>) => AsyncIterEither<E, B> = (f) =>
  chainW(fromEitherK(f))

/**
 * Returns an `AsyncIterEither` which yields values of `Task`s produced by
 * applying the function to each element of the first `AsyncIterEither`.
 *
 * @since 0.1.1
 * @category Legacy
 */
export const chainTaskK: <E, A, B>(
  f: (a: A) => Task<B>
) => (iter: AsyncIterEither<E, A>) => AsyncIterEither<E, B> = (f) =>
  chain((a) => fromTask(f(a)))

/**
 * Returns an `AsyncIterEither` which yields values of `TaskEither`s produced by
 * applying the function to each element of the first `AsyncIterEither`.
 *
 * @since 0.1.1
 * @category Legacy
 */
export const chainTaskEitherK: <E, A, B>(
  f: (a: A) => TaskEither<E, B>
) => (iter: AsyncIterEither<E, A>) => AsyncIterEither<E, B> = (f) =>
  chainW(fromTaskEitherK(f))

/**
 * Returns an `AsyncIterEither` which yields the elements from the `Iterable`s
 * produced by applying a provided function to the elements of the first
 * `AsyncIterEither`.
 *
 * @since 0.1.1
 * @category Legacy
 */
export const chainIterableK: <A, B>(
  f: (a: A) => Iterable<B>
) => <E>(iter: AsyncIterEither<E, A>) => AsyncIterEither<E, B> = (f) =>
  chain((a) => fromIterable(f(a)))

/**
 * Returns an `AsyncIterEither` which yields the elements from the
 * `AsyncIterable`s produced by applying a provided function to the elements of
 * the first `AsyncIterEither`.
 *
 * @since 0.1.1
 * @category Legacy
 */
export const chainAsyncIterableK: <E, A, B>(
  f: (a: A) => AsyncIterable<B>
) => (iter: AsyncIterEither<E, A>) => AsyncIterEither<E, B> = (f) =>
  chain((a) => fromAsyncIterable(f(a)))
