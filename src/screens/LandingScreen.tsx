import React, { useState, useEffect } from 'react'
import { View, Text, StyleSheet, Dimensions, Image } from 'react-native'
import * as Location from 'expo-location'

import { useNavigation } from '../utils'

const screenWidth = Dimensions.get('screen').width

export const LandingScreen = () => {
  const { navigate } = useNavigation()
  // useState
  const [ errorMsg, setErrorMsg ] = useState('')
  const [ address, setAddress ] = useState<Location.Address>()
  const [ displayAddress, setDisplayAddress ] = useState('Waiting for Current Location')

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access locaion is not granted')
      } 

      let location: any = await Location.getCurrentPositionAsync({});

      const { coords } = location
      if (coords) {
        const { latitude, longitude } = coords;
        
        let addressResponse: any = await Location.reverseGeocodeAsync({ latitude, longitude })
        
        for (let item of addressResponse) {
          setAddress(item)

          let currentAddress = `${item.name}, ${item.street}, ${item.postalCode}, ${item.country}`
          setDisplayAddress(currentAddress)
          
          if(currentAddress.length > 0) {
            setTimeout(() => {
              navigate('homeStack')
            }, 3000)
          }
          return;
        }
      } else {
        // notify user something went wrong with location
      }

    })();
  },[]) // no [] => everytime you call 

  //deconstruction
  const { 
    container,
    navigation,
    body,
    addressContainer,
    addressTitle,
    addressText,
    footer
   } = styles;

  return (
    <View style={container}>
      <View style={navigation}>
        <Text>Navigation</Text>
      </View>
      <View style={body}>
        <Image source={require('../images/delivery_icon.png')} style={styles.deliveryIcon}/>
        <View style={addressContainer}>
          <Text style={addressTitle}>Your Delivery Address</Text>
        </View>   
        <Text style={addressText}>{displayAddress}</Text>     
      </View>
      <View style={footer}>
        <Text>Footer</Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(242,242,242,1)'
  },
  navigation: {
    flex: 2,
  },
  body: {
    flex: 9,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(242,242,242,1)'
  },
  footer: {
    flex: 1
  },
  deliveryIcon: {
    width: 120,
    height: 120
  },
  addressContainer: {
    width: screenWidth - 100,
    borderBottomColor: 'red',
    borderBottomWidth: .5,
    padding: 5,
    marginBottom: 10,
    alignItems: 'center'
  },
  addressTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#7D7D7D'
  },
  addressText: {
    fontSize: 18,
    color: '#7D7D7D'
  }
})