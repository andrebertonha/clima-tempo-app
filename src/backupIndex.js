import React, {useEffect, useState} from 'react';
import {View, Text, Image, StyleSheet, SafeAreaView} from 'react-native';

import Geolocation from '@react-native-community/geolocation';
import axios from 'axios';

export default function App() {
  const [results, setResults] = useState([]);

  useEffect(() => {
    async function getUserLocaleInfo() {
      Geolocation.getCurrentPosition(
        async ({coords: {latitude, longitude}}) => {
          // localização do usuario
          const response = await axios.get(
            `http://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`,
          );

          // id cidade
          console.log(response.data);
          var city = response.data.address.city;
          const result = await axios.get(
            'http://apiadvisor.climatempo.com.br/api/v1/locale/city?name=' +
              city +
              '&state=SP&token=bacdc1142437e2f1455ba58466b170fd',
          );

          // registrar id da cidade no token da api climatempo
          var id = result.data[0].id;
          const registerResponse = await axios.put(
            'http://apiadvisor.climatempo.com.br/api-manager/user-token/bacdc1142437e2f1455ba58466b170fd/locales',
            {
              localeId: [id],
            },
          );

          // Informações de localização, data, cidade, estado e temperatura do usuário
          const finalResults = await axios.get(
            'http://apiadvisor.climatempo.com.br/api/v1/weather/locale/' +
              id +
              '/current?token=bacdc1142437e2f1455ba58466b170fd',
          );

          console.log(finalResults.data);
          setResults(finalResults.data);
        },
      );
    }

    getUserLocaleInfo();
  }, []);

  // objeto para carregar o icone dinamicamente conforme resposta da requisição api clima tempo
  const icons = {
    '1': require('./assets/1.png'),
    '1n': require('./assets/1n.png'),
    '2': require('./assets/2.png'),
    '2n': require('./assets/2n.png'),
    '2r': require('./assets/2r.png'),
    '2rN': require('./assets/2rN.png'),
    '3': require('./assets/3.png'),
    '3n': require('./assets/3n.png'),
    '3TM': require('./assets/3TM.png'),
    '4': require('./assets/4.png'),
    '4n': require('./assets/4n.png'),
    '4r': require('./assets/4r.png'),
    '4rN': require('./assets/4rN.png'),
    '5': require('./assets/5.png'),
    '5n': require('./assets/5n.png'),
    '6': require('./assets/6.png'),
    '6n': require('./assets/6n.png'),
    '7': require('./assets/7.png'),
    '7n': require('./assets/7n.png'),
    '8': require('./assets/8.png'),
    '8n': require('./assets/8n.png'),
    '9': require('./assets/9.png'),
    '9n': require('./assets/9n.png'),
    default: require('./assets/default.png'),
  };

  return (
    <SafeAreaView style={styles.container}>
      {results.data !== undefined && (
        <View style={styles.cardContainer}>
          <Text style={styles.textStyle}>
            {results.name}, {results.state}
          </Text>
          <Image source={icons[results.data.icon]} />
          <Text style={styles.temperature}>{results.data.temperature}ºC</Text>
          <Text>{results.data.date}</Text>
          <View style={styles.conditionsInfo}>
            <Text>Umidade: {results.data.humidity}</Text>
            <Text>Condições: {results.data.condition}</Text>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'lightblue',
  },
  cardContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    maxHeight: 500,
  },
  textStyle: {
    fontFamily: Platform.OS === 'ios' ? 'AvenirNext-Regular' : 'Roboto',
    fontSize: 28,
    fontWeight: '300',
    marginBottom: 25,
  },
  localidade: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  temperature: {
    fontFamily: Platform.OS === 'ios' ? 'AvenirNext-Regular' : 'Roboto',
    fontSize: 65,
    fontWeight: '400',
    alignItems: 'center',
  },
  conditionsInfo: {
    fontFamily: Platform.OS === 'ios' ? 'AvenirNext-Regular' : 'Roboto',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: 200,
    height: 75,
  },
});
