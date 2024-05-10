// //ReceiptUploadScreen.js this doesnt work when i submit to the API gateway it says not a valid key=value pair (missing equal-sign) in Authorization header: and then it list the auth token

// import React, {useContext} from 'react';
// import {View, Button, StyleSheet, Alert} from 'react-native';
// import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
// import axios from 'axios';
// import Config from 'react-native-config';
// import AuthContext from '../services/AuthContext';

// const ReceiptUploadScreen = () => {
//   const {token} = useContext(AuthContext);
//   console.log(`This is the token dudes ${token}`);

//   const handleTakePhoto = () => {
//     const options = {
//       saveToPhotos: true,
//       mediaType: 'photo',
//       includeBase64: false,
//     };
//     launchCamera(options, response => {
//       if (response.didCancel) {
//         console.log('User cancelled image picker');
//       } else if (response.errorCode) {
//         console.log('ImagePicker Error:', response.errorCode);
//       } else {
//         uploadImage(response.assets[0]);
//       }
//     });
//   };

//   const handleSelectPhoto = () => {
//     const options = {
//       mediaType: 'photo',
//       includeBase64: false,
//     };
//     launchImageLibrary(options, response => {
//       if (response.didCancel) {
//         console.log('User cancelled image picker');
//       } else if (response.errorCode) {
//         console.log('ImagePicker Error:', response.errorCode);
//       } else {
//         uploadImage(response.assets[0]);
//       }
//     });
//   };

//   const uploadImage = imageData => {
//     const formData = new FormData();
//     formData.append('file', {
//       name: imageData.fileName,
//       type: imageData.type,
//       uri: imageData.uri,
//     });
//     formData.append(
//       'metadata',
//       JSON.stringify({
//         date: new Date().toISOString(),
//         userId: 'chad', // Make sure this matches what your backend expects
//       }),
//     );

//     axios
//       .post(Config.IMAGE_UPLOAD_ENDPOINT, formData, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       })
//       .then(res => {
//         Alert.alert('Upload Successful', 'Your receipt has been uploaded.');
//         console.log('Response Data:', res.data);
//       })
//       .catch(err => {
//         Alert.alert('Upload Failed', 'Failed to upload your receipt.');
//         console.error('Axios Error:', err.response ? err.response.data : err);
//       });
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

// import React, {useContext} from 'react';
// import {View, Button, StyleSheet, Alert} from 'react-native';
// import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
// import Config from 'react-native-config';
// import AuthContext from '../services/AuthContext';

// const ReceiptUploadScreen = () => {
//   const {token} = useContext(AuthContext);
//   console.log(`Token being used: ${token}`);

//   const handleTakePhoto = () => {
//     const options = {
//       saveToPhotos: true,
//       mediaType: 'photo',
//       includeBase64: false,
//     };
//     launchCamera(options, response => {
//       if (response.didCancel) {
//         console.log('User cancelled image picker');
//       } else if (response.errorCode) {
//         console.log('ImagePicker Error:', response.errorCode);
//       } else {
//         uploadImage(response.assets[0]);
//       }
//     });
//   };

//   const handleSelectPhoto = () => {
//     const options = {
//       mediaType: 'photo',
//       includeBase64: false,
//     };
//     launchImageLibrary(options, response => {
//       if (response.didCancel) {
//         console.log('User cancelled image picker');
//       } else if (response.errorCode) {
//         console.log('ImagePicker Error:', response.errorCode);
//       } else {
//         uploadImage(response.assets[0]);
//       }
//     });
//   };

//   const uploadImage = imageData => {
//     const formData = new FormData();
//     formData.append('file', {
//       name: imageData.fileName,
//       type: imageData.type,
//       uri: imageData.uri,
//     });
//     formData.append(
//       'metadata',
//       JSON.stringify({
//         date: new Date().toISOString(),
//         userId: 'chad',
//       }),
//     );

//     const headers = {
//       Authorization: `Bearer ${token}`,
//       'Content-Type': 'multipart/form-data',
//     };

//     console.log('Preparing to send request with token:', token);
//     console.log('Headers being sent:', JSON.stringify(headers, null, 2));

//     fetch(Config.IMAGE_UPLOAD_ENDPOINT, {
//       method: 'POST',
//       headers: headers,
//       body: formData,
//     })
//       .then(response => {
//         console.log('HTTP Response Status:', response.status);
//         response.headers.forEach((value, name) => {
//           console.log(`HTTP Response Header - ${name}: ${value}`);
//         });
//         if (!response.ok) {
//           throw new Error(`HTTP error! status: ${response.status}`);
//         }
//         return response.json();
//       })
//       .then(data => {
//         console.log('Response Data:', JSON.stringify(data, null, 2));
//         Alert.alert('Upload Successful', 'Your receipt has been uploaded.');
//       })
//       .catch(error => {
//         console.log('Full Fetch Error Details:', error.toString());
//         Alert.alert('Upload Failed', 'Failed to upload your receipt.');
//         console.error('Error with fetch:', error);
//       });
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

import React, {useContext} from 'react';
import {View, Button, StyleSheet, Alert} from 'react-native';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import Config from 'react-native-config';
import AuthContext from '../services/AuthContext';

const ReceiptUploadScreen = () => {
  const {token} = useContext(AuthContext);

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

      // Prepare payload
      const payload = {
        imageData: base64Image,
        userId: 'chad',
        fileName: imageData.fileName,
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
        Alert.alert(
          'Upload Successful',
          `File uploaded successfully: ${data.url}`,
        );
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
});

export default ReceiptUploadScreen;
