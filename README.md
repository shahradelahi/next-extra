# next-extra

Enhance your Next.js projects with additional methods not found in the core package.

## Installation

```bash
npm install next-extra
```

## Usage

### `next-extra/pathname`

Access `pathname` and `search parameters` of the incoming request for server-side components in the `App Router`.

```typescript
import { headers } from 'next';
import { pathname, searchParams } from 'next-extra/pathname';

const fullurl = `${headers.get('host')}${pathname()}`; // http://localhost:3000/hello?name=shahrad
const params = searchParams(); // ReadonlyURLSearchParams
```

## Contributing

Want to contribute? Awesome! To show your support is to star the project, or to raise issues
on [GitHub](https://github.com/shahradelahi/next-extra).

Thanks again for your support, it is much appreciated! 🙏

## License

[MIT](/LICENSE) © [Shahrad Elahi](https://github.com/shahradelahi)
