import { hole } from 'fp-ts/lib/function'

export class Deferred<T> implements PromiseLike<T> {
  onResolve: (value: T | PromiseLike<T>) => void = hole
  onReject: (reason?: unknown) => void = hole

  private readonly promise = new Promise<T>((resolve, reject) => {
    this.onResolve = resolve
    this.onReject = reject
  })

  then<TResult1 = T, TResult2 = never>(
    onFulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | null,
    onRejected?: ((reason: unknown) => TResult2 | PromiseLike<TResult2>) | null
  ): PromiseLike<TResult1 | TResult2> {
    return this.promise.then(onFulfilled, onRejected)
  }
}
