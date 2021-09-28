
const express = require('express')
const app = express()
const port = 3000
var a=false;
app.set('view engine', 'ejs');

app.get('/palindromo', (req, res) => {


 const{q} = req.query;
  if(q==undefined){
     res.send("Por favor, digite a query string 'q'.");
 }
 let troca=q.split("").reverse().join("");



 if(q==troca){
a=true;
 }else{
     a=false;
 }
 res.render('home',{q,troca,a});

})




app.listen(port, () => {
    console.log("servidor ligado na porta 3000");
})