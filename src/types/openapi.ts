export interface OpenAPIDocument {
  openapi: string;
  info: {
    title: string;
    description: string;
    version: string;
    contact?: {
      url?: string;
    };
  };
  servers: Array<{
    url: string;
    description: string;
  }>;
  paths: Record<string, PathItemObject>;
  components: {
    schemas: Record<string, SchemaObject>;
    securitySchemes: {
      OAuth2: {
        type: string;
        flows: {
          authorizationCode: {
            authorizationUrl: string;
            tokenUrl: string;
            scopes: Record<string, string>;
          };
        };
      };
    };
  };
}

export interface PathItemObject {
  [method: string]: OperationObject;
}

export interface OperationObject {
  operationId: string;
  description?: string;
  parameters?: ParameterObject[];
  requestBody?: {
    content: {
      'application/json': {
        schema: SchemaObject;
      };
    };
    required?: boolean;
  };
  responses: {
    [statusCode: string]: {
      description: string;
      content?: {
        'application/json': {
          schema: SchemaObject;
        };
      };
    };
  };
  security?: Array<{ [key: string]: string[] }>;
}

export interface ParameterObject {
  name: string;
  in: string;
  description?: string;
  required?: boolean;
  schema: SchemaObject;
}

export interface SchemaObject {
  type?: string;
  description?: string;
  properties?: Record<string, SchemaObject>;
  items?: SchemaObject;
  $ref?: string;
  enum?: string[];
  format?: string;
}