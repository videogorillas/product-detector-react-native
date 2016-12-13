import React, { Component } from 'react';
import {
	  AppRegistry,
	  Alert,
	  Dimensions,
	  StyleSheet,
	  Text,
	  Image,
	  TouchableHighlight,
	  View
	} from 'react-native';

import Camera from 'react-native-camera';

class CameraComponent extends Component {
	render() {
		  return (
	      <View style={styles.cameraContainer}>
	        <Camera
	          ref={(cam) => {
	            this.camera = cam;
	          }}
	          style={styles.camera}
	          aspect={Camera.constants.Aspect.fill}>
	        </Camera>
	        <TouchableHighlight onPress={this.takePicture.bind(this)}>
		        <Image source={require('./ic_add_a_photo_white_24dp.png')} style={styles.ibutton} />
	        </TouchableHighlight>
	      </View>
	    );
	}
	
	takePicture() {
	    this.camera.capture()
	      .then(data => {
	    	  console.log('>> picture taken. data: ' + JSON.stringify(data));
	    	  this.props.setPhoto(data.path);
	      }).catch(err => {
			console.error(err);
		});
	  }
}

class FramesComponent extends Component {
	render() {
		var {left, top, width, height} = this.props.coordinates;
		return (
	      <View 
	      	style={{
      			position: 'absolute',
      			top: top,
      		    left: left,
      		    width: width,
      		    height: height,}}
	      >
		    {this.props.frames.map(frame => {
		    	var style = {
		        		position: 'absolute',
		        		left: left + width * frame.left,
		        		top: top + height * frame.top,
		            	width: left + width * frame.width, 
		            	height: top + height * frame.height,
	  	            	borderStyle: 'solid',
	  	      		  	borderWidth: frame.score * 5,
	  	      		  	borderRadius: 5,
	  	      		  	borderColor: 'white',
	  	      		  	alignItems: 'flex-end',
	  	      		  	justifyContent: 'flex-end'
	  	      	};
		    	return (
	        		 <View key={frame.id} style={style}>
	        		 	<Text style={styles.label}>{frame.label} : {frame.score.toFixed(2)}</Text>
	        		 </View>
		        );
		      })}
	      </View>
	    )
	 }
}

class ProductComponent extends Component {
	constructor(props) {
	    super(props);
	    this.state = {
	    	coordinates: {left: 0, top: 0, width: 0, height: 0}
	    };
	}

	render() {
	    return (
	      <View style={{flex: 1, backgroundColor: '#000000', justifyContent: 'space-between', 
	    	  flexDirection: 'column'}}>

	      	  <Image 
		      	source={{uri: this.props.photo}}
		      	style={{ flex: 1, resizeMode: 'contain'}}
		      	onLayout={this.setCoordinates.bind(this)}>
		      	<FramesComponent frames={this.props.frames} coordinates={this.state.coordinates}></FramesComponent>
		      	
		      </Image>
	      	  <TouchableHighlight onPress={this.props.clear}>
	  			<Image source={require('./ic_close_white_24dp.png')} style={styles.ibutton} />
	          </TouchableHighlight>
	      </View>
	    )
	 }
	
	 setCoordinates(event) {
		var {x, y, width, height} = event.nativeEvent.layout;
   	  	this.setState({coordinates: {left: x, top: y, width: width, height: height}});
	 }
}

class ProductDetector extends Component {
	  constructor(props) {
	    super(props);
	    this.state = {photo: undefined, frames: []};
//	    this.state = {
//	    	photo: 'file:///storage/emulated/0/DCIM/IMG_20161207_232552.jpg',
//	    	frames: [
//	    		{
//	    			id: 0,
//					top: 0, 
//					left: 0, 
//					width: 0.5, 
//					height: 0.5,
//					score: 1,
//					label: 'product A'
//				},
//				{
//					id: 1,
//					top: 0.25, 
//					left: 0.25, 
//					width: 0.5, 
//					height: 0.5,
//					score: 0.5,
//					label: 'product B'
//				}
//				]
//	    };
	  }
	
	  render() {
		  var photo = this.state.photo;
		  if (!photo) 
			  return React.createElement(CameraComponent, {
				  setPhoto: this.setPhoto.bind(this),
				  setFrames: this.setFrames.bind(this)
			  });
		  else return React.createElement(ProductComponent, {
			  	  photo: this.state.photo,
			  	  frames: this.state.frames,
			  	  clear: this.clear.bind(this)
			  });
	  }
	  
	  setPhoto(photo) {
		  this.setState({photo: photo});
		  
		  var url = 'http://podol.videogorillas.com:4242/upload';
		  
		  this.uploadPicture(photo, url).then(result => {
			  return result.json()
		  }).then(json => {
			  var frames = this.jsonToFrames(json);
			  this.setFrames(frames);
	      }).catch(err => {
	    	Alert.alert('Upload', '' + err + '(' + url + ')');
			console.log(err);
		});
	  }
	  
	  setFrames(frames) {
		  this.setState({frames: frames});
	  }
	  
	  clear() {
		  console.log('>> clear()');
		  this.setState({photo: undefined, frames: []});
	  }
	  
	  uploadPicture(path, url) {
			var file = {
			    uri: path,
			    type: 'image/jpeg',
			    name: 'file.jpg',
			};
	
			var body = new FormData();
			body.append('file', file);
			
			return fetch(url, {
			  method: 'POST',
			  headers: {
			    'Accept': 'application/json',
			    'Content-Type': 'multipart/form-data',
			  },
			  body: body
			});
	  }
	  
	  jsonToFrames(json) {
		  var frames = [];
		  for (i = 0; i < json.length; i++) {
			  var el = json[i]; 
			  if (el.score > 0.05) {
				  frames.push({
						id: i,
						top: el.ymin, 
						left: el.xmin, 
						width: el.width, 
						height: el.height, 
						score: el.score,
						label: el.label
					});
			  }
		  }
		  return frames;
	  }
}

const styles = StyleSheet.create({
	  cameraContainer: {
	    flex: 1,
	    backgroundColor: '#000000',
	    justifyContent:'flex-end',
	  },
	  camera: {
		position: 'absolute',
	    top: 0,
	    left: 0,
	    height: Dimensions.get('window').height,
	    width: Dimensions.get('window').width
	  },
	  label: {
		flex: 0, 
		alignSelf: 'center', 
		textAlign: 'center', 
		margin: 3, 
	    paddingLeft: 8, 
	    paddingRight: 8, 
	    paddingTop: 1, 
	    paddingBottom: 2,
	 	borderRadius: 5, 
	 	backgroundColor: 'white', 
	 	color: 'black', 
	 	fontSize: 12
	  },
	  ibutton: {
	    margin: 15,
	    bottom: 15,
	    alignSelf: 'center',
	  }
});

export {ProductDetector}