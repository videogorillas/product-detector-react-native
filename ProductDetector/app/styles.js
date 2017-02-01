import {Dimensions, StyleSheet} from 'react-native'

export const styles = StyleSheet.create({
	  cameraContainer: {
	    flex: 1,
	    backgroundColor: '#000000',
	    justifyContent:'flex-end',
        flexDirection: 'column',
//         justifyContent: 'space-around',
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
	    margin: 20,
        padding: 10,
//         backgroundColor: 'gray',
//         borderRadius: 24,
	    alignSelf: 'center',
	  },
})