import axios from 'axios';
import YAML from 'yaml';
import fs from 'fs/promises';

const GMAIL_DISCOVERY_URL = 'https://gmail.googleapis.com/$discovery/rest?version=v1';

async function fetchDiscoveryDocument() {
  const response = await axios.get(GMAIL_DISCOVERY_URL);
  return response.data;
}

function transformToOpenAPI(discoveryDoc) {
  const openapi = {
    openapi: '3.0.0',
    info: {
      title: discoveryDoc.title,
      description: discoveryDoc.description,
      version: discoveryDoc.version,
      contact: {
        url: discoveryDoc.documentationLink
      }
    },
    servers: [
      {
        url: discoveryDoc.rootUrl + discoveryDoc.servicePath,
        description: 'Production server'
      }
    ],
    paths: {},
    components: {
      schemas: {},
      securitySchemes: {
        OAuth2: {
          type: 'oauth2',
          flows: {
            authorizationCode: {
              authorizationUrl: discoveryDoc.auth.oauth2.authorizationUrl,
              tokenUrl: discoveryDoc.auth.oauth2.tokenUrl,
              scopes: discoveryDoc.auth.oauth2.scopes
            }
          }
        }
      }
    }
  };

  // Transform schemas
  if (discoveryDoc.schemas) {
    for (const [schemaName, schema] of Object.entries(discoveryDoc.schemas)) {
      openapi.components.schemas[schemaName] = transformSchema(schema);
    }
  }

  // Transform methods
  for (const [resourceName, resource] of Object.entries(discoveryDoc.resources)) {
    transformMethods(resource.methods, resourceName, openapi.paths);
  }

  return openapi;
}

function transformSchema(schema) {
  const openApiSchema = {
    type: schema.type,
    description: schema.description
  };

  if (schema.properties) {
    openApiSchema.properties = {};
    for (const [propName, prop] of Object.entries(schema.properties)) {
      openApiSchema.properties[propName] = transformSchema(prop);
    }
  }

  if (schema.$ref) {
    return { $ref: `#/components/schemas/${schema.$ref}` };
  }

  if (schema.items) {
    openApiSchema.items = transformSchema(schema.items);
  }

  return openApiSchema;
}

function transformMethods(methods, resourceName, paths) {
  for (const [methodName, method] of Object.entries(methods)) {
    const path = method.path.replace(/^\/?/, '/');
    
    if (!paths[path]) {
      paths[path] = {};
    }

    const operation = {
      operationId: `${r