// // SignInScreen.js
import React, {useState, useContext} from 'react';
import {View, TextInput, Button, Alert} from 'react-native';
import {signIn} from '../services/authServices';
import AuthContext from '../services/AuthContext';
import styles from '../styles/styles'; // Import common styles

const SignInScreen = ({navigation}) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const {setToken} = useContext(AuthContext);

  const handleSignIn = async () => {
    try {
      const session = await signIn(username, password);
      const token = session.AuthenticationResult.IdToken;
      setToken(token);
      navigation.navigate('Home');
    } catch (error) {
      Alert.alert('Sign In Error', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        value={username}
        onChangeText={setUsername}
        placeholder="Username"
        style={styles.input}
      />
      <TextInput
        value={password}
        onChangeText={setPassword}
        placeholder="Password"
        secureTextEntry
        style={styles.input}
      />
      <Button title="Sign In" onPress={handleSignIn} />
    </View>
  );
};

export default SignInScreen;

//css above has been pulled into styles.css
// import React, {useState, useContext} from 'react';
// import {View, TextInput, Button, StyleSheet, Alert} from 'react-native';
// import {signIn} from '../services/authServices'; // Ensure signIn is correctly returning the session
// import AuthContext from '../services/AuthContext'; // Import the AuthContext

// /**
//  * Sign in screen component.
//  *
//  * @param {object} navigation - The navigation object.
//  * @returns {JSX.Element} The sign in screen component.
//  */
// const SignInScreen = ({navigation}) => {
//   const [username, setUsername] = useState('');
//   const [password, setPassword] = useState('');
//   const {setToken} = useContext(AuthContext); // Use the setToken function from context

//   const handleSignIn = async () => {
//     try {
//       const session = await signIn(username, password);
//       const token = session.AuthenticationResult.IdToken; // Obtain the token
//       console.log('This is the Cognito Token:', token);
//       setToken(token); // Save the token in context
//       navigation.navigate('Home'); // No need to pass the token as a parameter
//     } catch (error) {
//       Alert.alert('Sign In Error', error.message);
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <TextInput
//         value={username}
//         onChangeText={setUsername}
//         placeholder="Username"
//         style={styles.input}
//       />
//       <TextInput
//         value={password}
//         onChangeText={setPassword}
//         placeholder="Password"
//         secureTextEntry
//         style={styles.input}
//       />
//       <Button title="Sign In" onPress={handleSignIn} />
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

// export default SignInScreen;
