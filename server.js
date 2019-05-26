const express = require('express');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const keys = require('./config/keys');
mongoose.connect(keys.MongoURI).then(()=>{
    console.log('DB connected...');
});

const app = express();

//setup template engine
app.engine('handlebars', exphbs({
    defaultLayout: 'main'
}));

app.set('view engine', 'handlebars');

//setup body parser to encode url
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());

//create collection with mongoose
const Schema = mongoose.Schema;
const Message = mongoose.model('message', new Schema({
    name: {
        type: String
    },
    email: {
        type: String
    },
    message: {
        type: String
    },
    date: {
        type: Date,
        default: Date.now
    }
}));


//setup express static public folder for css and js and images
app.use(express.static('public'));

const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.render('home');
});

app.get('/about', (req, res) => {
    res.render('about');
});

app.get('/contact', (req, res) => {
    res.render('contact');
});

app.post('/getMessage', (req, res) => {
    const newMessage = {
        name: req.body.name,
        email: req.body.email,
        message: req.body.message
    }
    new Message(newMessage).save().then(() => {
        res.render('inbox');
    });
});

app.get('/displayMessage', (req, res) => {
    Message.find({}, (err, messages) => {
        if(err){
            console.log(err);
        }else{
            res.render('displayMessage', {
                messages: messages
            })
        }
    })
});

app.get('/portfolio', (req, res) =>{
    res.render('portfolio');
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

