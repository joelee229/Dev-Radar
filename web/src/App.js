import React, { useState,useEffect } from 'react';
import api from './services/api';
import DevItem from './components/DevItem';
import DevForm from './components/DevForm';

import './global.css';
import './App.css';
import './SideBar.css';
import './Main.css';



// Componente: Bloco isolado de HTML, CSS e JS, o qual não interfere no restande da aplicação
// Propriedade: Passar um atributo para um componente; Informações que um componente PAI passa para o componente FILHO
// Estado: Informaões mantidas pelo componente (Lembrar: imutabilidade)
 

// Função que retorna um html. JSX
function App() {
  // Um state para devs que começa como um array vazio
  const [devs, setDevs] = useState([]);
  
  // useEffect: usando esse método, você diz para o React que o seu componente precisa fazer algo depois de renderizar;
  // O primeiro parâmetro é a função a ser disparada e o segundo é um array que contém uma variável. 
  // Se estiver vazio ele só vai executar uma vez, se tiver toda a vez que o valor desse array mudar ele dispara a função
  useEffect(() => {
    async function loadDevs(){
      const response  = await api.get('/devs');

      setDevs(response.data);
    }

    loadDevs();
  }, []);

  async function handleAddDev(data) {
    const response = await api.post('/devs', data);

    setDevs([...devs, response.data]);
  }

  return (
    <div id="app">
      <aside>
        <strong>Cadastrar</strong>
        <DevForm onSubmit={handleAddDev}/>
      </aside>

      <main>
        <ul>
          {devs.map( dev => (
              <DevItem key={dev._id} dev={dev}/>
          ))}
        </ul>
      </main>
    </div>
  );
}

export default App;
