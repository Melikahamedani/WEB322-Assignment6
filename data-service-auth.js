const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Schema = mongoose.Schema;

//define the user schema
var userSchema = new Schema({
    "userName" : {
        "type" : String,
        "unique" : true 
    },
    "password" : String,
    "email" : String,
    "loginHistory" : [{
        dateTime : Date,
        userAgent : String
    }]
});

let User; // to be defined on new connection
var URI = "mongodb+srv://MelikaHamedani:IVxrSRJ1tlXkBInK@senecaweb.ipsphu4.mongodb.net/?retryWrites=true&w=majority";
//Initilize
module.exports.initialize = () => {
    return new Promise(function (resolve, reject) {
        let db = mongoose.createConnection(URI, { useNewUrlParser: true, useUnifiedTopology: true });
        db.on('error', (err) => {
            reject(err);
        });
        db.once('open', () => {
            User = db.model("users", userSchema);
            console.log("connected to mongodb")
            resolve();
        });
    });
};

//register user
module.exports.registerUser = (userData) => {
    return new Promise((resolve, reject) => {
      if (userData.password != userData.password2) {
        reject('Passwords do not match');
      }
      bcrypt.genSalt(10)
        .then((salt) => bcrypt.hash(userData.password, salt))
        .then((hash) => {
          userData.password = hash;
          let newUser = new User(userData);
          newUser.save().then(() => {
            resolve()
        }).catch(err => {
            if (err.code == 11000) {
                reject('User Name is already taken')
            } else {
                reject(`There was an error creating the user: ${err}`)
            }
        })
    })
    .catch(err => {
        return reject('There was an error encrypting the password')
    });
});
};

//Check User
module.exports.checkUser = (userData) => {
  return new Promise((resolve, reject) => {
      User.find({ userName: userData.userName })
          .then((users) => {
            if (users.length == 0) {
                reject(`Unable to find user: ${userData.userName}`);
            }
            bcrypt.compare(userData.password, users[0].password).then((res) => {
                  if (!res) {
                      reject(`Incorrect Password for user: ${userData.userName}`);
                  } 
                  else {
                      users[0].loginHistory.push({dateTime: new Date(),userAgent: userData.userAgent});
                      User.update(
                        {userName: users[0].userName},
                        {$set: {loginHistory: users[0].loginHistory}
                      })
                      .exec()
                      .then(() => {
                          resolve(users[0]);
                      }).catch((err) => {
                          reject(`There was an error creating the user: ${err}`);
                      });
                  }
              }).catch(() => {
                  reject(`Incorrect Password for user: ${userData.userName}`);
              });
          }).catch((err) => {
              reject(`Unable to find user: ${userData.userName}`);
          });
      });
}