# Todos
 - [ ] Add Tslint in node project
 - [x] Common payload structure library
 - [ ] Integration tests?
 - [ ] Make a basic web ui to boot
 - [x] Make sure replay works
 - [ ] Have load metrics
 - [ ] Have a consumer / producer queues instead of HTTP
 - [ ] Webhooks
 - [ ] In case of HTTP, response types
 - [x] Change to WebSocket
 - [ ] Add all the env vars
 - [ ] Add queues for pushing and pulling
 - [ ] Write docs (cuz the code sucks)
 - [ ] -Make horizontally scalable-
 - [ ] Rewrite in Elixir

Currently not scalable, because
 1. The HTTP requests will fail to drop the socket if the associated session is not attached to that instance.
 1. The webhook sequence is not particularly reliable, so only for debugging purposes
 Testing URL: https://jsfiddle.net/rivalslayer/d80oqke7/