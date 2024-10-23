import { SchemaObject as DiscoverySchema } from '../types/discovery.js';
import { SchemaObject as OpenAPISchema } from '../types/openapi.js';

export function transformSchema(schema: DiscoverySchema): OpenAPISchema {
  const openApiSchema: OpenAPISchema = {
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

  if (schema.enum) {
    openApiSchema.enum = schema.enum;
  }

  if (schema.format) {
    openApiSchema.format = schema.format;
  }

  return openApiSchema;
}