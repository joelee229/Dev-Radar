import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import Main from './pages/Main';
import Profile from './pages/Profile';

const Stack = createStackNavigator();

// Nova forma de fazer a navegação

function Routes() {
    return (
        <Stack.Navigator
            initialRouteName="Home"
            // Opções das Screens, vai para todas. Ler documentação para mais atributos(como animação e etc)
            screenOptions  = {
                // Duas chaves, porque além de indicamos um código javascript estamos retornando um objeto
                { 
                    headerStyle: { backgroundColor: '#7D40E7' },
                    headerTintColor: '#FFF',
                }
            }
        >
            <Stack.Screen
                name="Home"
                component={Main}
                options={
                    { title: 'DevRadar' }
                } />
            <Stack.Screen
                name="Profile"
                component={Profile}
                options={
                    { title: 'Perfil no Github' }
                }

            />
        </Stack.Navigator>
    );
}


export default Routes;