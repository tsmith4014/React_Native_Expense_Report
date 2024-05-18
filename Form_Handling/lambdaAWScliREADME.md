# README for Creating and Updating AWS Lambda Functions with Dependencies Using Lambda Layers

## Introduction

This guide provides detailed step-by-step instructions to create and update AWS Lambda functions using the command line. It covers how to create a Lambda layer for dependencies, allowing you to manage dependencies separately from your main function code. This approach can improve deployment times and enable code reuse.

## Prerequisites

1. **AWS CLI**: Ensure you have the AWS CLI installed and configured with appropriate permissions.

   ```sh
   pip install awscli
   aws configure
   ```

2. **IAM Role**: Create an IAM role with the necessary permissions for Lambda execution and AWS services access. Note the ARN of this role.

## Creating the Lambda Functions

### Step 1: Prepare Your Deployment Package

1. Create a directory for your package:

   ```sh
   mkdir package
   ```

2. Install the required Python packages into this directory:

   ```sh
   pip install -r requirements.txt -t package/
   ```

3. Copy your application code into the package directory:

   ```sh
   cp -r my_flask_app package/
   ```

4. Change to the package directory and zip the contents:
   ```sh
   cd package
   zip -r ../lambda_package.zip .
   cd ..
   ```

### Step 2: Create the Lambda Functions

1. Use the AWS CLI to create the Lambda functions:

   **ImageUploadLambda**

   ```sh
   aws lambda create-function --function-name ImageUploadLambda --zip-file fileb://lambda_package.zip --handler my_flask_app.lambda_handler --runtime python3.8 --role arn:aws:iam::123456789012:role/lambda-ex
   ```

   **expense_report_lambda**

   ```sh
   aws lambda create-function --function-name expense_report_lambda --zip-file fileb://lambda_package.zip --handler my_flask_app.lambda_handler --runtime python3.8 --role arn:aws:iam::123456789012:role/lambda-ex
   ```

   Replace the placeholders with:

   - `ImageUploadLambda` and `expense_report_lambda`: The names of your Lambda functions.
   - `my_flask_app.lambda_handler`: The module and function handler.
   - `python3.8`: The Python runtime version.
   - `arn:aws:iam::123456789012:role/lambda-ex`: The ARN of your IAM role.

### Step 3: Update the Lambda Function Code

1. Whenever you update your code, create a new zip file and update the function code:

   **ImageUploadLambda**

   ```sh
   cd package
   zip -r ../lambda_package.zip .
   cd ..
   aws lambda update-function-code --function-name ImageUploadLambda --zip-file fileb://lambda_package.zip
   ```

   **expense_report_lambda**

   ```sh
   cd package
   zip -r ../lambda_package.zip .
   cd ..
   aws lambda update-function-code --function-name expense_report_lambda --zip-file fileb://lambda_package.zip
   ```

## Creating a Lambda Layer for Dependencies

### Step 1: Prepare the Layer Package

1. Create a directory for the layer dependencies:

   ```sh
   mkdir imageuploaddependencies
   ```

2. Install the required dependencies into this directory:

   ```sh
   pip install -r requirements.txt -t imageuploaddependencies
   ```

3. Zip the contents of the dependencies directory:

   ```sh
   zip -r imageuploaddependencies-package.zip imageuploaddependencies
   ```

### Step 2: Publish the Lambda Layer

1. Publish the layer using the AWS CLI:

   ```sh
   aws lambda publish-layer-version --layer-name imageupload-dependencies --zip-file fileb://imageuploaddependencies-package.zip --compatible-runtimes python3.8
   ```

### Step 3: Update the Lambda Functions to Use the Layer

1. Get the ARN of the published layer:

   ```sh
   LAYER_ARN=$(aws lambda publish-layer-version --layer-name imageupload-dependencies --zip-file fileb://imageuploaddependencies-package.zip --compatible-runtimes python3.8 --query 'LayerVersionArn' --output text)
   ```

2. Update the Lambda function configurations to include the layer:

   **ImageUploadLambda**

   ```sh
   aws lambda update-function-configuration --function-name ImageUploadLambda --layers $LAYER_ARN
   ```

   **expense_report_lambda**

   ```sh
   aws lambda update-function-configuration --function-name expense_report_lambda --layers $LAYER_ARN
   ```

## Convenience Shell Script

To automate the packaging and deployment process, you can use the following shell script. Save this script as `deploy_lambda.sh` and make it executable.

### deploy_lambda.sh

```sh
#!/bin/bash

# Variables
LAYER_NAME="imageupload-dependencies"
PACKAGE_DIR="package"
LAYER_DIR="imageuploaddependencies"
ZIP_FILE="lambda_package.zip"
LAYER_ZIP_FILE="imageuploaddependencies-package.zip"
IAM_ROLE_ARN="arn:aws:iam::123456789012:role/lambda-ex"
PYTHON_RUNTIME="python3.8"
HANDLER="my_flask_app.lambda_handler"

# Lambda function names
IMAGE_UPLOAD_LAMBDA="ImageUploadLambda"
EXPENSE_REPORT_LAMBDA="expense_report_lambda"

# Create deployment package
echo "Creating deployment package..."
mkdir -p $PACKAGE_DIR
pip install -r requirements.txt -t $PACKAGE_DIR/
cp -r my_flask_app $PACKAGE_DIR/
cd $PACKAGE_DIR
zip -r ../$ZIP_FILE .
cd ..

# Update Lambda function code
echo "Updating Lambda function code for $IMAGE_UPLOAD_LAMBDA..."
aws lambda update-function-code --function-name $IMAGE_UPLOAD_LAMBDA --zip-file fileb://$ZIP_FILE

echo "Updating Lambda function code for $EXPENSE_REPORT_LAMBDA..."
aws lambda update-function-code --function-name $EXPENSE_REPORT_LAMBDA --zip-file fileb://$ZIP_FILE

# Create layer package
echo "Creating layer package..."
mkdir -p $LAYER_DIR
pip install -r requirements.txt -t $LAYER_DIR/
zip -r $LAYER_ZIP_FILE $LAYER_DIR

# Publish the layer
echo "Publishing the layer..."
LAYER_VERSION_ARN=$(aws lambda publish-layer-version --layer-name $LAYER_NAME --zip-file fileb://$LAYER_ZIP_FILE --compatible-runtimes $PYTHON_RUNTIME --query 'LayerVersionArn' --output text)

# Update Lambda functions to use the layer
echo "Updating $IMAGE_UPLOAD_LAMBDA to use the layer..."
aws lambda update-function-configuration --function-name $IMAGE_UPLOAD_LAMBDA --layers $LAYER_VERSION_ARN

echo "Updating $EXPENSE_REPORT_LAMBDA to use the layer..."
aws lambda update-function-configuration --function-name $EXPENSE_REPORT_LAMBDA --layers $LAYER_VERSION_ARN

echo "Deployment complete."
```

### Usage

1. Make the script executable:

   ```sh
   chmod +x deploy_lambda.sh
   ```

2. Run the script whenever you need to package and deploy your Lambda functions:
   ```sh
   ./deploy_lambda.sh
   ```

## Conclusion

You have now successfully created and updated AWS Lambda functions and managed their dependencies using a Lambda layer. Additionally, you have a shell script to automate the packaging and deployment process, making it more efficient to update your Lambda functions. For more detailed information on Lambda and Lambda layers, refer to the [AWS Lambda Developer Guide](https://docs.aws.amazon.com/lambda/latest/dg/welcome.html).
