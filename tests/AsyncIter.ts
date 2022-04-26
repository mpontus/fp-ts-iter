import { io as I, task as T } from 'fp-ts'
import { pipe } from 'fp-ts/lib/function'
import * as _ from '../src/AsyncIter'

const of = <A>(...values: A[]) => _.fromIterable(values)

describe('AsyncIter', () => {
  // -------------------------------------------------------------------------------------
  // pipeables
  // -------------------------------------------------------------------------------------

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

  describe('constructors', () => {
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
      const gen = async function* (m: number) {
        yield 1 * m
        yield 2 * m
        yield 3 * m
      }

      expect(await pipe(2, _.fromAsyncIterableK(gen), _.toArray)()).toEqual([
        2, 4, 6,
      ])
    })
  })

  // -------------------------------------------------------------------------------------
  // combinators
  // -------------------------------------------------------------------------------------

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
