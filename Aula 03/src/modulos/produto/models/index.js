const pool = require('../../../config/database')

function ListarProdutos() {
    try {
        const query = `select * from produto`
        const resultado = pool.query(query)
        if(!resultado){
            
        }
    } catch (error) {
        
    }
}