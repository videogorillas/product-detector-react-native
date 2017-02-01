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
	      <View style={{flex: 1, backgroundColor: '#000000', justifyContent:'flex-end', flexDirection: 'column',}}>
	        <Camera
	          ref={(cam) => {
	            this.camera = cam;
	          }}
	          style={styles.camera}
	          aspect={Camera.constants.Aspect.stretch}
              captureQuality={"720p"}
              playSoundOnCapture={false}/>
            
	        <View style={{justifyContent: 'space-around', flexDirection: 'row'}}>
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