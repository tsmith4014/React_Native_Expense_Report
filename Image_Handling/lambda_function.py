import json
import base64
import boto3
from botocore.exceptions import ClientError


#need to address the following:
#5 gb limit anything over needs to be done in chunks so if 25 gb need to do 5 chunks of 5 gb
#size of image
#size of video
#type of image
#how long the presigned url is valid for
# Initialize S3 client
s3_client = boto3.client('s3')

def lambda_handler(event, context):
    try:
        # Parse incoming event data
        body = json.loads(event['body'])
        image_data = body['imageData']
        user_id = body['userId'] #swtich to cognito user id
        file_name = body['fileName']
        #need to add timestamp logic to capture metadata
        
        # Validate required fields
        if not image_data or not user_id or not file_name:
            raise ValueError("Missing imageData, userId, or fileName")

        # Decode the base64 image data
        image_bytes = base64.b64decode(image_data)

        # Define S3 bucket and object name
        bucket_name = "expensereport-bucket"
        object_name = f"{user_id}/{file_name}"

        # Upload the image to S3
        s3_client.put_object(
            Bucket=bucket_name,
            Key=object_name,
            Body=image_bytes,
            ContentType='image/jpeg',  # Ensure content type matches
            # ACL='public-read'          # Ensure ACL is consistent this was breaking shit....we need to still be able to retreive the s3 content.
        )

        # Generate a pre-signed URL for the uploaded image
        presigned_url = s3_client.generate_presigned_url(
            'get_object',
            Params={'Bucket': bucket_name, 'Key': object_name},
            ExpiresIn=3600  # URL expiration time in seconds or 1 hour
        )

        response = {
            'statusCode': 200,
            'body': json.dumps({
                'message': 'File successfully uploaded',
                'url': presigned_url
            }),
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json'
            }
        }
        
    except ClientError as e:
        response = {
            'statusCode': 500,
            'body': json.dumps({
                'message': f'Failed to upload image: {str(e)}'
            }),
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json'
            }
        }
    except Exception as e:
        response = {
            'statusCode': 500,
            'body': json.dumps({
                'message': f'Internal server error: {str(e)}'
            }),
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json'
            }
        }

    return response


