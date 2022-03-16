import React, { useState, useEffect } from 'react'
import { StyleSheet, Text, View, TextInput, Button } from 'react-native'
import MapView, { Marker } from 'react-native-maps'
import * as Location from 'expo-location'

export default function App() {
	const [address, setAddress] = useState('')
	const [region, setRegion] = useState({
		latitude: 35.6762,
		longitude: 139.6503,
		latitudeDelta: 0.01,
		longitudeDelta: 0.01,
	})
	const [location, setLocation] = useState(null)

	useEffect(() => {
		this._getLocationAsync()
	}, [])

	_getLocationAsync = async () => {
		let { status } = await Location.requestForegroundPermissionsAsync()
		if (status !== 'granted') {
			Alert.alert('No permission to get location')
			return
		}
		let location = await Location.getCurrentPositionAsync({})
		setLocation(location)
		//console.log(location)
		setRegion({
			...region,
			latitude: location.coords.latitude,
			longitude: location.coords.longitude,
		})
	}

	const showAddress = () => {
		if (address) {
			const url =
				'http://www.mapquestapi.com/geocoding/v1/address?key=VyG0oKImNWGL24LXXEAtp5PDBdSoGo1A&location=' +
				address
			fetch(url)
				.then((response) => response.json())
				.then((data) => {
					setRegion({
						...region,
						latitude: data.results[0].locations[0].latLng.lat,
						longitude: data.results[0].locations[0].latLng.lng,
					})
				})
		}
	}

	return (
		<View style={styles.container}>
			{/*Render our MapView*/}
			<MapView style={{ flex: 5, marginBottom: 50 }} region={region}>
				<Marker
					coordinate={{
						latitude: region.latitude,
						longitude: region.longitude,
					}}
				/>
			</MapView>
			<TextInput
				style={{
					height: 30,
					fontSize: 18,
					width: 200,
					borderWidth: 1,
					marginBottom: 20,
					alignItems: 'center',
					justifyContent: 'center',
				}}
				placeholder='address'
				onChangeText={(address) => setAddress(address)}
			/>
			<Button
				title='SHOW'
				onPress={showAddress}
				style={{ marginBottom: 100 }}
			/>
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		...StyleSheet.absoluteFillObject,
		flex: 1,
		// justifyContent: 'flex-end',
		// alignItems: 'center',
		// marginBottom: 100,
	},
})
