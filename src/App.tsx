import logo from './logo.svg';
import './App.css';
import { Simulation } from './simulation/Simulation';
import { unitSquare } from './simulation/Boundary';
import { Rule } from './simulation/Interactions';
import { Particle, particleTypes } from './simulation/Particle';
import { Orientation } from './simulation/Physics';
import { sample2DGaussian } from './simulation/utils';

function App() {
  const unitSquareSimulation = new Simulation({
    dimensions: 2,
    boundary: unitSquare(),
    rule: new Rule({ monopoleTensor: [
        [1, 0, 0],
        [0, 1, 0],
        [0, 0, 1],
    ]}),
    particles: new Array(10).fill(0).map((_: number) => new Particle({
        particleType: particleTypes[0],
        mass: 1,
        radius: 0.001,
        momentCoefficient: 2/5,
        position: new Orientation(sample2DGaussian(1/3)),
    })),
  }); 
  console.log("Hello world!");
  for (let i = 0; i < 10; i++) {
      unitSquareSimulation.eulerStep(0.01);
      console.log(unitSquareSimulation.textDump());
  }

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
