const { readFile } = require("fs");
const path = require("path");
const qs = require("querystring");
const addCity = require("../database/queries/postData");
const getCities = require("../database/queries/getData");
const getUser = require("../database/queries/getUser");
const bcrypt = require("bcryptjs");
const { sign, verify } = require("jsonwebtoken");
const secret = process.env.SECRET;
const alert = require("alert-node");
require("env2")("config.env");
const serverError = (err, response) => {
  response.writeHead(500, "Content-Type:text/html");
  response.end("<h1>Sorry, there was a problem loading the homepage</h1>");
  console.log(err);
};

const homeHandler = response => {
  const filepath = path.join(__dirname, "..", "..", "public", "index.html");
  readFile(filepath, (err, file) => {
    if (err) return serverError(err, response);
    response.writeHead(200, { "Content-Type": "text/html" });
    response.end(file);
  });
};

const getCitiesHandler = response => {
  getCities((error, result) => {
    if (error) return serverError(error, response);
    response.writeHead(200, { "Content-Type": "Application-json" });
    response.end(result);
  });
};

const postCityHandler = (request, response) => {
  let data = "";
  request.on("data", chunk => {
    data += chunk;
  });
  request.on("end", () => {
    console.log(qs.parse(data));
    addCity(qs.parse(data), (error, result) => {
      if (error) return serverError(error, response);
      response.writeHead(200, { "Content-Type": "text/html" });
      response.write('<div style="text-align:center;">');
      response.write("<h2>City Added Succesfuly</h2>");
      response.write(
        '<a href="#" onclick="history.go(-1)"> Click Here to go Back<a/>'
      );
      response.end("</div>");
    });
  });
};

const publicHandler = (url, response) => {
  const filepath = path.join(__dirname, "..", "..", url);
  readFile(filepath, (err, file) => {
    if (err) return serverError(err, response);
    const extension = url.split(".")[1];
    const extensionType = {
      html: "text/html",
      css: "text/css"
    };
    response.writeHead(200, { "content-type": extensionType[extension] });
    response.end(file);
  });
};

const errorHandler = response => {
  response.writeHead(404, { "content-type": "text/html" });
  response.end("<h1>404 Page Requested Cannot be Found</h1>");
};

const getSignupPage = response => {
  const filepath = path.join(__dirname, "..", "..", "public", "signup.html");
  readFile(filepath, (err, file) => {
    if (err) return serverError(err, response);
    response.writeHead(200, { "Content-Type": "text/html" });
    response.end(file);
  });
};

const getLoginPage = response => {
  const filepath = path.join(__dirname, "..", "..", "public", "login.html");
  readFile(filepath, (err, file) => {
    if (err) return serverError(err, response);
    response.writeHead(200, { "Content-Type": "text/html" });
    response.end(file);
  });
};
const signinHandler = (request, response) => {
  let body = "";
  request.on("data", chunk => {
    body += chunk.toString();
  });
  request.on("end", () => {
    const result = qs.parse(body);
    console.log(result, "result");
    getUser(result.Email, (err, rowResult) => {
      if (err) {
        return console.log(err);
      }
      if (rowResult.length) {
        console.log("rowResult", rowResult);
        console.log("result.password", result.password);
        bcrypt.compare(
          result.password,
          rowResult[0].password,
          (hashErr, passwordsMatch) => {
            console.log(passwordsMatch, "passwordsMatch");
            if (hashErr) {
              serverError();
              return;
            } else if (passwordsMatch) {
              const userInformation = {
                login: true,
                name: rowResult[0].name,
                id: rowResult[0].id
              };

              const token = sign(userInformation, secret);
              response.writeHead(302, {
                Location: "/public/cities.html",
                "Set-Cookie": "token=" + token + `;Max-Age=${100000}`
              });
              response.end();
            } else {
              alert("incorrect password");
              response.writeHead(302, {
                location: "/public/login.html"
              });
              response.end();
            }
          }
        );
      } else {
        alert("email does not exist");
        response.writeHead(302, {
          location: "/public/login.html"
        });
        response.end();
      }
    });
  });
};

const signupHandler = (request, response) => {
  let body = "";
  request.on("data", chunk => {
    body += chunk.toString();
  });
  request.on("end", () => {
    const result = qs.parse(body);
    console.log("reg result", result);
    if (result.password !== result.confirmPassword) {
      alert("the password confirm is different");
      response.writeHead(302, {
        location: "./public/login.html"
      });
      response.end();
    } else {
      getUser(result.email, (err, rowResult) => {
        if (err) {
          return console.log(err);
        }
        if (rowResult.length) {
          alert("the email is already used");
          response.writeHead(302, {
            location: "./public/login.html"
          });
          response.end();
        } else {
          bcrypt.hash(result.password, 8, (hashErr, hashedPassword) => {
            if (hashErr) {
              serverError(hashErr, response);
              return;
            }

            addUser(result.email, hashedPassword, (err) => {
              if (err) {
                alert("fail registered");
                response.writeHead(302, {
                  location: "/public/html/login.html"
                });
                response.end();
              } else {
                alert("successfully registered");
                response.writeHead(302, {
                  location: "/public/html/login.html"
                });
                response.end();
              }
            });
          });
        }
      });
    }
  });
};

const logoutHandler = response => {
  response.writeHead(302, {
    Location: "/public/html/login.html",
    "Set-Cookie": "token=0;Max-Age=0"
  });
  response.end();
};

const checkIfUserLogin = (request, response) => {
  if (!request.headers.cookie) return null;
  const { token } = qs.parse(request.headers.cookie);

  if (!token) return null;

  return verify(token, secret, (err, userData) => {
    if (err) {
      logoutHandler(response);
    } else {
      return userData;
    }
  });
};

const citiesHandler = response => {
  const filepath = path.join(
    __dirname,
    "..",
    "..",
    "public",
    "cities.html"
  );
};
module.exports = {
  homeHandler,
  getCitiesHandler,
  postCityHandler,
  publicHandler,
  getLoginPage,
  getSignupPage,
  errorHandler,
  signinHandler,
  logoutHandler,
  signupHandler,
  checkIfUserLogin,
  citiesHandler
};
