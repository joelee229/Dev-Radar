import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar, YellowBox } from 'react-native';

import Routes from './src/routes';

// Ignora os aviso de um certo problema não resolvido
YellowBox.ignoreWarnings([
  'Unrecognized WebSocket'
])


// Mas eh só isso que muda entre uma aplicação react e react-native
function App() {
  return (
    // Não podemos usar tagg HTML; Não é igual o react nessa parte.
    // Tags não tem valor semântico.
    // Não tem class nem id nos component. Todo component aceita o atributo style que contem a estilização desse componente
    // No react native não tem herança de estilização
    // Por isso no atributo style da VIEW recebemos somente a classe container do objeto styles
    <NavigationContainer>
      {/* Componente que ajusta o StatusBar */}
      <StatusBar barStyle="light-content" backgroundColor="#7D40E7"/>
      
      {/* Script que criamos que retorna um Componente com nossas Screens de rota */}
      <Routes />
    </NavigationContainer>
  );
}

export default App;
