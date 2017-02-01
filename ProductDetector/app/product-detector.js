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
import {FramesComponent} from './frames-component'

class ProductComponent extends Component {
    constructor(props) {
	    super(props);
//         const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
//         let planogram = this.getPlanogram(props.frames);
//         this.state = {
//           dataSource: ds.cloneWithRows(planogram)
//         };
    }
  
    getPlanogram(frames) {
//       return [{label: 'A', count: 10}, {label: 'B', count: 5}, {label: 'C', count: 0}];
      let planogram = [];
      greenProducts.forEach((greenProduct, i, arr) => {
        let p = planogram.find(x => x.label === greenProduct);
        if (!p) {
          p = {label: greenProduct, count: 0};
          planogram.push(p);
        }
        frames.forEach((frame) => {
          if (frame.label === p.label) {
            p.count++;
          }
        });
      });
      planogram.sort((a, b) => {return b.count - a.count}); 
      return planogram;
    }
  
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
       
       // fit:
       if (screenW < imageW) {
         imageW = screenW;
         imageH = imageW / ar;
       }
       if (screenH < imageH) {
         imageH = screenH;
         imageW = ar * imageH;
       }
       // center horizontally:
       if (screenW > imageW) {
         imageL = (screenW - imageW)/2;
       }
       console.log('>> ProductComponent render() ar=' + ar + ' screen ' + screenW + 'x' + screenH + ' image ' + imageW + 'x' + imageH);

       let style = { position: 'absolute', left: imageL, top: imageT, width: imageW, height: imageH};
      
       let viewFlexDirection = (screenW > screenH ) ? 'row' : 'column';
      
       let element;
       if (this.props.report) {
          const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
          let planogram = this.getPlanogram(this.props.frames);
          let dataSource = ds.cloneWithRows(planogram);
         
         element = <View style={{position: 'absolute', left: 25, top: 10, width: screenW-50, height: screenH-20,
                               backgroundColor: '#ffffff99', borderRadius: 5,
                               justifyContent: 'space-between', flexDirection: 'column'}}>            
               <Text style={{padding: 15, fontWeight: 'normal', fontSize: 20, color: 'black', textAlign: 'left'}}>Planogram Report</Text>
               <View style={{flex: 1, paddingTop: 0, paddingBottom: 0}}>
                 <ListView dataSource={dataSource} renderRow={this.renderRow}/>
               </View>
               <View style={{justifyContent: 'space-around', flexDirection: 'row'}}>
                 <TouchableHighlight onPress={this.props.toggleReport} 
                     activeOpacity={1} underlayColor={'#d3d3d355'} style={{borderRadius: 48}}>
                     <Image source={require('./ic_close_white_24dp.png')} style={styles.ibutton} />
                 </TouchableHighlight>
                 <TouchableHighlight onPress={this.props.sendReport}
                     activeOpacity={1} underlayColor={'#d3d3d355'} style={{borderRadius: 48}}>
                     <Image source={require('./ic_send_white_24dp.png')} style={styles.ibutton} />
                 </TouchableHighlight>
               </View>
           </View>;
       } else {
         element = <View style={{flex: 1, justifyContent: 'space-between', flexDirection: viewFlexDirection}}>
               <FramesComponent frames={this.props.frames} style={style}/>
               <View style={{flex: 1}}/>
               <View style={{justifyContent: 'space-around', flexDirection: 'row'}}>
                 <TouchableHighlight onPress={this.props.clear} 
                     activeOpacity={1} underlayColor={'#d3d3d355'} style={{borderRadius: 48}}>
                     <Image source={require('./ic_close_white_24dp.png')} style={styles.ibutton} />
                 </TouchableHighlight>
                 <TouchableHighlight onPress={this.props.toggleReport}
                     activeOpacity={1} underlayColor={'#d3d3d355'} style={{borderRadius: 48}}>
                     <Image source={require('./ic_assignment_white_24dp.png')} style={styles.ibutton} />
                 </TouchableHighlight>
               </View>
             </View>;
       }
         
	   let component = 
	      <View style={{flex: 1, backgroundColor: '#000000', justifyContent: 'space-between', flexDirection: viewFlexDirection}}>
             <Image 
                 source={{uri: this.props.photo}}
                 style={style}/>
             {element}
	      </View>
	    return component;
	 }
  
     renderRow(row) {
       let icon;
       if (row.count > 0)
         icon = require('./ic_check_black_24dp.png');
       else
         icon = require('./ic_warning_black_24dp.png');
       return <View style={{paddingTop: 10, paddingBottom: 10, flexDirection: 'row'}}>
         <View style={{flexDirection: 'column', justifyContent: 'space-around', paddingLeft: 15, paddingRight: 15}}>
           <Image source={icon} style={{padding: 0}}/>
         </View>
         <View style={{flexDirection: 'column'}}>
           <Text style={{padding: 3, fontWeight: 'normal', fontSize: 16, color: 'black'}}>{row.label}</Text>
           <Text style={{padding: 3, fontSize: 12}}>{row.count > 0 ? row.count + ' positions': 'not found'}</Text>
         </View>
       </View>;
     }
}

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
