import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Image,
  View,
  Text,
  TextInput,
  TouchableOpacity,
} from "react-native";
import MapView, { Marker, Callout } from "react-native-maps";
import {
  requestPermissionsAsync,
  getCurrentPositionAsync,
} from "expo-location";
import { MaterialIcons } from "@expo/vector-icons";

// importa o js que retorna a nossa API do backend
import api from "../services/api";
import {connect, disconnect, subscribeToNewDevs} from "../services/socket";

// Toda rota recebe um props, que pode ser pega para extrair alguns dados de interesse
// Desestruturação do props para pegarmos apenas o navigation
function Main({ navigation }) {

  // Seta os estados do nosso componente
  const [devs, setDevs] = useState([]);
  const [techs, setTechs] = useState('');
  const [currentRegion, setCurrentRegion] = useState(null);

  // Hook para executar uma vez quando o componente for renderizado
  useEffect(() => {
    // Carrega a posição inicial do usuário para inserir no MapView
    async function loadInitialPosition() {
      // Retorna se temos permissão para acessar sua localização
      const { granted } = await requestPermissionsAsync();

      // Se temos setamos o currentRegion com as coordenadas retornadas do gerCurrentPositionAsync()
      if (granted) {
        // Retorna um objeto, que nele há as coordenadas. Parâmetro para habilitar o uso do gps para aumentar a precisão
        const { coords } = await getCurrentPositionAsync({
          enableHighAccuracy: true,
        });

        // Desse objeto retornado, pegamos somente a latitude e a longitude
        const { latitude, longitude } = coords;

        // seta o valor de currentRegion para um objeto contendo a localização
        setCurrentRegion({
          latitude,
          longitude,
          latitudeDelta: 0.04,
          longitudeDelta: 0.04,
        });
      }
    }

    // Chama o método
    loadInitialPosition();
  }, []);

  // Hook para executar quando o valor de devs for alterado
  useEffect(() => {
    // Recebe o dev do servidor websocket e adiciona ele aos devs anteriores para aparecer no mapa se satisfazer as condições
    subscribeToNewDevs(dev => {setDevs([...devs, dev])});
  }, [devs]);

  // Função que faz a conexão com o nosso servidor WebSocket
  function setupWebSocket(){
    // Desconecta para não ter conflito de conexões anteriores
    disconnect();

    // Recebe as coordenadas de currentRegion
    const { latitude, longitude } = currentRegion;

    // Chama a função connect do no nosso socket service
    // Recebe como parâmetro as coordenadas atuais e as tecnologias digitada pelo o usuário
    connect(
      latitude,
      longitude,
      techs,
    );
  }

  // Função para carregar os Markers que terão os devs
  async function loadDevs() {
    // Na nossa API, fizemos uma rota que quando acessada retorna um JSON com as informações dos devs
    // Mas essa rota pede parâmetros, para podermos pegar somente os devs que estejam por perto
    // A rota pede a latitude e a longitude atual do usuário mais as tecnologias digitadas pelo o usuário 
    const { latitude, longitude } = currentRegion; // De currentRegion pegamos apenas a latitude e a longitude que precisamos

    // Pegamos esse JSON e armazenamos ela em uma variável
    // Tem await porque ela pode demorar e precisamos dela. Por isso indicamos que a aplicação precisa esperar essa reposta
    const response = await api.get("/search", {
      // Passamos os parâmetros, que são nossos estados criados mais cedo.
      params: {
        latitude,
        longitude,
        techs
      }
    });

    // Com o nosso JSON em mãos precisamos de um estado que armazene esse array de devs para criar os Markers no "HTML"
    // Para isso setamos o valor de devs com o array de devs que veio da API
    setDevs(response.data);
    setupWebSocket();
  }

  // Se não tiver nada no currentRegion o mapa não renderiza
  if (!currentRegion) {
    return null;
  }

  

  // Função que altera o currentRegion de acordo com que o usuário vai movendo o mapa
  // Como eh uma função que é chamada como um evento, podemos receber nos parâmetros esse evento que contém a nova localização
  function handleRegionChanged(region) {
    setCurrentRegion(region);
  }

  return (
    // <></> Chamado de fragment. Usamos isso porque ao retornar o nosso componente ele precisa estar dentro de uma tag.
    // Quando colocamos { } dentro do nosso HTML ou JSX ele indica que vai retornar algum código javascript
    <>
    {/*  */}
      <MapView
        onRegionChangeComplete={handleRegionChanged}
        initialRegion={currentRegion}
        style={styles.map}
      >
        {/* Iteração */}
        {/* .map() percorre o nosso array e nos retorna uma instância desse array. Assim podemos fazer algo com essa instância desse array */}
        {devs.map((dev) => (
          <Marker
            key={dev._id}
            coordinate={{
              longitude: dev.location.coordinates[0],
              latitude: dev.location.coordinates[1],
            }}
          >
            <Image
              style={styles.avatar}
              source={{
                uri: dev.avatar_url,
              }}
            />

            <Callout
              onPress={() => {
                // navegação
                navigation.navigate("Profile", {
                  github_username: dev.github_username,
                });
              }}
            >
              <View style={styles.callout}>
                <Text style={styles.devName}>{dev.name}</Text>
                <Text style={styles.devBio}>{dev.bio}</Text>
                <Text style={styles.devTechs}>{dev.techs.join(", ")}</Text>
              </View>
            </Callout>
          </Marker>
        ))}
      </MapView>

      {/* Parte de pesquisa */}
      <View style={styles.searchForm}>
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar devs por techs..."
          placeholderTextColor="#999"
          autoCapitalize="words"
          autoCorrect={false}
          value={techs}
          onChangeText={setTechs}
        />
        <TouchableOpacity onPress={loadDevs} style={styles.loadButton}>
          {/* O react possui todos os pacotes de ícones disponíveis no mundo. Só importar um e usar um ícone desse pacote. */}
          <MaterialIcons name="my-location" size={20} color="#FFF" />
        </TouchableOpacity>
      </View>
    </>
  );
}

// Variável que contém todos os estilos do nosso componente na estrutura de dados JSON
const styles = StyleSheet.create({
  // Todo os componente no React e React Native possui display: flex. Ou é none ou é flex
  map: {
    // Ocupa todo o tamanho possível
    flex: 1,
  },

  avatar: {
    width: 54,
    height: 54,
    borderRadius: 4,
    borderWidth: 4,
    borderColor: "#fff",
  },

  callout: {
    width: 260,
  },

  devName: {
    fontWeight: "bold",
    fontSize: 16,
  },

  devBio: {
    color: "#666",
    marginTop: 5,
  },

  devTechs: {
    marginTop: 5,
  },

  searchForm: {
    paddingHorizontal: 10,
    position: "absolute",
    bottom: 20,
    zIndex: 5,
    flexDirection: "row",
  },

  searchInput: {
    flex: 1,
    height: 50,
    backgroundColor: "#FFF",
    color: "#333",
    borderRadius: 25,
    paddingHorizontal: 20,
    fontSize: 16,
    // Popriedades que precisam ser passadas para adicionar sombra nessa parte do componente
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: {
      width: 4,
      height: 4,
    },
    elevation: 2,
  },

  loadButton: {
    width: 50,
    height: 50,
    backgroundColor: "#8E4DFF",
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 15,
  },
});

export default Main;
