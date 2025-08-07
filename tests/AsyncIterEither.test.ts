import { either as E } from 'fp-ts'
import { identity, pipe } from 'fp-ts/lib/function'
import * as AI from '../src/AsyncIter'
import { tryCatch } from '../src/AsyncIterEither'

test('AsyncIterEither#tryCatch w/ generator ', async () => {
  const iter = async function* () {
    yield Promise.resolve(1)
    yield Promise.reject(2)
    yield Promise.resolve(2)
  }
  const result = await pipe(
    tryCatch(() => iter(), identity),
    AI.toArray
  )()

  expect(result).toEqual([E.right(1), E.left(2)])
})

test('AsyncIterEither#tryCatch w/ throwing generator ', async () => {
  const iter = async function* () {
    yield Promise.resolve(1)
    yield Promise.resolve(2)
    throw new Error('foo')
  }
  const result = await pipe(
    tryCatch(() => iter(), identity),
    AI.toArray
  )()

  expect(result).toEqual([E.right(1), E.right(2), E.left(new Error('foo'))])
})

test('AsyncIterEither#tryCatch w/ iterable', async () => {
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
    tryCatch(
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
