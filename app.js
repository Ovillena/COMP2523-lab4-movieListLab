/*
 Authors:
 Octavio Villena A01207939
*/
const express = require("express");
const fs = require("fs");

let app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set("view engine", "ejs");

app.get("/", (req, res) => {
  res.render("pages/index", {
    moviesList: moviesArray, //send movieList as a variable for index.ejs
  });
});

app.get("/myForm", (req, res) => res.render("pages/myForm"));

let moviesArray = []; //stores an array of movies to be used in index.ejs
app.post("/myForm", (req, res) => {
  let formdata = req.body; //grabs user input of movies and splits them into an array
  moviesArray = formdata.movies.split(",").map((movie) => movie.trim());
});

app.get("/myListQueryString", (req, res) => {
  let movie1 = req.query.movie1;
  let movie2 = req.query.movie2;
  moviesArray = [movie1, movie2];
  res.redirect("/");
});

app.get("/search/:movieName", (req, res) => {
  let movieName = req.params.movieName;
  let moviesTextFile = fs.readFileSync("./movieDescriptions.txt", "utf8");
  let moviesAndDesc = moviesTextFile.split("\n");
  let searchFound = false;
  let movieTitle = "";
  let movieDesc = "";
  for (i = 0; i < moviesAndDesc.length; i++) {
    let movieSplitArray = moviesAndDesc[i].split(":");
    movieTitle = movieSplitArray[0];
    movieDesc = movieSplitArray[1];
    if (movieSplitArray[0].toUpperCase() == movieName.toUpperCase()) {
      searchFound = true;
      break;
    }
  }
  if (searchFound) {
    res.send(
      `<h1>${movieTitle}</h1><p>${movieDesc}</p><a href="http://localhost:3000/">back to index</a>`
    );
  } else {
    res.send("Movie could not be found");
  }
});

app.listen(3000, () => {
  console.log("Server is running on port 3000 🚀");
});
