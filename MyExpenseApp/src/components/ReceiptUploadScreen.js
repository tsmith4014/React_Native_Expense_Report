//ReceiptUploadScreen.js;
import React, {useContext, useState} from 'react';
import {
  View,
  Button,
  Alert,
  Image,
  TouchableOpacity,
  Text,
  TextInput,
  Linking,
  Platform,
  Keyboard,
  TouchableWithoutFeedback,
  Modal,
} from 'react-native';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import Config from 'react-native-config';
import AuthContext from '../services/AuthContext';
import DateTimePicker from '@react-native-community/datetimepicker';
import styles from '../styles/styles';
import {Picker} from '@react-native-picker/picker';

const ReceiptUploadScreen = () => {
  const {token} = useContext(AuthContext);
  const [imageUrl, setImageUrl] = useState(null);
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    price: '',
    category: '',
  });
  const [showForm, setShowForm] = useState(false);
  const [base64Image, setBase64Image] = useState(null);
  const [fileName, setFileName] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showPicker, setShowPicker] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState();

  const handleTakePhoto = () => {
    const options = {saveToPhotos: true, mediaType: 'photo'};
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
    const options = {mediaType: 'photo'};
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
    if (!imageData || !imageData.fileName || !imageData.uri) {
      Alert.alert('Upload Failed', 'Image data is incomplete.');
      return;
    }
    const base64Image = await convertToBase64(imageData.uri);
    setShowForm(true);
    setBase64Image(base64Image);
    setFileName(imageData.fileName);
  };

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(Platform.OS === 'android');
    if (selectedDate) {
      const formattedDate = `${selectedDate.getFullYear()}-${(
        selectedDate.getMonth() + 1
      )
        .toString()
        .padStart(2, '0')}-${selectedDate
        .getDate()
        .toString()
        .padStart(2, '0')}`;
      setFormData(prevState => ({...prevState, date: formattedDate}));
      setShowDatePicker(false);
    }
  };

  const handleFormSubmit = async () => {
    if (!formData.date || !formData.price || !selectedCategory) {
      Alert.alert('Validation Error', 'Please fill all the fields.');
      return;
    }

    const payload = {
      imageData: base64Image,
      userId: 'chad',
      fileName: fileName,
      date: formData.date,
      price: formData.price,
      category: selectedCategory,
    };

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
      setImageUrl(data.url);
      Alert.alert(
        'Upload Successful',
        `File uploaded successfully: ${data.url}`,
      );
      setShowForm(false);
      setFormData({
        date: new Date().toISOString().split('T')[0],
        price: '',
        category: '',
      });
      setSelectedCategory(null);
      setShowPicker(false);
    } else {
      const errorText = await response.text();
      throw new Error(`Failed to upload image: ${errorText}`);
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
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={styles.container}>
        <Button title="Take Photo" onPress={handleTakePhoto} />
        <Button title="Select Photo from Gallery" onPress={handleSelectPhoto} />
        {imageUrl && (
          <TouchableOpacity
            onPress={() => Linking.openURL(imageUrl)}
            style={styles.imageContainer}>
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
            <Text style={styles.label}>Date</Text>
            <TouchableOpacity
              onPress={() => setShowDatePicker(true)}
              style={styles.dateInput}>
              <Text style={styles.inputText}>
                {formData.date || 'Select Date'}
              </Text>
            </TouchableOpacity>
            {showDatePicker && (
              <DateTimePicker
                value={new Date(formData.date)}
                mode="date"
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                onChange={handleDateChange}
                maximumDate={new Date()}
              />
            )}
            <Text style={styles.label}>Price</Text>
            <TextInput
              placeholder="Price"
              value={formData.price}
              onChangeText={text => setFormData({...formData, price: text})}
              keyboardType="numeric"
              style={styles.input}
              returnKeyType="done"
            />
            <Text style={styles.label}>Category</Text>
            <TouchableOpacity
              style={styles.input}
              onPress={() => setShowPicker(true)}>
              <Text style={styles.pickerInputText}>
                {selectedCategory || 'Select Category'}
              </Text>
            </TouchableOpacity>
            <Modal
              animationType="slide"
              transparent={true}
              visible={showPicker}
              onRequestClose={() => setShowPicker(!showPicker)}>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={selectedCategory}
                  onValueChange={(itemValue, itemIndex) =>
                    setSelectedCategory(itemValue)
                  }
                  style={styles.picker}>
                  <Picker.Item label="Airfare" value="Airfare" />
                  <Picker.Item label="Car Rental" value="Car Rental" />
                  <Picker.Item
                    label="Local Transportation"
                    value="Local Transportation"
                  />
                  <Picker.Item label="Tolls/Parking" value="Tolls/Parking" />
                  <Picker.Item label="Car Expense" value="Car Expense" />
                  <Picker.Item label="Gas" value="Gas" />
                  <Picker.Item label="Hotel" value="Hotel" />
                  <Picker.Item label="Telephone" value="Telephone" />
                  <Picker.Item label="Business Meals" value="Business Meals" />
                  <Picker.Item label="Entertainment" value="Entertainment" />
                  <Picker.Item
                    label="Office Supplies"
                    value="Office Supplies"
                  />
                  <Picker.Item label="Postage" value="Postage" />
                  <Picker.Item label="Tips" value="Tips" />
                  <Picker.Item label="Other" value="Other" />
                </Picker>
                <Button title="Done" onPress={() => setShowPicker(false)} />
              </View>
            </Modal>
            <Button
              title="Submit Receipt"
              onPress={handleFormSubmit}
              color="#007BFF"
            />
          </View>
        )}
      </View>
    </TouchableWithoutFeedback>
  );
};

export default ReceiptUploadScreen;

// import React, {useContext, useState} from 'react';
// import {
//   View,
//   Button,
//   Alert,
//   Image,
//   TouchableOpacity,
//   Text,
//   TextInput,
//   Linking,
//   Platform,
//   Keyboard,
//   TouchableWithoutFeedback,
// } from 'react-native';
// import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
// import Config from 'react-native-config';
// import AuthContext from '../services/AuthContext';
// import DateTimePicker from '@react-native-community/datetimepicker';
// import {Picker} from '@react-native-picker/picker';
// import styles from '../styles/styles';

// const ReceiptUploadScreen = () => {
//   const {token} = useContext(AuthContext);
//   const [imageUrl, setImageUrl] = useState(null);
//   const [formData, setFormData] = useState({
//     date: new Date().toISOString().split('T')[0],
//     price: '',
//     category: '',
//   });
//   const [showForm, setShowForm] = useState(false);
//   const [base64Image, setBase64Image] = useState(null);
//   const [fileName, setFileName] = useState(null);
//   const [showDatePicker, setShowDatePicker] = useState(false);
//   const [selectedCategory, setSelectedCategory] = useState();

//   const handleTakePhoto = () => {
//     const options = {saveToPhotos: true, mediaType: 'photo'};
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
//     const options = {mediaType: 'photo'};
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
//     if (!imageData || !imageData.fileName || !imageData.uri) {
//       Alert.alert('Upload Failed', 'Image data is incomplete.');
//       return;
//     }
//     const base64Image = await convertToBase64(imageData.uri);
//     setShowForm(true);
//     setBase64Image(base64Image);
//     setFileName(imageData.fileName);
//   };

//   const handleDateChange = (event, selectedDate) => {
//     setShowDatePicker(Platform.OS === 'android');
//     if (selectedDate) {
//       const formattedDate = `${selectedDate.getFullYear()}-${(
//         selectedDate.getMonth() + 1
//       )
//         .toString()
//         .padStart(2, '0')}-${selectedDate
//         .getDate()
//         .toString()
//         .padStart(2, '0')}`;
//       setFormData(prevState => ({...prevState, date: formattedDate}));
//       setShowDatePicker(false);
//     }
//   };

//   const handleFormSubmit = async () => {
//     if (!formData.date || !formData.price || !formData.category) {
//       Alert.alert('Validation Error', 'Please fill all the fields.');
//       return;
//     }

//     const payload = {
//       imageData: base64Image,
//       userId: 'chad',
//       fileName: fileName,
//       date: formData.date,
//       price: formData.price,
//       category: selectedCategory,
//     };

//     const response = await fetch(Config.IMAGE_UPLOAD_ENDPOINT, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//         Authorization: `Bearer ${token}`,
//       },
//       body: JSON.stringify(payload),
//     });

//     if (response.ok) {
//       const data = await response.json();
//       setImageUrl(data.url);
//       Alert.alert(
//         'Upload Successful',
//         `File uploaded successfully: ${data.url}`,
//       );
//       setShowForm(false);
//       setFormData({
//         date: new Date().toISOString().split('T')[0],
//         price: '',
//         category: '',
//       });
//     } else {
//       const errorText = await response.text();
//       throw new Error(`Failed to upload image: ${errorText}`);
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
//     <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
//       <View style={styles.container}>
//         <Button title="Take Photo" onPress={handleTakePhoto} />
//         <Button title="Select Photo from Gallery" onPress={handleSelectPhoto} />
//         {imageUrl && (
//           <TouchableOpacity
//             onPress={() => Linking.openURL(imageUrl)}
//             style={styles.imageContainer}>
//             <Image
//               source={{uri: imageUrl}}
//               style={styles.image}
//               resizeMode="contain"
//             />
//             <Text style={styles.linkText}>View Image</Text>
//           </TouchableOpacity>
//         )}
//         {showForm && (
//           <View style={styles.formContainer}>
//             <Text style={styles.label}>Date</Text>
//             <TouchableOpacity
//               onPress={() => setShowDatePicker(true)}
//               style={styles.dateInput}>
//               <Text style={styles.inputText}>
//                 {formData.date || 'Select Date'}
//               </Text>
//             </TouchableOpacity>
//             {showDatePicker && (
//               <DateTimePicker
//                 value={new Date(formData.date)}
//                 mode="date"
//                 display={Platform.OS === 'ios' ? 'spinner' : 'default'}
//                 onChange={handleDateChange}
//                 maximumDate={new Date()}
//               />
//             )}
//             <Text style={styles.label}>Price</Text>
//             <TextInput
//               placeholder="Price"
//               value={formData.price}
//               onChangeText={text => setFormData({...formData, price: text})}
//               keyboardType="numeric"
//               style={styles.input}
//               returnKeyType="done"
//             />
//             <Text style={styles.label}>Category</Text>
//             <Picker
//               selectedValue={selectedCategory}
//               onValueChange={(itemValue, itemIndex) =>
//                 setSelectedCategory(itemValue)
//               }
//               style={styles.picker}>
//               <Picker.Item label="Airfare" value="Airfare" />
//               <Picker.Item label="Car Rental" value="Car Rental" />
//               <Picker.Item
//                 label="Local Transportation"
//                 value="Local Transportation"
//               />
//               <Picker.Item label="Tolls/Parking" value="Tolls/Parking" />
//               <Picker.Item label="Car Expense" value="Car Expense" />
//               <Picker.Item label="Gas" value="Gas" />
//               <Picker.Item label="Hotel" value="Hotel" />
//               <Picker.Item label="Telephone" value="Telephone" />
//               <Picker.Item label="Business Meals" value="Business Meals" />
//               <Picker.Item label="Entertainment" value="Entertainment" />
//               <Picker.Item label="Office Supplies" value="Office Supplies" />
//               <Picker.Item label="Postage" value="Postage" />
//               <Picker.Item label="Tips" value="Tips" />
//               <Picker.Item label="Other" value="Other" />
//             </Picker>
//           </View>
//         )}
//       </View>
//     </TouchableWithoutFeedback>
//   );
// };

// export default ReceiptUploadScreen;

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
//   TextInput,
//   Platform,
//   Keyboard,
//   TouchableWithoutFeedback, // Import to allow dismissing the keyboard
// } from 'react-native';
// import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
// import Config from 'react-native-config';
// import AuthContext from '../services/AuthContext';
// import DateTimePicker from '@react-native-community/datetimepicker';

// const ReceiptUploadScreen = () => {
//   const {token} = useContext(AuthContext);
//   const [imageUrl, setImageUrl] = useState(null);
//   const [formData, setFormData] = useState({
//     date: new Date().toISOString().split('T')[0], // Initialize date to today's date
//     price: '',
//     category: '',
//   });
//   const [showForm, setShowForm] = useState(false);
//   const [base64Image, setBase64Image] = useState(null);
//   const [fileName, setFileName] = useState(null);
//   const [showDatePicker, setShowDatePicker] = useState(false);

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
//     if (!imageData || !imageData.fileName || !imageData.uri) {
//       Alert.alert('Upload Failed', 'Image data is incomplete.');
//       return;
//     }
//     const base64Image = await convertToBase64(imageData.uri);
//     setShowForm(true);
//     setBase64Image(base64Image);
//     setFileName(imageData.fileName);
//   };

//   const handleDateChange = (event, selectedDate) => {
//     setShowDatePicker(Platform.OS === 'android'); // Ensure picker is hidden on Android after date selection
//     if (selectedDate) {
//       // Extract year, month, and day directly from the date object
//       const year = selectedDate.getFullYear();
//       const month = selectedDate.getMonth() + 1; // JavaScript months are 0-indexed
//       const day = selectedDate.getDate();

//       // Construct a date string in YYYY-MM-DD format
//       const formattedDate = `${year}-${month.toString().padStart(2, '0')}-${day
//         .toString()
//         .padStart(2, '0')}`;

//       setFormData(prevState => ({
//         ...prevState,
//         date: formattedDate,
//       }));
//       setShowDatePicker(false);
//     }
//   };

//   const handleFormSubmit = async () => {
//     if (!formData.date || !formData.price || !formData.category) {
//       Alert.alert('Validation Error', 'Please fill all the fields.');
//       return;
//     }

//     const payload = {
//       imageData: base64Image,
//       userId: 'chad',
//       fileName: fileName,
//       date: formData.date,
//       price: formData.price,
//       category: formData.category,
//     };

//     const response = await fetch(Config.IMAGE_UPLOAD_ENDPOINT, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//         Authorization: `Bearer ${token}`,
//       },
//       body: JSON.stringify(payload),
//     });

//     if (response.ok) {
//       const data = await response.json();
//       setImageUrl(data.url);
//       Alert.alert(
//         'Upload Successful',
//         `File uploaded successfully: ${data.url}`,
//       );
//       setShowForm(false);
//       setFormData({
//         date: new Date().toISOString().split('T')[0],
//         price: '',
//         category: '',
//       });
//     } else {
//       const errorText = await response.text();
//       throw new Error(`Failed to upload image: ${errorText}`);
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
//     <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
//       <View style={styles.container}>
//         <Button title="Take Photo" onPress={handleTakePhoto} />
//         <Button title="Select Photo from Gallery" onPress={handleSelectPhoto} />
//         {imageUrl && (
//           <TouchableOpacity onPress={() => Linking.openURL(imageUrl)}>
//             <Image
//               source={{uri: imageUrl}}
//               style={styles.image}
//               resizeMode="contain"
//             />
//             <Text style={styles.linkText}>View Image</Text>
//           </TouchableOpacity>
//         )}
//         {showForm && (
//           <View style={styles.formContainer}>
//             <Text style={styles.label}>Date</Text>
//             <TouchableOpacity
//               onPress={() => setShowDatePicker(true)}
//               style={styles.dateInput}>
//               <Text style={styles.inputText}>
//                 {formData.date || 'Select Date'}
//               </Text>
//             </TouchableOpacity>
//             {showDatePicker && (
//               <DateTimePicker
//                 value={new Date(formData.date)}
//                 mode="date"
//                 display={Platform.OS === 'ios' ? 'spinner' : 'default'}
//                 onChange={handleDateChange}
//                 maximumDate={new Date()} // Optional: Prevent future dates
//               />
//             )}
//             <Text style={styles.label}>Price</Text>
//             <TextInput
//               placeholder="Price"
//               value={formData.price}
//               onChangeText={text => setFormData({...formData, price: text})}
//               keyboardType="numeric"
//               style={styles.input}
//               returnKeyType="done" // Adds a "Done" button to the keyboard
//             />
//             <Text style={styles.label}>Category</Text>
//             <TextInput
//               placeholder="Category"
//               value={formData.category}
//               onChangeText={text => setFormData({...formData, category: text})}
//               style={styles.input}
//               returnKeyType="done" // Adds a "Done" button to the keyboard
//             />
//             <Button title="Submit" onPress={handleFormSubmit} />
//           </View>
//         )}
//       </View>
//     </TouchableWithoutFeedback>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     padding: 20,
//     backgroundColor: '#333', // Ensuring the background is slightly darker
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
//   formContainer: {
//     marginTop: 20,
//     width: '100%',
//     padding: 10,
//   },
//   label: {
//     alignSelf: 'flex-start',
//     marginLeft: 10,
//     marginBottom: 5,
//     fontWeight: 'bold',
//     color: '#fff', // White color for labels for better visibility
//   },
//   input: {
//     height: 40,
//     borderColor: 'gray',
//     borderWidth: 1,
//     marginBottom: 10,
//     paddingLeft: 8,
//     width: '100%',
//     color: '#fff', // White text for inputs
//     backgroundColor: '#555', // Darker input background for contrast
//   },
//   dateInput: {
//     height: 40,
//     borderColor: 'gray',
//     borderWidth: 1,
//     marginBottom: 10,
//     justifyContent: 'center',
//     paddingLeft: 8,
//     width: '100%',
//   },
//   inputText: {
//     color: '#fff', // Ensuring the text inside the date picker is also white
//   },
// });

// export default ReceiptUploadScreen;

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
//   TextInput,
//   Platform,
// } from 'react-native';
// import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
// import Config from 'react-native-config';
// import AuthContext from '../services/AuthContext';
// import DateTimePicker from '@react-native-community/datetimepicker';

// const ReceiptUploadScreen = () => {
//   const {token} = useContext(AuthContext);
//   const [imageUrl, setImageUrl] = useState(null);
//   const [formData, setFormData] = useState({
//     date: new Date().toISOString().split('T')[0], // Initialize date to today's date
//     price: '',
//     category: '',
//   });
//   const [showForm, setShowForm] = useState(false);
//   const [base64Image, setBase64Image] = useState(null);
//   const [fileName, setFileName] = useState(null);
//   const [showDatePicker, setShowDatePicker] = useState(false);

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
//     if (!imageData || !imageData.fileName || !imageData.uri) {
//       Alert.alert('Upload Failed', 'Image data is incomplete.');
//       return;
//     }
//     const base64Image = await convertToBase64(imageData.uri);
//     setShowForm(true);
//     setBase64Image(base64Image);
//     setFileName(imageData.fileName);
//   };

//   const handleDateChange = (event, selectedDate) => {
//     setShowDatePicker(Platform.OS === 'android'); // Ensure picker is hidden on Android after date selection
//     if (selectedDate) {
//       // Extract year, month, and day from the selected date
//       const year = selectedDate.getFullYear();
//       const month = selectedDate.getMonth() + 1; // getMonth returns a zero-based index
//       const day = selectedDate.getDate();

//       // Format month and day to ensure they are always two digits
//       const formattedMonth = month < 10 ? `0${month}` : month;
//       const formattedDay = day < 10 ? `0${day}` : day;

//       // Construct the date string in YYYY-MM-DD format
//       const formattedDate = `${year}-${formattedMonth}-${formattedDay}`;

//       // Update the formData state with the new date
//       setFormData(prevState => ({
//         ...prevState,
//         date: formattedDate,
//       }));

//       // Hide the DatePicker
//       setShowDatePicker(false);
//     }
//   };

//   const handleFormSubmit = async () => {
//     if (!formData.date || !formData.price || !formData.category) {
//       Alert.alert('Validation Error', 'Please fill all the fields.');
//       return;
//     }

//     const payload = {
//       imageData: base64Image,
//       userId: 'chad',
//       fileName: fileName,
//       date: formData.date,
//       price: formData.price,
//       category: formData.category,
//     };

//     const response = await fetch(Config.IMAGE_UPLOAD_ENDPOINT, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//         Authorization: `Bearer ${token}`,
//       },
//       body: JSON.stringify(payload),
//     });

//     if (response.ok) {
//       const data = await response.json();
//       setImageUrl(data.url);
//       Alert.alert(
//         'Upload Successful',
//         `File uploaded successfully: ${data.url}`,
//       );
//       setShowForm(false);
//       setFormData({
//         date: new Date().toISOString().split('T')[0],
//         price: '',
//         category: '',
//       });
//     } else {
//       const errorText = await response.text();
//       throw new Error(`Failed to upload image: ${errorText}`);
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
//       {showForm && (
//         <View style={styles.formContainer}>
//           <Text style={styles.label}>Date</Text>
//           <TouchableOpacity
//             onPress={() => setShowDatePicker(true)}
//             style={styles.dateInput}>
//             <Text>{formData.date || 'Select Date'}</Text>
//           </TouchableOpacity>
//           {showDatePicker && (
//             <DateTimePicker
//               value={new Date(formData.date)}
//               mode="date"
//               display={Platform.OS === 'ios' ? 'spinner' : 'default'}
//               onChange={handleDateChange}
//               maximumDate={new Date()} // Optional: Prevent future dates
//             />
//           )}
//           <Text style={styles.label}>Price</Text>
//           <TextInput
//             placeholder="Price"
//             value={formData.price}
//             onChangeText={text => setFormData({...formData, price: text})}
//             keyboardType="numeric"
//             style={styles.input}
//           />
//           <Text style={styles.label}>Category</Text>
//           <TextInput
//             placeholder="Category"
//             value={formData.category}
//             onChangeText={text => setFormData({...formData, category: text})}
//             style={styles.input}
//           />
//           <Button title="Submit" onPress={handleFormSubmit} />
//         </View>
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
//   formContainer: {
//     marginTop: 20,
//     width: '100%',
//     padding: 10,
//   },
//   label: {
//     alignSelf: 'flex-start',
//     marginLeft: 10,
//     marginBottom: 5,
//     fontWeight: 'bold',
//   },
//   input: {
//     height: 40,
//     borderColor: 'gray',
//     borderWidth: 1,
//     marginBottom: 10,
//     paddingLeft: 8,
//     width: '100%',
//   },
//   dateInput: {
//     height: 40,
//     borderColor: 'gray',
//     borderWidth: 1,
//     marginBottom: 10,
//     justifyContent: 'center',
//     paddingLeft: 8,
//   },
// });

// export default ReceiptUploadScreen;
