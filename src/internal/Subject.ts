import { hole } from 'fp-ts/lib/function'

class PromiseSubject<T> implements PromiseLike<T> {
  resolve: (value: T | PromiseLike<T>) => void = hole
  reject: (reason?: unknown) => void = hole

  private readonly promise = new Promise<T>((resolve, reject) => {
    this.resolve = resolve
    this.reject = reject
  })

  then<TResult1 = T, TResult2 = never>(
    onFulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | null,
    onRejected?: ((reason: unknown) => TResult2 | PromiseLike<TResult2>) | null
  ): PromiseLike<TResult1 | TResult2> {
    return this.promise.then(onFulfilled, onRejected)
  }
}

class ReadonlySubject<T> implements AsyncIterableIterator<T> {
  private done?: boolean
  // private result?: Promise<IteratorReturnResult<unknown>>
  private pending: Array<PromiseSubject<IteratorResult<T>>> = []
  private queue: Array<Promise<IteratorResult<T>>> = []

  onNext(value: T): void {
    if (this.done) {
      return
    } else if (this.pending.length > 0) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      this.pending.pop()!.resolve({ value, done: false })
    } else {
      this.queue.push(Promise.resolve({ value, done: false }))
    }
  }

  onReturn(value?: unknown): void {
    if (this.done) {
      return
    } else if (this.pending.length > 0) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      this.pending.pop()!.resolve({ value, done: true })
    } else {
      this.queue.push(Promise.resolve({ value, done: true }))
    }

    while (this.pending.length > 0) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      this.pending.pop()!.resolve({
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
      this.pending.pop()!.reject(reason)
    } else {
      this.queue.push(Promise.reject(reason))
    }

    while (this.pending.length > 0) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      this.pending.pop()!.resolve({
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

    this.pending.unshift(new PromiseSubject())
    return Promise.resolve(this.pending[0])
  }

  [Symbol.asyncIterator](): AsyncIterableIterator<T> {
    return this
  }
}

export { ReadonlySubject as Subject }
