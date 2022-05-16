import {
  either as E,
  io as I,
  number as n,
  option as O,
  string as s,
  task as T,
} from 'fp-ts'
import { pipe } from 'fp-ts/lib/function'
import * as _ from '../src/AsyncIter'

const of = <A>(...values: A[]) => _.fromIterable(values)
const delay = (n: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, n))

describe('AsyncIter', () => {
  // -------------------------------------------------------------------------------------
  // pipeables
  // -------------------------------------------------------------------------------------  // -------------------------------------------------------------------------------------

  it('map', async () => {
    expect(
      await pipe(
        of(1, 2),
        _.map((n) => n * 2),
        _.toArray
      )()
    ).toEqual([2, 4])
  })

  it('ap', async () => {
    expect(
      await pipe(
        _.fromIterable([
          (a: number) => (b: number) => a + b,
          (a: number) => (b: number) => a * b,
        ]),
        _.ap(_.fromIterable([2, 3])),
        _.ap(_.fromIterable([4, 5])),
        _.toArray
      )()
    ).toMatchInlineSnapshot([6, 7, 7, 8, 8, 10, 12, 15])
  })

  it('ap', async () => {
    expect(
      await pipe(
        of((a: string) => (b: string) => a + b),
        _.ap(of('a')),
        _.ap(of('b')),
        _.toArray
      )()
    ).toEqual(['ab'])
  })

  it('apFirst', async () => {
    expect(
      await pipe(of(1, 2), _.apFirst(of('a', 'b', 'c')), _.toArray)()
    ).toEqual([1, 1, 1, 2, 2, 2])
  })

  it('apSecond', async () => {
    expect(
      await pipe(of(1, 2), _.apSecond(of('a', 'b', 'c')), _.toArray)()
    ).toEqual(['a', 'b', 'c', 'a', 'b', 'c'])
  })

  it('chain', async () => {
    expect(
      await pipe(
        of(1, 2, 3),
        _.chain((n) => of(n, n * 2)),
        _.toArray
      )()
    ).toEqual([1, 2, 2, 4, 3, 6])
  })

  it('chainFirst', async () => {
    expect(
      await pipe(
        of(1, 2, 3),
        _.chainFirst((n) => of(n, n * 2)),
        _.toArray
      )()
    ).toEqual([1, 1, 2, 2, 3, 3])
  })

  it('flatten', async () => {
    expect(await pipe(of(of(1), of(2), of(3)), _.flatten, _.toArray)()).toEqual(
      [1, 2, 3]
    )
  })

  it('alt', async () => {
    expect(
      await pipe(
        async function* () {
          yield 1
          await delay(100)
          yield 2
        },
        _.alt<number>(
          _.fromAsyncIterableK(async function* () {
            yield 3
            await delay(100)
            yield 4
          })
        ),
        _.toArray
      )()
    ).toEqual([1, 2, 3, 4])
  })

  it('altW', async () => {
    expect(
      await pipe(
        async function* () {
          yield 1
          await delay(100)
          yield 2
        },
        _.altW(
          _.fromAsyncIterableK(async function* () {
            yield 'a'
            await delay(100)
            yield 'b'
          })
        ),
        _.toArray
      )()
    ).toEqual([1, 2, 'a', 'b'])
  })

  it('concat', async () => {
    expect(
      await pipe(
        async function* () {
          yield 1
          await delay(100)
          yield 2
        },
        _.concat<number>(async function* () {
          yield 3
          await delay(100)
          yield 4
        }),
        _.toArray
      )()
    ).toEqual([1, 3, 2, 4])
  })

  it('concatW', async () => {
    expect(
      await pipe(
        async function* () {
          yield 1
          await delay(100)
          yield 2
        },
        _.concatW(async function* () {
          yield 'a'
          await delay(100)
          yield 'b'
        }),
        _.toArray
      )()
    ).toEqual([1, 'a', 2, 'b'])
  })

  // -------------------------------------------------------------------------------------
  // constructors
  // -------------------------------------------------------------------------------------

  it('fromIO', async () => {
    expect(
      await pipe(
        _.fromIO(() => 1),
        _.toArray
      )()
    ).toEqual([1])
  })

  it('fromTask', async () => {
    expect(
      await pipe(
        _.fromTask(() => Promise.resolve(1)),
        _.toArray
      )()
    ).toEqual([1])
  })

  // -------------------------------------------------------------------------------------
  // combinators
  // -------------------------------------------------------------------------------------

  test('fromIterableK', async () => {
    expect(
      await pipe(
        2,
        _.fromIterableK(function* (m: number) {
          yield 1 * m
          yield 2 * m
          yield 3 * m
        }),
        _.toArray
      )()
    ).toEqual([2, 4, 6])
  })

  test('fromAsyncIterableK', async () => {
    expect(
      await pipe(
        2,
        _.fromAsyncIterableK(async function* (m: number) {
          yield 1 * m
          yield 2 * m
          yield 3 * m
        }),
        _.toArray
      )()
    ).toEqual([2, 4, 6])
  })

  it('fromIOK', async () => {
    expect(
      await pipe(
        3,
        _.fromIOK((n) => I.of(n + 2)),
        _.toArray
      )()
    ).toEqual([5])
  })

  it('chainIOK', async () => {
    expect(
      await pipe(
        of('a', 'bc'),
        _.chainIOK((s) => I.of(s.length)),
        _.toArray
      )()
    ).toEqual([1, 2])
  })

  it('chainFirstIOK', async () => {
    expect(
      await pipe(
        of('a', 'bc'),
        _.chainFirstIOK((s) => I.of(s.length)),
        _.toArray
      )()
    ).toEqual(['a', 'bc'])
  })

  it('fromTaskK', async () => {
    expect(
      await pipe(
        2,
        _.fromTaskK((n) => T.of(n + 4)),
        _.toArray
      )()
    ).toEqual([7])
  })

  it('chainTaskK', async () => {
    expect(
      await pipe(
        of('a', 'bc'),
        _.chainTaskK((s) => T.of(s.length)),
        _.toArray
      )()
    ).toEqual([1, 2])
  })

  it('chainFirstTaskK', async () => {
    expect(
      await pipe(
        of('a', 'bc'),
        _.chainFirstTaskK((s) => T.of(s.length)),
        _.toArray
      )()
    ).toEqual(['a', 'bc'])
  })

  // -------------------------------------------------------------------------------------
  // destructors
  // -------------------------------------------------------------------------------------

  it('scan', async () => {
    expect(
      await pipe(
        of(1, 2, 3),
        _.scan(0, (a, b) => a + b),
        _.toArray
      )()
    ).toEqual([1, 3, 6])
  })

  it('foldMap', async () => {
    expect(
      await pipe(of(100, 200, 300), _.foldMap(s.Monoid)(String))()
    ).toEqual('100200300')
  })

  it('reduce', async () => {
    expect(
      await pipe(
        of(2, 3, 4),
        _.reduce(5, (a, b) => a * b)
      )()
    ).toEqual(120)
  })

  describe('Compactible', () => {
    it('compact', async () => {
      expect(
        await pipe(
          of(O.some(1), O.some(2), O.none, O.some(3)),
          _.compact,
          _.toArray
        )()
      ).toEqual([1, 2, 3])
    })

    it('separate', async () => {
      const { left, right } = pipe(
        of(E.left('foo'), E.right('bar'), E.left('baz')),
        _.separate
      )
      const promises = [_.toArray(left)(), _.toArray(right)()]

      expect(await Promise.all(promises)).toEqual([['foo', 'baz'], ['bar']])
    })
  })

  describe('Filterable', () => {
    it('filterMap', async () => {
      expect(
        await pipe(
          of<number | string>(1, 2, 'foo', 3),
          _.filterMap(O.fromPredicate(n.isNumber)),
          _.toArray
        )()
      ).toEqual([1, 2, 3])
    })

    it('filter', async () => {
      expect(
        await pipe(
          of(1, 2, 3, 4, 6),
          _.filter((n) => n % 2 === 0),
          _.toArray
        )()
      ).toEqual([2, 4, 6])
    })

    it('partitionMap', async () => {
      const { left, right } = pipe(
        of<number | string>('foo', 2, 3, 'bar', 5),
        _.partitionMap(E.fromPredicate(s.isString, String))
      )
      const promises = [_.toArray(left)(), _.toArray(right)()]

      expect(await Promise.all(promises)).toEqual([
        ['2', '3', '5'],
        ['foo', 'bar'],
      ])
    })

    it('partition', async () => {
      const { left, right } = pipe(
        of('foo', 'bar', 'foobar', 'baz', 'barbaz'),
        _.partition((s) => s.length > 3)
      )
      const promises = [_.toArray(left)(), _.toArray(right)()]

      expect(await Promise.all(promises)).toEqual([
        ['foo', 'bar', 'baz'],
        ['foobar', 'barbaz'],
      ])
    })
  })

  describe('concurrent', () => {
    describe('Apply', () => {
      test('apC', async () => {
        expect(
          await pipe(
            of(
              (a: number) => a + 2,
              (a: number) => a * 2
            ),
            _.apC(2)(async function* () {
              await delay(100)
              yield 1
              await delay(100)
              yield 2
            }),
            _.toArray
          )()
        ).toEqual([3, 2, 4, 4])
      })

      test('apFirstC', async () => {
        expect(
          await pipe(
            of(1, 2, 3),
            _.apFirstC(2)(async function* () {
              await delay(100)
              yield 'a'
              await delay(100)
              yield 'b'
            }),
            _.toArray
          )()
        ).toEqual([1, 2, 1, 2, 3, 3])
      })

      test('apSecondC', async () => {
        expect(
          await pipe(
            of(1, 2, 3),
            _.apSecondC(2)(async function* () {
              await delay(100)
              yield 'a'
              await delay(100)
              yield 'b'
            }),
            _.toArray
          )()
        ).toEqual(['a', 'a', 'b', 'b', 'a', 'b'])
      })
    })
    describe('Chain', () => {
      test('chainC', async () => {
        expect(
          await pipe(
            of(),
            _.chainC(2)(() => _.empty),
            _.toArray
          )()
        ).toEqual([])

        expect(
          await pipe(
            of(1, 2, 3),
            _.chainC(2)(
              _.fromAsyncIterableK(async function* () {
                await delay(100)
                yield 'a'
                await delay(100)
                yield 'b'
              })
            ),
            _.toArray
          )()
        ).toEqual(['a', 'a', 'b', 'b', 'a', 'b'])
      })

      test('chainFirstC', async () => {
        expect(
          await pipe(
            of(1, 2, 3),
            _.chainFirstC(2)(
              _.fromAsyncIterableK(async function* () {
                await delay(100)
                yield 'a'
                await delay(100)
                yield 'b'
              })
            ),
            _.toArray
          )()
        ).toEqual([1, 2, 1, 2, 3, 3])
      })
    })
  })

  // -------------------------------------------------------------------------------------
  // utils
  // -------------------------------------------------------------------------------------

  describe('replay', () => {
    it('conserves iterator', async () => {
      const generator = jest.fn(async function* () {
        yield 1
        yield 2
        yield 3
      })

      const result = pipe(generator, _.replay, _.toArray)

      expect(await result()).toEqual([1, 2, 3])
      expect(await result()).toEqual([1, 2, 3])
      expect(await result()).toEqual([1, 2, 3])
      expect(generator).toHaveBeenCalledTimes(1)
    })

    it('supports concurrent invocation', async () => {
      const generator = jest.fn(async function* () {
        yield 1
        yield 2
        yield 3
      })
      const result = pipe(generator, _.replay, _.toArray)

      expect(await Promise.all([result(), result(), result()])).toEqual([
        [1, 2, 3],
        [1, 2, 3],
        [1, 2, 3],
      ])
      expect(generator).toHaveBeenCalledTimes(1)
    })
  })
})
