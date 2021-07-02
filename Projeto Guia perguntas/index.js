const express = require("express")
const app = express()

//BODY-PARSE É RESPONSÁVEL POR TRANSFORMAR O DADO ENVIADO PELO FORMULÁRIO EM DADOS QUE O JAVASCRIPT ENTENDA
const bodyParser = require("body-parser")

//CRIANDO TABELA PERGUNTA NO BANCO DE dados
const Pergunta = require("./database/Pergunta")

//INICIANDO A CONEXÃO COM O BANCO DE DADOS
const connection = require("./database/database")


//IMPORTANDO MODULO DE REPOSTAS
const Resposta = require('./database/Resposta')

//database, tenta autenticar (ESTRUTURA PROMISSE)
connection
.authenticate()
.then(()=>{
    console.log("Conexão feita com o banco de dados!")
})
.catch((msgErro)=>{
    console.log(msgErro)
})



//Estou dizendo para o Express usar o EJS como View engine
app.set('view engine', 'ejs')
app.use(express.static('public'))

//Body Parser
app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json())

//Rotas
app.get("/",(req, res)=>{
    Pergunta.findAll({raw: true, order:[
        ['id','desc']//asc = para crescente e desc para decrescente
    ]}).then(perguntas =>{
        res.render("index",{
            perguntas: perguntas
        })
    })
})

app.get("/perguntar",(req,res)=>{
    res.render("perguntar")
})

app.post("/salvarpergunta",(req,res)=>{
    let titulo = req.body.titulo
    let descricao = req.body.descricao
    
    Pergunta.create({
        titulo: titulo,
        descricao: descricao
    }).then(()=>{
        res.redirect("/")
    })
})

app.get("/pergunta/:id",(req,res)=>{
    let id = req.params.id
    Pergunta.findOne({
        where: {id: id}
    }).then(pergunta =>{
        if(pergunta != undefined){

            Resposta.findAll({
                where: {perguntaId: pergunta.id},
                order:[['id','DESC']]
            }).then(respostas =>{
                res.render("pergunta",{
                    pergunta:pergunta,
                    respostas:respostas
                })
            })
        }else{
            res.redirect("/")//Não encontrada
        }
    })
})

app.post("/responder",(req,res)=>{
    let corpo = req.body.corpo
    let perguntaId = req.body.pergunta
    Resposta.create({
        corpo:corpo,
        perguntaId: perguntaId
    }).then(()=>{
        res.redirect("/pergunta/"+perguntaId)
    })
})

app.listen(3003, ()=> {console.log("App rodando!")})