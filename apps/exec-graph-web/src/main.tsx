import { StrictMode } from 'react';
import * as ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import App from './app/app';
import About from './app/routes/about';
import Explore from './app/routes/explore';
import FAQ from './app/routes/faq';
import Overview from './app/routes/overview';
import { environment } from './environments/environment';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <StrictMode>
    <BrowserRouter basename={environment.basepath}>
      <Routes>
        <Route path="/" element={<App />}>
          <Route path="/" element={<Overview />} />
          <Route path="explore" element={<Explore />} />
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
