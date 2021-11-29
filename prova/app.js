const express = require('express');
const port = 3000;
const methodOverride = require('method-override');
const app = express();
const path = require('path');
const Blog = require('./models/blog')
const mongoose = require('mongoose');
const passport = require('passport');
const LocalSt = require('passport-local');


mongoose.connect('mongodb://localhost:27017/blogdb', {useNewUrlParser:true, useUnifiedTopology:true})
.then(()=>{
    console.log("conectou no banco");


})
.catch(err=>{
console.log("erro");
console.log(err);



 })
 app.use(express.urlencoded({ extended: true }));
 app.use(methodOverride('_method'));
 app.use(express.static('public'));
 app.set('views',path.join(__dirname,'views'));
 app.use(passport.initialize());
 passport.serializeUser(Blog.serializeUser());
passport.deserializeUser(Blog.deserializeUser());

app.use((req, res, next)=>{
    res.locals.currentUser = req.user;
    next();


});

const isLoggedIn = (req,res,next)=>{
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login")
}
// var comentario1=
// {
//     nome:"joao",
//     conteudo:"muito bom",
//     data: Date.now(),
// }
//  const blog1 = new Blog({
//     username: "antonio",
//     password: "12345",
//     conteudo: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.", 
//     titulo: "Lorem Ipsum",
//     criado: Date.now(),
//     imagem: "paisagem2.jpg",
//     comentario:comentario1
//  })
//  var comentario2=
//  {
//      nome:"mario",
//      conteudo:"otimo",
//      data: Date.now(),
//  }
//  const blog2 = new Blog({
//     username: "jose",
//     password: "12345",
//     conteudo: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.", 
//     titulo: "Lorem Ipsum",
//     criado: Date.now(),
//     imagem: "paisagem1.jpg",
//     comentario:comentario2
//  })

// Blog.insertMany([blog1,blog2])

//  .then(res=>{
//  console.log(res)
//  }
//      ).catch(e=>{

//              console.log(e);
//      })


app.set('view engine', 'ejs');

app.get("/index",  (req, res) => {

    res.render('index');

});


app.listen(port, () => console.log("servidor conectado a porta: " + port));