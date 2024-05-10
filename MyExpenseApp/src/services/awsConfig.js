// awsConfig.js
import {CognitoIdentityServiceProvider} from 'aws-sdk';
import Config from 'react-native-config';

export const cognito = new CognitoIdentityServiceProvider({
  region: Config.AWS_REGION,
});

export const poolData = {
  UserPoolId: Config.USER_POOL_ID,
  ClientId: Config.CLIENT_ID,
};
