export interface API {
  id: string;
  name: string;
  version: string;
  title: string;
  description: string;
  discoveryRestUrl: string;
}

export interface Method {
  id: string;
  name: string;
  description: string;
  httpMethod: string;
  path: string;
}