var express = require("express");
var app = express();
var PORT = 8080; // default port 8080
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));
var cookieParser = require('cookie-parser');
app.use(cookieParser());

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
function urlsForUser(id){
  var secureDatabase = {}
  for

  
 }




app.set('view engine','ejs');
app.get('/',(req, res) =>{
  res.render('homepage')
})

app.get('/register',(req, res) => {
  let templateVars = { urls: urlDatabase,
   user: users[req.cookies['user_id']]
 }

  res.render('urls_register', templateVars);
});

app.post("/register", (req, res) =>{
  var userID = generateRandomString();
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
      password : req.body.password,
      };

      
      res.cookie('user_id', userID);
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
    user : users[req.cookies['user_id']]

  }
  res.render('urls_login',templateVars)
});

app.post("/login", (req, res) =>{
   var errorCheck = false;
  for (let uID in users ){
    
    

    if (req.body.email === users[uID].email)
    {
      
      if (req.body.password === users[uID].password){
        res.cookie('user_id', users[uID].id);
        res.redirect('/urls');
      } else {
          throw 'ERROR 403';
      } 
    } 
    else {
      errorCheck = true;
    }
    
  }
   if (errorCheck === true)
     {
        throw 'ERROR 403';
      }
});

app.post("/logout", (req, res) =>{
  res.clearCookie('user_id');
  res.redirect('/');
});



  


app.get("/urls", (req, res) => {

  let templateVars = { urls: urlDatabase,
   //username: req.cookies["username"]};
   user : users[req.cookies['user_id']],
  
  }

  res.render("urls_index", templateVars);
});


app.get("/urls/new", (req, res) => {
 
  let templateVars = {
  //username: req.cookies["username"],
    user : users[req.cookies['user_id']]

  };
  res.render("urls_new",templateVars);
});

/*app.post('/urls/new',(req, res) => {
  let userID = users[req.cookies['user_id']].id
  urlDatabase[shortURL] = longURL
  res.redirect("/urls");
});*/

app.post("/urls/new", (req, res) => {
  console.log(req.body);
  let longURL = req.body.longURL 
  let userID = users[req.cookies['user_id']].id
  let shortURL = generateRandomString()
  urlDatabase[shortURL] = {
    longURL: longURL,
    user : userID}
    console.log(urlDatabase)
  		  // debug statement to see POST parameters
  res.redirect(`/urls/${shortURL}`);         // Respond with 'Ok' (we will replace this)
});



app.get("/urls/:id", (req, res) => {
	let templateVars = { urls: urlDatabase,
		shortURL: req.params.id,
      user : users[req.cookies['user_id']]
	 };
  res.render("urls_show",templateVars);
});

  app.post("/urls/:id/delete",(req, res) => {
  if (urlDatabase[req.params.id]['user'] === req.cookies['user_id']){
  delete urlDatabase[req.params.id];
  res.redirect('/urls');
}
});

 app.post("/urls/:id",(req, res) => {
   if (urlDatabase[req.params.id]['user'] === req.cookies['user_id']){
  urlDatabase[req.params.id]['longURL'] = req.body.updatedURL;
  res.redirect('/urls');
} else {
  throw 'Not a valid username'
}
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