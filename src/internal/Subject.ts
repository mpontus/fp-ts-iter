import { Deferred } from './Deferred'

class ReadonlySubject<T> implements AsyncIterableIterator<T> {
  private done?: boolean
  private pending: Array<Deferred<IteratorResult<T>>> = []
  private queue: Array<Promise<IteratorResult<T>>> = []

  onNext(value: T): void {
    if (this.done) {
      return
    } else if (this.pending.length > 0) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      this.pending.pop()!.onResolve({ value, done: false })
    } else {
      this.queue.push(Promise.resolve({ value, done: false }))
    }
  }

  onReturn(value?: unknown): void {
    if (this.done) {
      return
    } else if (this.pending.length > 0) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      this.pending.pop()!.onResolve({ value, done: true })
    } else {
      this.queue.push(Promise.resolve({ value, done: true }))
    }

    while (this.pending.length > 0) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      this.pending.pop()!.onResolve({
        done: true,
        value: undefined,
      })
    }

    this.done = true
  }

  onReject(reason?: unknown): void {
    if (this.done) {
      return
    } else if (this.pending.length > 0) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      this.pending.pop()!.onReject(reason)
    } else {
      this.queue.push(Promise.reject(reason))
    }

    while (this.pending.length > 0) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      this.pending.pop()!.onResolve({
        done: true,
        value: undefined,
      })
    }

    this.done = true
  }

  next(): Promise<IteratorResult<T, void>> {
    if (this.queue.length > 0) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      return this.queue.shift()!
    }

    if (this.done) {
      return Promise.resolve({
        done: true,
        value: undefined,
      })
    }

    this.pending.unshift(new Deferred())
    return Promise.resolve(this.pending[0])
  }

  [Symbol.asyncIterator](): AsyncIterableIterator<T> {
    return this
  }
}

export { ReadonlySubject as Subject }
