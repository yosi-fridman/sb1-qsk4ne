import axios from 'axios';
import YAML from 'yaml';
import fs from 'fs/promises';
import { DiscoveryDocument } from './types/discovery.js';
import { OpenAPIDocument } from './types/openapi.js';
import { transformSchema } from './transformers/schema.js';
import { transformMethod } from './transformers/method.js';

const GMAIL_DISCOVERY_URL = 'https://gmail.googleapis.com/$discovery/rest?version=v1';

async function fetchDiscoveryDocument(): Promise<DiscoveryDocument> {
  const response = await axios.get<DiscoveryDocument>(GMAIL_DISCOVERY_URL);
  return response.data;
}

function transformToOpenAPI(discoveryDoc: DiscoveryDocument): OpenAPIDocument {
  const openapi: OpenAPIDocument = {
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
              authorizationUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
              tokenUrl: 'https://oauth2.googleapis.com/token',
              scopes: Object.entries(discoveryDoc.auth.oauth2.scopes).reduce(
                (acc, [scope, { description }]) => ({
                  ...acc,
                  [scope]: description
                }),
                {}
              )
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
  function processResources(resources: Record<string, any>, prefix = '') {
    for (const [resourceName, resource] of Object.entries(resources)) {
      const fullResourceName = prefix ? `${prefix}.${resourceName}` : resourceName;
      
      if (resource.methods) {
        for (const method of Object.values(resource.methods)) {
          transformMethod(method, fullResourceName, openapi.paths);
        }
      }
      
      if (resource.resources) {
        processResources(resource.resources, fullResourceName);
      }
    }
  }

  processResources(discoveryDoc.resources);

  return openapi;
}

async function main() {
  try {
    console.log('Fetching Gmail API Discovery document...');
    const discoveryDoc = await fetchDiscoveryDocument();
    
    console.log('Transforming to OpenAPI format...');
    const openApiDoc = transformToOpenAPI(discoveryDoc);
    
    console.log('Writing OpenAPI documents...');
    await fs.mkdir('output', { recursive: true });
    
    // Save as JSON
    await fs.writeFile(
      'output/gmail-openapi.json',
      JSON.stringify(openApiDoc, null, 2)
    );
    
    // Save as YAML
    await fs.writeFile(
      'output/gmail-openapi.yaml',
      YAML.stringify(openApiDoc)
    );
    
    console.log('Transformation complete! Check the output directory for the OpenAPI documents.');
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

main();