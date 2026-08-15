# Deploy repair

Temporary repair marker: the previous `server.js` contained browser-side code after the server startup, causing Render to fail with `ReferenceError: socket is not defined`.
