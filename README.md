# SSM Secrets Action

Github Action to retrieve secrets from AWS SSM Parameters and make them available to steps in the workflow as environment variables
## Inputs

- `aws-access-key-id` / `aws-secret-key`: AWS Credentials with read permission on the parameters
- `parameters`: comma separated list of parameter names to read
## Outputs
None

## Example usage
```
uses: bx-looop/ssm-secrets@v1.0.3
with:
  aws-access-key-id: {{secrets.SECRETS_ACCESS_KEY_ID}}
  aws-secret-key: {{secrets.SECRETS_SECRET_KEY}}
  parameters: /secrets/my-secret,/secrets/apps/my-app-secret
```

The SSM Parameter are expected to hold JSON strings. These will be parsed and each key output as a environment variable.

If `/secrets/my-secret` contains the JSON `{"token":"1234", "id":"abc"}` the following environment variables will be set:
- `MY_SECRET_TOKEN=1234`
- `MY_SECRET_ID=abc`