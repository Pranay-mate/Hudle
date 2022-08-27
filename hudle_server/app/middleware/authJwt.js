const jwt = require("jsonwebtoken");
const config = require("../config/auth.config.js");
const db = require("../models");
const User = db.user;

verifyToken = (req, res, next) => {
  let token = req.headers["x-access-token"];
  console.log('token: '+token)
  if (!token) {
    return res.status(403).send({
      message: "No token provided!"
    });
  }

  jwt.verify(token, config.secret, (err, decoded) => {
    if (err) {
      return res.status(401).send({
        message: "Unauthorized!"
      });
    }
    req.userId = decoded.id;
    next();
  });
};

isRecruiter = (req, res, next) => {
  User.findByPk(req.userId).then(user => {
    if(user.role == 2){
      next();
      return;
    }
    res.status(403).send({
          message: "Require Recruitor Role!"
    });
  });
};

isCandidate = (req, res, next) => {
  User.findByPk(req.userId).then(user => {
    
    if(user.role == 1){
      next();
      return;
    }
    res.status(403).send({
          message: "Require Candidate Role!"
    });
  });
};

const authJwt = {
  verifyToken: verifyToken,
  isRecruiter: isRecruiter,
  isCandidate:isCandidate
};
module.exports = authJwt;
