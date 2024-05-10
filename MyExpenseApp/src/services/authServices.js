// authServices.js
import Config from 'react-native-config';
import {cognito} from './awsConfig';

//signUp logic

export const signUp = async (
  username,
  password,
  email,
  nickname,
  phoneNumber,
) => {
  const params = {
    ClientId: Config.CLIENT_ID,
    Username: username,
    Password: password,
    UserAttributes: [
      {
        Name: 'email',
        Value: email,
      },
      {
        Name: 'nickname',
        Value: nickname,
      },
      {
        Name: 'phone_number',
        Value: phoneNumber, // Make sure the phone number format is correct (+[country code][number])
      },
    ],
  };

  try {
    const data = await cognito.signUp(params).promise();
    return data;
  } catch (error) {
    console.error('Sign up failed:', error);
    throw error;
  }
};

//signin logic

export const signIn = async (username, password) => {
  const params = {
    AuthFlow: 'USER_PASSWORD_AUTH',
    ClientId: Config.CLIENT_ID, // Use CLIENT_ID from .env
    AuthParameters: {
      USERNAME: username,
      PASSWORD: password,
    },
  };

  try {
    const session = await cognito.initiateAuth(params).promise();
    return session;
  } catch (error) {
    console.error('Sign in failed: ', error);
    throw error;
  }
};

//confirm user logic

export const confirmUser = async (username, code) => {
  const params = {
    ClientId: Config.CLIENT_ID,
    Username: username,
    ConfirmationCode: code,
  };

  try {
    const data = await cognito.confirmSignUp(params).promise();
    return data; // Returns success message if confirmation is successful
  } catch (error) {
    console.error('User confirmation failed:', error);
    throw error;
  }
};

//resend comfirmation code
export const resendConfirmationCode = async username => {
  const params = {
    ClientId: Config.CLIENT_ID,
    Username: username,
  };

  try {
    const data = await cognito.resendConfirmationCode(params).promise();
    return data;
  } catch (error) {
    console.error('Error resending confirmation code:', error);
    throw error;
  }
};
