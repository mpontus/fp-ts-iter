/**
 * ```ts
 * interface AsyncIter<A> {
 *   (): AsyncIterable<A>
 * }
 * ```
 *
 * `AsyncIter<A>` represents an async generator function with no arguments or
 * `Lazy<AsyncIterable<A>>`.
 *
 * @since 0.1.0
 */
import {
  either as E,
  option as O,
  reader,
  readonlyArray as RA,
  task as T,
} from 'fp-ts'
import { Alt1 } from 'fp-ts/lib/Alt'
import { Alternative1 } from 'fp-ts/lib/Alternative'
import { Applicative1 } from 'fp-ts/lib/Applicative'
import {
  apFirst as apFirst_,
  Apply1,
  apSecond as apSecond_,
  sequenceS,
} from 'fp-ts/lib/Apply'
import { Chain1, chainFirst as chainFirst_ } from 'fp-ts/lib/Chain'
import { Compactable1 } from 'fp-ts/lib/Compactable'
import { Either } from 'fp-ts/lib/Either'
import { Filterable1 } from 'fp-ts/lib/Filterable'
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
import { flow, identity, Lazy, pipe } from 'fp-ts/lib/function'
import { flap as flap_, Functor1 } from 'fp-ts/lib/Functor'
import { IO } from 'fp-ts/lib/IO'
import { Monad1 } from 'fp-ts/lib/Monad'
import { MonadIO1 } from 'fp-ts/lib/MonadIO'
import { MonadTask1 } from 'fp-ts/lib/MonadTask'
import { Monoid } from 'fp-ts/lib/Monoid'
import { Option } from 'fp-ts/lib/Option'
import { Pointed1 } from 'fp-ts/lib/Pointed'
import { Predicate } from 'fp-ts/lib/Predicate'
import { Refinement } from 'fp-ts/lib/Refinement'
import { Semigroup } from 'fp-ts/lib/Semigroup'
import { Separated } from 'fp-ts/lib/Separated'
import { Task } from 'fp-ts/lib/Task'
import { guard as guard_, Zero1 } from 'fp-ts/lib/Zero'
import { Deferred } from './internal/Deferred'
import { Subject } from './internal/Subject'

// -------------------------------------------------------------------------------------
// model
// -------------------------------------------------------------------------------------

/**
 * @since 0.1.0
 * @category Model
 */
export interface AsyncIter<A> {
  (): AsyncIterable<A>
}

// -------------------------------------------------------------------------------------
// natural transformations
// -------------------------------------------------------------------------------------

/**
 * Return an `AsyncIter` which yields only the value of the given `IO`.
 *
 * @since 0.1.0
 * @category Natural transformations
 */
export const fromIO: FromIO1<URI>['fromIO'] = (ma) =>
  async function* () {
    yield ma()
  }

/**
 * Return an `AsyncIter` which yields only the value of the given `Task`.
 *
 * @since 0.1.0
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
 * Returns a constructor, that passes its arguments to the given `Iterable`
 * constructor and returns an `AsyncIter` that yields the same elements.
 *
 * @since 0.1.0
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
 * Returns an `AsyncIter` that yields the elements of the given `Iterable`.
 *
 * @since 0.1.0
 * @category Constructors
 */
export const fromIterable: <A>(iter: Iterable<A>) => AsyncIter<A> =
  fromIterableK(identity)

/**
 * Returns a constructor, that passes its arguments to the given `AsyncIterable`
 * constructor and returns an `AsyncIter` that yields the same elements.
 *
 * @since 0.1.0
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
 * Returns an `AsyncIter` that yields the elements of the given `AsyncIterable`.
 *
 * @since 0.1.0
 * @category Constructors
 */
export const fromAsyncIterable: <A>(iter: AsyncIterable<A>) => AsyncIter<A> =
  fromAsyncIterableK(identity)

// -------------------------------------------------------------------------------------
// destructors
// -------------------------------------------------------------------------------------

/**
 * Returns a `Task` of readonly array containing the elements of the given `AsyncIter`.
 *
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
 * Returns a `Task` of array containing the elements of the given `AsyncIter`.
 *
 * @since 0.1.0
 * @category Destructors
 */
export const toArray: <A>(as: AsyncIter<A>) => Task<Array<A>> = flow(
  toReadonlyArray,
  T.map(RA.toArray)
)

/**
 * Returns a `Task` of value produced by applying the given function to the
 * elements of the given `AsyncIter` and concatenating the results using the
 * given monoid.
 *
 * @since 0.1.0
 * @category Destructors
 */
export const foldMap: <M>(
  M: Monoid<M>
) => <A>(f: (a: A) => M) => (fa: AsyncIter<A>) => Task<M> =
  (M) => (f) => (fa) => async () => {
    let result = M.empty
    for await (const a of fa()) {
      result = M.concat(result, f(a))
    }
    return result
  }

/**
 * Returns a `Task` containing last value produced by applying the given
 * function to each element of the given `AsyncIter`, passing it the result of
 * the previous call and starting with the initial value.
 *
 * @since 0.1.0
 * @category Destructors
 */
export const reduce: <A, B>(
  b: B,
  f: (b: B, a: A) => B
) => (fa: AsyncIter<A>) => Task<B> = (b, f) => (fa) => async () => {
  for await (const a of fa()) {
    b = f(b, a)
  }
  return b
}

// -------------------------------------------------------------------------------------
// combinators
// -------------------------------------------------------------------------------------

/**
 * Returns an `AsyncIter` that yields the values produced by applying the given
 * function to the elements of the given `AsyncIter`, passing it the result of
 * the previous call and starting with the initial value.
 *
 * @since 0.1.0
 * @category Combinators
 */
export const scan: <A, B>(
  b: B,
  f: (b: B, a: A) => B
) => (iter: AsyncIter<A>) => AsyncIter<B> = (b, f) => (iter) =>
  async function* () {
    for await (const a of iter()) {
      yield (b = f(b, a))
    }
  }

/**
 * Merge `AsyncIterable`s into a single `AsyncIterable`
 *
 * @internal
 */
/// See https://stackoverflow.com/a/50586391/326574
async function* _concat<A>(iterables: AsyncIterable<A>[]): AsyncIterable<A> {
  const asyncIterators = Array.from(iterables, (o) => o[Symbol.asyncIterator]())
  const results = []
  let count = asyncIterators.length

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  const never = new Promise<never>(() => {})
  function getNext(asyncIterator: AsyncIterator<A>, index: number) {
    return asyncIterator.next().then((result) => ({
      index,
      result,
    }))
  }
  const nextPromises = asyncIterators.map(getNext)
  try {
    while (count) {
      const { index, result } = await Promise.race(nextPromises)
      if (result.done) {
        nextPromises[index] = never
        results[index] = result.value
        count--
      } else {
        nextPromises[index] = getNext(asyncIterators[index], index)
        yield result.value
      }
    }
  } finally {
    for (const [index, iterator] of asyncIterators.entries())
      if (nextPromises[index] != never && iterator.return != null)
        iterator.return()
    // no await here - see https://github.com/tc39/proposal-async-iteration/issues/126
  }
  return results
}

/**
 * Returns an `AsyncIter` that yields the values from both given `AsyncIter`s.
 *
 * This function subscribes to both `AsyncIter`s and yields their values in
 * parallel. Use `altW` if you want to concatenate their values sequentially.
 *
 * @since 0.1.0
 * @category Combinators
 */
export const concatW =
  <B>(second: AsyncIter<B>) =>
  <A>(first: AsyncIter<A>): AsyncIter<B | A> =>
  () =>
    _concat<A | B>([first(), second()])

/**
 * Returns an `AsyncIter` that yields the values from both given `AsyncIter`s.
 *
 * This function subscribes to both `AsyncIter`s and yields their values in
 * parallel. Use `altW` if you want to concatenate their values sequentially.
 *
 * @since 0.1.0
 * @category Combinators
 */
export const concat: <A>(
  second: AsyncIter<A>
) => (first: AsyncIter<A>) => AsyncIter<A> = concatW

// -------------------------------------------------------------------------------------
// non-pipeables
// -------------------------------------------------------------------------------------

const _map: Functor1<URI>['map'] = (fa, f) => pipe(fa, map(f))
const _ap: Apply1<URI>['ap'] = (fab, fa) => pipe(fab, ap(fa))
const _chain: Chain1<URI>['chain'] = (ma, f) => pipe(ma, chain(f))
const _filter: Filterable1<URI>['filter'] = <A>(
  fa: AsyncIter<A>,
  predicate: Predicate<A>
) => pipe(fa, filter(predicate))
/* istanbul ignore next */
const _filterMap: Filterable1<URI>['filterMap'] = (fa, f) =>
  pipe(fa, filterMap(f))
/* istanbul ignore next */
const _partition: Filterable1<URI>['partition'] = <A>(
  fa: AsyncIter<A>,
  predicate: Predicate<A>
) => pipe(fa, partition(predicate))
/* istanbul ignore next */
const _partitionMap: Filterable1<URI>['partitionMap'] = (fa, f) =>
  pipe(fa, partitionMap(f))
const _alt: Alt1<URI>['alt'] = (fa, that) => pipe(fa, alt(that))

// -------------------------------------------------------------------------------------
// type class members
// -------------------------------------------------------------------------------------

/**
 * Returns an `AsyncIter` containing only a given element.
 *
 * @since 0.1.0
 * @category Pointed
 */
export const of: Pointed1<URI>['of'] = flow(RA.of, fromIterable)

/**
 * Returns a constructor for an empty `AsyncIter`.
 *
 * @since 0.1.0
 * @category Zero
 */
export const zero: Zero1<URI>['zero'] = () => fromIterable([])

/**
 * Returns an `AsyncIter` that yields the results of applying a given function
 * to the elements of the first `AsyncIter`.
 *
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
 * Returns an `AsyncIter` that yields the results of applying each function in
 * the first `AsyncIter` to the elements of the second `AsyncIter`.
 *
 * @since 0.1.0
 * @category Apply
 */
export const ap: <A>(
  fa: AsyncIter<A>
) => <B>(fab: AsyncIter<(a: A) => B>) => AsyncIter<B> = (fa) =>
  chain((f) => pipe(fa, map(f)))

/**
 * Returns an `AsyncIter` that yields the elements of each `AsyncIter` produced
 * by applying a given function to the elements of the first `AsyncIter`.
 *
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
 * Returns an `AsyncIter` that yields the elements from each `AsyncIter`
 * produced by the first `AsyncIter`.
 *
 * @since 0.1.0
 * @category Combinators
 */
export const flatten: <A>(mma: AsyncIter<AsyncIter<A>>) => AsyncIter<A> =
  /*#__PURE__*/
  chain(identity)

/**
 * Omit the elements of an `AsyncIter` according to a mapping function.
 *
 * @since 0.1.0
 * @category Filterable
 */
export const filterMap: <A, B>(
  f: (a: A) => Option<B>
) => (fa: AsyncIter<A>) => AsyncIter<B> = (f) => (fa) =>
  async function* () {
    for await (const item of fa()) {
      const optionB = f(item)
      if (O.isSome(optionB)) {
        yield optionB.value
      }
    }
  }

/**
 * Separate the elements of an `AsyncIter` into two `AsyncIter`s according to a
 * mapping function.
 *
 * @since 0.1.0
 * @category Filterable
 */
export const partitionMap =
  <A, B, C>(f: (a: A) => Either<B, C>) =>
  (fa: AsyncIter<A>): Separated<AsyncIter<B>, AsyncIter<C>> =>
    pipe(
      replay(fa),
      map(f),
      sequenceS(reader.Monad)({
        left: filterMap(E.fold(O.some, () => O.none)),
        right: filterMap(E.fold(() => O.none, O.some)),
      })
    )

/**
 * Omit the elements of an `AsyncIter` that fail to satisfy a predicate.
 *
 * @since 0.1.0
 * @category Filterable
 */
export const filter: {
  <A, B extends A>(refinement: Refinement<A, B>): (
    iter: AsyncIter<A>
  ) => AsyncIter<B>
  <A>(predicate: Predicate<A>): (iter: AsyncIter<A>) => AsyncIter<A>
} = flow(O.fromPredicate, filterMap)

/**
 * Separate the elements of an `AsyncIter` into two `AsyncIter`s according to a predicate.
 *
 * @since 0.1.0
 * @category Filterable
 */
export const partition: {
  <A, B extends A>(refinement: Refinement<A, B>): (
    fa: AsyncIter<A>
  ) => Separated<AsyncIter<A>, AsyncIter<B>>
  <A>(predicate: Predicate<A>): (
    fa: AsyncIter<A>
  ) => Separated<AsyncIter<A>, AsyncIter<A>>
} = <A>(predicate: Predicate<A>) =>
  partitionMap(E.fromPredicate(predicate, identity))

/**
 * Transform `AsyncIter<Option<A>>` to `AsyncIter<A>`
 *
 * @since 0.1.0
 * @category Compactable
 */
export const compact: Filterable1<URI>['compact'] =
  /*#__PURE__*/
  filterMap(identity)

/**
 * Separate `AsyncIter<Either<E, A>>` into `AsyncIter<E>` and `AsyncIter<A>`
 *
 * @since 0.1.0
 * @category Compactable
 */
export const separate: Filterable1<URI>['separate'] =
  /*#__PURE__*/
  partitionMap(identity)

/**
 * Returns an `AsyncIter` that yields the elements of the first `AsyncIter`
 * followed by the elements of the second `AsyncIter`.
 *
 * @since 0.1.0
 * @category Alt
 */
export const altW =
  <B>(that: Lazy<AsyncIter<B>>) =>
  <A>(fa: AsyncIter<A>): AsyncIter<A | B> =>
    async function* () {
      yield* fa()
      yield* that()()
    }

/**
 * Returns an `AsyncIter` that yields the elements of the first `AsyncIter`
 * followed by the elements of the second `AsyncIter`.
 *
 * @since 0.1.0
 * @category Alt
 */
export const alt: <A>(
  that: Lazy<AsyncIter<A>>
) => (fa: AsyncIter<A>) => AsyncIter<A> = altW

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
 * Returns an instance of `Semigroup` type class for `AsyncIter`.
 *
 * @since 0.1.0
 * @category Instances
 */
export const getSemigroup = <A = never>(): Semigroup<AsyncIter<A>> => ({
  concat: (first, second) => pipe(first, concat(second)),
})

/**
 * Returns an instance of `Monoid` type class for `AsyncIter`.
 *
 * @since 0.1.0
 * @category Instances
 */
export const getMonoid = <A = never>(): Monoid<AsyncIter<A>> => ({
  ...getSemigroup<A>(),
  empty,
})

/**
 * Instance of `Pointed` type class.
 *
 * @since 0.1.0
 * @category Instances
 */
export const Functor: Functor1<URI> = {
  URI,
  map: _map,
}

/**
 * Returns an `AsyncIter` which yields the values produced by applying functions
 * emitted by the first `AsyncIter` to the given value.
 *
 * @since 0.1.0
 * @category Combinators
 */
export const flap: <A>(
  a: A
) => <B>(fab: AsyncIter<(a: A) => B>) => AsyncIter<B> =
  /*#__PURE__*/
  flap_(Functor)

/**
 * Instance of `Pointed` type class.
 *
 * @since 0.1.0
 * @category Instances
 */
export const Pointed: Pointed1<URI> = {
  URI,
  of,
}

/**
 * Instance of `Apply` type class.
 *
 * @since 0.1.0
 * @category Instances
 */
export const Apply: Apply1<URI> = {
  URI,
  map: _map,
  ap: _ap,
}

/**
 * Combine effectful actions of two `AsyncIter`s keeping only the results of the first.
 *
 * @since 0.1.0
 * @category Combinators
 */
export const apFirst: <B>(
  second: AsyncIter<B>
) => <A>(first: AsyncIter<A>) => AsyncIter<A> =
  /*#__PURE__*/
  apFirst_(Apply)

/**
 * Combine effectful actions of two `AsyncIter`s keeping only the results of the second.
 *
 * @since 0.1.0
 * @category Combinators
 */
export const apSecond: <B>(
  second: AsyncIter<B>
) => <A>(first: AsyncIter<A>) => AsyncIter<B> =
  /*#__PURE__*/
  apSecond_(Apply)

/**
 * Instance of `Applicative` type class.
 *
 * @since 0.1.0
 * @category Instances
 */
export const Applicative: Applicative1<URI> = {
  URI,
  map: _map,
  ap: _ap,
  of,
}

/**
 * Instance of `Chain` type class.
 *
 * @since 0.1.0
 * @category Instances
 */
export const Chain: Chain1<URI> = {
  URI,
  map: _map,
  ap: _ap,
  chain: _chain,
}

/**
 * @since 0.1.0
 * @category Combinators
 */
export const chainFirst: <A, B>(
  f: (a: A) => AsyncIter<B>
) => (first: AsyncIter<A>) => AsyncIter<A> =
  /*#__PURE__*/
  chainFirst_(Chain)

/**
 * Instance of `Monad` type class.
 *
 * @since 0.1.0
 * @category Instances
 */
export const Monad: Monad1<URI> = {
  URI,
  map: _map,
  of,
  ap: _ap,
  chain: _chain,
}

/**
 * Instance of `MonadIO` type class.
 *
 * @since 0.1.0
 * @category Instances
 */
export const MonadIO: MonadIO1<URI> = {
  URI,
  map: _map,
  of,
  ap: _ap,
  chain: _chain,
  fromIO,
}

/**
 * Instance of `MonadTask` type class.
 *
 * @since 0.1.0
 * @category Instances
 */
export const MonadTask: MonadTask1<URI> = {
  URI,
  map: _map,
  of,
  ap: _ap,
  chain: _chain,
  fromIO,
  fromTask,
}

/**
 * Instance of `Alt` type class.
 *
 * @since 0.1.0
 * @category Instances
 */
export const Alt: Alt1<URI> = {
  URI,
  map: _map,
  alt: _alt,
}

/**
 * Instance of `Alternative` type class.
 *
 * @since 0.1.0
 * @category Instances
 */
export const Alternative: Alternative1<URI> = {
  URI,
  map: _map,
  ap: _ap,
  of,
  alt: _alt,
  zero,
}

/**
 * Instance of `Compactable` type class.
 *
 * @since 0.1.0
 * @category Instances
 */
export const Compactable: Compactable1<URI> = {
  URI,
  compact,
  separate,
}

/**
 * Instance of `Filterable` type class.
 *
 * @since 0.1.0
 * @category Instances
 */
export const Filterable: Filterable1<URI> = {
  URI,
  map: _map,
  compact,
  separate,
  filter: _filter,
  filterMap: _filterMap,
  partition: _partition,
  partitionMap: _partitionMap,
}

/**
 * Instance of `FromIO` type class.
 *
 * @since 0.1.0
 * @category Instances
 */
export const FromIO: FromIO1<URI> = {
  URI,
  fromIO,
}

/**
 * Returns an `AsyncIter` constructor that passes its arguments to the `IO`
 * constructor, and produces an `AsyncIter` that only yields the value of the
 * produced `IO`.
 *
 * @since 0.1.0
 * @category Combinators
 */
export const fromIOK: <A extends ReadonlyArray<unknown>, B>(
  f: (...a: A) => IO<B>
) => (...a: A) => AsyncIter<B> =
  /*#__PURE__*/
  fromIOK_(FromIO)

/**
 * Return an `AsyncIter` which yields the values from the `IO`s produced by
 * applying a given function to the elements of the first `AsyncIter`.
 *
 * @since 0.1.0
 * @category Combinators
 */
export const chainIOK: <A, B>(
  f: (a: A) => IO<B>
) => (first: AsyncIter<A>) => AsyncIter<B> =
  /*#__PURE__*/
  chainIOK_(FromIO, Chain)

/**
 * @since 0.1.0
 * @category Combinators
 */
export const chainFirstIOK: <A, B>(
  f: (a: A) => IO<B>
) => (first: AsyncIter<A>) => AsyncIter<A> =
  /*#__PURE__*/
  chainFirstIOK_(FromIO, Chain)

/**
 * Instance of `FromTask` type class.
 *
 * @since 0.1.0
 * @category Instances
 */
export const FromTask: FromTask1<URI> = {
  URI,
  fromIO,
  fromTask,
}

/**
 * Returns an `AsyncIter` constructor that passes its arguments to the `Task`
 * constructor, and produces an `AsyncIter` that only yields the value of the
 * produced `Task`.
 *
 * @since 0.1.0
 * @category Combinators
 */
export const fromTaskK: <A extends ReadonlyArray<unknown>, B>(
  f: (...a: A) => Task<B>
) => (...a: A) => AsyncIter<B> =
  /*#__PURE__*/
  fromTaskK_(FromTask)

/**
 * Return an `AsyncIter` which yields the values from the `IO`s produced by
 * applying a given function to the elements of the first `AsyncIter`.
 *
 * @since 0.1.0
 * @category Combinators
 */
export const chainTaskK: <A, B>(
  f: (a: A) => Task<B>
) => (first: AsyncIter<A>) => AsyncIter<B> =
  /*#__PURE__*/
  chainTaskK_(FromTask, Chain)

/**
 * @since 0.1.0
 * @category Combinators
 */
export const chainFirstTaskK: <A, B>(
  f: (a: A) => Task<B>
) => (first: AsyncIter<A>) => AsyncIter<A> =
  /*#__PURE__*/
  chainFirstTaskK_(FromTask, Chain)

// -------------------------------------------------------------------------------------
// concurrency
// -------------------------------------------------------------------------------------

/**
 * Concurrent version of `chain`, which runs the specified number of promises in parallel.
 *
 * @since 0.1.0
 * @category Monad
 */
export const chainC =
  (concurrency: number) =>
  <A, B>(f: (a: A) => AsyncIter<B>) =>
  (ma: AsyncIter<A>): AsyncIter<B> =>
  () => {
    const subject = new Subject<B>()
    let deferred = new Deferred<void>()
    let running = 0
    let isComplete = false
    ;(async () => {
      for await (const a of ma()) {
        const mb = f(a)

        if (++running >= concurrency) {
          deferred = new Deferred()
        }

        ;(async () => {
          for await (const b of mb()) {
            subject.onNext(b)
          }

          if (--running < concurrency) {
            deferred.onResolve()
          }

          if (isComplete && running == 0) {
            subject.onReturn()
          }
        })()

        await deferred
      }

      if (running == 0) {
        subject.onReturn()
      }

      isComplete = true
    })()

    deferred.onResolve()

    return subject
  }

/**
 * Concurrent version of `ap`, which runs the specified number of promises in parallel.
 *
 * @since 0.1.0
 * @category Apply
 */

export const apC =
  (concurrency: number) =>
  <A>(fa: AsyncIter<A>) =>
  <B>(fab: AsyncIter<(a: A) => B>): AsyncIter<B> =>
    pipe(
      fab,
      chainC(concurrency)((f) => pipe(fa, map(f)))
    )

const _apC =
  (concurrency: number): Apply1<URI>['ap'] =>
  (fab, fa) =>
    apC(concurrency)(fa)(fab)
const _chainC =
  (concurrency: number): Chain1<URI>['chain'] =>
  (fa, f) =>
    chainC(concurrency)(f)(fa)

/**
 * @since 0.1.0
 * @category Instances
 */
export const getApplyC = (concurrency: number): Apply1<URI> => ({
  URI,
  map: _map,
  ap: _apC(concurrency),
})

/**
 * @since 0.1.0
 * @category Combinators
 */
export const apFirstC = (concurrency: number): typeof apFirst =>
  /*#__PURE__*/
  apFirst_(getApplyC(concurrency))

/**
 * @since 0.1.0
 * @category Combinators
 */
export const apSecondC = (concurrency: number): typeof apSecond =>
  /*#__PURE__*/
  apSecond_(getApplyC(concurrency))

/**
 * @since 0.1.0
 * @category Instances
 */
export const getApplicativeC = (concurrency: number): Applicative1<URI> => ({
  URI,
  map: _map,
  ap: _apC(concurrency),
  of,
})

/**
 * @since 0.1.0
 * @category Instances
 */
export const getChainC = (concurrency: number): Chain1<URI> => ({
  URI,
  map: _map,
  ap: _apC(concurrency),
  chain: _chainC(concurrency),
})

/**
 * @since 0.1.0
 * @category Combinators
 */
export const chainFirstC = (concurrency: number) =>
  chainFirst_(getChainC(concurrency))

/**
 * @since 0.1.0
 * @category Instances
 */
export const getMonadC = (concurrency: number): Monad1<URI> => ({
  URI,
  map: _map,
  ap: _apC(concurrency),
  chain: _chainC(concurrency),
  of,
})

/**
 * @since 0.1.0
 * @category Instances
 */
export const getMonadIOC = (concurrency: number): MonadIO1<URI> => ({
  URI,
  map: _map,
  ap: _apC(concurrency),
  chain: _chainC(concurrency),
  of,
  fromIO,
})

/**
 * @since 0.1.0
 * @category Instances
 */
export const getMonadTaskC = (concurrency: number): MonadTask1<URI> => ({
  URI,
  map: _map,
  ap: _apC(concurrency),
  chain: _chainC(concurrency),
  of,
  fromIO,
  fromTask,
})

// -------------------------------------------------------------------------------------
// utils
// -------------------------------------------------------------------------------------

/**
 * An empty instance
 *
 * @since 0.1.0
 */
export const empty: AsyncIter<never> = fromIterable([])

/**
 * Replay emitted values for each subscriber
 *
 * @since 0.1.0
 * @category Combinators
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
