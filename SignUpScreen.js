//SignUpScreen.js
import React, {useState} from 'react';
import {View, TextInput, Button, Alert, Text} from 'react-native';
import {signUp} from '../services/authServices';
import styles from '../styles/styles';

const SignUpScreen = ({navigation}) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [nickname, setNickname] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');

  const handleSignUp = async () => {
    const formattedPhoneNumber = phoneNumber.startsWith('+')
      ? phoneNumber
      : `+1${phoneNumber}`;

    try {
      const result = await signUp(
        username,
        password,
        email,
        nickname,
        formattedPhoneNumber,
      );
      Alert.alert(
        'Success',
        'User registered successfully! Please confirm your email.',
      );
      navigation.navigate('Confirm Sign Up Screen', {username});
    } catch (error) {
      Alert.alert('Sign Up Error', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Username:</Text>
      <TextInput
        value={username}
        onChangeText={setUsername}
        placeholder="Username"
        style={styles.input}
        autoCapitalize="none"
      />
      <Text style={styles.label}>Email:</Text>
      <TextInput
        value={email}
        onChangeText={setEmail}
        placeholder="Email"
        style={styles.input}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <Text style={styles.label}>Nickname:</Text>
      <TextInput
        value={nickname}
        onChangeText={setNickname}
        placeholder="Nickname"
        style={styles.input}
        autoCapitalize="none"
      />
      <Text style={styles.label}>Phone Number:</Text>
      <TextInput
        value={phoneNumber}
        onChangeText={setPhoneNumber}
        placeholder="Phone Number"
        style={styles.input}
        keyboardType="phone-pad"
        autoCapitalize="none"
      />
      <Text style={styles.label}>Password:</Text>
      <TextInput
        value={password}
        onChangeText={setPassword}
        placeholder="Password"
        secureTextEntry
        style={styles.input}
        autoCapitalize="none"
      />
      <Button title="Sign Up" onPress={handleSignUp} />
      <Button
        title="Already have an account? Sign In"
        onPress={() => navigation.navigate('Sign In Screen')}
      />
    </View>
  );
};

export default SignUpScreen;

// import React, {useState} from 'react';
// import {View, TextInput, Button, StyleSheet, Alert} from 'react-native';
// import {signUp} from '../services/authServices';

// const SignUpScreen = ({navigation}) => {
//   const [username, setUsername] = useState('');
//   const [password, setPassword] = useState('');
//   const [email, setEmail] = useState('');
//   const [nickname, setNickname] = useState('');
//   const [phoneNumber, setPhoneNumber] = useState('');

//   const handleSignUp = async () => {
//     // Automatically add the +1 for US numbers if not already included
//     const formattedPhoneNumber = phoneNumber.startsWith('+')
//       ? phoneNumber
//       : `+1${phoneNumber}`;

//     try {
//       const result = await signUp(
//         username,
//         password,
//         email,
//         nickname,
//         formattedPhoneNumber,
//       );
//       Alert.alert(
//         'Success',
//         'User registered successfully! Please confirm your email.',
//       );
//       console.log('SignUp success:', result);
//       navigation.navigate('Confirm Sign Up Screen', {username});
//     } catch (error) {
//       Alert.alert('Sign Up Error', error.message);
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <TextInput
//         value={username}
//         onChangeText={setUsername}
//         placeholder="Username"
//         style={styles.input}
//         autoCapitalize="none" // Disable automatic capitalization
//       />
//       <TextInput
//         value={email}
//         onChangeText={setEmail}
//         placeholder="Email"
//         style={styles.input}
//         keyboardType="email-address" // Use email-address to get the right keyboard
//         autoCapitalize="none" // Disable automatic capitalization
//       />
//       <TextInput
//         value={nickname}
//         onChangeText={setNickname}
//         placeholder="Nickname"
//         style={styles.input}
//         autoCapitalize="none" // Disable automatic capitalization
//       />
//       <TextInput
//         value={phoneNumber}
//         onChangeText={setPhoneNumber}
//         placeholder="Phone Number"
//         style={styles.input}
//         keyboardType="phone-pad" // To facilitate numeric input
//         autoCapitalize="none" // Disable automatic capitalization
//       />
//       <TextInput
//         value={password}
//         onChangeText={setPassword}
//         placeholder="Password"
//         secureTextEntry
//         style={styles.input}
//         autoCapitalize="none" // Disable automatic capitalization
//       />
//       <Button title="Sign Up" onPress={handleSignUp} />

//       <Button
//         title="Already have an account? Sign In"
//         onPress={() => navigation.navigate('Sign In Screen')}
//       />
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

// export default SignUpScreen;
