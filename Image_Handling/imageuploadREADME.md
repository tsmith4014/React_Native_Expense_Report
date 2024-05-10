# Project: Image Upload to AWS S3 via Lambda and React Native

This README provides a comprehensive guide to set up an image upload functionality using AWS Lambda and React Native. This includes all code snippets, configurations, and AWS CLI commands necessary to achieve the functionality.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [AWS S3 Bucket Setup](#aws-s3-bucket-setup)
3. [AWS Lambda Function](#aws-lambda-function)
4. [React Native Frontend](#react-native-frontend)
5. [Testing and Validation](#testing-and-validation)
6. [Troubleshooting](#troubleshooting)

### Prerequisites

- AWS Account
- Node.js and npm installed
- React Native development environment set up
- AWS CLI configured with appropriate permissions

### AWS S3 Bucket Setup

1. **Create an S3 Bucket**

   ```bash
   aws s3api create-bucket --bucket expensereport-bucket --region us-east-1 --create-bucket-configuration LocationConstraint=us-east-1
   ```

2. **Enable ACLs on the Bucket**

   ```bash
   aws s3api put-bucket-acl --bucket expensereport-bucket --acl public-read
   ```

3. **Configure Bucket Policy**

   Create a `bucket-policy.json` file with the following content:

   ```json
   {
     "Version": "2012-10-17",
     "Statement": [
       {
         "Sid": "PublicReadGetObject",
         "Effect": "Allow",
         "Principal": "*",
         "Action": "s3:GetObject",
         "Resource": "arn:aws:s3:::expensereport-bucket/*"
       }
     ]
   }
   ```

   Apply the policy:

   ```bash
   aws s3api put-bucket-policy --bucket expensereport-bucket --policy file://bucket-policy.json
   ```

### AWS Lambda Function

1. **Create Lambda Function**

   Create a file named `lambda_function.py`:

   ```python
   import json
   import boto3
   import logging
   from botocore.exceptions import ClientError

   s3_client = boto3.client('s3')

   logger = logging.getLogger()
   logger.setLevel(logging.INFO)

   def lambda_handler(event, context):
       try:
           query_params = event.get('queryStringParameters', {})
           user_id = query_params.get('userId')
           file_name = query_params.get('fileName')

           if not user_id or not file_name:
               raise ValueError("Missing userId or fileName")

           bucket_name = "expensereport-bucket"
           object_name = f"{user_id}/{file_name}"

           presigned_url = s3_client.generate_presigned_url(
               'put_object',
               Params={
                   'Bucket': bucket_name,
                   'Key': object_name,
                   'ContentType': 'image/jpeg',
                   'ACL': 'public-read'
               },
               ExpiresIn=3600
           )

           response = {
               'statusCode': 200,
               'body': json.dumps({
                   'url': presigned_url,
                   'bucket': bucket_name,
                   'key': object_name
               })
           }

       except ClientError as e:
           logger.error(f"Client error: {e}")
           response = {
               'statusCode': 500,
               'body': json.dumps({
                   'message': f'Failed to generate pre-signed URL: {str(e)}'
               })
           }
       except Exception as e:
           logger.error(f"Error processing request: {str(e)}")
           response = {
               'statusCode': 500,
               'body': json.dumps({
                   'message': f'Internal server error: {str(e)}'
               })
           }

       return response
   ```

2. **Deploy Lambda Function**

   ```bash
   aws lambda create-function \
     --function-name GeneratePresignedUrl \
     --runtime python3.8 \
     --role arn:aws:iam::YOUR_ACCOUNT_ID:role/YourLambdaExecutionRole \
     --handler lambda_function.lambda_handler \
     --zip-file fileb://function.zip
   ```

3. **Configure API Gateway**

   ```bash
   aws apigateway create-rest-api --name "ImageUploadAPI"
   ```

### React Native Frontend

1. **Install Dependencies**

   ```bash
   npm install react-native-image-picker react-native-config
   ```

2. **Create React Native Component**

   Create `ReceiptUploadScreen.js`:

   ```javascript
   import React, { useContext } from "react";
   import { View, Button, StyleSheet, Alert } from "react-native";
   import { launchCamera, launchImageLibrary } from "react-native-image-picker";
   import Config from "react-native-config";
   import AuthContext from "../services/AuthContext";

   const ReceiptUploadScreen = () => {
     const { token } = useContext(AuthContext);

     const handleTakePhoto = () => {
       const options = {
         saveToPhotos: true,
         mediaType: "photo",
       };
       launchCamera(options, (response) => {
         if (response.didCancel) {
           console.log("User cancelled image picker");
         } else if (response.errorCode) {
           console.log("ImagePicker Error:", response.errorCode);
         } else {
           uploadImage(response.assets[0]);
         }
       });
     };

     const handleSelectPhoto = () => {
       const options = {
         mediaType: "photo",
       };
       launchImageLibrary(options, (response) => {
         if (response.didCancel) {
           console.log("User cancelled image picker");
         } else if (response.errorCode) {
           console.log("ImagePicker Error:", response.errorCode);
         } else {
           uploadImage(response.assets[0]);
         }
       });
     };

     const getPresignedUrl = async (fileName) => {
       try {
         const response = await fetch(
           `${Config.IMAGE_UPLOAD_ENDPOINT}?userId=chad&fileName=${fileName}`,
           {
             method: "GET",
             headers: {
               Authorization: `Bearer ${token}`,
             },
           }
         );
         if (!response.ok) {
           throw new Error(
             `Failed to get pre-signed URL: ${response.statusText}`
           );
         }
         const data = await response.json();
         console.log("Pre-signed URL data:", data);
         return data;
       } catch (error) {
         console.error("Error fetching pre-signed URL:", error);
         throw error;
       }
     };

     const uploadImage = async (imageData) => {
       try {
         if (
           !imageData ||
           !imageData.fileName ||
           !imageData.uri ||
           !imageData.type
         ) {
           Alert.alert("Upload Failed", "Image data is incomplete.");
           return;
         }

         const fileName = imageData.fileName;
         const { url, bucket, key } = await getPresignedUrl(fileName);

         const blob = await fetch(imageData.uri).then((r) => r.blob());

         const xhr = new XMLHttpRequest();
         xhr.open("PUT", url, true);
         xhr.setRequestHeader("Content-Type", imageData.type);
         xhr.setRequestHeader("x-amz-acl", "public-read");

         xhr.onreadystatechange = () => {
           if (xhr.readyState === 4) {
             if (xhr.status === 200) {
               Alert.alert(
                 "Upload Successful",
                 `File uploaded to ${bucket}/${key}`
               );
             } else {
               console.error("Failed to upload image", xhr.responseText);
               Alert.alert(
                 "Upload Failed",
                 `Failed to upload image: ${xhr.responseText}`
               );
             }
           }
         };

         xhr.send(blob);
       } catch (error) {
         console.error("Upload error:", error);
         Alert.alert("Upload Failed", error.message);
       }
     };

     return (
       <View style={styles.container}>
         <Button title="Take Photo" onPress={handleTakePhoto} />
         <Button
           title="Select Photo from Gallery"
           onPress={handleSelectPhoto}
         />
       </View>
     );
   };

   const styles = StyleSheet.create({
     container: {
       flex: 1,
       justifyContent: "center",
       alignItems: "center",
       padding: 20,
     },
   });

   export default ReceiptUploadScreen;
   ```

3. **Configure Environment Variables**

   Create a `.env` file:

   ```
   IMAGE_UPLOAD_ENDPOINT=https://your-api-id.execute-api.region.amazonaws.com/your-stage/your-resource
   ```

### Testing and Validation

1. **Run React Native App**

   ```bash
   npx react-native run-android
   npx react-native run-ios
   ```

2. **Test Image Upload**

   - Open the app on your device/emulator.
   - Use the "Take Photo" or "Select Photo from Gallery" buttons to upload an image.
   - Verify the image is uploaded to the S3 bucket.

### Troubleshooting

1. **Common Errors**

   - **SignatureDoesNotMatch**: Ensure the `ContentType` and `ACL` match between the Lambda function and the React Native frontend.
   - **Access Denied**: Ensure the Lambda function has appropriate IAM roles and policies.

2. **Logs and Debugging**

   - **Lambda Logs**: Use CloudWatch to view logs.
   - **React Native Debugging**: Use `console.log` and debugger statements to troubleshoot issues.

### Conclusion

This guide provides all the necessary steps to set up an image upload functionality using AWS Lambda and React Native, including comprehensive AWS CLI commands, code snippets, and configuration details

--
