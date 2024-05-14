//ConfirmSignUpScreen.js
import React, {useState} from 'react';
import {View, TextInput, Button, Alert} from 'react-native';
import {confirmUser, resendConfirmationCode} from '../services/authServices';
import styles from '../styles/styles'; // Import common styles

const ConfirmSignUpScreen = ({route, navigation}) => {
  const {username} = route.params;
  const [code, setCode] = useState('');

  const handleConfirmSignUp = async () => {
    try {
      await confirmUser(username, code);
      Alert.alert('Success', 'Your account has been verified!');
      navigation.navigate('Sign In Screen'); // Navigate to the sign-in screen after verification
    } catch (error) {
      Alert.alert('Verification Error', error.message);
    }
  };

  const handleResendCode = async () => {
    try {
      await resendConfirmationCode(username);
      Alert.alert(
        'Resend Successful',
        'A new verification code has been sent to your email.',
      );
    } catch (error) {
      Alert.alert('Resend Failed', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        value={code}
        onChangeText={setCode}
        placeholder="Verification Code"
        style={styles.input}
        keyboardType="number-pad"
      />
      <View style={styles.buttonContainer}>
        <Button title="Verify Account" onPress={handleConfirmSignUp} />
        <Button
          title="Resend Code"
          onPress={handleResendCode}
          color="#007BFF"
        />
      </View>
    </View>
  );
};

export default ConfirmSignUpScreen;

// import React, {useState} from 'react';
// import {View, TextInput, Button, StyleSheet, Alert} from 'react-native';
// import {confirmUser, resendConfirmationCode} from '../services/authServices';

// const ConfirmSignUpScreen = ({route, navigation}) => {
//   const {username} = route.params;
//   const [code, setCode] = useState('');

//   const handleConfirmSignUp = async () => {
//     try {
//       await confirmUser(username, code);
//       Alert.alert('Success', 'Your account has been verified!');
//       navigation.navigate('Sign In Screen'); // Navigate to the sign-in screen after verification
//     } catch (error) {
//       Alert.alert('Verification Error', error.message);
//     }
//   };

//   const handleResendCode = async () => {
//     try {
//       await resendConfirmationCode(username);
//       Alert.alert(
//         'Resend Successful',
//         'A new verification code has been sent to your email.',
//       );
//     } catch (error) {
//       Alert.alert('Resend Failed', error.message);
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <TextInput
//         value={code}
//         onChangeText={setCode}
//         placeholder="Verification Code"
//         style={styles.input}
//         keyboardType="number-pad"
//       />
//       <Button title="Verify Account" onPress={handleConfirmSignUp} />
//       {/* Ensure that props are correctly used */}
//       <Button title="Resend Code" onPress={handleResendCode} color="#007BFF" />
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     padding: 20,
//   },
//   input: {
//     marginBottom: 12,
//     borderWidth: 1,
//     borderColor: '#ddd',
//     borderRadius: 5,
//     padding: 10,
//   },
// });

// export default ConfirmSignUpScreen;
