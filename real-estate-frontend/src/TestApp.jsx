import React from 'react';
import { createRoot } from 'react-dom/client';

function TestApp() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-blue-600">Test App</h1>
      <p className="mt-2 text-gray-700">If you can see this, React is working!</p>
      <div className="mt-4 p-4 bg-blue-100 text-blue-800 rounded">
        <p>Next steps:</p>
        <ol className="list-decimal list-inside mt-2 space-y-1">
          <li>Check browser console for errors (F12)</li>
          <li>Verify all dependencies are installed</li>
          <li>Check the network tab for failed requests</li>
        </ol>
      </div>
    </div>
  );
}

// Render the app
const container = document.getElementById('root');
const root = createRoot(container);
root.render(
  <React.StrictMode>
    <TestApp />
  </React.StrictMode>
);
