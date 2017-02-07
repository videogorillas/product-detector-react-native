import React, { Component } from 'react'
import {
	  Alert,
	  Text,
	  Image,
	  TouchableHighlight,
	  View,
	} from 'react-native'

import Camera from 'react-native-camera'
import {styles} from './styles'

class CameraComponent extends Component {
	render() {
		  return (
	      <View style={{flex: 1, backgroundColor: '#000000', justifyContent:'flex-end', 
                        flexDirection: this.props.layout.portrait ? 'column' : 'row',}}>
	        <Camera
	          ref={(cam) => {
	            this.camera = cam;
	          }}
	          style={{
                position: 'absolute',
                top: 0,
                left: 0,
                height: this.props.layout.height,
                width: this.props.layout.width
              }}
	          aspect={Camera.constants.Aspect.fit}
              captureQuality={"720p"}
              playSoundOnCapture={false}
              orientation={"auto"}/>
            
	        <View style={{justifyContent: 'space-around', flexDirection: this.props.layout.portrait ? 'row' : 'column'}}>
              <TouchableHighlight onPress={this.takePicture.bind(this)} activeOpacity={1} underlayColor={'#d3d3d355'} style={{borderRadius: 48}}>
		        <Image source={require('./ic_photo_camera_white_24dp.png')} style={styles.ibutton} />
              </TouchableHighlight>
            </View>
	      </View>
	    );
	}
  
	takePicture() {
        console.log('>> takePicture()');
	    this.camera.capture()
	      .then(data => {
	    	  console.log('>> picture taken. data: ' + JSON.stringify(data));
	    	  this.props.setPhoto(data.path);
	      }).catch(err => {
			console.error(err);
			Alert.alert('Capturing ', '' + err);
            this.props.setSpinner(false);
		});
	}
}

export {CameraComponent}