import * as core from "@actions/core";
import { SSM } from "aws-sdk";

const substringAfterLast = (value: string, match: string) => {
  return value.split(match).pop()!;
};

const formatEnvironmentVariable = (value: string) => {
  return value
    .toUpperCase()
    .replace(/^([0-9])/, "_$1") // replace leading digits with _{digit}
    .replace(/[^A-Z,0-9]/g, "_"); // replace invalid chars with _
};

const environmentVariableName = (paramName: string) => {
  const name = substringAfterLast(paramName, "/");
  return formatEnvironmentVariable(name);
};

export const TEST = { substringAfterLast, environmentVariableName };

export const run = async () => {
  const accessKeyId = core.getInput("aws-access-key-id");
  const secretAccessKey = core.getInput("aws-secret-key");
  const parameters = core.getInput("parameters").split(",");
  const ssm = new SSM({ credentials: { accessKeyId, secretAccessKey }, region: "eu-west-2" });

  const promises = parameters.map(async (param) => {
    const paramValue = await ssm.getParameter({ Name: param, WithDecryption: true }).promise();
    if (!paramValue.Parameter?.Value) {
      core.setFailed(`Parameter ${param} not found`);
      return;
    }
    const secret = JSON.parse(paramValue.Parameter.Value);
    if (!secret) {
      core.setFailed(`Parameter ${param} invalid format - should be JSON`);
      return;
    }
    const envVarPrefix = environmentVariableName(param);
    Object.keys(secret).forEach((secretKey) => {
      const secretValue = secret[secretKey];
      core.setSecret(secretValue);
      core.exportVariable(`${envVarPrefix}_${formatEnvironmentVariable(secretKey)}`, secret);
    });
  });

  await Promise.all(promises);
};
