var admin = require("firebase-admin");
const express = require("express");
var serviceAccount = require("./serviceAccountKey.json");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

var port = process.env.PORT || 8080;

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://steer-93271.firebaseio.com"
});

app.get("/", (req, res) => {
  res.send("Sure youre on the right place mate?");
});

app.get("/verify", function(req, res) {
  console.log("email", req.query.email);
  var email = req.query.email;
  var otp = Math.floor(1000 + Math.random() * 9000);

  var db = admin.database();
  var ref = db.ref("emailVerification");
  ref.child(email.replace(".", "_")).set({ otp });

  res
    .status(200)
    .json({ otp })
    .send("done");
  // ref.once("value", function(snapshot) {
  //   console.log(snapshot.val());
  //   res.status(200);
  // });
});

// var email = "akshaycj999@gmail.com";
// var otp = Math.floor(1000 + Math.random() * 9000);

// var db = admin.database();
// var ref = db.ref("emailVerification");
// ref.child(email.replace(".", "_")).set({ otp });
// ref.once("value", function(snapshot) {
//   console.log(snapshot.val());
// });

app.listen(port, function() {
  console.log("Server started listening...");
});
