# next-extra

Enhance your Next.js projects with additional methods not found in the core package.

## Installation

```bash
npm install next-extra
```

## Usage

### `next-extra/action`

###### API

```typescript
function createAction(fn: Function): ActionFunc;
function actionError(code: string, message: string): ActionError;
```

###### Example

```typescript jsx
// -------------------- actions.ts -------------------- //
'use server';

import { actionError, createAction } from 'next-extra/action';

export const hello = createAction(async (name: string) => {
  if (!name) {
    throw actionError('NAME_REQUIRED', 'Name is required');
  }
  return `Hello, ${name}!`;
});

// -------------------- page.tsx -------------------- //
import { hello } from './actions';

export default async function Page() {
  const { data, error } = await hello('John');
  if (error) {
    return <h1>ERROR: {error.message}</h1>;
  }
  return <h1>{data}</h1>;
}
```

### `next-extra/pathname`

Access `pathname` and `searchParams` of the incoming request for server-side components in the [App Router](https://nextjs.org/docs/app).

###### API

```typescript
function invokeUrl(): URL;
function pathname(): string;
function searchParams(): ReadonlyURLSearchParams;
```

###### Example

```typescript
import { invokeUrl, pathname, searchParams } from 'next-extra/pathname';

export default async function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const url = invokeUrl(); // instance of URL; http://localhost:3000/hello?name=John
  const path = pathname(); // /hello
  const params = searchParams(); // ReadonlyURLSearchParams { 'name' => 'John' }

  return children;
}
```

## Contributing

Want to contribute? Awesome! To show your support is to star the project, or to raise issues on [GitHub](https://github.com/shahradelahi/next-extra).

Thanks again for your support, it is much appreciated! 🙏

## License

[MIT](/LICENSE) © [Shahrad Elahi](https://github.com/shahradelahi)
