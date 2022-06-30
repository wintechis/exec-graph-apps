import { lazy, StrictMode } from 'react';
import * as ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import App from './app/app';
import Overview from './app/routes/overview';
import { environment } from './environments/environment';

const Explorer = lazy(() =>
  // react only supports default imports, so correct the import:
  import('@exec-graph/explorer').then((lib) => ({ default: lib.Explorer }))
);
const About = lazy(() => import('./app/routes/about'));
const FAQ = lazy(() => import('./app/routes/faq'));

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <StrictMode>
    <BrowserRouter basename={environment.basepath}>
      <Routes>
        <Route path="/" element={<App />}>
          <Route
            path="/"
            element={<Overview sparqlEndpoint={environment.sparqlEndpoint} />}
          />
          <Route
            path="explore"
            element={<Explorer sparqlEndpoint={environment.sparqlEndpoint} />}
          />
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
