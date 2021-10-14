const express = require('express');
const port = 3000;
const methodOverride = require('method-override');
const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
let pessoas = [
    {
        nome: "joao marco",
        id: "1"

    }, {
        nome: "jose",
        id: "2"
    }
];

app.set('view engine', 'ejs');

app.get("/pessoas", (req, res) => {
    res.render('pessoas/index', { pessoas });

});

app.get("/pessoas/new", (req, res) => {
    res.render('pessoas/new');

});


app.get("/pessoas/:id", (req, res) => {
    const { id } = req.params;
    const pessoa = pessoas.find(pessoa => pessoa.id == id);
    res.render('pessoas/show', { pessoa });

});
app.post("/pessoas", (req, res) => {

    const {nome,id} = req.body;
    pessoas.push({nome, id});
    res.redirect('pessoas');

});
app.get("/pessoas/:id/edit", (req, res) => {
    const { id } = req.params;
    const pessoa = pessoas.find(pessoa => pessoa.id == id);
    res.render('pessoas/edit', { pessoa });

});

app.patch("/pessoas/:id", (req, res) => {
    const { id } = req.params;
    const novoNome = req.body.nome;
    const pessoa = pessoas.find(pessoa => pessoa.id == id);
    pessoa.nome = novoNome;
    res.redirect('/pessoas');

});
app.listen(port, () => console.log("servidor conectado a porta: " + port));