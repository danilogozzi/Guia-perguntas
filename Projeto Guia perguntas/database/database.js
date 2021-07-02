const Sequelize = require('sequelize')

const connection = new Sequelize('guiaperguntas','root','123456',{
    host: 'localhost',
    dialect: 'mysql'
})


//Para exportar para outros arquivos
module.exports = connection