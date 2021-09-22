const express = require('express');
const { runInNewContext } = require('vm');
const app = express()

// "/" -> "Bem vindo ao meu exercício!"

app.get('/', (req, res) =>{ 
    res.send('Bem vindo ao meu exercício!');
});


// "/nome/Jose" -> "Bem vindo(a) Jose!"
app.get('/nome/:nome', (req, res) =>{ 
    res.send('Bem vindo(a)'+req.params.nome+'!');
});

// "/repetir/Ola!/3" -> "Ola! Ola! Ola!"
app.get("/repetir/:v1/:v2", (req, res) =>{
    var v=[];

    for ( i = 0; i<parseInt(req.params.v2); i++) {
        v[i]=req.params.v1+'!';
        
    } 
    var myv = v.join(' ');
        res.send(myv);
 
   
});


app.get('/som/:v1', (req, res) =>{ 
    if(req.params.v1=="cao")
    res.send('O cachorro faz '+'Auuu Auuu Auuu'+'.');
    else if(req.params.v1=="gato")
    res.send('O gato faz '+'Miauuu'+'.');
    else if(req.params.v1=="vaca")
    res.send('A vaca faz '+'Mooon'+'.');
    else if(req.params.v1=="ovelha")
    res.send('A ovelha faz '+'Meeeee'+'.');
    else if(req.params.v1=="cavalo")
    res.send('O cavalo faz '+'Rhiiiii'+'.');
    else
    res.send('Animal desconhecido.');
});

app.get('*', (req, res) =>{ 
    res.send('Página não encontrada!');
});
app.listen(3000, () => {
    console.log("servidor ligado na porta 3000");
})