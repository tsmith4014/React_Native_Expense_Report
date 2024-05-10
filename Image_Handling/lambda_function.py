import json
import base64
import boto3
from botocore.exceptions import ClientError

# Initialize S3 client
s3_client = boto3.client('s3')

def lambda_handler(event, context):
    try:
        # Parse incoming event data
        body = json.loads(event['body'])
        image_data = body['imageData']
        user_id = body['userId']
        file_name = body['fileName']
        
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
            ACL='public-read'          # Ensure ACL is consistent
        )

        # Generate a pre-signed URL for the uploaded image
        presigned_url = s3_client.generate_presigned_url(
            'get_object',
            Params={'Bucket': bucket_name, 'Key': object_name},
            ExpiresIn=3600  # URL expiration time in seconds
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


