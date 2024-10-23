import React from 'react';
import { API } from '../types';

interface APIListProps {
  apis: API[];
  selectedAPI: API | null;
  onSelectAPI: (api: API) => void;
}

const APIList: React.FC<APIListProps> = ({ apis, selectedAPI, onSelectAPI }) => {
  return (
    <ul className="divide-y divide-gray-200">
      {apis.map((api) => (
        <li
          key={api.id}
          className={`px-4 py-4 hover:bg-gray-50 cursor-pointer ${
            selectedAPI?.id === api.id ? 'bg-blue-50' : ''
          }`}
          onClick={() => onSelectAPI(api)}
        >
          <div className="flex items-center space-x-4">
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">{api.name}</p>
              <p className="text-sm text-gray-500 truncate">{api.description}</p>
            </div>
            <div>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                {api.version}
              </span>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
};

export default APIList;