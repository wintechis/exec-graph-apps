import { Explorer } from '@exec-graph/explorer';
import { StrictMode } from 'react';
import * as ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import App from './app/app';
import About from './app/routes/about';
import FAQ from './app/routes/faq';
import Start from './app/routes/start';
import { environment } from './environments/environment';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <StrictMode>
    <BrowserRouter basename={environment.basepath}>
      <Routes>
        <Route path="/" element={<App />}>
          <Route path="/" element={<Start />} />
          <Route path="explore" element={<Explorer sparqlEndpoint={environment.sparqlEndpoint} />} />
          <Route path="about" element={<About />} />
          <Route path="faq" element={<FAQ />} />
          <Route
            path="*"
            element={
              <main style={{ padding: '1rem' }}>
                <p>Page not found</p>
              </main>
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
