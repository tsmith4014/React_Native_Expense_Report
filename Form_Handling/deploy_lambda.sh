#!/bin/bash

# Define variables
LAYER_NAME="expense_report_layer"
LAMBDA_NAME="expense_report_lambda"
REGION="us-east-1"
PYTHON_VERSION="python3.9"
ZIP_FILE_LAYER="my-layer-package.zip"
ZIP_FILE_FUNCTION="my-lambda-function-package.zip"
DEPENDENCIES_DIR="python"

# Clean up any previous builds
rm -rf $DEPENDENCIES_DIR $ZIP_FILE_LAYER $ZIP_FILE_FUNCTION

# Create dependencies directory
mkdir $DEPENDENCIES_DIR

# Install dependencies
pip install -t $DEPENDENCIES_DIR openpyxl Pillow==8.4.0 boto3 urllib3==1.26.5

# Zip the dependencies
cd $DEPENDENCIES_DIR
zip -r ../$ZIP_FILE_LAYER .
cd ..

# Publish the Lambda layer
LAYER_ARN=$(aws lambda publish-layer-version \
    --layer-name $LAYER_NAME \
    --zip-file fileb://$ZIP_FILE_LAYER \
    --compatible-runtimes $PYTHON_VERSION \
    --region $REGION \
    --query 'LayerVersionArn' --output text)

echo "Layer ARN: $LAYER_ARN"

# Update the Lambda function configuration to use the new layer
aws lambda update-function-configuration \
    --function-name $LAMBDA_NAME \
    --layers $LAYER_ARN \
    --region $REGION

# Zip the Lambda function code
zip $ZIP_FILE_FUNCTION lambda_function.py populate_excel.py eahead.jpg expense_report.xlsx

# Update the Lambda function code
aws lambda update-function-code \
    --function-name $LAMBDA_NAME \
    --zip-file fileb://$ZIP_FILE_FUNCTION \
    --region $REGION

echo "Lambda function $LAMBDA_NAME updated successfully."

