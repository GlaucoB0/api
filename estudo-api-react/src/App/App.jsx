import { useState } from "react"
import './App.css'

const App = () => {

    const [data, setData] = useState(null)

    async function Data(topico, id) {

        const livros = await fetch(`http://localhost:3333/${topico}/${id} `)
        const json = await livros.json()

        setData(json)
    }


    return (
        <div className="container">
            <section className="btn-container">
                <div>
                    <h1>Livros:</h1>
                    <div>
                        <button onClick={() => Data('livros', 1)}>Harry Potter</button>
                        <button onClick={() => Data('livros', 2)}>Heartstopper</button>
                        <button onClick={() => Data('livros', 3)}>Batman</button>
                    </div>
                </div>

                <div>
                    <h2>Filmes:</h2>
                    <div>
                        <button onClick={() => Data('filmes', 1)}>Vingadores</button>
                        <button onClick={() => Data('filmes', 2)}>Homem de Ferro</button>
                    </div>
                </div>
            </section>
            {data &&
                <section>
                    <div>
                        <h1>{data.nome}</h1>
                        <p>{data.autor}</p>
                        <p>{data.sinopse}</p>
                    </div>
                    <div>
                        <img src={data.img} alt="" />
                    </div>
                </section>
            }

        </div>
    )
}

export default App