import { readonlyArray as RA, task as T } from 'fp-ts'
import { Applicative1 } from 'fp-ts/lib/Applicative'
import {
  apFirst as apFirst_,
  Apply1,
  apSecond as apSecond_,
} from 'fp-ts/lib/Apply'
import { Chain1, chainFirst as chainFirst_ } from 'fp-ts/lib/Chain'
import {
  chainFirstIOK as chainFirstIOK_,
  chainIOK as chainIOK_,
  FromIO1,
  fromIOK as fromIOK_,
} from 'fp-ts/lib/FromIO'
import {
  chainFirstTaskK as chainFirstTaskK_,
  chainTaskK as chainTaskK_,
  FromTask1,
  fromTaskK as fromTaskK_,
} from 'fp-ts/lib/FromTask'
import { flow, identity, pipe } from 'fp-ts/lib/function'
import { flap as flap_, Functor1 } from 'fp-ts/lib/Functor'
import { Monad1 } from 'fp-ts/lib/Monad'
import { MonadIO1 } from 'fp-ts/lib/MonadIO'
import { MonadTask1 } from 'fp-ts/lib/MonadTask'
import { Pointed1 } from 'fp-ts/lib/Pointed'
import { Task } from 'fp-ts/lib/Task'
import { Subject } from './internal/Subject'

// -------------------------------------------------------------------------------------
// model
// -------------------------------------------------------------------------------------

/**
 * @since 2.0.0
 * @category Model
 */
export interface AsyncIter<A> {
  (): AsyncIterable<A>
}

// -------------------------------------------------------------------------------------
// natural transformations
// -------------------------------------------------------------------------------------

/**
 * @since 2.0.0
 * @category Natural transformations
 */
export const fromIO: FromIO1<URI>['fromIO'] = (ma) =>
  async function* () {
    yield ma()
  }

/**
 * @since 2.7.0
 * @category FromTask
 */
export const fromTask: FromTask1<URI>['fromTask'] = (ma) =>
  async function* () {
    yield await ma()
  }

// -------------------------------------------------------------------------------------
// constructors
// -------------------------------------------------------------------------------------

/**
 * @since 2.7.0
 * @category Constructors
 */
export const fromIterableK: <A extends ReadonlyArray<unknown>, B>(
  f: (...a: A) => Iterable<B>
) => (...a: A) => AsyncIter<B> =
  (f) =>
  (...a) =>
    async function* () {
      for (const val of f(...a)) {
        yield val
      }
    }

/**
 * @since 2.7.0
 * @category Constructors
 */
export const fromIterable: <A>(iter: Iterable<A>) => AsyncIter<A> =
  fromIterableK(identity)

/**
 * @since 2.7.0
 * @category Constructors
 */
export const fromAsyncIterableK: <A extends ReadonlyArray<unknown>, B>(
  f: (...a: A) => AsyncIterable<B>
) => (...a: A) => AsyncIter<B> =
  (f) =>
  (...a) =>
    async function* () {
      for await (const val of f(...a)) {
        yield val
      }
    }

/**
 * @since 2.7.0
 * @category Constructors
 */
export const fromAsyncIterable: <A>(iter: AsyncIterable<A>) => AsyncIter<A> =
  fromAsyncIterableK(identity)

// -------------------------------------------------------------------------------------
// destructors
// -------------------------------------------------------------------------------------

/**
 * @since 0.1.0
 * @category Destructors
 */
export const toReadonlyArray: <A>(
  iter: AsyncIter<A>
) => Task<ReadonlyArray<A>> = (iter) => async () => {
  const result = []
  for await (const i of iter()) {
    result.push(i)
  }
  return result
}

/**
 * @since 0.1.0
 * @category Destructors
 */
export const toArray: <A>(as: AsyncIter<A>) => Task<Array<A>> = flow(
  toReadonlyArray,
  T.map(RA.toArray)
)

// -------------------------------------------------------------------------------------
// non-pipeables
// -------------------------------------------------------------------------------------

const _map: Functor1<URI>['map'] = (fa, f) => pipe(fa, map(f))
const _apPar: Apply1<URI>['ap'] = (fab, fa) => pipe(fab, ap(fa))
const _apSeq: Apply1<URI>['ap'] = (fab, fa) =>
  pipe(
    fab,
    chain((f) => pipe(fa, map(f)))
  )
const _chain: Chain1<URI>['chain'] = (ma, f) => pipe(ma, chain(f))
const _of = <A>(...values: A[]): AsyncIter<A> =>
  async function* () {
    for (const val of values) {
      yield val
    }
  }

// -------------------------------------------------------------------------------------
// type class members
// -------------------------------------------------------------------------------------

/**
 * @since 0.1.0
 * @category Functor
 */
export const map: <A, B>(
  f: (a: A) => B
) => (fa: AsyncIter<A>) => AsyncIter<B> = (f) => (iter) =>
  async function* () {
    for await (const i of iter()) {
      yield f(i)
    }
  }

/**
 * @since 0.1.0
 * @category Apply
 */
export const ap: <A>(
  fa: AsyncIter<A>
) => <B>(fab: AsyncIter<(a: A) => B>) => AsyncIter<B> = (fa) =>
  chain((f) => pipe(fa, map(f)))

/**
 * @since 2.0.0
 * @category Pointed
 */
export const of: Pointed1<URI>['of'] = _of

/**
 * @since 0.1.0
 * @category Monad
 */
export const chain: <A, B>(
  f: (a: A) => AsyncIter<B>
) => (ma: AsyncIter<A>) => AsyncIter<B> = (f) => (iter) =>
  async function* () {
    for await (const i of iter()) {
      for await (const j of f(i)()) {
        yield j
      }
    }
  }

/**
 * @since 0.1.0
 * @category Combinators
 */
export const flatten: <A>(mma: AsyncIter<AsyncIter<A>>) => AsyncIter<A> =
  /*#__PURE__*/
  chain(identity)

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
  interface URItoKind<A> {
    readonly [URI]: AsyncIter<A>
  }
}

/**
 * @since 2.7.0
 * @category Instances
 */
export const Functor: Functor1<URI> = {
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
export const Pointed: Pointed1<URI> = {
  URI,
  of,
}

/**
 * @since 2.10.0
 * @category Instances
 */
export const ApplyPar: Apply1<URI> = {
  URI,
  map: _map,
  ap: _apPar,
}

/**
 * @since 2.0.0
 * @category Combinators
 */
export const apFirst =
  /*#__PURE__*/
  apFirst_(ApplyPar)

/**
 * @since 2.0.0
 * @category Combinators
 */
export const apSecond =
  /*#__PURE__*/
  apSecond_(ApplyPar)

/**
 * @since 2.7.0
 * @category Instances
 */
export const ApplicativePar: Applicative1<URI> = {
  URI,
  map: _map,
  ap: _apPar,
  of,
}

/**
 * @since 2.10.0
 * @category Instances
 */
export const ApplySeq: Apply1<URI> = {
  URI,
  map: _map,
  ap: _apSeq,
}

/**
 * @since 2.7.0
 * @category Instances
 */
export const ApplicativeSeq: Applicative1<URI> = {
  URI,
  map: _map,
  ap: _apSeq,
  of,
}

/**
 * @since 2.10.0
 * @category Instances
 */
export const Chain: Chain1<URI> = {
  URI,
  map: _map,
  ap: _apPar,
  chain: _chain,
}

/**
 * @since 2.10.0
 * @category Instances
 */
export const Monad: Monad1<URI> = {
  URI,
  map: _map,
  of,
  ap: _apPar,
  chain: _chain,
}

/**
 * @since 2.10.0
 * @category Instances
 */
export const MonadIO: MonadIO1<URI> = {
  URI,
  map: _map,
  of,
  ap: _apPar,
  chain: _chain,
  fromIO,
}

/**
 * @since 2.10.0
 * @category Instances
 */
export const MonadTask: MonadTask1<URI> = {
  URI,
  map: _map,
  of,
  ap: _apPar,
  chain: _chain,
  fromIO,
  fromTask,
}

/**
 * @since 2.0.0
 * @category Combinators
 */
export const chainFirst =
  /*#__PURE__*/
  chainFirst_(Chain)

/**
 * @since 2.10.0
 * @category Instances
 */
export const FromIO: FromIO1<URI> = {
  URI,
  fromIO,
}

/**
 * @since 2.4.0
 * @category Combinators
 */
export const fromIOK =
  /*#__PURE__*/
  fromIOK_(FromIO)

/**
 * @since 2.4.0
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
export const FromTask: FromTask1<URI> = {
  URI,
  fromIO,
  fromTask,
}

/**
 * @since 2.4.0
 * @category Combinators
 */
export const fromTaskK =
  /*#__PURE__*/
  fromTaskK_(FromTask)

/**
 * @since 2.4.0
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

// -------------------------------------------------------------------------------------
// utils
// -------------------------------------------------------------------------------------

/**
 * Replay emitted values for each subscriber
 *
 * @since 0.1.0
 */
export function replay<A>(iter: AsyncIter<A>): AsyncIter<A> {
  let subject: Subject<A>

  return async function* () {
    const source = subject ?? iter()
    const dest = (subject = new Subject())
    for await (const item of source) {
      dest.onNext(item)
      yield item
    }
    dest.onReturn()
  }
}
