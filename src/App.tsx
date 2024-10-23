import React, { useState, useEffect } from 'react';
import { Loader2, Search } from 'lucide-react';
import APIList from './components/APIList';
import MethodList from './components/MethodList';
import MethodInvoker from './components/MethodInvoker';
import Auth from './components/Auth';
import { API, Method } from './types';

const DISCOVERY_URL = 'https://discovery.googleapis.com/discovery/v1/apis';

function App() {
  const [apis, setApis] = useState<API[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAPI, setSelectedAPI] = useState<API | null>(null);
  const [selectedMethod, setSelectedMethod] = useState<Method | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [authToken, setAuthToken] = useState<string | null>(null);

  useEffect(() => {
    fetchAPIs();
  }, []);

  const fetchAPIs = async () => {
    try {
      const response = await fetch(`${DISCOVERY_URL}?preferred=true`);
      const data = await response.json();
      setApis(data.items);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching APIs:', error);
      setLoading(false);
    }
  };

  const filteredAPIs = apis.filter((api) =>
    api.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAuthChange = (token: string | null) => {
    setAuthToken(token);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Google API Explorer</h1>
          <Auth onAuthChange={handleAuthChange} />
        </div>
      </header>
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="animate-spin h-8 w-8 text-blue-500" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
              <div className="px-4 py-5 sm:px-6">
                <h2 className="text-lg font-medium text-gray-900">APIs</h2>
                <div className="mt-2 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    className="form-input block w-full pl-10 sm:text-sm sm:leading-5"
                    placeholder="Search APIs"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              <APIList
                apis={filteredAPIs}
                selectedAPI={selectedAPI}
                onSelectAPI={setSelectedAPI}
              />
            </div>
            {selectedAPI && (
              <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                <div className="px-4 py-5 sm:px-6">
                  <h2 className="text-lg font-medium text-gray-900">Methods</h2>
                </div>
                <MethodList
                  api={selectedAPI}
                  selectedMethod={selectedMethod}
                  onSelectMethod={setSelectedMethod}
                />
              </div>
            )}
            {selectedMethod && (
              <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                <div className="px-4 py-5 sm:px-6">
                  <h2 className="text-lg font-medium text-gray-900">Invoke Method</h2>
                </div>
                <MethodInvoker method={selectedMethod} authToken={authToken} />
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

export default App;