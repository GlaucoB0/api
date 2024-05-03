import http from 'http'
import fs from 'fs'

const port = 3333

const server = http.createServer((request, response) => {

    const { url, method } = request

    response.setHeader('Access-Control-Allow-Origin', '*') // Allow requests from any origin
    response.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE') // Allow specified methods
    response.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization') // Allow specified headers

    fs.readFile('livro.json', (error, data) => {
        if (!error) { // verifica se há erro no json
            const api = JSON.parse(data)

            if (url.startsWith('/livros')) {
                if (url === "/livros" && method === "GET") { // Listar todos os livros
                    response.writeHead(200, { 'Content-Type': "application/json" })
                    response.end(JSON.stringify(api.livros))
                }
                else if (url.startsWith('/livros/') && method === "GET") { // Encontrar livro por ID
                    const id = url.split('/')[2]
                    const LivroId = api.livros.find((livro) => livro.id == id)

                    if (LivroId) {
                        response.writeHead(200, { 'Content-Type': "application/json" })
                        response.end(JSON.stringify(LivroId))
                    } else {
                        response.writeHead(404, { 'Content-Type': "application/json" })
                        response.end(JSON.stringify({ message: "livro não encontrado" }))
                    }
                }
                else if (url == '/livros' && method === "POST") { // Cadastrar novo Livro
                    let body = ''

                    request.on('data', (chunk) => {
                        body += chunk
                    })
                    request.on('end', () => {
                        const NovoLivro = JSON.parse(body)
                        NovoLivro.id = api.livros.length + 1
                        api.livros.push(NovoLivro)

                        fs.writeFile('livro.json', JSON.stringify(api, null, 2), (erro) => {
                            response.writeHead(202, { 'Content-Type': "application/json" })
                            response.end(JSON.stringify(NovoLivro))
                        })
                    })
                }
                else if (url.startsWith('/livros/') && method === "PUT") {
                    const id = url.split('/')[2]
                    const index = api.livros.findIndex((livro) => livro.id == id)
                    let body = ''

                    request.on('data', (chunk) => {
                        body += chunk
                    })
                    request.on('end', () => {
                        const NovoLivro = JSON.parse(body)
                        api.livros[index] = { ...api[index], ...NovoLivro }

                        fs.writeFile('livro.json', JSON.stringify(api, null, 2), (erro) => {
                            response.writeHead(202, { 'Content-Type': "application/json" })
                            response.end(JSON.stringify(api.livros[index]))
                        })
                    })
                }
            }
            else if (url.startsWith('/filmes')) {
                if (url === "/filmes" && method === "GET") { // Listar todos os filmes
                    response.writeHead(200, { 'Content-Type': "application/json" })
                    response.end(JSON.stringify(api.filmes))
                }
                else if (url === "/filmes/marvel" && method === "GET") { // Filtrar filmes da marvel
                    const filmesMarvel = api.filmes.filter((filme)=>filme.autor == 'Marvel')
                    
                    response.writeHead(200, { 'Content-Type': "application/json" })
                    response.end(JSON.stringify(filmesMarvel))
                }
                else if (url.startsWith('/filmes/') && method === "GET") { // Encontrar filme por ID
                    const id = url.split('/')[2]
                    const FilmeId = api.filmes.find((filme) => filme.id == id)

                    if (FilmeId) {
                        response.writeHead(200, { 'Content-Type': "application/json" })
                        response.end(JSON.stringify(FilmeId))
                    } else {
                        response.writeHead(404, { 'Content-Type': "application/json" })
                        response.end(JSON.stringify({ message: "filme não encontrado" }))
                    }
                }
                
                else if (url == '/filmes' && method === "POST") { // Cadastrar novo Livro
                    let body = ''

                    request.on('data', (chunk) => {
                        body += chunk
                    })
                    request.on('end', () => {
                        const NovoFilme = JSON.parse(body)
                        NovoFilme.id = api.filmes.length + 1
                        api.filmes.push(NovoFilme)

                        fs.writeFile('livro.json', JSON.stringify(api, null, 2), (erro) => {
                            response.writeHead(202, { 'Content-Type': "application/json" })
                            response.end(JSON.stringify(NovoFilme))
                        })
                    })
                }
                else if (url.startsWith('/filmes/') && method === "PUT") { // atualizar informações do filme
                    const id = url.split('/')[2]
                    const index = api.filmes.findIndex((filme) => filme.id == id)
                    let body = ''

                    request.on('data', (chunk) => {
                        body += chunk
                    })
                    request.on('end', () => {
                        const NovoFilme = JSON.parse(body)
                        api.filmes[index] = { ...api[index], ...NovoFilme }

                        fs.writeFile('livro.json', JSON.stringify(api, null, 2), (erro) => {
                            response.writeHead(202, { 'Content-Type': "application/json" })
                            response.end(JSON.stringify(api.filmes[index]))
                        })
                    })
                }
            }
        } else { // Caso der erro ao ler o json
            response.writeHead(500, { 'Content-Type': "application/json" })
            response.end(JSON.stringify({ message: "error ao ler o json" }))
        }
    })
})

server.listen(port, () => {
    console.log('server on port:' + port)
})