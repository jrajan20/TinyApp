var express = require("express");
var app = express();
var PORT = 8080; // default port 8080
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));

var urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};
function generateRandomString() {
	let randNum = Math.random().toString(36).substring(7);
	return randNum;
}



app.set('view engine','ejs');



/*app.get("/", (req, res) => {
  res.render('pages/index');
});
app.get("/", (req, res) => {
  res.render('pages/about');
});*/

// server.js

// index page 
/*app.get('/', function(req, res) {
    var drinks = [
        { name: 'Bloody Mary', drunkness: 3 },
        { name: 'Martini', drunkness: 5 },
        { name: 'Scotch', drunkness: 10 }
    ];
    var tagline = "Any code of your own that you haven't looked at for six or more months might as well have been written by someone else.";

    res.render('pages/index', {
        drinks: drinks,
        tagline: tagline
    });
});
*/
app.get("/urls", (req, res) => {
  let templateVars = { urls: urlDatabase };
  res.render("urls_index", templateVars);
});

app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});

app.post("/urls", (req, res) => {
  console.log(req.body);
  let longURL = req.body.longURL 
  let shortURL = generateRandomString()
  urlDatabase[shortURL] = longURL;
  		  // debug statement to see POST parameters
  res.redirect(`/urls/${shortURL}`);         // Respond with 'Ok' (we will replace this)
});

app.get("/urls/:id", (req, res) => {
	let templateVars = { urls: urlDatabase,
		shortURL: req.params.id
	 };
  
  res.render("urls_show",templateVars);
});



  
 app.get("/u/:shortURL", (req, res) => {
  let stringCode = req.params.shortURL;
   let longURL = `${urlDatabase[stringCode]}`;
  res.redirect(longURL);
 	
});


/*app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});*/

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`)
});