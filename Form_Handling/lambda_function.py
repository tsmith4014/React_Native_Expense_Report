#working lambda function, uses same auth as the non-working component
import json
import boto3
from botocore.client import Config
from populate_excel import populate_template

def lambda_handler(event, context):
    # Check if the incoming event has a 'body' attribute
    if 'body' in event:
        # Parse the stringified body to JSON
        body = json.loads(event['body'])
    else:
        # Use the event directly if it's already the expected JSON structure (useful for direct Lambda testing)
        body = event

    # Extract data with fallbacks
    data = {
        'school': body.get('school', 'Default School'),
        'period_ending': body.get('periodEnding', '2022-01-01'),
        'trip_purpose': body.get('tripPurpose', 'Default Purpose'),
        'travel': body.get('travel', 'Default Travel'),
        'travel_start_date': body.get('travelStartDate', '2022-01-01'),
        'travel_end_date': body.get('travelEndDate', '2022-01-02'),
        'employee_department': body.get('employeeDepartment', 'Default Department')
    }

    # Populate the template and generate output path
    template_path = 'expense_report.xlsx'
    output_path = '/tmp/output.xlsx'  # Lambda has write access to the /tmp directory
    output_path = populate_template(data, template_path, output_path)

    # Upload the file to S3
    bucket_name = 'expensereport-bucket'  # Your S3 bucket name
    s3_file_name = 'output.xlsx'
    s3 = boto3.client('s3', config=Config(signature_version='s3v4'))
    s3.upload_file(output_path, bucket_name, s3_file_name)

    # Generate a presigned URL for the uploaded file
    presigned_url = s3.generate_presigned_url('get_object',
                                              Params={'Bucket': bucket_name, 'Key': s3_file_name},
                                              ExpiresIn=3600)

    return {
        'statusCode': 200,
        'body': json.dumps(f'File successfully processed. Download link: {presigned_url}'),
        'headers': {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json'
        }
    }
