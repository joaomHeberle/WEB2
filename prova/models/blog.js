const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({

    conteudo:String,
    titulo: String,
    criado: {
        type: Date,
        default: Date.now,
    },
    imagem: String,

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



const Blog = new mongoose.model("Blog", blogSchema);

module.exports = Blog;