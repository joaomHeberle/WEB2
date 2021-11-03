const express = require('express');
const port = 3000;
const methodOverride = require('method-override');
const app = express();
const path = require('path');
const Pessoa = require('./models/pessoa')
const mongoose = require('mongoose');
// mongoose.connect('mongodb://localhost:27017/dbPessoas')
// .then(()=>{
//     console.log("conectou");


// })
// .catch(err=>{
// console.log("erro");
// console.log(err);



// })
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static('public'));
 app.set('views',path.join(__dirname,'views'));




// const pessoa1 = new Pessoa({
//     nome: "joao marco",
//     email:"j@j",
//     cpf: "1"
// })
// const pessoa2 = new Pessoa({
//     nome: "jose",
//     email:"j@ze",
//     cpf: "2"
// })

// Pessoa.insertMany([pessoa1,pessoa2])
// // pessoa1.save()
// .then(res=>{
// console.log(res)
// }
//     ).catch(e=>{

//             console.log(e);
//     })


app.set('view engine', 'ejs');

app.get("/",  (req, res) => {
    //const pessoas =await Pessoa.find({});

    res.render('jogo/index');

});

app.get("/jogo/play",  (req, res) => {
    //const pessoas =await Pessoa.find({});

    res.render('jogo/jogar');

});
app.get("/jogo/gameOver",  (req, res) => {
    //const pessoas =await Pessoa.find({});

    res.render('jogo/gameOver');

});
// app.get("/pessoas/new", (req, res) => {
//     res.render('pessoas/new');

// });


// app.get('/pessoas/:id', async (req, res) => {
//     const { id } = req.params;
//     const pessoa =await Pessoa.findById(id);
//     res.render('pessoas/show', {pessoa});

// });
// app.post("/pessoas", async (req, res) => {
//     const novaPessoa= new Pessoa(req.body);
//     await novaPessoa.save();
//     res.redirect('pessoas');

// });
// app.get("/pessoas/:id/edit", async (req, res) => {
//     const { id } = req.params;
//     const pessoa = await Pessoa.findById(id);
//     res.render('pessoas/edit', { pessoa });

// });

// app.put("/pessoas/:id", async (req, res) => {
//     const { id } = req.params;
// await Pessoa.findByIdAndUpdate(id,req.body, {runValidators:true})

//     res.redirect('/pessoas');

//  });
// app.delete("/pessoas/:id", async (req, res) => {
//     const { id } = req.params;
//     await Pessoa.findByIdAndDelete(id);
//     res.redirect('/pessoas');

// });
app.listen(port, () => console.log("servidor conectado a porta: " + port));