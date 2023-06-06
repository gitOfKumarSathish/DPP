import { useState } from 'react';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import './App.css';
import GraphViewer from './pages/Dagger';
import { Checking } from './pages/Test';
import Playground from './Components/AddNode/Playground';
// import DnDFlow from './Components/AddNode/Playground';
import StoreFlow from './Components/Store/StoreFlow';
// import { DnDFlower } from './Components/DragandDrop/Dagger/';
import 'reactflow/dist/style.css';
import { DnDFlow } from './Components/DragandDrop/Dagger';

function App() {

  return (
    <>
      {/* <GraphViewer /> */}
      {/* <Checking /> */}
      {/* <Playground /> */}
      {/* <DnDFlow />
      <StoreFlow /> */}
      <DnDFlow />
    </>
  );
}

export default App;
