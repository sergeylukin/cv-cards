const jsonServer = require("json-server");
const server = jsonServer.create();
const router = jsonServer.router("./mock/data.json");
const middlewares = jsonServer.defaults();

server.use(middlewares);

server.use(
  jsonServer.rewriter({
    "/hs-resume-data": "/cv-cards",
  })
);

router.render = (req, res) => {
  res.jsonp(
    res.locals.data
  );
};

server.use(router);

server.listen(3333, () => {
  console.log("JSON Server is running");
});
