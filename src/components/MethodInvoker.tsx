import React, { useState } from 'react';
import { Method } from '../types';

interface MethodInvokerProps {
  method: Method;
  authToken: string | null;
}

const MethodInvoker: React.FC<MethodInvokerProps> = ({ method, authToken }) => {
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleInvoke = async () => {
    if (!authToken) {
      setError('Please sign in to invoke the method');
      return;
    }

    setError(null);
    setResult(null);

    try {
      // Here you would typically make an API call to invoke the method
      // For this example, we'll just log the token and method details
      console.log('Invoking method:', method.name);
      console.log('Auth Token:', authToken);

      // Simulated API response
      const mockResponse = {
        status: 'success',
        method: method.name,
        message: 'Method invoked successfully',
        timestamp: new Date().toISOString(),
      };

      setResult(JSON.stringify(mockResponse, null, 2));
    } catch (error) {
      console.error('Error invoking method:', error);
      setError('Error invoking method. Please try again.');
    }
  };

  return (
    <div className="px-4 py-5 sm:p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">{method.name}</h3>
      <p className="text-sm text-gray-500 mb-4">{method.description}</p>
      <button
        onClick={handleInvoke}
        disabled={!authToken}
        className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white ${
          authToken ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-400 cursor-not-allowed'
        } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
      >
        Invoke Method
      </button>
      {error && (
        <div className="mt-4 text-red-600 text-sm">{error}</div>
      )}
      {result && (
        <div className="mt-4">
          <h4 className="text-md font-medium text-gray-900 mb-2">Result:</h4>
          <pre className="bg-gray-100 p-4 rounded-md overflow-x-auto">
            <code>{result}</code>
          </pre>
        </div>
      )}
    </div>
  );
};

export default MethodInvoker;