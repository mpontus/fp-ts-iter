import { Subject } from '../../src/internal/Subject'
const toArray = async <T>(iter: AsyncIterable<T>): Promise<T[]> => {
  const values: T[] = []
  for await (const value of iter) {
    values.push(value)
  }
  return values
}

describe('Subject', () => {
  it('iterator', async () => {
    const subj = new Subject()

    subj.onNext(1)
    subj.onNext(2)
    subj.onReturn(3)

    expect(await toArray(subj)).toEqual([1, 2])
  })

  it('sequence', async () => {
    const subj = new Subject()

    subj.onNext(1)
    subj.onReturn(2)
    subj.onNext(3)

    await expect(subj.next()).resolves.toEqual({ done: false, value: 1 })
    await expect(subj.next()).resolves.toEqual({ done: true, value: 2 })
    await expect(subj.next()).resolves.toEqual({ done: true })
  })

  it('parallel', async () => {
    const subj = new Subject()

    subj.onNext(1)
    subj.onReturn(2)
    subj.onReturn(3)

    expect(await Promise.all([subj.next(), subj.next(), subj.next()])).toEqual([
      { done: false, value: 1 },
      { done: true, value: 2 },
      { done: true, value: undefined },
    ])
  })

  it('pending', async () => {
    const subj = new Subject()
    const promise = Promise.all([subj.next(), subj.next(), subj.next()])

    subj.onNext(1)
    subj.onReturn(2)

    expect(await promise).toEqual([
      { done: false, value: 1 },
      { done: true, value: 2 },
      { done: true, value: undefined },
    ])
  })

  describe('rejects', () => {
    it('iterator', async () => {
      const subj = new Subject()

      subj.onNext(1)
      subj.onNext(2)
      subj.onReject('foo')
      // subj.onReject(5)

      await expect(toArray(subj)).rejects.toEqual('foo')
    })

    it('queue', async () => {
      const subj = new Subject()

      subj.onNext(1)
      subj.onReject(2)
      subj.onReject(3)

      await expect(subj.next()).resolves.toEqual({ done: false, value: 1 })
      await expect(subj.next()).rejects.toEqual(2)
      await expect(subj.next()).resolves.toEqual({ done: true })
    })

    it('pending', async () => {
      const subj = new Subject()

      const [a, b, c] = [subj.next(), subj.next(), subj.next()]

      subj.onNext(1)
      subj.onReject(2)

      await expect(a).resolves.toEqual({ done: false, value: 1 })
      await expect(b).rejects.toEqual(2)
      await expect(c).resolves.toEqual({ done: true })
    })
  })
})
