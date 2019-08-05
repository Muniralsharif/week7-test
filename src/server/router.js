const {
  homeHandler,
  getCitiesHandler,
  postCityHandler,
  publicHandler,
  errorHandler,
  getSignupPage,
  getLoginPage,
  signinHandler,
  signupHandler,
  citiesHandler,
  checkIfUserLogin
} = require("./handlers");

const router = (request, response) => {
  let userData = checkIfUserLogin(request, response);
  const { url } = request;

  if (url === "/") {
    if (!userData) {
      homeHandler(response);
    } else {
      citiesHandler(response);
    }
  } else if (url === "/cities") {
    if (!userData) {
      homeHandler(response);
    } else {
      citiesHandler(response);
      getCitiesHandler(response);
    }
  } else if (url === "/add-city") {
    if (!userData) {
      homeHandler(response);
    } else {
      citiesHandler(response);
      postCityHandler(request, response);
    }
  } else if (url.includes("public")) {
    publicHandler(url, response);
  } else if (url === "/signup" && request.method === "GET") {
    getSignupPage(response);
  } else if (url === "/login" && request.method === "GET") {
    getLoginPage(response);
  } else if (url === "/signup" && request.method === "POST") {
    if (!userData) {
      signupHandler(request, response);
    } else {
      citiesHandler(response);
    }
  } else if (url === "/login" && request.method === "POST") {
    if (!userData) {
      signinHandler(request, response);
    } else {
      citiesHandler(response);
    }
  } else {
    errorHandler(response);
  }
};

module.exports = router;
