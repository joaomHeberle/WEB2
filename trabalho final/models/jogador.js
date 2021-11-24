const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose')
const jogadorSchema = new mongoose.Schema({
    nome:{
        type:String,

    },
    username:{
        type:String,
     
    },
    password:{
        type:String,

    },
    highScore1:Number,
    highScore2:Number,
    dataDeNascimento:{
        type:String,
        required:true,
    }
})

jogadorSchema.plugin(passportLocalMongoose);
const Jogador = new mongoose.model("Jogador",jogadorSchema); 

module.exports = Jogador;