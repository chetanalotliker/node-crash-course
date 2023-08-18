const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const Blog = require('./models/blog');

// express app
const app = express();

// connect to mongo db 
const dbURI = 'mongodb://localhost:27017/node-tuts';
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true})
.then((result)=>console.log('connected to db'))
.catch((err)=> console.log(err))
// listen for requests
app.listen(3000);

// register view engine
app.set('view engine', 'ejs');

// middleware & static files
app.use(express.static('public'));
app.use(morgan('dev'));

// mongoose and mongo sandbox 
app.get('/add-blog',(req,res)=>{
  const blog = new Blog({
    title: 'new aa',
    snippet: 'new site',
    body:'more info'
  });

  blog.save()
  .then((result)=>{
    res.send(result)
  })
  .catch((err)=>{
    console.log(err)
  })
})

app.get('/all-blogs',(req,res)=>{
  Blog.find()
  .then((result)=>{
    res.send(result);
  })
  .catch((err)=>{
    console.log(err)
  })
});

app.get('/single-blog',(req,res)=>{
  Blog.findById('64dfa4657bbf9ab6db5e011f')
  .then((result)=>{
    res.send(result)
  })
  .catch((err)=>{
    console.log(err)
  })
});
app.use((req, res, next) => {
  console.log('new request made:');
  console.log('host: ', req.hostname);
  console.log('path: ', req.path);
  console.log('method: ', req.method);
  next();
});

app.use((req, res, next) => {
  res.locals.path = req.path;
  next();
});

app.get('/', (req, res) => {
  res.redirect('/blogs')
});

app.use((req, res, next) => {
  console.log('in the next middleware');
  next();
});

app.get('/about', (req, res) => {
  res.render('about', { title: 'About' });
});

//blog routes 
app.get('/blogs',(req,res)=>{
  Blog.find()
  .then((result)=>{
    res.render('index',{title:'All Blogs', blogs: result})
  })
  .catch((err)=>{
    console.log(err)
  })
});

app.get('/blogs/create', (req, res) => {
  res.render('create', { title: 'Create a new blog' });
});

// 404 page
app.use((req, res) => {
  res.status(404).render('404', { title: '404' });
});