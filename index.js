"use strict";

const axiosCookieJarSupport = require("axios-cookiejar-support").default;
const axios = require("axios");
const { CookieJar } = require("tough-cookie");
const Nodestream = require("nodestream");

const destination = new Nodestream({
  // This tells nodestream which storage system it should interact with
  // Under the hood, it will try to require `nodestream-filesystem` module
  adapter: "filesystem",
  // This object is always specific to your adapter of choice - always check
  // the documentation for that adapter for available options
  config: {
    // The `filesystem` adapter requires a `root` configuration option, so let's provide one
    root: [__dirname, ".storage"]
  }
});

axiosCookieJarSupport(axios);

const transport = (url, destination) =>
  axios
    .get(url, {
      jar: new CookieJar(),
      responseType: "stream",
      withCredentials: true
    })
    .then(response => response.data.pipe(destination))
    .catch(error => console.log(error));

const recall = (destination, file) => {}

module.exports = { transport, recall }
