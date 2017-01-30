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

import Spinner from 'react-native-loading-spinner-overlay';
import Camera from 'react-native-camera';
import RandomColor from 'randomcolor';

class CameraComponent extends Component {
	render() {
		  return (
	      <View style={styles.cameraContainer}>
	        <Camera
	          ref={(cam) => {
	            this.camera = cam;
	          }}
	          style={styles.camera}
	          aspect={Camera.constants.Aspect.stretch}
              captureQuality={"720p"}
              playSoundOnCapture={false}/>
	        <TouchableHighlight onPress={this.takePicture.bind(this)}>
		        <Image source={require('./ic_add_a_photo_white_24dp.png')} style={styles.ibutton} />
	        </TouchableHighlight>
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

class FramesComponent extends Component {
	render() {
        let style = this.props.style;
        let {width, height} = style;
        console.log('FramesComponent ' + width + 'x' + height);
		return (
	      <View 
	      	style={style}
	      >
		  {this.props.frames.map(frame => {
                var style = {
		        		position: 'absolute',
		        		left: width * frame.xmin,
		        		top: height * frame.ymin,
		            	width: width * frame.width, 
		            	height: height * frame.height,
	  	            	borderStyle: 'solid',
	  	      		  	borderWidth: frame.score * 5,
	  	      		  	borderRadius: 5,
	  	      		  	borderColor: this.labelToColor(frame.label),
	  	      		  	alignItems: 'flex-end',
	  	      		  	justifyContent: 'flex-end'
	  	      	};
                console.log('style  ' + style.left + ' ' + style.top + ' ' + style.width + ' ' + style.height);
		    	return (
	        		 <View key={frame.id} style={style}>
	        		 	<Text style={styles.label}>{frame.label} : {frame.score.toFixed(2)}</Text>
	        		 </View>
		        );
		      })}
	      </View>
	    )
	 }

     labelToColor(label) {
//        let color = RandomColor.randomColor({seed: label, format: 'rgb'});
       let color = greenProducts.indexOf(label) >=0 ? 'green' : 'red';
       return color;
     }
}

class ProductComponent extends Component {
	render() {
      return this._render();
    }
	
    _render() {
       let imageL = 0;
       let imageT = 0;
       let imageW = this.props.photoW;
       let imageH = this.props.photoH;
       let ar =  imageW/imageH;
       let screenH = Dimensions.get('window').height;
       let screenW = Dimensions.get('window').width;
       
       if (screenW < imageW) {
         imageW = screenW;
         imageH = imageW / ar;
       }
       if (screenH < imageH) {
         imageH = screenH;
         imageW = ar * imageH;
       }
       
//        // test:
//        imageW = imageW/2;
//        imageH = imageH/2;
//        imageT = 25;
      
       if (screenW > imageW) {
         imageL = (screenW - imageW)/2;
       }
       console.log('>> ProductComponent render() ar=' + ar + ' screen ' + 
                   screenW + 'x' + screenH + ' image ' + imageW + 'x' + imageH);

       let style = {
          position: 'absolute',
          left: imageL,
          top: imageT,
          width: imageW, 
          height: imageH};
      
       let viewFlexDirection = (screenW > screenH ) ? 'row' : 'column';
         
	   let component = 
	      <View style={{flex: 1, backgroundColor: '#000000', justifyContent: 'space-between', flexDirection: viewFlexDirection}}>
             <Image 
                 source={{uri: this.props.photo}}
                 style={style}/>
             <FramesComponent frames={this.props.frames} style={style}/>
             <View style={{flex: 1}}/>
             <TouchableHighlight onPress={this.props.clear} >
                 <Image source={require('./ic_close_white_24dp.png')} style={styles.ibutton} />
             </TouchableHighlight>
	      </View>
	    return component;
	 }
}

class ProductDetector extends Component {
	  constructor(props) {
	    super(props);
	    this.state = {photo: undefined, photoW: 0, photoH: 0, frames: [], spinner: false};
// 	    this.state = {
// 	    	photo: 'file:///storage/emulated/0/DCIM/IMG_20170125_190854.jpg',
// 	    	frames: [
// 	    		{
// 	    			id: 0,
// 					ymin: 0, 
// 					xmin: 0, 
// 					width: 0.5, 
// 					height: 0.5,
// 					score: 1,
// 					label: 'one'
// 				},
// 				{
// 					id: 1,
// 					ymin: 0, 
// 					xmin: 0, 
// 					width: 1, 
// 					height: 1,
// 					score: 0.5,
// 					label: 'another'
// 				}
// 				],
// 	    	spinner: false,
//             photoW: 480,
//             photoH: 800
// 	    };
	  }
	
	  render() {
		var photo = this.state.photo;
        let component = null;
        if (!photo) {
            console.log('>> opening CameraComponent');
            component = <CameraComponent 
                          setPhoto={this.setPhoto.bind(this)} 
                          setSpinner={this.setSpinner.bind(this)}/>;
        } else {
            console.log('>> opening ProductComponent');
            component = <ProductComponent 
                          photo={this.state.photo} 
                          photoW={this.state.photoW}
                          photoH={this.state.photoH}
                          frames={this.state.frames} 
                          clear={this.clear.bind(this)} 
                          setSpinner={this.setSpinner.bind(this)} />;
        }
        
        return (
          <View style={{flex: 1}}>
            {component}
            <Spinner visible={this.state.spinner} />
          </View>
        )
	  }
  
      setSpinner(spinner) {
          this.setState({spinner: spinner});
      }
	  
	  setPhoto(photo) {
		  this.setState({photo: photo, spinner: true});
		  const url = 'http://podol.videogorillas.com:4242/upload';
		  console.log('>> setPhoto() uploading...');
          
          Image.getSize(photo, (width, height) => {
            this.setState({photoW: width, photoH: height});
            console.log('>> Actual photo size: ' + width + 'x' + height);
          });
          
		  this.uploadPicture(photo, url).then(result => {
			  return result.json()
		  }).then(frames => {
              console.log('>> frames received: ' + frames.length);
              frames = frames.filter((f) => {return f.score >= 0.2});
              console.log('>> frames having filtered: ' + frames.length);
            
              if (frames.length == 0) {
                Alert.alert('Nothing was detected\nProbably, out of focus');
              } else {
                frames.forEach((item, i, arr) => {console.log(i + ': ' + item.label + ' ' + item.score);});
                frames.sort((a, b) => {return a.score - b.score});
                frames.forEach((item, i, arr) => { item.id = i });
                
                console.log('>> Sorted: ---------');
                frames.forEach((item, i, arr) => {console.log(item.id + ': ' + item.label + ' ' + item.score);});
              }

              this.setState({frames: frames, spinner: false});
	      }).catch(err => {
	    	Alert.alert('Upload', '' + err + '(' + url + ')');
			console.log('>> setPhoto() error ' + err);
            this.setSpinner(false);
		});
	  }
	  
	  clear() {
		  console.log('>> clear()');
		  this.setState({photo: undefined, photoW: 0, photoH: 0, frames: [], spinner: false});
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
	  },
});

const greenProducts = [
  "voda",
  "loreal_expert",
  "mineral",
  "elseve",
  "colorNature",
  "Miller",
  "pivo0",
  "Kozel",
  "Kozels",
  "efes",
  "Miller",
  "Kozel",
  "efes",
//   "pivo0",
//   "Kozels",
  "bioBalans",
  "moloko_prostokvashino",
  "moloko_otbornoe",
  "tvorog",
  "smetana"
];

export {ProductDetector}