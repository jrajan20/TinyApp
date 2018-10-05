var express = require("express");
var app = express();
var PORT = 8080; // default port 8080
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));
var cookieSession = require('cookie-session');
app.use(cookieSession({
  name: 'session',
  keys: ['REST IN SPAGHETTI never Forghetti'],
  // Cookie Options
  maxAge: 24 * 60 * 60 * 1000 // 24 hours
}))

const bcrypt = require('bcrypt');

var urlDatabase = {
  "b2xVn2": {
    longURL: 'http://www.lighthouselabs.com',
    user : 'sdgsf56'},
  "9sm5xK": {
    longURL: 'http://www.google.com',
    user : 'jvjdshf'} 
};

const users = { 
  "userRandomID": {
    id: "userRandomID", 
    email: "user@example.com", 
    password: "purple-monkey-dinosaur"
  },
 "user2RandomID": {
    id: "user2RandomID", 
    email: "user2@example.com", 
    password: "dishwasher-funk"
  }
}

function generateRandomString() {
	let randNum = Math.random().toString(36).substring(7);
	return randNum;
}






app.set('view engine','ejs');
app.get('/',(req, res) =>{
  res.render('homepage')
})

app.get('/register',(req, res) => {
  let templateVars = { urls: urlDatabase,
   user: users[req.session.user_id]
 }

  res.render('urls_register', templateVars);
});

app.post("/register", (req, res) =>{
  var userID = generateRandomString()
  
  const password = req.body.password; // you will probably this from req.params
  const hashedPassword = bcrypt.hashSync(password, 10);
  if((req.body.email) &&(req.body.password) && req.body.email !== null && req.body.password !== null )
  {
    for (let uID in users)
    {
      if (req.body.email === users[uID].email)
      {
        throw  "Error 400";
      }
      else
      {
        users[userID] = {
      id : userID,
      email : req.body.email,
      password : hashedPassword,
      };
//req.session.user_id
      
      req.session.user_id = userID;
      res.redirect('/login');
      }
    } 
} 
else {
  throw "Error 400";
}

});

app.get('/login',(req, res) =>{
  let templateVars ={
    user : users[req.session.user_id]

  }
  res.render('urls_login',templateVars)
});

app.post("/login", (req, res) =>{
   var errorCheck = false;
   
   
  for (let uID in users ){
    const password = users[uID].password;
    const hashedPassword = bcrypt.hashSync(password, 10);
    if (req.body.email === users[uID].email){

      if (bcrypt.compareSync(password, hashedPassword)){

        req.session.user_id = users[uID].id;
        res.redirect('/urls');
      } else {
        throw 'ERROR 403';
        errorCheck = true;
      }
       if (errorCheck === true){
        throw 'ERROR 403';
      }
    }
   
  }
});

app.post("/logout", (req, res) =>{
  req.session.user_id = null;
  res.redirect('/');
});


function urlsForUser(id){
  var secureDatabase = {};

  for (var userURL in urlDatabase){
    if ( urlDatabase[userURL].user === id){
      secureDatabase = urlDatabase[userURL];
    }
  } 
  return secureDatabase;
 }
  


app.get("/urls", (req, res) => {

  let templateVars = { urls: urlsForUser(req.session.user_id),
   //username: req.cookies["username"]};
   user : users[req.session.user_id],

   shortURL : generateRandomString()

  }

  res.render("urls_index", templateVars);
});


app.get("/urls/new", (req, res) => {
 
  let templateVars = {
  //username: req.cookies["username"],
    user : users[req.session.user_id]

  };
  res.render("urls_new",templateVars);
});



app.post("/urls/new", (req, res) => {
  console.log(req.body);
  let longURL = req.body.longURL 
  let userID = users[req.session.user_id].id
  let shortURL = generateRandomString()
  urlDatabase[shortURL] = {
    longURL: longURL,
    user : userID}
    console.log(urlDatabase)
  		  // debug statement to see POST parameters
  res.redirect(`/urls/${shortURL}`);         // Respond with 'Ok' (we will replace this)
});



app.get("/urls/:id", (req, res) => {
	let templateVars = { urls : urlsForUser(req.session.user_id),
		shortURL: req.params.id,
      user : users[req.session.user_id]
	 };
  res.render("urls_show",templateVars);
});

  app.post("/urls/:id/delete",(req, res) => {
  if (urlsForUser(req.session.user_id).user === req.session.user_id){
  delete urlsForUser(req.session.user_id).user;
  delete urlsForUser(req.session.user_id).longURL;
  res.redirect('/urls');
}
});

 app.post("/urls/:id",(req, res) => {
  console.log(req.params.id)
   if (urlsForUser(req.session.user_id).user === req.session.user_id){
  urlsForUser(req.session.user_id).longURL = req.body.updatedURL;
  res.redirect('/urls');
} else {
  throw 'Not a valid username'
}
})


  
 app.get("/u/:id", (req, res) => {
  let stringCode = req.params.id;
   let longURL = `${urlDatabase[stringCode].longURL}`;
  res.redirect(longURL);
 	
});




/*app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});*/

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`)
});