var express = require("express");
var app = express();
var PORT = 8080; // default port 8080
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));
var cookieParser = require('cookie-parser');
app.use(cookieParser());

var urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};
function generateRandomString() {
	let randNum = Math.random().toString(36).substring(7);
	return randNum;
}




app.set('view engine','ejs');

app.post("/login", (req, res) =>{
  res.cookie('username',req.body.username);
  res.redirect('/urls');
});

app.post("/logout", (req, res) =>{
  res.clearCookie('username');
  res.redirect('/urls');
});




  


app.get("/urls", (req, res) => {
  let templateVars = { urls: urlDatabase,
   username: req.cookies["username"]};
  res.render("urls_index", templateVars);
});

app.get("/urls/new", (req, res) => {
  let templateVars = {
  username: req.cookies["username"],
  // ... any other vars
  };
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
		shortURL: req.params.id,
    username: req.cookies["username"],
	 };
  res.render("urls_show",templateVars);
});

  app.post("/urls/:id/delete",(req, res) => {
  delete urlDatabase[req.params.id];
  res.redirect('/urls');
})

 app.post("/urls/:id",(req, res) => {
  urlDatabase[req.params.id] = req.body.updatedURL;
  res.redirect('/urls');
})


  
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