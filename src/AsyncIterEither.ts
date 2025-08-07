/**
 * ```ts
 * interface AsyncIterEither<E, A> extends AsyncIter<Either<E, A>> {}
 * ```
 *
 * `AsyncIterEither<E, A>` represents an async iterator that yields values of
 * type `Either<E, A>`, where `E` represents the error type and `A` represents
 * the success type.
 *
 * @since 0.1.0
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
 * @since 0.1.0
 * @category Model
 */
export type AsyncIterEither<E, A> = AsyncIter<Either<E, A>>

// -------------------------------------------------------------------------------------
// type lambdas
// -------------------------------------------------------------------------------------

/**
 * @since 0.1.0
 * @category Type lambdas
 */
export const URI = 'AsyncIterEither'

/**
 * @since 0.1.0
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
 * @since 0.1.0
 * @category Constructors
 */
export const left = flow(E.left, AI.of)

/**
 * @since 0.1.0
 * @category Constructors
 */
export const right = flow(E.right, AI.of)

/**
 * @since 0.1.0
 * @category Constructors
 */
export const of = <E = never, A = never>(
  ...values: A[]
): AsyncIterEither<E, A> => fromIterable(values)

/**
 * @since 0.1.0
 * @category Constructors
 */
export const throwError: MonadThrow2<URI>['throwError'] = left

/**
 * @since 0.1.0
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
 * @since 0.1.0
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

export const fromEither: <E, A>(task: Either<E, A>) => AsyncIterEither<E, A> =
  AI.of

export const fromIO: <E, A>(task: IO<A>) => AsyncIterEither<E, A> = flow(
  AI.fromIO,
  AI.map(E.right)
)

export const fromTask: <E, A>(task: Task<A>) => AsyncIterEither<E, A> = flow(
  AI.fromTask,
  AI.map(E.right)
)

export const fromTaskEither: <E, A>(
  task: TaskEither<E, A>
) => AsyncIterEither<E, A> = AI.fromTask

export const fromIterable: <E = never, A = unknown>(
  iter: Iterable<A>
) => AsyncIterEither<E, A> = flow(AI.fromIterable, AI.map(E.right))

export const fromAsyncIterable: <E = never, A = never>(
  iter: AsyncIterable<A>
) => AsyncIterEither<E, A> = flow(AI.fromAsyncIterable, AI.map(E.right))

// -------------------------------------------------------------------------------------
// combinators
// -------------------------------------------------------------------------------------

export const chainW =
  <E, A, B>(f: (a: A) => AsyncIterEither<E, B>) =>
  <D>(fa: AsyncIterEither<D, A>): AsyncIterEither<E | D, B> =>
    pipe(fa, AI.chain(E.fold<D, A, AsyncIterEither<D | E, B>>(left, f)))

export const chain: <E, A, B>(
  cb: (item: A) => AsyncIterEither<E, B>
) => (iter: AsyncIterEither<E, A>) => AsyncIterEither<E, B> = chainW

export const map: <E, A, B>(
  f: (a: A) => B
) => (iter: AsyncIterEither<E, A>) => AsyncIterEither<E, B> = (f) =>
  AI.map(E.map(f))

export const mapLeft: <E, G, A>(
  f: (a: E) => G
) => (iter: AsyncIterEither<E, A>) => AsyncIterEither<G, A> = (f) =>
  AI.map(E.mapLeft(f))

export const apW: <D, A>(
  fa: AsyncIterEither<D, A>
) => <E, B>(
  fab: AsyncIterEither<E, (a: A) => B>
) => AsyncIterEither<E | D, B> = (fa) => chainW((f) => pipe(fa, map(f)))

export const ap: <E, A>(
  fa: AsyncIterEither<E, A>
) => <B>(fab: AsyncIterEither<E, (a: A) => B>) => AsyncIterEither<E, B> = apW

// -------------------------------------------------------------------------------------
// lifting
// -------------------------------------------------------------------------------------

export const fromEitherK: <E, A extends ReadonlyArray<unknown>, B>(
  f: (...a: A) => Either<E, B>
) => (...a: A) => AsyncIterEither<E, B> = (f) => flow(f, fromEither)

export const fromIOK: <E, A extends ReadonlyArray<unknown>, B>(
  f: (...a: A) => IO<B>
) => (...a: A) => AsyncIterEither<E, B> =
  (f) =>
  (...a) =>
    fromIO(f(...a))

export const fromTaskK: <E, A extends ReadonlyArray<unknown>, B>(
  f: (...a: A) => Task<B>
) => (...a: A) => AsyncIterEither<E, B> =
  (f) =>
  (...a) =>
    fromTask(f(...a))

export const fromTaskEitherK: <E, A extends ReadonlyArray<unknown>, B>(
  f: (...a: A) => TaskEither<E, B>
) => (...a: A) => AsyncIterEither<E, B> = AI.fromTaskK

export const fromIterableK: <E, A extends ReadonlyArray<unknown>, B>(
  f: (...a: A) => Iterable<B>
) => (...a: A) => AsyncIterEither<E, B> =
  (f) =>
  (...a) =>
    fromIterable(f(...a))

export const fromAsyncIterableK: <E, A extends ReadonlyArray<unknown>, B>(
  f: (...a: A) => AsyncIterable<B>
) => (...a: A) => AsyncIterEither<E, B> =
  (f) =>
  (...a) =>
    fromAsyncIterable(f(...a))

export const concatW: <D, B>(
  second: AsyncIterEither<D, B>
) => <E, A>(first: AsyncIterEither<E, A>) => AsyncIterEither<E | D, A | B> =
  AI.concatW

export const concat: <E, A>(
  second: AsyncIterEither<E, A>
) => (first: AsyncIterEither<E, A>) => AsyncIterEither<E, A> = concatW

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

export const chainFirst: <A, E, B>(
  f: (a: A) => AsyncIterEither<E, B>
) => (ma: AsyncIterEither<E, A>) => AsyncIterEither<E, A> = chainFirstW

export const empty: AsyncIterEither<never, never> = of()

export const fold: <E, A, B>(
  onLeft: (e: E) => AsyncIter<B>,
  onRight: (a: A) => AsyncIter<B>
) => (ma: AsyncIterEither<E, A>) => AsyncIter<B> = (onLeft, onRight) =>
  AI.chain(E.fold(onLeft, onRight))

export const filter: {
  <E, A, B extends A>(refinement: Refinement<A, B>): (
    fa: AsyncIterEither<E, A>
  ) => AsyncIterEither<E, B>
  <E, A>(predicate: Predicate<A>): (
    fa: AsyncIterEither<E, A>
  ) => AsyncIterEither<E, A>
} = <A>(predicate: Predicate<A>) => AI.filter(E.fold(constTrue, predicate))

export const filterMap: <E, A, B>(
  f: (a: A) => Option<B>
) => (fa: AsyncIterEither<E, A>) => AsyncIterEither<E, B> = (f) =>
  AI.filterMap(E.fold((err) => O.some(E.left(err)), flow(f, O.map(E.right))))

export const alt: <E, A>(
  that: Lazy<AsyncIterEither<E, A>>
) => (fa: AsyncIterEither<E, A>) => AsyncIterEither<E, A> = ET.alt(AI.Monad)

export const altW: <E2, B>(
  that: Lazy<AsyncIterEither<E2, B>>
) => <E1, A>(fa: AsyncIterEither<E1, A>) => AsyncIterEither<E2, A | B> =
  alt as any

// -------------------------------------------------------------------------------------
// utils
// -------------------------------------------------------------------------------------

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
 * @since 0.1.0
 * @category Instances
 */
export const Functor: Functor2<URI> = {
  URI,
  map: _map,
}

/**
 * @since 0.1.0
 * @category Instances
 */
export const Pointed: Pointed2<URI> = {
  URI,
  of,
}

/**
 * @since 0.1.0
 * @category Instances
 */
export const Apply: Apply2<URI> = {
  URI,
  map: _map,
  ap: _ap,
}

/**
 * @since 0.1.0
 * @category Instances
 */
export const Applicative: Applicative2<URI> = {
  URI,
  map: _map,
  ap: _ap,
  of,
}

/**
 * @since 0.1.0
 * @category Instances
 */
export const Chain: Chain2<URI> = {
  URI,
  map: _map,
  ap: _ap,
  chain: _chain,
}

/**
 * @since 0.1.0
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
 * @since 0.1.0
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
 * @since 0.1.0
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
 * @since 0.1.0
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
 * @since 0.1.0
 * @category Instances
 */
export const FromEither: FromEither2<URI> = {
  URI,
  fromEither,
}

/**
 * @since 0.1.0
 * @category Instances
 */
export const FromIO: FromIO2<URI> = {
  URI,
  fromIO,
}

/**
 * @since 0.1.0
 * @category Instances
 */
export const FromTask: FromTask2<URI> = {
  URI,
  fromIO,
  fromTask,
}

/**
 * @since 0.1.0
 * @category Instances
 */
export const Bifunctor: Bifunctor2<URI> = {
  URI,
  bimap: _bimap,
  mapLeft: _mapLeft,
}

/**
 * @since 0.1.0
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
 * @since 0.1.0
 * @category Do notation
 */
export const Do: AsyncIterEither<never, {}> = /*#__PURE__*/ of({})

/**
 * @since 0.1.0
 * @category Do notation
 */
export const bindTo = /*#__PURE__*/ bindTo_(Functor)

/**
 * @since 0.1.0
 * @category Do notation
 */
export const bind = /*#__PURE__*/ bind_(Chain)

/**
 * @since 0.1.0
 * @category Do notation
 */
export const apS = /*#__PURE__*/ apS_(Apply)

// -------------------------------------------------------------------------------------
// legacy
// -------------------------------------------------------------------------------------

/**
 * @since 0.1.0
 * @category Legacy
 */
export const chainEitherK: <E, A, B>(
  f: (a: A) => Either<E, B>
) => (iter: AsyncIterEither<E, A>) => AsyncIterEither<E, B> = (f) =>
  chainW(fromEitherK(f))

/**
 * @since 0.1.0
 * @category Legacy
 */
export const chainTaskK: <E, A, B>(
  f: (a: A) => Task<B>
) => (iter: AsyncIterEither<E, A>) => AsyncIterEither<E, B> = (f) =>
  chain((a) => fromTask(f(a)))

/**
 * @since 0.1.0
 * @category Legacy
 */
export const chainTaskEitherK: <E, A, B>(
  f: (a: A) => TaskEither<E, B>
) => (iter: AsyncIterEither<E, A>) => AsyncIterEither<E, B> = (f) =>
  chainW(fromTaskEitherK(f))

/**
 * @since 0.1.0
 * @category Legacy
 */
export const chainIterableK: <A, B>(
  f: (a: A) => Iterable<B>
) => <E>(iter: AsyncIterEither<E, A>) => AsyncIterEither<E, B> = (f) =>
  chain((a) => fromIterable(f(a)))

/**
 * @since 0.1.0
 * @category Legacy
 */
export const chainAsyncIterableK: <E, A, B>(
  f: (a: A) => AsyncIterable<B>
) => (iter: AsyncIterEither<E, A>) => AsyncIterEither<E, B> = (f) =>
  chain((a) => fromAsyncIterable(f(a)))
