## batchman
gives you the ability to post `application/json` array of parameters and get the api returned values for each array in the collection. 

wip, but simple example:

```js
// ... express app stuff ...

var Batchman = require('batchman');
var batchman = new Batchman();

batchman.mount(app, function (msg) {
  console.log(msg);
});
```

then post to `/batchman` with js or use postman to test

receive back my github json, twice, with one client request.