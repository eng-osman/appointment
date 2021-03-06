import React , { Component } from 'react';
import { View , StyleSheet , Image , Text , Animated } from 'react-native';
import Colors from '../constants/Colors';

const APP_LOGO = '../../assets/location.png';

class Logo extends Component
{
    state = {
        position : new Animated.ValueXY(0,0),
        fadeAnim : new Animated.Value(0),
        springAnim : new Animated.Value(0)
    }

    componentWillMount()
    {
        const { position , fadeAnim , springAnim } = this.state;
        
        Animated.sequence([
            Animated.parallel([
                Animated.timing(fadeAnim , {
                    toValue : 1,
                    duration: 1000
                }),
                Animated.timing(position,{
                    toValue : {x:0,y:-20},
                    duration : 2000
                }),
            ]),
        ]).start(() => {
            this.props.startApp();
        });

        Animated.timing(springAnim , {
            toValue : 1,
            duration : 1500
        }).start();
    }

    render()
    {
        return(
            <View style={styles.container}>
                <Animated.View style={[this.state.position.getLayout(),{ opacity : this.state.fadeAnim }]}>
                    <Image source={require(APP_LOGO)} style={styles.logoStyle} />
                </Animated.View>
                <Animated.View style={{ transform : [{ scale : this.state.springAnim }] }}>
                    <Text style={styles.logoText}>Appointment</Text>
                </Animated.View>
            </View>
        );
    }
};

const styles = StyleSheet.create({
    container : {
        flex : 1,
        justifyContent : 'center',
        alignItems : 'center'
    },
    logoStyle : {
        width : 150,    
        height : 150
    },
    logoText : {
        fontSize : 40,
        color : Colors.redSahade1,
        fontFamily : 'MontserratBold'
    }
});

export default Logo;