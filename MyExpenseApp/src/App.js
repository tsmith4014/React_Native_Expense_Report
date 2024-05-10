// // App.js
import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import SignInScreen from './components/SignInScreen';
import FormScreen from './components/FormScreen';
import SignUpScreen from './components/SignUpScreen';
import ConfirmSignUpScreen from './components/ConfirmSignUpScreen';
import ReceiptUploadScreen from './components/ReceiptUploadScreen';
import HomeScreen from './components/HomeScreen';
import {AuthProvider} from './services/AuthContext';

const Stack = createStackNavigator();

const App = () => {
  return (
    <AuthProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Home">
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Sign Up Screen" component={SignUpScreen} />
          <Stack.Screen
            name="Confirm Sign Up Screen"
            component={ConfirmSignUpScreen}
          />
          <Stack.Screen name="Sign In Screen" component={SignInScreen} />
          <Stack.Screen name="Travel Form Screen" component={FormScreen} />
          <Stack.Screen name="Receipt Upload" component={ReceiptUploadScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </AuthProvider>
  );
};

export default App;

/////////////////////////////////////////////////////////

// import React, {useState} from 'react';
// import {View, Text, Button, ActivityIndicator} from 'react-native';
// import {signIn} from './authServices'; // Make sure this path is correct
// import axios from 'axios';

// const App = () => {
//   const [loading, setLoading] = useState(false);
//   const [data, setData] = useState(null);
//   const [error, setError] = useState('');

//   const handleLoginAndFetchData = async () => {
//     setLoading(true);
//     try {
//       const username = 'vega'; // Your Cognito user's username
//       const password = 'Sketchy1!'; // Your Cognito user's password

//       const session = await signIn(username, password);
//       console.log('Sign in successful', session);

//       // Extract the JWT token from the authentication result
//       const token = session.AuthenticationResult.IdToken; // Adjusted to use AccessToken
//       console.log('JWT token: ', token);

//       // Use the JWT token to authorize the API call
//       const response = await axios.post(
//         'https://vkxi444rt3.execute-api.us-east-1.amazonaws.com/dev/expenseReport', // Corrected endpoint
//         {
//           school: 'Test School',
//           periodEnding: '2022-12-31',
//           tripPurpose: 'Test Trip',
//           travel: 'Test Travel',
//           travelStartDate: '2022-01-01',
//           travelEndDate: '2022-01-31',
//           employeeDepartment: 'Test Department',
//         },
//         {headers: {Authorization: `Bearer ${token}`}},
//       );

//       setData(response.data);
//     } catch (error) {
//       console.error('Sign in or data fetch failed', error);
//       setError(error.message || 'An error occurred');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
//       {loading ? (
//         <ActivityIndicator />
//       ) : (
//         <>
//           <Text>{data ? JSON.stringify(data) : 'No data fetched'}</Text>
//           <Button
//             onPress={handleLoginAndFetchData}
//             title="Login and Fetch Data"
//           />
//           {error ? <Text style={{color: 'red'}}>{error}</Text> : null}
//         </>
//       )}
//     </View>
//   );
// };

// export default App;

/////////////////////////////////////#############################################///////////////////////////////

// import React from 'react';
// import {View, Text} from 'react-native';

// const App = () => (
//   <View>
//     <Text>Hello, World! its chad you iphone ios developer yessssss sir</Text>
//   </View>
// );

// export default App;

/////////////////////////////////////#############################################///////////////////////////////

// // Main Application Component
// import React from 'react';
// import {View, Text, Button} from 'react-native';
// import {signIn} from './authServices'; // Updated import path

// const App = () => {
//   const handleLogin = async () => {
//     // Placeholder for actual username and password
//     const username = 'vega';
//     const password = 'Vega4014!';

//     try {
//       await signIn(username, password); // Use actual credentials
//       console.log('Sign in successful');
//       // You can navigate to another screen or update state here upon successful login
//     } catch (error) {
//       console.error('Sign in failed', error);
//     }
//   };

//   return (
//     <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
//       <Text>Welcome to the App</Text>
//       <Button onPress={handleLogin} title="Login" />
//     </View>
//   );
// };
