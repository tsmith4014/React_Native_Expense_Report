// HomeScreen.js
import React, {useContext} from 'react';
import {View, Button} from 'react-native';
import AuthContext from '../services/AuthContext';

const HomeScreen = ({navigation}) => {
  const {token} = useContext(AuthContext);
  console.log(`here is the token ${token}`);
  return (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <Button
        title="Go to Sign Up Screen"
        onPress={() => navigation.navigate('Sign Up Screen')}
      />
      <Button
        title="Go to Confirm Sign Up Screen"
        onPress={() => navigation.navigate('Confirm Sign Up Screen')}
      />
      <Button
        title="Go to Sign In Screen"
        onPress={() => navigation.navigate('Sign In Screen')}
      />
      <Button
        title="Go to Travel Form Screen"
        onPress={() => navigation.navigate('Travel Form Screen')}
      />
      <Button
        title="Go to Receipt Upload"
        onPress={() => navigation.navigate('Receipt Upload')}
      />
    </View>
  );
};

export default HomeScreen;
