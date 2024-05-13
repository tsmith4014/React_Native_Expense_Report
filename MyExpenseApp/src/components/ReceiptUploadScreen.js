//ReceiptUploadScreen.js
import React, {useContext, useState} from 'react';
import {
  View,
  Button,
  StyleSheet,
  Alert,
  Image,
  TouchableOpacity,
  Text,
  Linking,
  TextInput,
} from 'react-native';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import Config from 'react-native-config';
import AuthContext from '../services/AuthContext';

const ReceiptUploadScreen = () => {
  const {token} = useContext(AuthContext);
  const [imageUrl, setImageUrl] = useState(null);
  const [formData, setFormData] = useState({date: '', price: '', category: ''});
  const [showForm, setShowForm] = useState(false);
  const [base64Image, setBase64Image] = useState(null);
  const [fileName, setFileName] = useState(null);

  const handleTakePhoto = () => {
    const options = {
      saveToPhotos: true,
      mediaType: 'photo',
    };
    launchCamera(options, response => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.errorCode) {
        console.log('ImagePicker Error:', response.errorCode);
      } else {
        processImage(response.assets[0]);
      }
    });
  };

  const handleSelectPhoto = () => {
    const options = {
      mediaType: 'photo',
    };
    launchImageLibrary(options, response => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.errorCode) {
        console.log('ImagePicker Error:', response.errorCode);
      } else {
        processImage(response.assets[0]);
      }
    });
  };

  const processImage = async imageData => {
    try {
      if (!imageData || !imageData.fileName || !imageData.uri) {
        Alert.alert('Upload Failed', 'Image data is incomplete.');
        return;
      }

      // Convert image to base64
      const base64Image = await convertToBase64(imageData.uri);

      // Show form after image is selected
      setShowForm(true);

      // Save the base64 image and file name to state for later use
      setBase64Image(base64Image);
      setFileName(imageData.fileName);
    } catch (error) {
      console.error('Image processing error:', error);
      Alert.alert('Processing Failed', error.message);
    }
  };

  const handleFormSubmit = async () => {
    try {
      // Validate form data
      if (!formData.date || !formData.price || !formData.category) {
        Alert.alert('Validation Error', 'Please fill all the fields.');
        return;
      }

      // Prepare payload with form data and image data
      const payload = {
        imageData: base64Image,
        userId: 'chad', // This will be updated to the Cognito user ID
        fileName: fileName,
        date: formData.date,
        price: formData.price,
        category: formData.category,
      };

      // Send to Lambda
      const response = await fetch(Config.IMAGE_UPLOAD_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const data = await response.json();
        setImageUrl(data.url); // Set the image URL to state
        Alert.alert(
          'Upload Successful',
          `File uploaded successfully: ${data.url}`,
        );
        setShowForm(false); // Hide form after successful upload
        setFormData({date: '', price: '', category: ''}); // Reset form data
      } else {
        const errorText = await response.text();
        throw new Error(`Failed to upload image: ${errorText}`);
      }
    } catch (error) {
      console.error('Upload error:', error);
      Alert.alert('Upload Failed', error.message);
    }
  };

  const convertToBase64 = async uri => {
    const response = await fetch(uri);
    const blob = await response.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result.split(',')[1]);
      reader.onerror = error => reject(error);
      reader.readAsDataURL(blob);
    });
  };

  return (
    <View style={styles.container}>
      <Button title="Take Photo" onPress={handleTakePhoto} />
      <Button title="Select Photo from Gallery" onPress={handleSelectPhoto} />
      {imageUrl && (
        <TouchableOpacity onPress={() => Linking.openURL(imageUrl)}>
          <Image
            source={{uri: imageUrl}}
            style={styles.image}
            resizeMode="contain"
          />
          <Text style={styles.linkText}>View Image</Text>
        </TouchableOpacity>
      )}
      {showForm && (
        <View style={styles.formContainer}>
          <TextInput
            placeholder="Date"
            value={formData.date}
            onChangeText={text => setFormData({...formData, date: text})}
            style={styles.input}
          />
          <TextInput
            placeholder="Price"
            value={formData.price}
            onChangeText={text => setFormData({...formData, price: text})}
            keyboardType="numeric"
            style={styles.input}
          />
          <TextInput
            placeholder="Category"
            value={formData.category}
            onChangeText={text => setFormData({...formData, category: text})}
            style={styles.input}
          />
          <Button title="Submit" onPress={handleFormSubmit} />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  image: {
    width: 300,
    height: 300,
    marginTop: 20,
    borderWidth: 1,
    borderColor: '#000',
  },
  linkText: {
    color: 'blue',
    marginTop: 10,
    textDecorationLine: 'underline',
  },
  formContainer: {
    marginTop: 20,
    width: '100%',
    padding: 10,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingLeft: 8,
    width: '100%',
  },
});

export default ReceiptUploadScreen;

// import React, {useContext, useState} from 'react';
// import {
//   View,
//   Button,
//   StyleSheet,
//   Alert,
//   Image,
//   TouchableOpacity,
//   Text,
//   Linking,
// } from 'react-native';
// import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
// import Config from 'react-native-config';
// import AuthContext from '../services/AuthContext';

// const ReceiptUploadScreen = () => {
//   const {token} = useContext(AuthContext);
//   const [imageUrl, setImageUrl] = useState(null);

//   const handleTakePhoto = () => {
//     const options = {
//       saveToPhotos: true,
//       mediaType: 'photo',
//     };
//     launchCamera(options, response => {
//       if (response.didCancel) {
//         console.log('User cancelled image picker');
//       } else if (response.errorCode) {
//         console.log('ImagePicker Error:', response.errorCode);
//       } else {
//         processImage(response.assets[0]);
//       }
//     });
//   };

//   const handleSelectPhoto = () => {
//     const options = {
//       mediaType: 'photo',
//     };
//     launchImageLibrary(options, response => {
//       if (response.didCancel) {
//         console.log('User cancelled image picker');
//       } else if (response.errorCode) {
//         console.log('ImagePicker Error:', response.errorCode);
//       } else {
//         processImage(response.assets[0]);
//       }
//     });
//   };

//   const processImage = async imageData => {
//     try {
//       if (!imageData || !imageData.fileName || !imageData.uri) {
//         Alert.alert('Upload Failed', 'Image data is incomplete.');
//         return;
//       }

//       // Convert image to base64
//       const base64Image = await convertToBase64(imageData.uri);

//       // Prepare payload
//       const payload = {
//         imageData: base64Image,
//         userId: 'chad',
//         fileName: imageData.fileName,
//       };

//       // Send to Lambda
//       const response = await fetch(Config.IMAGE_UPLOAD_ENDPOINT, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify(payload),
//       });

//       if (response.ok) {
//         const data = await response.json();
//         setImageUrl(data.url); // Set the image URL to state
//         Alert.alert(
//           'Upload Successful',
//           `File uploaded successfully: ${data.url}`,
//         );
//       } else {
//         const errorText = await response.text();
//         throw new Error(`Failed to upload image: ${errorText}`);
//       }
//     } catch (error) {
//       console.error('Upload error:', error);
//       Alert.alert('Upload Failed', error.message);
//     }
//   };

//   const convertToBase64 = async uri => {
//     const response = await fetch(uri);
//     const blob = await response.blob();
//     return new Promise((resolve, reject) => {
//       const reader = new FileReader();
//       reader.onloadend = () => resolve(reader.result.split(',')[1]);
//       reader.onerror = error => reject(error);
//       reader.readAsDataURL(blob);
//     });
//   };

//   return (
//     <View style={styles.container}>
//       <Button title="Take Photo" onPress={handleTakePhoto} />
//       <Button title="Select Photo from Gallery" onPress={handleSelectPhoto} />
//       {imageUrl && (
//         <TouchableOpacity onPress={() => Linking.openURL(imageUrl)}>
//           <Image
//             source={{uri: imageUrl}}
//             style={styles.image}
//             resizeMode="contain"
//           />
//           <Text style={styles.linkText}>View Image</Text>
//         </TouchableOpacity>
//       )}
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     padding: 20,
//   },
//   image: {
//     width: 300,
//     height: 300,
//     marginTop: 20,
//     borderWidth: 1,
//     borderColor: '#000',
//   },
//   linkText: {
//     color: 'blue',
//     marginTop: 10,
//     textDecorationLine: 'underline',
//   },
// });

// export default ReceiptUploadScreen;

//Working backup, this works to upload and image to s3 using both the image upload and the camera upload but doesnt dispaly to screen but rather a popup the presigned url link click on the 3 ... to open this nested backup code
// import React, {useContext} from 'react';
// import {View, Button, StyleSheet, Alert} from 'react-native';
// import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
// import Config from 'react-native-config';
// import AuthContext from '../services/AuthContext';

// const ReceiptUploadScreen = () => {
//   const {token} = useContext(AuthContext);

//   const handleTakePhoto = () => {
//     const options = {
//       saveToPhotos: true,
//       mediaType: 'photo',
//     };
//     launchCamera(options, response => {
//       if (response.didCancel) {
//         console.log('User cancelled image picker');
//       } else if (response.errorCode) {
//         console.log('ImagePicker Error:', response.errorCode);
//       } else {
//         processImage(response.assets[0]);
//       }
//     });
//   };

//   const handleSelectPhoto = () => {
//     const options = {
//       mediaType: 'photo',
//     };
//     launchImageLibrary(options, response => {
//       if (response.didCancel) {
//         console.log('User cancelled image picker');
//       } else if (response.errorCode) {
//         console.log('ImagePicker Error:', response.errorCode);
//       } else {
//         processImage(response.assets[0]);
//       }
//     });
//   };

//   const processImage = async imageData => {
//     try {
//       if (!imageData || !imageData.fileName || !imageData.uri) {
//         Alert.alert('Upload Failed', 'Image data is incomplete.');
//         return;
//       }

//       // Convert image to base64
//       const base64Image = await convertToBase64(imageData.uri);

//       // Prepare payload
//       const payload = {
//         imageData: base64Image,
//         userId: 'chad',
//         fileName: imageData.fileName,
//       };

//       // Send to Lambda
//       const response = await fetch(Config.IMAGE_UPLOAD_ENDPOINT, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify(payload),
//       });

//       if (response.ok) {
//         const data = await response.json();
//         Alert.alert(
//           'Upload Successful',
//           `File uploaded successfully: ${data.url}`,
//         );
//       } else {
//         const errorText = await response.text();
//         throw new Error(`Failed to upload image: ${errorText}`);
//       }
//     } catch (error) {
//       console.error('Upload error:', error);
//       Alert.alert('Upload Failed', error.message);
//     }
//   };

//   const convertToBase64 = async uri => {
//     const response = await fetch(uri);
//     const blob = await response.blob();
//     return new Promise((resolve, reject) => {
//       const reader = new FileReader();
//       reader.onloadend = () => resolve(reader.result.split(',')[1]);
//       reader.onerror = error => reject(error);
//       reader.readAsDataURL(blob);
//     });
//   };

//   return (
//     <View style={styles.container}>
//       <Button title="Take Photo" onPress={handleTakePhoto} />
//       <Button title="Select Photo from Gallery" onPress={handleSelectPhoto} />
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     padding: 20,
//   },
// });

// export default ReceiptUploadScreen;
