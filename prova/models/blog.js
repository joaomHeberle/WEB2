const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');
const blogSchema = new mongoose.Schema({

    username: {
        type: String,

    },
    password: {
        type: String,

    },
    conteudo: {
        type: String
    },
    titulo: {
        type: String
    },
    criado: {
        type: Date,
        default: Date.now,
    },
    imagem: {
        type: String,
    },

    comentario: [
        {
            nome: {
                type: String,
            },
            conteudo: {
                type: String,
            },
            data: {
                type: Date,
                default: Date.now,
            }
        }
    ]
})


blogSchema.plugin(passportLocalMongoose);
const Blog = new mongoose.model("Blog", blogSchema);

module.exports = Blog;