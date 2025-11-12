# Define variables
$STACK_NAME = "HTF25-GoPowerRanger"
$MY_REGION = "eu-central-1"
$MY_DEV_BUCKET = "htf25-cfn-bucket"

# AWS_PROFILE is typically set as an environment variable or via the AWS CLI configuration
# For consistency with the bash script, we'll define it, but `aws` and `sam` commands
# will usually pick it up from the environment or default config.
# If you need to explicitly pass it, you would add `--profile $AWS_PROFILE` to the commands.
$AWS_PROFILE = "default"

# Package the CloudFormation template
# Note: 'template' in the original bash script is often an alias for '--template-file'
# We use the explicit '--template-file' for clarity in PowerShell.
aws cloudformation package `
    --template-file "./cfn-students.yaml" `
    --s3-bucket $MY_DEV_BUCKET `
    --output-template-file "./cfn-students-export.yaml" `
    # If you need to specify the profile explicitly: --profile $AWS_PROFILE

# Deploy the packaged template using AWS SAM CLI
sam deploy `
    --template-file "./cfn-students-export.yaml" `
    --stack-name $STACK_NAME `
    --capabilities CAPABILITY_NAMED_IAM `
    --region $MY_REGION `
    # If you need to specify the profile explicitly: --profile $AWS_PROFILE
