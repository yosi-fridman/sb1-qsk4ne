export interface DiscoveryDocument {
  kind: string;
  discoveryVersion: string;
  id: string;
  name: string;
  version: string;
  title: string;
  description: string;
  documentationLink: string;
  protocol: string;
  rootUrl: string;
  servicePath: string;
  baseUrl: string;
  auth: {
    oauth2: {
      scopes: Record<string, { description: string }>;
      authorizationUrl: string;
      tokenUrl: string;
    };
  };
  schemas: Record<string, SchemaObject>;
  resources: Record<string, ResourceObject>;
}

export interface SchemaObject {
  id?: string;
  type?: string;
  description?: string;
  properties?: Record<string, SchemaObject>;
  items?: SchemaObject;
  $ref?: string;
  enum?: string[];
  format?: string;
}

export interface ResourceObject {
  methods: Record<string, MethodObject>;
  resources?: Record<string, ResourceObject>;
}

export interface MethodObject {
  id: string;
  path: string;
  httpMethod: string;
  description: string;
  parameters?: Record<string, ParameterObject>;
  parameterOrder?: string[];
  request?: { $ref: string };
  response?: { $ref: string };
  scopes?: string[];
}

export interface ParameterObject {
  type: string;
  description?: string;
  required?: boolean;
  location: string;
  default?: string | number | boolean;
}