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

then post to `/batchman`

```js
var jsonArray = [
  {"url":"https://api.github.com/users/dhigginbotham"},
  {"url":"https://api.github.com/users/dhigginbotham"}
];

var ajax = new XMLHttpRequest();

ajax.open("POST", "/batchman", true);

ajax.onreadystatechange = function () {
  
  if (ajax.readyState != 4 || ajax.status != 200) {
    
    return;

  };

  console.log(ajax.responseText);

};

ajax.send(jsonArray);
```

receive back my github json, twice, with one client request.