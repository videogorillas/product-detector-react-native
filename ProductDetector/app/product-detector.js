import React, { Component } from 'react'
import {
	  AppRegistry,
	  Alert,
	  Dimensions,
	  StyleSheet,
	  Text,
	  Image,
	  TouchableHighlight,
	  View,
      ListView,
	} from 'react-native'

import Spinner from 'react-native-loading-spinner-overlay'

import {styles} from './styles'

import {CameraComponent} from './camera-component'
import {ProductComponent} from './product-component'

class ProductDetector extends Component {
	  constructor(props) {
	    super(props);
// 	    this.state = {photo: undefined, photoW: 0, photoH: 0, frames: [], spinner: false, report: false};
	    this.state = {
            photo: 'file:///storage/emulated/0/DCIM/IMG_20170131_163055.jpg', photoW: 720, photoH: 1280,
	    	frames: [
	    		{id: 0, ymin: 0.00, xmin: 0.00, width: 0.50, height: 0.50, score: 1.0, label: 'one'},
				{id: 1, ymin: 0.00, xmin: 0.00, width: 1.00, height: 1.00, score: 0.5, label: 'another'},
                {id: 2, ymin: 0.25, xmin: 0.25, width: 0.25, height: 0.20, score: 0.9, label: 'Miller'},
                {id: 3, ymin: 0.65, xmin: 0.25, width: 0.55, height: 0.20, score: 0.8, label: 'smetana'},
				],
	    	spinner: false, report: false};
        
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
                          report={this.state.report}
                          clear={this.clear.bind(this)} 
                          setSpinner={this.setSpinner.bind(this)}
                          toggleReport={this.toggleReport.bind(this)}
                          sendReport={this.sendReport.bind(this)}
                          />;
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
  
      toggleReport() {
          this.setState({report: !this.state.report});
      }
  
      sendReport() {
          Alert.alert('Sent');
          this.toggleReport();
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
              frames = this.doFrames(frames);
              this.setState({frames: frames, spinner: false});
	      }).catch(err => {
	    	Alert.alert('Upload', '' + err + '(' + url + ')');
			console.log('>> setPhoto() error ' + err);
            this.setSpinner(false);
		});
	  }
  
      doFrames(frames) {
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
          // TODO: test
//           frames.push({
//             id: 100,
//             ymin: 0.25, 
//             xmin: 0.25, 
//             width: 0.5, 
//             height: 0.5,
//             score: 1,
//             label: 'another'});
          return frames;
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
