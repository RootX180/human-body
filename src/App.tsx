import { ProgressProvider } from './contexts/ProgressContext';
import { AnatomyProvider } from './contexts/AnatomyContext';
import { LayerProvider } from './contexts/LayerContext';
import { AnatomyViewer } from './components/anatomy/AnatomyViewer';

function App() {
  return (
    <ProgressProvider>
      <AnatomyProvider>
        <LayerProvider>
          <AnatomyViewer />
        </LayerProvider>
      </AnatomyProvider>
    </ProgressProvider>
  );
}

export default App;
