import React, { Component } from 'react'
import {
	  Alert,
	  Dimensions,
	  StyleSheet,
	  Text,
	  Image,
	  TouchableHighlight,
	  View,
      ListView,
	} from 'react-native'

import ViewTransformer from 'react-native-view-transformer'
import {FramesComponent} from './frames-component'
import {styles} from './styles'
const greenProducts = require('./green-products.json')

class ProductComponent extends Component {
    constructor(props) {
	    super(props);
        this.state = {
          report: false,
          transformation: {scale: 1, translateX: 0, translateY: 0}
        }
    }
  
    getPlanogram(frames) {
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
       let screenH = this.props.layout.height;
       let screenW = this.props.layout.width;
       
       // fit:
       if (screenW < imageW) {
         imageW = screenW;
         imageH = imageW / ar;
       }
       if (screenH < imageH) {
         imageH = screenH;
         imageW = ar * imageH;
       }
       // if portrait, center (top) horizontally, else (left) vertically:
       if (this.props.layout.portrait && (screenW > imageW)) {
         imageL = (screenW - imageW) / 2;
       } else if (this.props.layout.landscape && (screenH > imageH)) {
         imageT = (screenH - imageH) / 2;
       }
       console.log('>> ProductComponent render() ar=' + ar + ' screen ' + screenW + 'x' + screenH + ' image ' + imageW + 'x' + imageH);

       let style = { position: 'absolute', left: imageL, top: imageT, width: imageW, height: imageH};
      
       let viewFlexDirection = this.props.layout.landscape ? 'row' : 'column';
       let buttonsFlexDirection = this.props.layout.landscape ? 'column' : 'row';
      
       let controlButtons = null;
       let frames = null;
       let report = null;
      
       if (this.state.report) {
         const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
         let planogram = this.getPlanogram(this.props.frames);
         let dataSource = ds.cloneWithRows(planogram);
         
         report = <View style={{position: 'absolute', left: 10, top: 10, width: screenW-20, height: screenH-20,
                               backgroundColor: '#ffffff99', borderRadius: 5,
                               justifyContent: 'space-between', flexDirection: 'column'}}>            
               <Text style={{padding: 15, fontWeight: 'normal', fontSize: 20, color: 'black', textAlign: 'left'}}>Planogram Report</Text>
               <View style={{flex: 1, paddingTop: 0, paddingBottom: 0}}>
                 <ListView dataSource={dataSource} renderRow={this.renderRow}/>
               </View>
               <View style={{justifyContent: 'space-around', flexDirection: 'row'}}>
                 <TouchableHighlight onPress={this.toggleReport.bind(this)} 
                     activeOpacity={1} underlayColor={'#d3d3d355'} style={{borderRadius: 48}}>
                     <Image source={require('./ic_close_white_24dp.png')} style={styles.ibutton} />
                 </TouchableHighlight>
                 <TouchableHighlight onPress={this.sendReport.bind(this)}
                     activeOpacity={1} underlayColor={'#d3d3d355'} style={{borderRadius: 48}}>
                     <Image source={require('./ic_send_white_24dp.png')} style={styles.ibutton} />
                 </TouchableHighlight>
               </View>
           </View>
       } else {
         controlButtons = 
            <View style={{justifyContent: 'space-around', flexDirection: buttonsFlexDirection}}>
               <TouchableHighlight onPress={this.props.clear} 
                   activeOpacity={1} underlayColor={'#d3d3d355'} style={{borderRadius: 48}}>
                   <Image source={require('./ic_close_white_24dp.png')} style={styles.ibutton} />
               </TouchableHighlight>
               <TouchableHighlight onPress={this.toggleReport.bind(this)}
                   activeOpacity={1} underlayColor={'#d3d3d355'} style={{borderRadius: 48}}>
                   <Image source={require('./ic_assignment_white_24dp.png')} style={styles.ibutton} />
               </TouchableHighlight>
            </View>
           
         frames = 
           <View style={{flex: 1, justifyContent: 'space-between', flexDirection: viewFlexDirection}}>
               <FramesComponent frames={this.props.frames} style={style} transformation={this.state.transformation}/>
               <View style={{flex: 1}}/>
           </View>
       }
       
	   let component = 
          <View style={{flex: 1, backgroundColor: '#000000', justifyContent: 'flex-end', flexDirection: viewFlexDirection}}>
            <ViewTransformer style={{position: 'absolute', left: 0, top: 0, width: screenW, height: screenH}}
                maxScale={3}>
               <Image 
                   source={{uri: this.props.photo}}
                   style={style}/>
               {frames}
            </ViewTransformer>
            {report}
            {controlButtons}
          </View>
	    return component;
	 }

     toggleReport() {
       this.setState((prevState, props) => ({
         report: !prevState.report
       }));
     }
     
     sendReport() {
        Alert.alert('Sent');
        this.toggleReport();
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

export {ProductComponent}