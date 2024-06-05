FROM public.ecr.aws/lambda/python:3.12

COPY requirements.txt  .

RUN pip install -r requirements.txt -t .

CMD ["app.lambda_handler"]