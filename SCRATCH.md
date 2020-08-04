# Todos
 - Add Tslint in node project
 - Common payload structure library
 - Integration tests?
 - Make a basic web ui to boot
 - Make sure replay works
 - Add Schema validation on HTTP messaging

https://gist.github.com/asoorm/7822cc742831639c93affd734e97ce4f

```
 rs.initiate(
  {
    _id : 'myRepl',
    members: [
      { _id : 0, host : "mongo1:27017" },
      { _id : 1, host : "mongo2:27017" },
      { _id : 2, host : "mongo3:27017" }
    ]
  }
)
```