<h1 align="center">
<sup>Next.JS EXTRA</sup>
<br>
<a href="https://github.com/shahradelahi/next-extra/actions/workflows/ci.yml" title="Build status"><img src="https://github.com/shahradelahi/next-extra/actions/workflows/ci.yml/badge.svg" alt="Build status"></a>
<a href="https://www.npmjs.com/package/next-extra" title="NPM Version"><img src="https://img.shields.io/npm/v/next-extra" alt="npm"></a>
<a href="https://www.npmjs.com/package/next-extra" title="Downloads"><img alt="NPM Downloads" src="https://img.shields.io/npm/dm/next-extra.svg"></a>
<a href="https://opensource.org/licenses/MIT" title="License"><img src="https://img.shields.io/badge/License-MIT-blue.svg?style=flat" alt="MIT Licensed"></a>
</h1>

_next-extra_ is a utility package that allows you to enhance your Next.js projects with additional methods not found in the core package.

---

- [Installation](#-installation)
- [Usage](#-usage)
  - [`next-extra/action`](#next-extraaction)
  - [`next-extra/context`](#next-extracontext)
  - [`next-extra/pathname`](#next-extrapathname)
- [Contributing](#-contributing)
- [Relevant](#relevant)
- [License](#license)
- [Notice of Non-Affiliation and Disclaimer](#notice-of-non-affiliation-and-disclaimer)

## 📦 Installation

```bash
npm install next-extra
```

## 📖 Usage

### `next-extra/action`

###### API

```typescript
function createAction(fn: Function): ActionFunc;
function actionError(code: string, message: string): never;
function cookies(): ResponseCookies;
function clientIP(): Promise<string | null>;
```

###### Example

```typescript jsx
// -- actions.ts
'use server';

import { actionError, createAction } from 'next-extra/action';

export const hello = createAction(async (name: string) => {
  if (!name) {
    actionError('NAME_REQUIRED', 'Name is required');
  }
  return `Hello, ${name}!`;
});
```

```typescript jsx
// -- page.tsx
import { hello } from './actions';

export default async function Page() {
  const { data, error } = await hello('John');
  if (error) {
    return <h1>ERROR: {error.message}</h1>;
  }
  return <h1>{data}</h1>;
}
```

### `next-extra/context`

This module provides utilities for passing serializable data from the **server layout** to **client page components** in the Next.js [App Router](https://nextjs.org/docs/app). It is particularly useful for sharing context-specific data across your application without the need to re-fetch data, thereby saving computing resources and improving performance.

###### API

```typescript
function PageContext<T>(props: PageContextProps<T>): JSX.Element;
function usePageContext<T>(): Readonly<T>;
function useServerInsertedContext<T>(): Readonly<T | undefined>;
```

###### Example

```typescript jsx
// -- layout.tsx
import { PageContext } from 'next-extra/context';

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  return <PageContext data={{ ts: Date.now() }}>{children}</PageContext>;
}
```

```typescript jsx
// -- quotes/layout.tsx
import { PageContext } from 'next-extra/context';

export default async function Layout({ children }: { children: React.ReactNode }) {
  return <PageContext data={{ quote: 'Guillermo Rauch is a handsome dude!' }}>{children}</PageContext>;
}
```

```typescript jsx
// -- quotes/page.tsx
'use client';

import { useServerInsertedContext, usePageContext } from 'next-extra/context';

interface Context {
  message: string;
}

interface InsertedContext extends Context {
  ts: number;
}

export default function Page() {
  const insertedCtx = useServerInsertedContext<InsertedContext>();
  console.log(insertedCtx); // undefined in server or Object { ts: ..., message: "..." }

  const ctx = usePageContext<Context>();
  console.log(ctx); // Object { message: "..." }

  return <h3>Message: {ctx.message}</h3>;
}
```

### `next-extra/pathname`

Access `pathname` and `searchParams` of the incoming request for server-side components in the [App Router](https://nextjs.org/docs/app).

###### API

```typescript
function pathname(): Promise<string>;
function searchParams(): Promise<ReadonlyURLSearchParams>;
```

###### Example

```typescript
import { pathname, searchParams } from 'next-extra/pathname';

export default async function Layout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  // Assuming a request to "/hello?name=John"

  const route = await pathname(); // /hello
  const params = await searchParams(); // ReadonlyURLSearchParams { 'name' => 'John' }

  return children;
}
```

## 🤝 Contributing

Want to contribute? Awesome! To show your support is to star the project, or to raise issues on [GitHub](https://github.com/shahradelahi/next-extra).

Thanks again for your support, it is much appreciated! 🙏

## Relevant

- [NextJs CSRF Protection](https://github.com/shahradelahi/next-csrf)

## License

[MIT](/LICENSE) © [Shahrad Elahi](https://github.com/shahradelahi)

## Notice of Non-Affiliation and Disclaimer

This project, [`next-extra`](https://github.com/shahradelahi/next-extra), is an independent, community-driven project and is not affiliated with, endorsed by, or sponsored by Vercel, the creators of Next.js. Next.js is a registered trademark of Vercel, Inc.

This project utilizes the Next.js framework but is not a part of the official Next.js distribution. Any features, functionalities, or integrations provided by [`next-extra`](https://github.com/shahradelahi/next-extra) are solely the responsibility of the project maintainers and contributors. Vercel and the Next.js team hold no responsibility for the content, quality, or support of this project.

While we strive to ensure compatibility and proper functionality with Next.js, there is no guarantee of seamless integration or continued support in future Next.js releases. Use of [`next-extra`](https://github.com/shahradelahi/next-extra) is at your own discretion and risk. We recommend thoroughly testing this project in your environment before deploying it to production.

All trademarks, service marks, and registered trademarks are the property of their respective owners. The use of any third-party names or trademarks in this project is for identification purposes only and does not imply any affiliation or endorsement.
