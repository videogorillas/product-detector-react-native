import React, { Component } from 'react'
import {
	  Alert,
	  StyleSheet,
	  Text,
      Image,
	  View,
	} from 'react-native'

import Spinner from 'react-native-loading-spinner-overlay'
var equal = require('deep-equal');

import {styles} from './styles'

import {CameraComponent} from './camera-component'
import {ProductComponent} from './product-component'
import processFrames from './frames-utils'

class ProductDetector extends Component {
	  constructor(props) {
	    super(props);
	    this.state = {photo: undefined, photoW: 0, photoH: 0, frames: [], spinner: false, 
                      layout: {width: 0, height: 0, orientation: 'undefined', portrait: true, landscape: false},};
	  }

//       componentWillMount() {
        // INITIAL TEST ENV:
//         var st = require('./_test-state-0.json');
//         st.frames = processFrames(st.frames);
//         this.setState((prevState, props) => (st));
//       }

	  render() {
		var photo = this.state.photo;
        let component = null;
        if (!photo) {
            console.log('>> opening CameraComponent');
            component = <CameraComponent 
                          setPhoto={this.setPhoto.bind(this)} 
                          setSpinner={this.setSpinner.bind(this)}
                          layout={this.state.layout}/>;
        } else {
            console.log('>> opening ProductComponent');
            component = <ProductComponent 
                          photo={this.state.photo} 
                          photoW={this.state.photoW}
                          photoH={this.state.photoH}
                          frames={this.state.frames}
                          clear={this.clear.bind(this)}
                          layout={this.state.layout}
                          />;
        }

        return (
          <View style={{flex: 1}} onLayout={this.onLayout.bind(this)}>
            {component}
            <Spinner visible={this.state.spinner} />
          </View>
        )
	  }
  
      onLayout(event) {
        let {width, height} = event.nativeEvent.layout;
        let orientation = width >= height ? 'landscape': 'portrait';
        let newLayout = {width: width, height: height, orientation: orientation, portrait: orientation=='portrait', landscape: orientation=='landscape'};
        if (!equal(this.state.layout, newLayout)) {
          this.setState((prevState, props) => ({
            layout: newLayout
          }));
          console.log(`>> onLayout new ${this.state.layout.width}x${this.state.layout.height} ${this.state.layout.orientation}`);
        }
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
		  }).then(json => {
              let frames = processFrames(json);
              if (frames.length == 0) {
                Alert.alert('Nothing was detected\nProbably, out of focus')
              }
//                 this.doFrames(frames);
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

export {ProductDetector}
