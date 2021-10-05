
const express = require("express")
const app = express();
const port = 2000;
const path = require('path');


app.use(express.static(path.join(__dirname,'public')));

app.set('view engine', 'ejs');

app.set('views',path.join(__dirname,'views'));

app.get('/',(req,res)=>{
res.render('index');

})
app.get('/compra',(req,res)=>{
    res.render('compra');
    
    })


app.listen(port, () => {
    console.log("servidor ligado na porta 2000");
})