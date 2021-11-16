import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import { StyleSheet, View, TextInput, Button, Alert } from 'react-native';
import * as Location from 'expo-location'; 
import MapView, { Marker } from 'react-native-maps';

export default function App() {

  const [location, setLocation]=useState(null);

  const [text, setText]=useState(""); 
  const [pin, setPin]=useState({
    latitude: 60.200692,
    longitude: 24.934302,
    })
  const [region, setRegion]=useState({
    latitude: 60.200692,
    longitude: 24.934302,
    latitudeDelta: 0.0322,
    longitudeDelta: 0.0221
  })
 

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted'){
        Alert.alert('No permission to get location')
        return;
      }
      let location = await Location.getCurrentPositionAsync({});
      console.log(location.coords.latitude);
      setLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.0322,
        longitudeDelta: 0.0221
      })
    })();
  }, []);


  const getAddress = () => {
    fetch(`http://www.mapquestapi.com/geocoding/v1/address?key=3JIT9JdCuHOBuHA8jsz6eLzHUoceyCUT&location=${text}`)
    .then(response => response.json())
    .then(responseData => {
      console.log(responseData.results[0].locations[0].displayLatLng.lat)
      setRegion({
        latitude: responseData.results[0].locations[0].displayLatLng.lat,
        longitude: responseData.results[0].locations[0].displayLatLng.lng,
        latitudeDelta: 0.0322,
        longitudeDelta: 0.0221
      })
      setPin({
        latitude: responseData.results[0].locations[0].displayLatLng.lat,
        longitude: responseData.results[0].locations[0].displayLatLng.lng,
      })  
    }) 
  } 
  


  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={location}
        region={region}
        provider="google"
      >
        <Marker
          coordinate={pin}
          draggable={true}
          onDragStart={(e)=> {
            console.log('Started', e.nativeEvent.coordinate)
          }}
          onDragEnd={(e)=> {
            setPin({
              latitude: e.nativeEvent.coordinate.latitude,
              longitude: e.nativeEvent.coordinate.longitude
            })
          }}
          title={text}
        />
      </MapView>
      <TextInput style={styles.textinput}
        onChangeText={text => setText(text)}
        value={text}
        placeholder="Write the address"
      />
      <Button title="Find" onPress={getAddress} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop:StatusBar.currentHeight,
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  map: {
    flex: 1,
    width: "100%",
    height: "100%"
  },
  textinput: {
    width: 300,
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,

  }
});

