var request = require("request");
var express = require("express");
const app = express();
const path = require('path');

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));


app.get('/', (req, res) => {
    res.render('busca');
});

app.get('/buscaCidade', (req, res) => {
    const {cidade} = req.query;
    var resposta = {};
    request("https://api.hgbrasil.com/weather?key=351365a3&city_name=" + cidade, (error, response, body) => {
        if(!error && response.statusCode == 200){
            resposta = JSON.parse(body);
        }
        res.render('resultadoBusca', {resposta});
    });
});

app.listen(3000, () => console.log("Servidor ligado na porta 3000!"));


// request("https://api.hgbrasil.com/weather?key=351365a3&city_name=Campinas,SP" , (error, response, body)=>{
// if(!error && response.statusCode == 200){
//     var resposta = JSON.parse(body);
//     console.log(resposta.results.temp);
// }

// });