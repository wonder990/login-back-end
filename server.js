const express = require("express");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const advancedOptions = { useNewUrlParser: true, useUnifiedTopology: true };
const app = express();
const PORT = 8080;

app.use(
  session({
    store: MongoStore.create({
      mongoUrl:
        "mongodb+srv://Nicolas9412:admin123@cluster0.x4k71fz.mongodb.net/ecommerce?retryWrites=true&w=majority",
      mongoOptions: advancedOptions,
    }),
    secret: "top secret",
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 600000 },
  })
);

app.use(function (req, res, next) {
  console.log(req.session);
  req.session._garbage = Date();
  req.session.touch();
  return next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.set("view engine", "ejs");

const server = app.listen(PORT, () => {
  console.log(
    `Servidor levantado http://localhost:${server.address().port}/login`
  );
});
server.on("error", (error) => {
  console.log(`Error en el servidor ${error}`);
});

let usuario = "";

function checkLogin(req, res, next) {
  if (!req.session["login"]) {
    return res.render("pages/login.ejs");
  }
  return next();
}

app.get("/login", checkLogin, (req, res) => {
  usuario = req.session["login"].usuario;
  return res.render("pages/vistaProductos.ejs", { usuario });
});

app.post("/login", (req, res) => {
  const { body } = req;
  usuario = body.usuario;
  if (!req.session["login"]) {
    req.session["login"] = {};
    req.session["login"].usuario = usuario;
  }
  res.render("pages/vistaProductos.ejs", { usuario });
});

app.get("/logout", checkLogin, (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.json({ status: "Logout ERROR", body: err });
    }
    res.render("pages/logout.ejs", { usuario });
  });
});
