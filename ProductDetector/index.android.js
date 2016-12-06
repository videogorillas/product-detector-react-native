/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
	  AppRegistry,
	  Dimensions,
	  StyleSheet,
	  Text,
	  Image,
	  TouchableHighlight,
	  View
	} from 'react-native';

import Camera from 'react-native-camera';

class CameraView extends Component {
	render() {
		  return (
	      <View style={styles.container}>
	        <Camera
	          ref={(cam) => {
	            this.camera = cam;
	          }}
	          style={styles.preview}
	          aspect={Camera.constants.Aspect.fill}>
	          <Text style={styles.capture} onPress={this.takePicture.bind(this)}>CAPTURE</Text>
	        </Camera>
	      </View>
	    );
	}
	
	uploadPicture(path) {
		var file = {
		    uri: path,
		    type: 'image/jpeg',
		    name: 'file.jpg',
		};

		var body = new FormData();
		body.append('file', file);

		
		fetch('http://podol.videogorillas.com:4242/upload', {
			  method: 'POST',
			  headers: {
			    'Accept': 'application/json',
			    'Content-Type': 'multipart/form-data',
			  },
			  body: body
			})
			.then(result => {return result.json()})
			.then(json => {
//			console.log('>> json length: ' + json.length);
			
			var wheight = Dimensions.get('window').height;
		    var wwidth = Dimensions.get('window').width;
			
			var frames = [];
			for (i = 0; i < json.length; i++) {
				var el = json[i]; 
				if (el.score > 0.05) {
					frames.push({
						top: el.ymin * wheight, 
						left: el.xmin * wwidth, 
						w: el.width * wwidth, 
						h: el.height * wheight, 
						color: 'red', 
						score: el.score,
						id: i});
				}
			}
//				frames = [
//					{top: 0, left: 0, w: 150, h: 300, color: 'red', id: 0}, 
//					{top: 0, left: 0, w: 100, h: 250, color: 'green', id: 1},
//					{top: 0, left: 0, w: 200, h: 100, color: 'blue', id: 2}
//					]
			var product = {
					path: path,
					frames: frames
				};
			var setProduct = this.props.setProduct;
			setProduct(product);
		});
	  }

	  takePicture() {
	    this.camera.capture()
	      .then((data) => {
	    	  console.log('>> picture taken. data: ' + JSON.stringify(data));
	    	  this.uploadPicture(data.path);
	    	  
	    	  })
	      .catch(err => {console.error(err);});
	  }
}

class Frames extends Component {
	render() {
		console.log('>> frames: ' + JSON.stringify(this.props.frames));
	    return (
	      <View style={styles.container}>
		    {this.props.frames.map(frame => {
		    	var color = '#ff4500';
		    	
		    	var style = {
		        		position: 'absolute',
		  	        	top: frame.top,
		      		  	left: frame.left,
		            	width: frame.w, 
		            	height: frame.h,
	  	            	borderStyle: 'solid',
	  	      		  	borderWidth: frame.score * 5,
	  	      		  	borderRadius: 5,
	  	      		  	borderColor: frame.color
	  	      	};
		    	return (
	        		 <Text key={frame.id} style={style}></Text>
		        );
		      })}
	      </View>
	    )
	 }
}

class ProductComponent extends Component {
	render() {
	    return (
	      <Image 
	      	source={{uri: this.props.product.path}}
	      	style={styles.preview}>
	      		<View style={styles.preview}>
	      			<Frames frames={this.props.product.frames}></Frames>	
	      		</View>
	      		<View style={styles.preview}>
	      			<Text style={styles.capture} onPress={this.resetProduct.bind(this)}>BACK</Text>
	      		</View>
	      </Image>
	    )
	 }
	
	 resetProduct() {
		 this.props.setProduct();
	 }
}

class ProductDetector extends Component {
	  constructor(props) {
	    super(props);
	    this.state = {product: undefined};
//	    this.state = {
//	    		product: {
//	    			path: 'file:///storage/emulated/0/DCIM/IMG_20161206_120957.jpg'
//	    		},
//				frames: [
//					{x: 50, y: 50, w: 50, h: 25}, 
//					{x: 100, y: 100, w: 25, h: 25}]
//	    }
	  }
	
	  render() {
		  var product = this.state.product;
//		  console.log('>> product: ' + JSON.stringify(product));
		  if (!product) 
			  return React.createElement(CameraView, {setProduct: this.setProduct.bind(this)});
		  else return React.createElement(ProductComponent, {product: product, setProduct: this.setProduct.bind(this)});
	  }
	  
	  setProduct(product) {
		  this.setState({ product: product });
	  }
}

const styles = StyleSheet.create({
	  container: {
	    flex: 1
	  },
	  preview: {
		justifyContent:'flex-end',
		position: 'absolute',
	    top: 0,
	    left: 0,
	    height: Dimensions.get('window').height,
	    width: Dimensions.get('window').width
	  },
	  capture: {
	    flex: 0,
	    backgroundColor: '#fff',
	    borderRadius: 5,
	    color: '#000',
	    padding: 10,
	    margin: 25,
	    bottom: 25,
	    alignSelf: 'center'
	  }
});
	
AppRegistry.registerComponent('ProductDetector', () => ProductDetector);
