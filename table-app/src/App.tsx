import React, { useState } from 'react';
import Dashboard from './components/dashborad';
import Spreadsheet from './components/table';

function App() {
  const [activeDocumentId, setActiveDocumentId] = useState<string | null>(null);

  if (activeDocumentId) {
    return (
      <Spreadsheet 
        documentId={activeDocumentId} 
        onBackToDashboard={() => setActiveDocumentId(null)} 
      />
    );
  }

  return <Dashboard onSelectDocument={(id) => setActiveDocumentId(id)} />;
}

export default App;