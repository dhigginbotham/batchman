## batchman
gives you the ability to post `text/json` array of parameters and get the api returned values for each array in the collection. 

wip, but simple example:

```js
// ... express app stuff ...

var Batchman = require('batchman');
var batchman = new Batchman();

batchman.mount(app, function (msg) {
  console.log(msg);
});
```

then post to `/batchman`

```json
[{"url":"https://api.github.com/users/dhigginbotham"},
{"url":"https://api.github.com/users/dhigginbotham"}]
```

receive back my github json, twice, with one client request.