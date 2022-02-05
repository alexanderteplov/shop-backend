import { APIGatewayTokenAuthorizerEvent, Handler } from 'aws-lambda';

const generatePolicy = (principalId: string, resource: string, effect: string) => ({
  principalId,
  policyDocument: {
    Version: '2012-10-17',
    Statement: [{
      Action: 'execute-api:Invoke',
      Effect: effect,
      Resource: resource,
    }],
  },
});

const basicAuthorizer = (tokenString: string, resource: string) => {
  const token = tokenString.replace(/Basic\s+/, '');
  const tokenCredentials = Buffer.from(token, 'base64').toString('ascii');
  const [user, password] = tokenCredentials.split(':');
  const apiCredentials = JSON.parse(process.env.credentials);
  const accessDenied = !apiCredentials[user] || apiCredentials[user] !== password;
  const effect = accessDenied ? 'Deny' : 'Allow';
  return generatePolicy(token, resource, effect);
}

const handler: Handler<APIGatewayTokenAuthorizerEvent> = async (event, _, callback) => {
  try {
    const policy = basicAuthorizer(event.authorizationToken, event.methodArn);
    callback(undefined, policy);
  } catch (error) {
    callback('Unauthorized: ' + error.message);
  }
}

export const main = handler;
