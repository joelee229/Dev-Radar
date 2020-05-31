import axios from 'axios';

// Cria conexão com a nossa API do backend
const api = axios.create({
    // Muito cuidado com o URL do base, tem que ser maiúsculo
    baseURL: 'http://192.168.25.29:3333',
});

export default api;