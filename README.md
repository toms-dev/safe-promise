# ES6 Safe Promise

A native promise wrapper that automatically supports the handling of errors in your callback instead of swallowing them silently.  
End the struggle and let the errors gracefully bubble up to your console from your Promises!

## Why?

Native promises default behavior consists in swallowing the errors that occurs in their process. Unless you explicitely put a `.catch()`,
the errors are lost forever and you just end up spending hours of painful debugging before knowing what's going on.

## Installation

```bash
npm install safe-promise
```

```Javascript
var Promise = require('safe-promise');
```

## Requirements

 * A node engine natively supporting Promises.
 * that's all
