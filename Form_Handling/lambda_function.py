import json
import boto3
from botocore.client import Config
from datetime import datetime, timedelta
from populate_excel import populate_template

s3_client = boto3.client('s3')

def lambda_handler(event, context):
    try:
        # Parse incoming event data
        body = json.loads(event['body'])
        cognito_user_id = event['requestContext']['authorizer']['claims']['sub']  # Use Cognito user ID
        period_ending = body['periodEnding']  # YYYY-MM-DD format
        
        # Extract other form data
        employee_department = body.get('employeeDepartment', 'Default Department')
        school = body.get('school', 'Default School')
        trip_purpose = body.get('tripPurpose', 'Default Purpose')
        travel = body.get('travel', 'No')
        travel_start_date = body.get('travelStartDate', '2022-01-01')
        travel_end_date = body.get('travelEndDate', '2022-01-02')

        # Calculate the start date of the reporting period
        period_ending_date = datetime.strptime(period_ending, '%Y-%m-%d')
        period_start_date = period_ending_date - timedelta(days=6)

        # Query S3 to get files for the user within the date range
        bucket_name = "expensereport-bucket"
        prefix = f"{cognito_user_id}/"
        
        response = s3_client.list_objects_v2(Bucket=bucket_name, Prefix=prefix)
        if 'Contents' not in response:
            return {
                'statusCode': 404,
                'body': json.dumps('No files found for the user in the specified date range.'),
                'headers': {
                    'Access-Control-Allow-Origin': '*',
                    'Content-Type': 'application/json'
                }
            }
        
        files_data = []
        for obj in response['Contents']:
            key = obj['Key']
            obj_metadata = s3_client.head_object(Bucket=bucket_name, Key=key)['Metadata']
            file_date = datetime.strptime(obj_metadata['date'], '%Y-%m-%d').date()
            if period_start_date.date() <= file_date <= period_ending_date.date():
                files_data.append({
                    'date': file_date,
                    'price': float(obj_metadata['price']),
                    'category': obj_metadata['category']
                })

        # Generate and populate the Excel report
        data = {
            'period_ending': period_ending,
            'files_data': files_data,
            'employee_department': employee_department,
            'school': school,
            'trip_purpose': trip_purpose,
            'travel': travel,
            'travel_start_date': travel_start_date,
            'travel_end_date': travel_end_date
        }
        
        template_path = '/mnt/data/expense_report.xlsx'  # Use the uploaded template path
        output_path = '/tmp/output.xlsx'
        output_path = populate_template(data, template_path, output_path)

        # Upload the file to S3
        s3_file_name = f"{cognito_user_id}/expense_report_{period_ending}.xlsx"
        s3_client.upload_file(output_path, bucket_name, s3_file_name)

        # Generate a presigned URL for the uploaded file
        presigned_url = s3_client.generate_presigned_url('get_object',
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

    except Exception as e:
        return {
            'statusCode': 500,
            'body': json.dumps(f'Internal server error: {str(e)}'),
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json'
            }
        }



#     # Extract data with fallbacks
#     data = {
#         'school': body.get('school', 'Default School'),
#         'period_ending': body.get('periodEnding', '2022-01-01'),
#         'trip_purpose': body.get('tripPurpose', 'Default Purpose'),
#         'travel': body.get('travel', 'Default Travel'),
#         'travel_start_date': body.get('travelStartDate', '2022-01-01'),
#         'travel_end_date': body.get('travelEndDate', '2022-01-02'),
#         'employee_department': body.get('employeeDepartment', 'Default Department')
#     }

#     # Populate the template and generate output path
#     template_path = 'expense_report.xlsx'
#     output_path = '/tmp/output.xlsx'  # Lambda has write access to the /tmp directory
#     output_path = populate_template(data, template_path, output_path)

#     # Upload the file to S3
#     bucket_name = 'expensereport-bucket'  # Your S3 bucket name
#     s3_file_name = 'output.xlsx'
#     s3 = boto3.client('s3', config=Config(signature_version='s3v4'))
#     s3.upload_file(output_path, bucket_name, s3_file_name)

#     # Generate a presigned URL for the uploaded file
#     presigned_url = s3.generate_presigned_url('get_object',
#                                               Params={'Bucket': bucket_name, 'Key': s3_file_name},
#                                               ExpiresIn=3600)

#     return {
#         'statusCode': 200,
#         'body': json.dumps(f'File successfully processed. Download link: {presigned_url}'),
#         'headers': {
#             'Access-Control-Allow-Origin': '*',
#             'Content-Type': 'application/json'
#         }
#     }
