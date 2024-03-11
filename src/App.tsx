import './App.css';
import { snakeSimulation } from './config/examples/snake';
import { Display } from './graphics/Display';
import { rnaSimulation } from './config/examples/rna';
import { Moments } from './simulation/Physics';
import { SimulationDimensions } from './config/ParticleInit';




function App() {

  const standard: SimulationDimensions = {
    globalSize: 50,
    dimension: 2,
    interactionCutoff: 50,
    h: 0.01,
  };

  return (
    <div className="App">
      {/* <Display simulation={snakeSimulation(
        standard,
        {  
          interactionCutoff: 20,
          diversity: 5,
          particleSize: 1,
          particleInitSigma: standard.globalSize / 4,
          particlesPerType: 16,
        }
      )} turbo={true} width={1200} height={800}/> */}
      <Display simulation={rnaSimulation(
        {
          globalSize: 25,
          dimension: 2,
          interactionCutoff: 10,
          h: 0.01,
        },
        {
          interactionCutoff: 50,
          collisionCutoff: 4,

          pairCt: Math.round(2 * 250 / 16),
          chainBinderCt: Math.round(2 * 1000 / 16),
          pairBinderCt: 50,
          shellCt: 0,

          basePairSelfAttraction: 10,
          basePairRepulsion: -10,

          chainBinderSelfAttraction: -1,
          chainBinderStrength: 10,
          // pairBinderStrength: 1,

          pairPhysics: { mass: 4, radius: 0.5, momentCoefficient: Moments.UNIFORM_SPHERE },
          chainBinderPhysics: { mass: 1, radius: 0.25, momentCoefficient: Moments.UNIFORM_SPHERE },
          pairBinderPhysics: { mass: 1, radius: 0.25, momentCoefficient: Moments.UNIFORM_SPHERE },
          shellPhysics: { mass: 0.1, radius: 0.5, momentCoefficient: Moments.UNIFORM_SPHERE },
          
          initialSpread: 25,
        }
      )} turbo={true} width={600} height={600}/>
    </div>
  );
}

export default App;
