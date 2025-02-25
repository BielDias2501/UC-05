// Importando com (ESM)
const express = require('express')
const { pool } = require('./src/config/database')
const dotenv = require('dotenv')
dotenv.config();

const port = process.env.PORTA;
const app = express();

//Aplicação use express com json
app.use(express.json());

app.get('/produtos', async (requisicao, resposta) => {
    //tratamento de exceções
    try {
        const consulta = `select * from produto` 
        const produtos = await pool.query(consulta) //FAZENDO A CONSULTA 
        if (produtos.rows.length === 0) { //BUSCAR LINHAS NO BANCO DE DADOS\\
            return resposta.status(200).json({ mensagem: "Banco de Dados vazio" })
        }
        resposta.status(200).json(produtos.rows);
    } catch (error) {
        resposta.status(500).json({ mensagem: "Erro ao buscar produtos", erro: error.message })
    }
});

//Criando produto
app.post('/produtos', async (requisicao, resposta) => {
    try {
        const { nome, preco, quantidade } = requisicao.body;
        if (!nome || !preco || !quantidade) {
            return resposta.status(200).json({ mensagem: "Todos os dados devem ser preenchidos" })
        }
        const dados = [nome, preco, quantidade];
        const consulta = `insert into produto(nome,preco,quantidade) 
                    values ($1, $2, $3) returning *`
        await pool.query(consulta, dados)

        resposta.status(201).json({ mensagem: "Produto criado com sucesso" });
    } catch (error) {
        resposta.status(500).json({ mensagem: "Erro ao cadastrar produtos", erro: error.message })
    }
});


app.put('/produtos/:id', async (requisicao, resposta) => {
    try {
        // localhost:3000/produtos/1
        const id = requisicao.params.id;
        const { novoNome, novoPreco, novaQuantidade } = requisicao.body
        if (!id) {
            return resposta.status(404).json({ mensagem: "informe um paramentro" })
        }
        const dados1 = [id]
        const consulta1 = `select * from produto where id = $1`
        const resultado1 = await pool.query(consulta1, dados1)
        if (!resultado1.rows.length === 0) {
            return resposta.status(404).json({ mensagem: "Produto não encontrado" })
        }
        const dados2 = [id, novoNome, novoPreco, novaQuantidade]
        const consulta2 = `update produto set nome = $2, preco = $3, quantidade = $4 where id = $1 returning *`
        await pool.query(consulta2, dados2)
        resposta.status(200).json({ mensagem: "Produto atualizado com sucesso" })
    } catch (error) {
        resposta.status(500).json({ mensagem: "Erro ao editar produtos", erro: error.message })
    }
})


app.delete("/produtos/:id", async (requisicao, resposta) => {
    try {
        const id = requisicao.params.id
        const dados1 = [id]
        const consulta1 = `select * from produto where id = $1`
        const resultado1 = await pool.query(consulta1, dados1)
        if (resultado1.rows.length === 0) {
            return resposta.status(404).json({ mensagem: "Produto não encontrado" })
        }
        const dados2 = [id]
        const consulta2 = `delete from produto where id = $1`
        await pool.query(consulta2, dados2)
        resposta.status(200).json({ mensagem: "Produto deletado com sucesos" })
    } catch (error) {
        resposta.status(500).json({ mensagem: "Erro ao excluir produtos", erro: error.message })
    }
})


//GET PELO ID

app.get('/produtos/:id', async (requisicao, resposta) => {
    try {
        const id = requisicao.params.id
        const dados1 = [id]
        const consulta1 = `select * from produto where id = $1`
        const resultado1 = await pool.query(consulta1, dados1)
        if (!resultado1.rows.length === 0) {
            return resposta.status(404).json({ mensagem: "Produto não encontrado" })
        }
        resposta.status(200).json(resultado1.rows[0])
    } catch (error) {
        resposta.status(500).json({ mensagem: "Erro ao buscar o produto", erro: error.message })
    }
});


app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});

//DELETAR TUDO
app.delete('/produtos', async (requisicao, resposta) => {
    try {
        const consulta = `delete from produto`
        await pool.query(consulta)
        resposta.status(200).json({ mensagem: "Todos os dados excluídos com sucesso" })
    } catch (error) {
        resposta.status(500).json({ mensagem: "Erro ao deletar todos os produtos", erro: error.message })
    }
})
