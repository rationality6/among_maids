const path = require("path");
const express = require("express");
const morgan = require("morgan");
const compression = require("compression");
const PORT = process.env.PORT || 8080;
const app = express();

const { Server } = require("socket.io");

// module.exports = app;

const createApp = () => {
  //   // logging middleware
  app.use(morgan("dev"));

  //   // body parsing middleware
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  //   // compression middleware
  app.use(compression());

  //   // static file-serving middleware
  app.use(express.static(path.join(__dirname, "..", "dist")));

  app.use((req, res, next) => {
    if (path.extname(req.path).length) {
      const err = new Error("Not found");
      err.status = 404;
      next(err);
    } else {
      next();
    }
  });

  //   // sends index.html
  app.get("/", (req, res, next) => {
    res.sendFile(path.join(__dirname, "..", "dist/index.html"));
  });

  app.get("/foo", (req, res, next) => {
    console.log("foo");
    res.send("foo");
  });

  //   // error handling endware
  app.use((err, req, res, next) => {
    console.error(err);
    console.error(err.stack);
    res.status(err.status || 500).send(err.message || "Internal server error.");
  });
};

const startListening = () => {
  const server = app.listen(PORT, () =>
    console.log(`Mixing it up on port ${PORT}`)
  );
  const io = new Server(server);

  io.on("connection", (socket) => {
    console.log("a user connected");

    socket.on("disconnect", () => {
      console.log("user disconnected");
    });
  });
};

async function bootApp() {
  await createApp();
  await startListening();
}

bootApp();
