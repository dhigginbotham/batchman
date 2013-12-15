## batchman
batch api proxy with ratelimiting, usable as middleware or mountable for an express app. post multiple xhr requests as one json array on the client and get back your multiple responses.

```js
// ... express app stuff ...

var Batchman = require('batchman');
var batchman = new Batchman();

batchman.mount(app); // supports optional callback fn
// then post to `/batchman` with js or use postman to test.

```

### Options
key | description
--- | ---
`path` | endpoint path url. defaults to `batchman` 
`delay` | rate-limit requests, especially helpful if you're hitting the same servers many times. defaults to `25ms`
`middleware` | pass an array of functions in like you would any other express app. defaults to `[]`
`filter` | filter your responses before you deliver them to the client, really helpful if you want to do something else on the server while the client has the response as well. defaults to `[]`
`key` | key name for the response model to be added to the `req` object defaults to `path`
`end` | if you want to customize the endpoint function, add your own here.

### License
```md

The MIT License (MIT)

Copyright (c) 2013 David Higginbotham 

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.

```

