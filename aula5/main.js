
const express = require("express")
const app = express();
const port = 3000;
const path = require('path');


app.use(express.static(path.join(__dirname,'public')));

app.set('view engine', 'ejs');

app.set('views',path.join(__dirname,'views'));

app.use(express.urlencoded({extended:true}));

app.get('/',(req,res)=>{
res.render('index');

})
app.get('/comprar',(req,res)=>{
    res.render('comprar');
    
    })

    app.post('/confirma',(req,res)=>{
        const {nome , endereco, email,qtd} = req.body;
        res.render('confirma',{nome , endereco, email,qtd} );
        
        })

app.listen(port, () => {
    console.log("servidor ligado na porta 3000");
})