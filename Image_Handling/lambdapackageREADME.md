mkdir package
rm -rf package/
mkdir package
cd package/
pip freeze > requirements.txt
cat requirements.txt
cd package/
pip install -r ../requirements.txt -t .
zip -r ../lambda_package.zip .
aws lambda update-function-code --function-name ImageUploadLambda --zip-file fileb://../lambda_package.zip
