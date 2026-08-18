import React, { useState } from 'react';
import { X, Key, ExternalLink } from 'lucide-react';
import { getApiKey, setApiKey, clearApiKey } from '../services/apiKey';

interface SettingsModalProps {
  onClose: () => void;
  onSaved: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ onClose, onSaved }) => {
  const [key, setKey] = useState(getApiKey());

  const handleSave = () => {
    if (key.trim()) {
      setApiKey(key.trim());
    } else {
      clearApiKey();
    }
    onSaved();
    onClose();
  };

  const handleClear = () => {
    clearApiKey();
    setKey('');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <Key className="w-5 h-5 text-blue-600 mr-2" />
            <h2 className="text-lg font-semibold text-gray-900">Google Places API Key</h2>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-sm text-gray-500 mb-4">
          Your key is stored only in this browser's local storage and sent directly to Google's
          API on each search. It is never sent to any other server.
        </p>

        <input
          type="password"
          value={key}
          onChange={(e) => setKey(e.target.value)}
          placeholder="Paste your API key here"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-2"
          autoFocus
        />

        <a
          href="https://console.cloud.google.com/google/maps-apis/credentials"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center text-sm text-blue-600 hover:underline mb-6"
        >
          Get a key from Google Cloud Console
          <ExternalLink className="w-3.5 h-3.5 ml-1" />
        </a>

        <div className="flex justify-between">
          <button
            onClick={handleClear}
            className="px-4 py-2 text-sm text-red-600 hover:text-red-700 font-medium"
          >
            Clear Key
          </button>
          <div className="space-x-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 font-medium"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
