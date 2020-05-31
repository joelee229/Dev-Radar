import React from 'react';
import { View } from 'react-native';
import { WebView } from 'react-native-webview';

function Profile({ route, navigation }){

    // const githubUsername = navigation.getParam('github_username');  Depreciado
    // De props, os parâmetros das rotas ficam na parte route
    const { github_username } = route.params;

    return (
        // Cria uma componente que faz papel de um Browser
        <WebView style={{ flex: 1 }} source={{ uri: `https://github.com/${github_username}` }}/>
    );
}

export default Profile;