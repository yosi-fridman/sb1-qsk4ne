import { MethodObject, ParameterObject as DiscoveryParameter } from '../types/discovery.js';
import { PathItemObject, ParameterObject } from '../types/openapi.js';

export function transformMethod(
  method: MethodObject,
  resourceName: string,
  paths: Record<string, PathItemObject>
): void {
  const path = method.path.replace(/^\/?/, '/');
  
  if (!paths[path]) {
    paths[path] = {};
  }

  const operation = {
    operationId: `${resourceName}.${method.id}`,
    description: method.description,
    parameters: transformParameters(method.parameters),
    responses: {
      '200': {
        description: 'Successful response',
        ...(method.response && {
          content: {
            'application/json': {
              schema: {
                $ref: `#/components/schemas/${method.response.$ref}`
              }
            }
          }
        })
      },
      '400': {
        description: 'Bad Request'
      },
      '401': {
        description: 'Unauthorized'
      }
    },
    security: [{ OAuth2: method.scopes || [] }]
  };

  if (method.request) {
    operation.requestBody = {
      content: {
        'application/json': {
          schema: {
            $ref: `#/components/schemas/${method.request.$ref}`
          }
        }
      },
      required: true
    };
  }

  paths[path][method.httpMethod.toLowerCase()] = operation;
}

function transformParameters(
  parameters?: Record<string, DiscoveryParameter>
): ParameterObject[] {
  if (!parameters) return [];

  return Object.entries(parameters).map(([name, param]) => ({
    name,
    in: param.location === 'query' ? 'query' : 'path',
    description: param.description,
    required: param.location === 'path' ? true : param.required,
    schema: {
      type: param.type,
      default: param.default
    }
  }));
}