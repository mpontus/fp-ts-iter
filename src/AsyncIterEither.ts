import { either as E, taskEither as TE } from 'fp-ts'
import { Applicative2 } from 'fp-ts/lib/Applicative'
import {
  apFirst as apFirst_,
  Apply2,
  apSecond as apSecond_,
} from 'fp-ts/lib/Apply'
import { Bifunctor2 } from 'fp-ts/lib/Bifunctor'
import { Chain2 } from 'fp-ts/lib/Chain'
import { Either } from 'fp-ts/lib/Either'
import * as ET from 'fp-ts/lib/EitherT'
import {
  chainEitherK as chainEitherK_,
  chainOptionK as chainOptionK_,
  filterOrElse as filterOrElse_,
  FromEither2,
  fromEitherK as fromEitherK_,
  fromOption as fromOption_,
  fromOptionK as fromOptionK_,
  fromPredicate as fromPredicate_,
} from 'fp-ts/lib/FromEither'
import {
  chainFirstIOK as chainFirstIOK_,
  chainIOK as chainIOK_,
  FromIO1,
  FromIO2,
  fromIOK as fromIOK_,
} from 'fp-ts/lib/FromIO'
import {
  chainFirstTaskK as chainFirstTaskK_,
  chainTaskK as chainTaskK_,
  FromTask2,
  FromTask3,
  fromTaskK as fromTaskK_,
} from 'fp-ts/lib/FromTask'
import { flow, identity, Lazy, pipe, unsafeCoerce } from 'fp-ts/lib/function'
import { flap as flap_, Functor2 } from 'fp-ts/lib/Functor'
import { IO } from 'fp-ts/lib/IO'
import { IOEither } from 'fp-ts/lib/IOEither'
import { Monad2 } from 'fp-ts/lib/Monad'
import { MonadIO2 } from 'fp-ts/lib/MonadIO'
import { MonadTask2 } from 'fp-ts/lib/MonadTask'
import { MonadThrow2 } from 'fp-ts/lib/MonadThrow'
import { NaturalTransformation22 } from 'fp-ts/lib/NaturalTransformation'
import { Pointed2 } from 'fp-ts/lib/Pointed'
import { Task } from 'fp-ts/lib/Task'
import { TaskEither } from 'fp-ts/lib/TaskEither'
import * as AI from './AsyncIter'
import { AsyncIter } from './AsyncIter'
import { chainFirst as chainFirst_ } from 'fp-ts/lib/Chain'
import { Refinement } from 'fp-ts/lib/Refinement'
import { Predicate } from 'fp-ts/lib/Predicate'

// -------------------------------------------------------------------------------------
// model
// -------------------------------------------------------------------------------------

/**
 * @since 2.0.0
 * @category Model
 */
export type AsyncIterEither<E, A> = AsyncIter<Either<E, A>>

// -------------------------------------------------------------------------------------
// constructors
// -------------------------------------------------------------------------------------

/**
 * @since 2.0.0
 * @category Constructors
 */
export const left: <E = never, A = never>(e: E) => AsyncIterEither<E, A> =
  /*#__PURE__*/
  ET.left(AI.Pointed)

/**
 * @since 2.0.0
 * @category Constructors
 */
export const right: <E = never, A = never>(a: A) => AsyncIterEither<E, A> =
  /*#__PURE__*/
  ET.right(AI.Pointed)

/**
 * @since 2.0.0
 * @category Constructors
 */
export const rightTask: <E = never, A = never>(
  ma: Task<A>
) => AsyncIterEither<E, A> =
  /*#__PURE__*/
  flow(AI.fromTask, AI.chain(right))

/**
 * @since 2.0.0
 * @category Constructors
 */
export const leftTask: <E = never, A = never>(
  me: Task<E>
) => AsyncIterEither<E, A> =
  /*#__PURE__*/
  flow(AI.fromTask, AI.chain(left))

/**
 * @since 2.0.0
 * @category Constructors
 */
export const rightIO: <E = never, A = never>(
  ma: IO<A>
) => AsyncIterEither<E, A> =
  /*#__PURE__*/
  flow(AI.fromIO, AI.chain(right))

/**
 * @since 2.0.0
 * @category Constructors
 */
export const leftIO: <E = never, A = never>(
  me: IO<E>
) => AsyncIterEither<E, A> =
  /*#__PURE__*/
  flow(AI.fromIO, AI.chain(left))

// -------------------------------------------------------------------------------------
// natural transformations
// -------------------------------------------------------------------------------------

/**
 * @since 2.0.0
 * @category Natural transformations
 */
export const fromIO: FromIO2<URI>['fromIO'] = rightIO
/**
 * @since 2.7.0
 * @category FromTask
 */
export const fromTask: FromTask2<URI>['fromTask'] = rightTask

/**
 * @since 2.7.0
 * @category FromTask
 */
export const fromEither: FromEither2<URI>['fromEither'] = AI.of

/**
 * @since 2.0.0
 * @category Natural transformations
 */
export const fromIOEither: FromIO1<URI>['fromIO'] = AI.fromIO

/**
 * @since 2.7.0
 * @category Natural transformations
 */
export const fromTaskEither: NaturalTransformation22<TE.URI, URI> = AI.fromTask

// -------------------------------------------------------------------------------------
// interop
// -------------------------------------------------------------------------------------

/**
 * @since 2.0.0
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
 * @since 2.5.0
 * @category Interop
 */
export const tryCatchK =
  <E, A extends ReadonlyArray<unknown>, B>(
    f: (...a: A) => AsyncIterable<B>,
    onRejected: (reason: unknown) => E
  ): ((...a: A) => AsyncIterEither<E, B>) =>
  (...a) =>
    tryCatch(() => f(...a), onRejected)

/**
 * @since 2.10.0
 * @category Interop
 */
export const toUnion: <E, A>(fa: AsyncIterEither<E, A>) => AsyncIter<E | A> =
  /*#__PURE__*/
  ET.toUnion(AI.Functor)

// -------------------------------------------------------------------------------------
// combinators
// -------------------------------------------------------------------------------------

/**
 * @since 2.0.0
 * @category Combinators
 */
export const orElse: <E1, A, E2>(
  onLeft: (e: E1) => AsyncIterEither<E2, A>
) => (ma: AsyncIterEither<E1, A>) => AsyncIterEither<E2, A> =
  /*#__PURE__*/
  ET.orElse(AI.Monad)

/**
 * Less strict version of [`orElse`](#orelse).
 *
 * @since 2.10.0
 * @category Combinators
 */
export const orElseW: <E1, E2, B>(
  onLeft: (e: E1) => AsyncIterEither<E2, B>
) => <A>(ma: AsyncIterEither<E1, A>) => AsyncIterEither<E2, A | B> =
  unsafeCoerce(orElse)

/**
 * @since 2.11.0
 * @category Combinators
 */
export const orElseFirst: <E, B>(
  onLeft: (e: E) => AsyncIterEither<E, B>
) => <A>(ma: AsyncIterEither<E, A>) => AsyncIterEither<E, A> =
  /*#__PURE__*/
  ET.orElseFirst(AI.Monad)

/**
 * @since 2.11.0
 * @category Combinators
 */
export const orElseFirstW: <E1, E2, B>(
  onLeft: (e: E1) => AsyncIterEither<E2, B>
) => <A>(ma: AsyncIterEither<E1, A>) => AsyncIterEither<E1 | E2, A> =
  unsafeCoerce(orElseFirst)

/**
 * @since 2.11.0
 * @category Combinators
 */
export const orLeft: <E1, E2>(
  onLeft: (e: E1) => AsyncIter<E2>
) => <A>(fa: AsyncIterEither<E1, A>) => AsyncIterEither<E2, A> =
  /*#__PURE__*/
  ET.orLeft(AI.Monad)

/**
 * @since 2.0.0
 * @category Combinators
 */
export const swap: <E, A>(ma: AsyncIterEither<E, A>) => AsyncIterEither<A, E> =
  /*#__PURE__*/
  ET.swap(AI.Functor)

/**
 * @since 2.4.0
 * @category Combinators
 */
export const fromIOEitherK = <E, A extends ReadonlyArray<unknown>, B>(
  f: (...a: A) => IOEither<E, B>
): ((...a: A) => AsyncIterEither<E, B>) => flow(f, fromIOEither)

/**
 * Less strict version of [`chainIOEitherK`](#chainioeitherk).
 *
 * @since 2.6.1
 * @category Combinators
 */
export const chainIOEitherKW: <E2, A, B>(
  f: (a: A) => IOEither<E2, B>
) => <E1>(ma: AsyncIterEither<E1, A>) => AsyncIterEither<E1 | E2, B> = (f) =>
  chainW(fromIOEitherK(f))

/**
 * @since 2.4.0
 * @category Combinators
 */
export const chainIOEitherK: <E, A, B>(
  f: (a: A) => IOEither<E, B>
) => (ma: AsyncIterEither<E, A>) => AsyncIterEither<E, B> = chainIOEitherKW

/**
 * @since 2.4.0
 * @category Combinators
 */
export const fromTaskEitherK = <E, A extends ReadonlyArray<unknown>, B>(
  f: (...a: A) => TaskEither<E, B>
): ((...a: A) => AsyncIterEither<E, B>) => flow(f, fromTaskEither)

/**
 * Less strict version of [`chainTaskEitherK`](#chainioeitherk).
 *
 * @since 2.6.1
 * @category Combinators
 */
export const chainTaskEitherKW: <E2, A, B>(
  f: (a: A) => TaskEither<E2, B>
) => <E1>(ma: AsyncIterEither<E1, A>) => AsyncIterEither<E1 | E2, B> = (f) =>
  chainW(fromTaskEitherK(f))

/**
 * @since 2.4.0
 * @category Combinators
 */
export const chainTaskEitherK: <E, A, B>(
  f: (a: A) => TaskEither<E, B>
) => (ma: AsyncIterEither<E, A>) => AsyncIterEither<E, B> = chainTaskEitherKW

// -------------------------------------------------------------------------------------
// non-pipeables
// -------------------------------------------------------------------------------------

const _map: Functor2<URI>['map'] = (fa, f) => pipe(fa, map(f))
const _apPar: Apply2<URI>['ap'] = (fab, fa) => pipe(fab, ap(fa))
const _apSeq: Apply2<URI>['ap'] = (fab, fa) =>
  pipe(
    fab,
    chain((f) => pipe(fa, map(f)))
  )
/* istanbul ignore next */
const _chain: Chain2<URI>['chain'] = (ma, f) => pipe(ma, chain(f))
/* istanbul ignore next */
const _bimap: Bifunctor2<URI>['bimap'] = (fa, f, g) => pipe(fa, bimap(f, g))
/* istanbul ignore next */
const _mapLeft: Bifunctor2<URI>['mapLeft'] = (fa, f) => pipe(fa, mapLeft(f))
/* istanbul ignore next */

// -------------------------------------------------------------------------------------
// type class members
// -------------------------------------------------------------------------------------

/**
 * `map` can be used to turn functions `(a: A) => B` into functions `(fa: F<A>)
 * => F<B>` whose argument and return types use the type constructor `F` to
 * represent some computational context.
 *
 * @since 2.0.0
 * @category Functor
 */
export const map: <A, B>(
  f: (a: A) => B
) => <E>(fa: AsyncIterEither<E, A>) => AsyncIterEither<E, B> =
  /*#__PURE__*/
  ET.map(AI.Functor)

/**
 * Map a pair of functions over the two type arguments of the bifunctor.
 *
 * @since 2.0.0
 * @category Bifunctor
 */
export const bimap: <E, G, A, B>(
  f: (e: E) => G,
  g: (a: A) => B
) => (fa: AsyncIterEither<E, A>) => AsyncIterEither<G, B> =
  /*#__PURE__*/
  ET.bimap(AI.Functor)

/**
 * Map a function over the first type argument of a bifunctor.
 *
 * @since 2.0.0
 * @category Bifunctor
 */
export const mapLeft: <E, G>(
  f: (e: E) => G
) => <A>(fa: AsyncIterEither<E, A>) => AsyncIterEither<G, A> =
  /*#__PURE__*/
  ET.mapLeft(AI.Functor)

/**
 * Apply a function to an argument under a type constructor.
 *
 * @since 2.0.0
 * @category Apply
 */
export const ap: <E, A>(
  fa: AsyncIterEither<E, A>
) => <B>(fab: AsyncIterEither<E, (a: A) => B>) => AsyncIterEither<E, B> =
  /*#__PURE__*/
  ET.ap(AI.ApplyPar)

/**
 * Less strict version of [`ap`](#ap).
 *
 * @since 2.8.0
 * @category Apply
 */
export const apW: <E2, A>(
  fa: AsyncIterEither<E2, A>
) => <E1, B>(
  fab: AsyncIterEither<E1, (a: A) => B>
) => AsyncIterEither<E1 | E2, B> = unsafeCoerce(ap)

/**
 * Composes computations in sequence, using the return value of one computation
 * to determine the next computation.
 *
 * @since 2.0.0
 * @category Monad
 */
export const chain: <E, A, B>(
  f: (a: A) => AsyncIterEither<E, B>
) => (ma: AsyncIterEither<E, A>) => AsyncIterEither<E, B> =
  /*#__PURE__*/
  ET.chain(AI.Monad)

/**
 * Less strict version of [`chain`](#chain).
 *
 * @since 2.6.0
 * @category Monad
 */
export const chainW: <E2, A, B>(
  f: (a: A) => AsyncIterEither<E2, B>
) => <E1>(ma: AsyncIterEither<E1, A>) => AsyncIterEither<E1 | E2, B> =
  unsafeCoerce(chain)

/**
 * Less strict version of [`flatten`](#flatten).
 *
 * @since 2.11.0
 * @category Combinators
 */
export const flattenW: <E1, E2, A>(
  mma: AsyncIterEither<E1, AsyncIterEither<E2, A>>
) => AsyncIterEither<E1 | E2, A> =
  /*#__PURE__*/
  chainW(identity)

/**
 * Derivable from `Chain`.
 *
 * @since 2.0.0
 * @category Combinators
 */
export const flatten: <E, A>(
  mma: AsyncIterEither<E, AsyncIterEither<E, A>>
) => AsyncIterEither<E, A> = flattenW

/**
 * @since 2.0.0
 * @category Pointed
 */
export const of: <E = never, A = never>(a: A) => AsyncIterEither<E, A> = right

/**
 * @since 2.7.0
 * @category MonadTask
 */
export const throwError: MonadThrow2<URI>['throwError'] = left

// -------------------------------------------------------------------------------------
// instances
// -------------------------------------------------------------------------------------

/**
 * @since 0.1.0
 * @category Instances
 */
export const URI = 'AsyncIter'

/**
 * @since 0.1.0
 * @category Instances
 */
export type URI = typeof URI

declare module 'fp-ts/lib/HKT' {
  interface URItoKind2<E, A> {
    readonly [URI]: AsyncIterEither<E, A>
  }
}

/**
 * @since 2.7.0
 * @category Instances
 */
export const Functor: Functor2<URI> = {
  URI,
  map: _map,
}

/**
 * Derivable from `Functor`.
 *
 * @since 2.10.0
 * @category Combinators
 */
export const flap =
  /*#__PURE__*/
  flap_(Functor)

/**
 * @since 2.10.0
 * @category Instances
 */
export const Pointed: Pointed2<URI> = {
  URI,
  of,
}

/**
 * @since 2.10.0
 * @category Instances
 */
export const ApplyPar: Apply2<URI> = {
  URI,
  map: _map,
  ap: _apPar,
}

/**
 * Combine two effectful actions, keeping only the result of the first.
 *
 * Derivable from `Apply`.
 *
 * @since 2.0.0
 * @category Combinators
 */
export const apFirst =
  /*#__PURE__*/
  apFirst_(ApplyPar)

/**
 * Less strict version of [`apFirst`](#apfirst).
 *
 * @since 2.12.0
 * @category Combinators
 */
export const apFirstW: <E2, A, B>(
  second: TaskEither<E2, B>
) => <E1>(first: TaskEither<E1, A>) => TaskEither<E1 | E2, A> = apFirst as any

/**
 * Combine two effectful actions, keeping only the result of the second.
 *
 * Derivable from `Apply`.
 *
 * @since 2.0.0
 * @category Combinators
 */
export const apSecond =
  /*#__PURE__*/
  apSecond_(ApplyPar)

/**
 * Less strict version of [`apSecond`](#apsecond).
 *
 * @since 2.12.0
 * @category Combinators
 */
export const apSecondW: <E2, A, B>(
  second: TaskEither<E2, B>
) => <E1>(first: TaskEither<E1, A>) => TaskEither<E1 | E2, B> = apSecond as any

/**
 * @since 2.7.0
 * @category Instances
 */
export const ApplicativePar: Applicative2<URI> = {
  URI,
  map: _map,
  ap: _apPar,
  of,
}

/**
 * @since 2.10.0
 * @category Instances
 */
export const ApplySeq: Apply2<URI> = {
  URI,
  map: _map,
  ap: _apSeq,
}

/**
 * @since 2.7.0
 * @category Instances
 */
export const ApplicativeSeq: Applicative2<URI> = {
  URI,
  map: _map,
  ap: _apSeq,
  of,
}

/**
 * @since 2.10.0
 * @category Instances
 */
export const Chain: Chain2<URI> = {
  URI,
  map: _map,
  ap: _apPar,
  chain: _chain,
}

/**
 * @since 2.10.0
 * @category Instances
 */
export const Monad: Monad2<URI> = {
  URI,
  map: _map,
  ap: _apPar,
  chain: _chain,
  of,
}

/**
 * @since 2.10.0
 * @category Instances
 */
export const MonadIO: MonadIO2<URI> = {
  URI,
  map: _map,
  ap: _apPar,
  chain: _chain,
  of,
  fromIO,
}

/**
 * @since 2.10.0
 * @category Instances
 */
export const MonadTask: MonadTask2<URI> = {
  URI,
  map: _map,
  ap: _apPar,
  chain: _chain,
  of,
  fromIO,
  fromTask,
}

/**
 * @since 2.10.0
 * @category Instances
 */
export const MonadThrow: MonadThrow2<URI> = {
  URI,
  map: _map,
  ap: _apPar,
  chain: _chain,
  of,
  throwError,
}

/**
 * Composes computations in sequence, using the return value of one computation
 * to determine the next computation and keeping only the result of the first.
 *
 * Derivable from `Chain`.
 *
 * @since 2.0.0
 * @category Combinators
 */
export const chainFirst: <E, A, B>(
  f: (a: A) => AsyncIterEither<E, B>
) => (ma: AsyncIterEither<E, A>) => AsyncIterEither<E, A> =
  /*#__PURE__*/
  chainFirst_(Chain)

/**
 * Less strict version of [`chainFirst`](#chainfirst).
 *
 * Derivable from `Chain`.
 *
 * @since 2.8.0
 * @category Combinators
 */
export const chainFirstW: <E2, A, B>(
  f: (a: A) => AsyncIterEither<E2, B>
) => <E1>(ma: AsyncIterEither<E1, A>) => AsyncIterEither<E1 | E2, A> =
  chainFirst as any

/**
 * @since 2.7.0
 * @category Instances
 */
export const Bifunctor: Bifunctor2<URI> = {
  URI,
  bimap: _bimap,
  mapLeft: _mapLeft,
}

/**
 * @since 2.10.0
 * @category Instances
 */
export const FromEither: FromEither2<URI> = {
  URI,
  fromEither,
}

/**
 * @since 2.0.0
 * @category Natural transformations
 */
export const fromOption =
  /*#__PURE__*/
  fromOption_(FromEither)

/**
 * @since 2.10.0
 * @category Combinators
 */
export const fromOptionK =
  /*#__PURE__*/
  fromOptionK_(FromEither)

/**
 * @since 2.10.0
 * @category Combinators
 */
export const chainOptionK =
  /*#__PURE__*/
  chainOptionK_(FromEither, Chain)

/**
 * @since 2.4.0
 * @category Combinators
 */
export const chainEitherK: <E, A, B>(
  f: (a: A) => E.Either<E, B>
) => (ma: AsyncIterEither<E, A>) => AsyncIterEither<E, B> =
  /*#__PURE__*/
  chainEitherK_(FromEither, Chain)

/**
 * Less strict version of [`chainEitherK`](#chaineitherk).
 *
 * @since 2.6.1
 * @category Combinators
 */
export const chainEitherKW: <E2, A, B>(
  f: (a: A) => Either<E2, B>
) => <E1>(ma: AsyncIterEither<E1, A>) => AsyncIterEither<E1 | E2, B> =
  chainEitherK as any

/**
 * @since 2.0.0
 * @category Constructors
 */
export const fromPredicate: {
  <E, A, B extends A>(refinement: Refinement<A, B>, onFalse: (a: A) => E): (
    a: A
  ) => AsyncIterEither<E, B>
  <E, A>(predicate: Predicate<A>, onFalse: (a: A) => E): <B>(
    b: B
  ) => AsyncIterEither<E, B>
  <E, A>(predicate: Predicate<A>, onFalse: (a: A) => E): (
    a: A
  ) => AsyncIterEither<E, A>
} =
  /*#__PURE__*/
  fromPredicate_(FromEither)

/**
 * @since 2.0.0
 * @category Combinators
 */
export const filterOrElse: {
  <E, A, B extends A>(refinement: Refinement<A, B>, onFalse: (a: A) => E): (
    ma: AsyncIterEither<E, A>
  ) => AsyncIterEither<E, B>
  <E, A>(predicate: Predicate<A>, onFalse: (a: A) => E): <B extends A>(
    mb: AsyncIterEither<E, B>
  ) => AsyncIterEither<E, B>
  <E, A>(predicate: Predicate<A>, onFalse: (a: A) => E): (
    ma: AsyncIterEither<E, A>
  ) => AsyncIterEither<E, A>
} =
  /*#__PURE__*/
  filterOrElse_(FromEither, Chain)

/**
 * Less strict version of [`filterOrElse`](#filterorelse).
 *
 * @since 2.9.0
 * @category Combinators
 */
export const filterOrElseW: {
  <A, B extends A, E2>(refinement: Refinement<A, B>, onFalse: (a: A) => E2): <
    E1
  >(
    ma: AsyncIterEither<E1, A>
  ) => AsyncIterEither<E1 | E2, B>
  <A, E2>(predicate: Predicate<A>, onFalse: (a: A) => E2): <E1, B extends A>(
    mb: AsyncIterEither<E1, B>
  ) => AsyncIterEither<E1 | E2, B>
  <A, E2>(predicate: Predicate<A>, onFalse: (a: A) => E2): <E1>(
    ma: AsyncIterEither<E1, A>
  ) => AsyncIterEither<E1 | E2, A>
} = filterOrElse

/**
 * @since 2.4.0
 * @category Combinators
 */
export const fromEitherK: <E, A extends ReadonlyArray<unknown>, B>(
  f: (...a: A) => E.Either<E, B>
) => (...a: A) => AsyncIterEither<E, B> =
  /*#__PURE__*/
  fromEitherK_(FromEither)

/**
 * @since 2.10.0
 * @category Instances
 */
export const FromIO: FromIO2<URI> = {
  URI,
  fromIO,
}

/**
 * @since 2.10.0
 * @category Combinators
 */
export const fromIOK =
  /*#__PURE__*/
  fromIOK_(FromIO)

/**
 * @since 2.10.0
 * @category Combinators
 */
export const chainIOK =
  /*#__PURE__*/
  chainIOK_(FromIO, Chain)

/**
 * @since 2.10.0
 * @category Combinators
 */
export const chainFirstIOK =
  /*#__PURE__*/
  chainFirstIOK_(FromIO, Chain)

/**
 * @since 2.10.0
 * @category Instances
 */
export const FromTask: FromTask2<URI> = {
  URI,
  fromIO,
  fromTask,
}

/**
 * @since 2.10.0
 * @category Combinators
 */
export const fromTaskK =
  /*#__PURE__*/
  fromTaskK_(FromTask)

/**
 * @since 2.10.0
 * @category Combinators
 */
export const chainTaskK =
  /*#__PURE__*/
  chainTaskK_(FromTask, Chain)

/**
 * @since 2.10.0
 * @category Combinators
 */
export const chainFirstTaskK =
  /*#__PURE__*/
  chainFirstTaskK_(FromTask, Chain)
