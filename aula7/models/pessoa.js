const mongoose = require('mongoose');
const pessoaSchema = new mongoose.Schema({
    nome:String,
    email:String,
    cpf:{
        type:String,
        required:true,
    }
})


const Pessoa = new mongoose.model("Pessoa",pessoaSchema); 

module.exports = Pessoa;