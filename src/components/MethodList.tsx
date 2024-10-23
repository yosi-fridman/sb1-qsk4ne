import React, { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { API, Method } from '../types';

interface MethodListProps {
  api: API;
  selectedMethod: Method | null;
  onSelectMethod: (method: Method) => void;
}

const MethodList: React.FC<MethodListProps> = ({ api, selectedMethod, onSelectMethod }) => {
  const [methods, setMethods] = useState<Method[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMethods();
  }, [api]);

  const fetchMethods = async () => {
    try {
      const response = await fetch(api.discoveryRestUrl);
      const data = await response.json();
      const methodList: Method[] = [];
      for (const resource in data.resources) {
        for (const method in data.resources[resource].methods) {
          methodList.push({
            id: `${resource}.${method}`,
            name: method,
            description: data.resources[resource].methods[method].description,
            httpMethod: data.resources[resource].methods[method].httpMethod,
            path: data.resources[resource].methods[method].path,
          });
        }
      }
      setMethods(methodList);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching methods:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="animate-spin h-8 w-8 text-blue-500" />
      </div>
    );
  }

  return (
    <ul className="divide-y divide-gray-200">
      {methods.map((method) => (
        <li
          key={method.id}
          className={`px-4 py-4 hover:bg-gray-50 cursor-pointer ${
            selectedMethod?.id === method.id ? 'bg-blue-50' : ''
          }`}
          onClick={() => onSelectMethod(method)}
        >
          <div className="flex items-center space-x-4">
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">{method.name}</p>
              <p className="text-sm text-gray-500 truncate">{method.description}</p>
            </div>
            <div>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                {method.httpMethod}
              </span>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
};

export default MethodList;