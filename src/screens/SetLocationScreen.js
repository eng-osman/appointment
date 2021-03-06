import React,{ Component } from 'react';
import { View , Dimensions , StyleSheet , ScrollView } from 'react-native';
import { FormInput , FormLabel , Button , List , ListItem } from 'react-native-elements';
import { MapView , Location } from 'expo';
import { Spinner } from '../components';
import Colors from '../constants/Colors';

import axios from 'axios';  
import FbConfig from '../FbConfig';

const { width , height } = Dimensions.get('window');
const ASPECT_RATIO = width / height;
const LAT_DELTA = 0.5;
const LONG_DELTA = LAT_DELTA * ASPECT_RATIO;
class SetLocationScreen extends Component 
{
    static navigationOptions = {
        headerTitle : 'Set Location'
    }

    constructor(props)
    {
        super(props);
        this.state = {
            initMap : true,
            userLocation : {},
            query : '',
            searchResult : null,
            selectedLoaction : null,
            btnDisabled : true
        };
    }

    async componentDidMount()
    {
        const { coords : { latitude , longitude } } = await Location.getCurrentPositionAsync({});
        const userLocation = { latitude , longitude };
        this.setState({ initMap : false , userLocation });
    }

    search = async () => {

        let endPoint = 'https://maps.googleapis.com/maps/api/place/textsearch/json?query=';
        endPoint += this.state.query;
        endPoint += `&key=${FbConfig.mapAPIKey}`;

        try{
            const { data } = await axios.get(endPoint);
            this.setState({searchResult : data.results});
        } catch (e)
        {
            console.log(e);
        }
        //Replace with Google API Later on

        //Dummy Data
        // let searchResult = [];

        // for(let i=0 ; i < 50 ; i++ )
        // {   
        //     searchResult[i] = { name : `Name ${i}` , address : `Address ${i}` , latitude:28.7920363,longitude:32.70127 };
        // }

        // this.setState({ searchResult });
    }

    toggleSearchResult = () => {
        if(!this.state.searchResult) return;
    
        return (
            <ScrollView style={{height : 200 , marginBottom : 20}}>
                <List containerStyle={{ marginHorizontal : 15 }}>
                    {
                        this.state.searchResult.map(( item , i ) => (
                            <ListItem 
                                key = {i}
                                title ={ item.name }
                                subtitle ={ item.formatted_address }
                                leftIcon ={{ name : 'ios-pin' , type : 'ionicon' }}
                                onPress={this.setSelectedLocation.bind(this,item)}
                            />
                        ))
                    }
                </List>
            </ScrollView>
        )
    }

    setSelectedLocation(item){

        const { geometry : { location } } = item;
        // const { geometry : location  } = item;
        // const geometry = item.geometry
        // const location = item.geometry.location

        const formattedItem = {
            name : item.name,
            address : item.formatted_address,
            latitude : location.lat,
            longitude : location.lng
        }

        this.setState({ searchResult :null ,selectedLoaction:formattedItem ,btnDisabled:false });

        //animateToRegion
        //animateToCoordinate

        this.map.animateToRegion(
            {
                latitude : formattedItem.latitude,
                longitude : formattedItem.longitude,
                longitudeDelta : LONG_DELTA,
                latitudeDelta : LAT_DELTA
            },
            350
        );
    }

    showMapMarker = () => {
        if(!this.state.selectedLoaction) return ;
        
        const { latitude , longitude , name } = this.state.selectedLoaction;
        return (
            <MapView.Marker
                title={name}
                coordinate={{ latitude , longitude }}
            >
            </MapView.Marker>    
        );
    }

    onLocationSelected = () => {
        const { navigation } = this.props;
        navigation.state.params.onGoBack(this.state.selectedLoaction);
        navigation.goBack();
    }

    render()
    {
        if(this.state.initMap)
        {
            return <Spinner/>;
        }  
        
        const { userLocation } = this.state;

        return(
            <ScrollView style={styles.container}>
                <View style={{marginBottom:20}}>
                    <FormLabel>Enter Location Name</FormLabel>
                    <FormInput
                        onChangeText={(query) => this.setState({ query })}
                        onSubmitEditing={() => this.search()}
                    />
                </View>

                {this.toggleSearchResult()}

                <View style={{ height : 400 , marginHorizontal : 15 }}>
                    <MapView 
                        ref={ map => this.map = map }
                        style={{ flex : 1 }}
                        initialRegion={{
                            latitude : userLocation.latitude,
                            longitude : userLocation.longitude,
                            latitudeDelta : LAT_DELTA,
                            longitudeDelta : LONG_DELTA
                        }}
                    >
                        { this.showMapMarker() }
                    </MapView>
                </View>
                <Button
                    raised
                    title='Confirm Location'
                    containerViewStyle={{margin: 10}}
                    buttonStyle={{backgroundColor : Colors.redSahade1}}
                    disabled={this.state.btnDisabled}
                    onPress={this.onLocationSelected}
                />
            </ScrollView>
        );
    }   
}

const styles = StyleSheet.create({
    container :{
        flex: 1,
        backgroundColor : Colors.white
    }
})

export default SetLocationScreen;