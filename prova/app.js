const express = require('express');
const port = 3000;
const methodOverride = require('method-override');
const app = express();
const path = require('path');
const Blog = require('./models/blog');
const User = require('./models/user');
const mongoose = require('mongoose');
const passport = require('passport');
const LocalSt = require('passport-local');
var moment = require ('moment');
const expressSession = require('express-session');

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
 app.use(expressSession({
    secret: "ninhodemafagafo",
    resave:false,
    saveUnitiaded:false
}));
 app.use(passport.initialize());
 app.use(passport.session());
 passport.use(new LocalSt(User.authenticate()));
 passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

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


app.set('view engine', 'ejs');
app.post("/login", passport.authenticate("local",{
    
    successRedirect:"/administracao",

    failureRedirect:"/index"
  


}));
app.get("/", async  (req, res) => {
    const artigos =await Blog.find({});
    res.render('index',{ artigos,moment:moment  });

});
app.get("/index", async  (req, res) => {
    const artigos =await Blog.find({});
    res.render('index',{ artigos,moment:moment  });

});
app.get("/index/:id", async (req, res) => {
const{id} = req.params;
const artigo = await Blog.findById(id);
res.render('artigos/show', {artigo,moment:moment});
});

app.post("/index/:id", async (req, res) => {
    const{id} = req.params;
    try {
       
        const{conteudo,nome} = req.body;
        const artigo = await Blog.findById(id);
       


       artigo.comentario.push({nome: nome,conteudo: conteudo})
    
     await Blog.findByIdAndUpdate(id,artigo, {runValidators:true})
     } catch (error) {
         console.log(error);
     }
    res.redirect('/index/'+id);
    

  } );




app.get("/administracao",isLoggedIn, async (req, res) => {
    const artigos =await Blog.find({});

    res.render('artigos/administracao',{artigos});

});
app.get("/login", (req, res) => {
    res.render('artigos/login');

});
app.get("/cadastroUsuario", (req, res) => {
    res.render('artigos/cadUsuario');

});
app.post("/cadastroUsuario", (req, res) => {
   User.register(new User({username: req.body.username}), req.body.password,(err, user)=>{
    if(err){
        console.log(err);
        res.render('artigos/cadUsuario');
    }else{
        passport.authenticate("local")(req,res, ()=>{
            res.redirect("/administracao")

        });
    }

   })
   
 } );
 app.get("/artigos/new",isLoggedIn, (req, res) => {
    res.render('artigos/new');

});
app.post("/artigos/new",isLoggedIn, async (req, res) => {
    try {
        const blog = new Blog(req.body);
       await blog.save();
     
     } catch (error) {
         console.log(error);
     }
    res.redirect('/administracao');
    

  } );


  app.get("/index/:id/edit",isLoggedIn, async (req, res) => {
    const { id } = req.params;
   const blog = await Blog.findById(id);
   res.render('artigos/edit', { blog });
   

});



app.get("/artigos/:id/edit",isLoggedIn, async (req, res) => {
    const { id } = req.params;
   const blog = await Blog.findById(id);
   res.render('artigos/edit', { blog });
   

});

app.put("/artigos/:id/edit",isLoggedIn, async (req, res) => {
        const { id } = req.params;
        await Blog.findByIdAndUpdate(id,req.body, {runValidators:true})

        res.redirect('/index/'+id);

 });


app.get("/logout", isLoggedIn,(req, res) => {
   req.logout();
   res.redirect('/index');

});



app.delete("/artigos/deletar/:id",isLoggedIn, async (req, res) => {
   const { id } = req.params;
   await Blog.findByIdAndDelete(id);
   res.redirect('/administracao');
});


app.listen(port, () => console.log("servidor conectado a porta: " + port));