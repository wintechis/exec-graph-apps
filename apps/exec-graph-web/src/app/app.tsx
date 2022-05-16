// eslint-disable-next-line @typescript-eslint/no-unused-vars
import styles from './app.module.scss';
import '@react-sigma/core/lib/react-sigma.min.css';
import TestGraphIterative from './components/TestGraph';
import { useState } from 'react';

export function App() {
  const [layoutIterative, changeLayout] = useState(false)

  function ChangeLayout () {
    changeLayout(!layoutIterative);
  }
  
  return (
    <div>
      <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" style={{float: "left"}} onClick={ChangeLayout}>Change Layout</button>
      
      <div className="GraphContainer">
        <TestGraphIterative layoutIterative={layoutIterative}/>
      </div>
    </div>
  );
}

export default App;
