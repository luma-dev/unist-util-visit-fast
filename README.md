# @luma-dev/unist-util-visit-fast

## License

[MIT](https://github.com/luma-dev/unist-util-visit-fast?tab=MIT-2-ov-file) and [CC0](https://github.com/luma-dev/unist-util-visit-fast?tab=CC0-1.0-1-ov-file)

## Install

```bash
npm i @luma-dev/unist-util-visit-fast
```

## Usage

```ts
import {
  visit,
  CONTINUE,
  STEP_OVER,
  REPLACE,
  EXIT,
  BREAK,
  DELETE,
  DELETE_EXIT,
  DELETE_BREAK,
} from "@luma-dev/unist-util-visit-fast";
```

Please refer to [`src/__tests__/visit.spec.ts`](src/__tests__/visit.spec.ts)

## Why?

[unist-util-visit](https://github.com/syntax-tree/unist-util-visit) takes $O(n^2)$ time when you have $n$ children. This library just takes $O(n)$ time.

[Quick benchmark](https://jsbench.me/) for the key point logic.
