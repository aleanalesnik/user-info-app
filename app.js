var express = require('express');
var app = express();
var fs = require('fs');
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }))


app.set('views', './views');
app.set('view engine', 'pug');
app.use(express.static('public'));


// home page
app.get('/', function(req, res) {
    res.render('index');
});

// search bar that goes to results file and /search page
app.post('/search', (req, res) => {
    fs.readFile('./users.json', function(err, data) {
        if (err) {
            throw err;
        }
        let parsedData = JSON.parse(data);
        let query = req.body.search; // store search query user put in

        let output = parsedData.find(function(element) {
            return element.firstname.toLowerCase() === query.toLowerCase() || element.lastname.toLowerCase() === query.toLowerCase();
        });

        res.render('results', { users: output });
    });
});


// users page that displays all users
app.get('/users', function(req, res) {
    fs.readFile('./users.json', function(err, data) {
        if (err) {
            throw err;
        }
        let parsedData = JSON.parse(data);
        console.log(parsedData);
        res.render('users', { users: parsedData });
    });
});

// signup page
app.get('/signup', function(req, res) {
    res.render('signup');
});

// post signup 
app.post('/signup', function(req, res) {
    let newUser = {
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            email: req.body.email
    };
    fs.readFile('./users.json', function(err, data) {
        if (err) {
            throw err;
        }
        let parsedData = JSON.parse(data);
     
        parsedData.push(newUser);
        let fileContent = JSON.stringify(parsedData);

        fs.writeFile('./users.json', fileContent, function(err) {
            if (err) {
                throw err;
            }
        });
        res.redirect('users');
    });
});




var server = app.listen(3000, function() {
    console.log("App is running at port 3000 :)");
});