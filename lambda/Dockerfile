FROM public.ecr.aws/lambda/nodejs:18

WORKDIR /var/task

COPY index.js .

RUN npm init -y && npm install --arch=x64 --platform=linux sharp aws-sdk