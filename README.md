# fp-ts-iter

Functional async iterators for TypeScript, built on fp-ts.

**Lazy async iteration** with familiar functional programming patterns - map, filter, chain, and more.

## Install

```bash
npm install fp-ts fp-ts-iter
```

## Quick Start

```typescript
import { pipe } from 'fp-ts/function'
import * as AI from 'fp-ts-iter/AsyncIter'

// Process data lazily
const result = pipe(
  AI.fromIterable([1, 2, 3, 4, 5]),
  AI.map((x) => x * 2),
  AI.filter((x) => x > 4),
  AI.toArray
)

console.log(await result()) // [6, 8, 10]
```

## Error Handling

```typescript
import * as AIE from 'fp-ts-iter/AsyncIterEither'
import * as E from 'fp-ts/Either'

const parseNumber = (s: string) =>
  isNaN(+s) ? AIE.left('Invalid') : AIE.right(+s)

const result = pipe(
  AIE.of('1', '2', 'bad', '4'),
  AIE.chain(parseNumber),
  AIE.toArray
)

// Returns E.left('Invalid') on first error
```

## Types

- **`AsyncIter<A>`** - Lazy async iterators
- **`AsyncIterEither<E, A>`** - Async iterators with error handling

## Documentation

[API Reference](https://mpontus.github.io/fp-ts-iter/)
