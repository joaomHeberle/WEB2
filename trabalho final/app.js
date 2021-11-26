const express = require('express');
const port = 3000;
const methodOverride = require('method-override');
const app = express();
const path = require('path');
const Jogador = require('./models/jogador')
const mongoose = require('mongoose');
const passport = require('passport');
const LocalSt = require('passport-local');
const expressSession = require('express-session');




mongoose.connect('mongodb://localhost:27017/dbJogadores', {useNewUrlParser:true, useUnifiedTopology:true})
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
passport.use(new LocalSt(Jogador.authenticate()));


passport.serializeUser(Jogador.serializeUser());
passport.deserializeUser(Jogador.deserializeUser());

app.use((req, res, next)=>{
    res.locals.currentUser = req.user;
    next();


});

const isLoggedIn = (req,res,next)=>{
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/")
}



// const pessoa1 = new Jogador({
//     nome: "antonio",
//     email:"antes@ze",
//     senha: "333",
//     highScore1: 2,
// highScore2: 3,
// dataDeNascimento:'10-18-1992'
// })
// const pessoa2 = new Jogador({
//     nome: "jose",
//     email:"j@ze",
//     senha: "2",
//     highScore1: 2,
// highScore2: 3,
// dataDeNascimento: '10-10-2010'
// })

// Jogador.insertMany([pessoa1,pessoa2])

// .then(res=>{
// console.log(res)
// }
//     ).catch(e=>{

//             console.log(e);
//     })


app.set('view engine', 'ejs');

app.get("/",  (req, res) => {

    res.render('index');

});
app.post("/", passport.authenticate("local",{
    
     successRedirect:"/jogo/inicio",

     failureRedirect:"/"
   


}));
app.get("/jogo/inicio", isLoggedIn, (req, res) => {


    res.render('jogo/inicio');

});
app.get("/jogo/ranking1", async  (req, res) => {
    const jogadores =await Jogador.find({}).sort({highScore1: -1});

    res.render('jogo/ranking',{ jogadores });

});
app.get("/jogo/ranking2", async  (req, res) => {
    const jogadores =await Jogador.find({}).sort({highScore2: -1});

    res.render('jogo/ranking2',{ jogadores });

});

 app.get("/jogo/cadastro", (req, res) => {
     res.render('jogo/cadastro');

 });
 app.post("/jogo/cadastro", async (req, res) => {
     try {
        const {nome,username,password,highScore1,highScore2,dataDeNascimento} = req.body;
        const jogador = new Jogador({username,nome,highScore1,highScore2,dataDeNascimento});
        const jogadorReg = await Jogador.register(jogador,password);
     
     } catch (error) {
         console.log(error);
     }
    res.redirect('/');
    



});
app.get("/logout", isLoggedIn,(req, res) => {
    req.logout();
    res.redirect('/');

});




app.post("/", isLoggedIn,async (req, res) => {
    const novoJogador= new Jogador(req.body);
    await novoJogador.save();
    res.redirect('/');

});
 app.get("/jogo/atualizar",isLoggedIn, async (req, res) => {
     const { id } = req.params;
    const jogador = await Jogador.findById(id);
    res.render('jogo/atualizar', { jogador });

 });

 app.put("/jogo/:id",isLoggedIn, async (req, res) => {     const { id } = req.params;
 await Jogador.findByIdAndUpdate(id,req.body, {runValidators:true})

     res.redirect('/jogo/inicio');

  });
  app.get("/jogo/deletar",isLoggedIn, async (req, res) => {

    res.render('jogo/deletar');
});
app.delete("/jogo/deletar/:id", async (req, res) => {
    const { id } = req.params;
    await Jogador.findByIdAndDelete(id);
    res.redirect('/');
});



app.get("/jogo/play2",isLoggedIn,  (req, res) => {
  

    res.render('jogo/jogar');

});
app.get("/jogo/play",isLoggedIn, (req, res) => {
   

    res.render('jogo/jogo2');

});
// app.get("/jogo/gameOver1",  (req, res) => {
  

//     res.render('jogo/gameOver');

// });

app.put("/jogo/gameOver1/:id", async (req, res) => {
    const {highScore1} = req.body;

     const { id } = req.params;
     const highBanco= await Jogador.findById(id, {highScore1:1});
   

   if(highScore1>highBanco.highScore1){
   await Jogador.findByIdAndUpdate(id,req.body, {runValidators:true})
   }
       await res.redirect('/jogo/gameOver');
   
   });

app.put("/jogo/gameOver2/:id", async (req, res) => {
 const {highScore2} = req.body;

  const { id } = req.params;
  const highBanco= await Jogador.findById(id, {highScore2:1});


if(highScore2>highBanco.highScore2){
await Jogador.findByIdAndUpdate(id,req.body, {runValidators:true})
}
    await res.redirect('/jogo/gameOver');

});
app.get("/jogo/gameOver",  (req, res) => {
  

    res.render('jogo/gameOver');

});
app.listen(port, () => console.log("servidor conectado a porta: " + port));