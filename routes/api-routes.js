// Requiring our models and passport as we've configured it
const db = require("../models");
const passport = require("../config/passport");

const Op = require("sequelize").Op;

module.exports = function(app) {
  // Using the passport.authenticate middleware with our local strategy.
  // If the user has valid login credentials, send them to the members page.
  // Otherwise the user will be sent an error
  app.post("/api/login", passport.authenticate("local"), (req, res) => {
    // Sending back a password, even a hashed password, isn't a good idea
    res.json({
      email: req.user.email,
      id: req.user.id
    });
  });

  // Route for signing up a user. The user's password is automatically hashed and stored securely thanks to
  // how we configured our Sequelize User Model. If the user is created successfully, proceed to log the user in,
  // otherwise send back an error
  app.post("/api/signup", (req, res) => {
    db.User.create({
      email: req.body.email,
      password: req.body.password
    })
      .then(() => {
        res.redirect(307, "/api/login");
      })
      .catch(err => {
        res.status(401).json(err);
      });
  });

  app.post("/api/add", (req, res) => {
    db.events.create({
      title: req.body.title,
      city: req.body.city,
      state: req.body.state,
      address: req.body.address
    })
      .catch(err => {
        res.status(401).json(err);
      });
  });

  app.get("/api/search", (req, res) => {
    console.log(req);
    db.Event.findAll({
      limit: 10,
      where: {
        title: { [Op.like]: "%" + req + "%" }, 
        details: { [Op.like]:  "%" + req + "%" },
        address: { [Op.like]:  "%" + req + "%" },
        city: { [Op.like]:  "%" + req + "%" },
        state: { [Op.like]:  "%" + req + "%" },
        zip: { [Op.like]:  "%" + req + "%" } }
    })
      .then((dbEvent) => {
        console.log(req);
        console.log(res);
        res.json(dbEvent);
      })
      .catch(err => {
        res.status(401).json(err);
      });
  });
  

  // Route for logging user out
  app.get("/logout", (req, res) => {
    req.logout();
    res.redirect("/");
  });

  // Route for getting some data about our user to be used client side
  app.get("/api/user_data", (req, res) => {
    if (!req.user) {
      // The user is not logged in, send back an empty object
      res.json({});
    } else {
      // Otherwise send back the user's email and id
      // Sending back a password, even a hashed password, isn't a good idea
      res.json({
        email: req.user.email,
        id: req.user.id
      });
    }
  });

  app.get("/api/event", (req, res) => {
    // findAll returns all entries for a table when used with no options
    console.log(db);
    db.Event.findAll({}).then(dbEvent => {
      // We have access to the todos as an argument inside of the callback function
      res.json(dbEvent);
    })
      .catch(err => {
        res.status(401).json(err);
      });
  });

  app.post("/api/event", (req, res) => {
    // create takes an argument of an object describing the item we want to
    // insert into our table. In this case we just we pass in an object with a text
    // and complete property (req.body)
    db.Event.create({
      event_name: req.body.event_name,
      city: req.body.city
    })
      .then(dbEvent => {
        // We have access to the new todo as an argument inside of the callback function
        res.json(dbEvent);
      })
      .catch((err) => {
        // Whenever a validation or flag fails, an error is thrown
        // We can "catch" the error to prevent it from being "thrown", which could crash our node app
        res.json(err);
      });
  });
};
