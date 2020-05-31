import socketio from 'socket.io-client';

const socket  = socketio('http://192.168.25.29:3333', {
    autoConnect: false,
});

// Função de callback
function subscribeToNewDevs(subscribeFunction){
    // Adiciona um event listener para o evento new-dev que foi criado no back/WebSocket
    // Ao mesmo tempo que ele recebe um parâmetro vazio ele retorna esse parâmetro com um valor novo, mas pela mesma via.
    socket.on('new-dev', subscribeFunction);
}

// Funcão criada para adicionar os dados atuais do usuário em um query param e fazer a conexão
function connect(latitude, longitude, techs){
    // Manda parâmetros para o back
    socket.io.opts.query = {
        latitude,
        longitude,
        techs
    }

    // Faz literalmente a conexão com o back/WebSocket
    socket.connect();

    socket.on('message', text => {
        console.log(text);
    });
}

// Desconecta 
function disconnect(){
    if(socket.connected) {
        socket.disconnect();
    }
}

export {
    connect,
    disconnect,
    subscribeToNewDevs
};