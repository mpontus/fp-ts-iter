import { either as E, io as I, option as O, task as T } from 'fp-ts'
import { identity, pipe } from 'fp-ts/lib/function'
import * as AI from '../src/AsyncIter'
import * as _ from '../src/AsyncIterEither'

const of = <E = never, A = never>(...values: A[]): _.AsyncIterEither<E, A> =>
  _.fromIterable(values)

describe('AsyncIterEither', () => {
  // -------------------------------------------------------------------------------------
  // constructors
  // -------------------------------------------------------------------------------------

  it('left', async () => {
    expect(await pipe(_.left('error'), _.toArray)()).toEqual(E.left('error'))
  })

  it('right', async () => {
    expect(await pipe(_.right(42), _.toArray)()).toEqual(E.right([42]))
  })

  it('of', async () => {
    expect(await pipe(_.of(1, 2, 3), _.toArray)()).toEqual(E.right([1, 2, 3]))
  })

  it('throwError', async () => {
    expect(await pipe(_.throwError('error'), _.toArray)()).toEqual(
      E.left('error')
    )
  })

  it('fromEither', async () => {
    expect(await pipe(_.fromEither(E.right(42)), _.toArray)()).toEqual(
      E.right([42])
    )

    expect(await pipe(_.fromEither(E.left('error')), _.toArray)()).toEqual(
      E.left('error')
    )
  })

  it('fromIO', async () => {
    expect(
      await pipe(
        _.fromIO(() => 42),
        _.toArray
      )()
    ).toEqual(E.right([42]))
  })

  it('fromTask', async () => {
    expect(
      await pipe(
        _.fromTask(() => Promise.resolve(42)),
        _.toArray
      )()
    ).toEqual(E.right([42]))
  })

  it('fromIterable', async () => {
    expect(await pipe(_.fromIterable([1, 2, 3]), _.toArray)()).toEqual(
      E.right([1, 2, 3])
    )
  })

  // -------------------------------------------------------------------------------------
  // combinators
  // -------------------------------------------------------------------------------------

  it('map', async () => {
    expect(
      await pipe(
        of(1, 2, 3),
        _.map((n) => n * 2),
        _.toArray
      )()
    ).toEqual(E.right([2, 4, 6]))
  })

  it('mapLeft', async () => {
    expect(
      await pipe(
        _.left('error'),
        _.mapLeft((s) => s.toUpperCase()),
        _.toArray
      )()
    ).toEqual(E.left('ERROR'))
  })

  it('chain', async () => {
    expect(
      await pipe(
        of(1, 2, 3),
        _.chain((n) => of(n, n * 2)),
        _.toArray
      )()
    ).toEqual(E.right([1, 2, 2, 4, 3, 6]))
  })

  it('chainW', async () => {
    expect(
      await pipe(
        of<string, number>(1, 2),
        _.chainW((n) => (n > 1 ? _.right(n * 2) : _.left('too small'))),
        _.toArray
      )()
    ).toEqual(E.left('too small'))
  })

  it('ap', async () => {
    expect(
      await pipe(
        of((n: number) => n * 2),
        _.ap(of(1, 2, 3)),
        _.toArray
      )()
    ).toEqual(E.right([2, 4, 6]))
  })

  it('apW', async () => {
    expect(
      await pipe(
        of<string, (n: number) => string>((n) => String(n)),
        _.apW(of<number, number>(1, 2)),
        _.toArray
      )()
    ).toEqual(E.right(['1', '2']))
  })

  it('filter', async () => {
    expect(
      await pipe(
        of(1, 2, 3, 4),
        _.filter((n) => n % 2 === 0),
        _.toArray
      )()
    ).toEqual(E.right([2, 4]))
  })

  it('filterMap', async () => {
    expect(
      await pipe(
        of(1, 2, 3, 4),
        _.filterMap((n) => (n % 2 === 0 ? O.some(n * 10) : O.none)),
        _.toArray
      )()
    ).toEqual(E.right([20, 40]))
  })

  it('fold', async () => {
    const handleError = (error: string) => AI.of(`Error: ${error}`)
    const handleSuccess = (value: number) => AI.of(`Success: ${value}`)

    expect(
      await pipe(_.right(42), _.fold(handleError, handleSuccess), AI.toArray)()
    ).toEqual(['Success: 42'])

    expect(
      await pipe(
        _.left('not found'),
        _.fold(handleError, handleSuccess),
        AI.toArray
      )()
    ).toEqual(['Error: not found'])
  })

  it('alt', async () => {
    // alt is used for error recovery in Either context
    expect(
      await pipe(
        of(1, 2),
        _.alt(() => of(3, 4)),
        _.toArray
      )()
    ).toEqual(E.right([1, 2]))

    // Test error recovery
    expect(
      await pipe(
        _.left<string, number>('error'),
        _.alt<string, number>(() => of(3, 4)),
        _.toArray
      )()
    ).toEqual(E.right([3, 4]))
  })

  it('altW', async () => {
    // altW is used for error recovery with different types
    expect(
      await pipe(
        of<string, number>(1, 2),
        _.altW(() => of<number, string>('a', 'b')),
        _.toArray
      )()
    ).toEqual(E.right([1, 2]))

    // Test error recovery with different types
    expect(
      await pipe(
        _.left<string, number>('error'),
        _.altW(() => of<number, string>('a', 'b')),
        _.toArray
      )()
    ).toEqual(E.right(['a', 'b']))
  })

  // -------------------------------------------------------------------------------------
  // lifting
  // -------------------------------------------------------------------------------------

  it('fromEitherK', async () => {
    const parseNumber = (s: string): E.Either<string, number> => {
      const n = parseInt(s, 10)
      return isNaN(n) ? E.left('not a number') : E.right(n)
    }

    expect(
      await pipe(of('1', '2'), _.chain(_.fromEitherK(parseNumber)), _.toArray)()
    ).toEqual(E.right([1, 2]))

    expect(
      await pipe(
        of('invalid'),
        _.chain(_.fromEitherK(parseNumber)),
        _.toArray
      )()
    ).toEqual(E.left('not a number'))
  })

  it('fromIOK', async () => {
    expect(
      await pipe(
        of(1, 2, 3),
        _.chain(_.fromIOK((n) => I.of(n * 2))),
        _.toArray
      )()
    ).toEqual(E.right([2, 4, 6]))
  })

  it('fromTaskK', async () => {
    expect(
      await pipe(
        of(1, 2, 3),
        _.chain(_.fromTaskK((n) => T.of(n * 2))),
        _.toArray
      )()
    ).toEqual(E.right([2, 4, 6]))
  })

  // -------------------------------------------------------------------------------------
  // utils
  // -------------------------------------------------------------------------------------

  it('reduce', async () => {
    expect(
      await pipe(
        of(1, 2, 3),
        _.reduce(0, (a, b) => a + b)
      )()
    ).toEqual(E.right(6))

    expect(
      await pipe(
        _.left<string, number>('error'),
        _.reduce(0, (a, b) => a + b)
      )()
    ).toEqual(E.left('error'))
  })

  it('toArray', async () => {
    expect(await pipe(of(1, 2, 3), _.toArray)()).toEqual(E.right([1, 2, 3]))

    expect(await pipe(_.left<string, number>('error'), _.toArray)()).toEqual(
      E.left('error')
    )
  })

  // -------------------------------------------------------------------------------------
  // interop
  // -------------------------------------------------------------------------------------

  it('tryCatch w/ generator', async () => {
    const iter = async function* () {
      yield Promise.resolve(1)
      yield Promise.reject(2)
      yield Promise.resolve(2)
    }
    const result = await pipe(
      _.tryCatch(() => iter(), identity),
      AI.toArray
    )()

    expect(result).toEqual([E.right(1), E.left(2)])
  })

  it('tryCatch w/ throwing generator', async () => {
    const iter = async function* () {
      yield Promise.resolve(1)
      yield Promise.resolve(2)
      throw new Error('foo')
    }
    const result = await pipe(
      _.tryCatch(() => iter(), identity),
      AI.toArray
    )()

    expect(result).toEqual([E.right(1), E.right(2), E.left(new Error('foo'))])
  })

  it('tryCatch w/ iterable', async () => {
    const asyncIterable = {
      [Symbol.asyncIterator]: () => ({
        next: jest
          .fn()
          .mockResolvedValueOnce({ value: 1 })
          .mockRejectedValueOnce(new Error('2'))
          .mockResolvedValueOnce({ value: 3 })
          .mockResolvedValueOnce({ done: true }),
      }),
    }

    const result = pipe(
      _.tryCatch(
        () => asyncIterable,
        (err) => (err instanceof Error ? err : new Error(`${err}`))
      ),
      AI.toArray
    )

    expect(await result()).toEqual([
      E.right(1),
      E.left(new Error('2')),
      E.right(3),
    ])
  })

  it('tryCatchK', async () => {
    const throwingFunction = async function* (n: number) {
      if (n < 0) throw new Error('negative')
      yield n
      yield n * 2
    }

    expect(
      await pipe(
        1,
        _.tryCatchK(throwingFunction, (err) =>
          err instanceof Error ? err.message : String(err)
        ),
        AI.toArray
      )()
    ).toEqual([E.right(1), E.right(2)])

    expect(
      await pipe(
        -1,
        _.tryCatchK(throwingFunction, (err) =>
          err instanceof Error ? err.message : String(err)
        ),
        AI.toArray
      )()
    ).toEqual([E.left('negative')])
  })

  // -------------------------------------------------------------------------------------
  // do notation
  // -------------------------------------------------------------------------------------

  it('Do', async () => {
    expect(await pipe(_.Do, _.toArray)()).toEqual(E.right([{}]))
  })

  it('bindTo', async () => {
    expect(await pipe(of(42), _.bindTo('value'), _.toArray)()).toEqual(
      E.right([{ value: 42 }])
    )
  })

  it('bind', async () => {
    expect(
      await pipe(
        _.Do,
        _.bind('a', () => of(1)),
        _.bind('b', ({ a }) => of(a + 1)),
        _.toArray
      )()
    ).toEqual(E.right([{ a: 1, b: 2 }]))
  })

  it('apS', async () => {
    expect(
      await pipe(of({}), _.apS('a', of(1)), _.apS('b', of(2)), _.toArray)()
    ).toEqual(E.right([{ a: 1, b: 2 }]))
  })
})
