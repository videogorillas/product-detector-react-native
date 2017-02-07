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

import RandomColor from 'randomcolor'

import {styles} from './styles'

const greenProducts = require('./green-products.json')

class FramesComponent extends Component {
    constructor(props) {
	    super(props);
        this.state = {showLabel: -1};
    }
	render() {
        let style = this.props.style;
        let {width, height} = style;
        console.log('FramesComponent ' + width + 'x' + height);
		return (
	      <View 
	      	style={style}
	      >
		  {this.props.frames.map(frame => {
                let fleft = width * frame.xmin;
                let ftop = height * frame.ymin;
                let fwidth = width * frame.width;
                let fheight = height * frame.height;
                let color = this.labelToColor(frame.label);
                let style = {
		        		position: 'absolute',
		        		left: fleft,
		        		top: ftop,
		            	width: fwidth, 
		            	height: fheight,
	  	            	borderStyle: 'solid',
	  	      		  	borderWidth: frame.score * 5,
	  	      		  	borderRadius: 5,
	  	      		  	borderColor: color,
	  	      		  	alignItems: 'flex-end',
	  	      		  	justifyContent: 'flex-end'
	  	      	};
                console.log('style  ' + style.left + ' ' + style.top + ' ' + style.width + ' ' + style.height);
                let bgcolor = '#00000000';
                let th = 15;
                let b = 5;
                let label;
                if (this.state.showLabel == frame.id)
                  label = <Text style={{color: color, fontSize: 14, position: 'absolute', top: ftop+fheight-30, left: fleft+10, 
                                        width: 140, height: 20}}>{frame.label} : {frame.score.toFixed(2)}</Text>;
		    	return (
	        		<View key={frame.id} style={{position: 'absolute', top: 0, left: 0, width: width, height: height}}>
                      <View key={frame.id} style={style}>
                         <TouchableHighlight onPress={() => {this.showLabel(frame.id)}} underlayColor={'#00000000'}
                             style={{position: 'absolute', left: -b, top: -b, width: fwidth+2*b, height: th, borderRadius: 0, backgroundColor: bgcolor}}>
                           <View/></TouchableHighlight>
                         <TouchableHighlight onPress={() => {this.showLabel(frame.id)}} underlayColor={'#00000000'}
                             style={{position: 'absolute', left: -b, top: -b, width: th, height: fheight+2*b, borderRadius: 0, backgroundColor: bgcolor}}>
                           <View/></TouchableHighlight>
                         <TouchableHighlight onPress={() => {this.showLabel(frame.id)}} underlayColor={'#00000000'}
                             style={{position: 'absolute', left: fwidth-th, top: -b, width: th, height: fheight+2*b, borderRadius: 0, backgroundColor: bgcolor}}>
                           <View/></TouchableHighlight>
                         <TouchableHighlight onPress={() => {this.showLabel(frame.id)}} underlayColor={'#00000000'}
                             style={{position: 'absolute', left: -b, top: fheight-th, width: fwidth+2*b, height: th, borderRadius: 0, backgroundColor: bgcolor}}>
                           <View/></TouchableHighlight>
                         
                       </View>
                       {label}
                    </View> 
		        );
		      })}
	      </View>
	    )
	 }
    
     showLabel(id) {
       this.setState((prevState, props) => ({
         showLabel: prevState.showLabel != id ? id : -1
       }));
       console.log('>> show label: ' + id);
     }

     labelToColor(label) {
//        let color = RandomColor.randomColor({seed: label, format: 'rgb'});
       let color = greenProducts.indexOf(label) >=0 ? 'green' : 'red';
       return color;
     }
}

export {FramesComponent}