// eslint-disable-next-line @typescript-eslint/no-unused-vars
import styles from './app.module.scss';
import '@react-sigma/core/lib/react-sigma.min.css';
import TestGraph from './components/TestGraph';
import { useState } from 'react';

export function App() {
  const [layout, changeLayout] = useState(0);
  const [graphLoaded, setGraphLoaded] = useState(false);

  function ChangeLayout(e: { target: { value: string } }) {
    changeLayout(+e.target.value);
  }

  return (
    <div>
      <div style={{ float: 'left' }}>
        <label>Select Layout: </label>
        <select value={layout} onChange={ChangeLayout}>
          <option value="0">Random</option>
          <option value="1">Circle</option>
          <option value="2">Atlas</option>
        </select>
      </div>
      <div className="GraphContainer">
        <TestGraph
          layout={layout}
          graphLoaded={graphLoaded}
          setGraphLoaded={setGraphLoaded}
        />
      </div>
    </div>
  );
}

export default App;
