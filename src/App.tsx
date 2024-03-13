import './App.css';
import { rnaSimulation } from './config/examples/rna';
import { snakeSimulation } from './config/examples/snake';
import { Display } from './graphics/Display';
import { Moments } from './simulation/Physics';

function App() {
  return (
    <div className="App">
      {/* <Display simulation={snakeSimulation(
        {
          globalSize: 250,
          dimension: 3,
          interactionCutoff: 25 / 4,
          h: 0.1,
        },
        {  
          diversity: 1,
          interactionCutoff: 25,
          particlesPerType: 2,

          particleSize: 0.5,
          particleInitSigma: 50 / 4,
          backgroundRepulsion: -10,
          selfAttraction: 10,
          nextAttraction: 10,
          prevRepulsion: 5,
        }
      )} turbo={false} width={1200} height={800}/> */}
      <Display simulation={rnaSimulation(
        {
          globalSize: 50,
          dimension: 3,
          interactionCutoff: 50 / 4,
          h: 0.001,
        },
        {
          interactionCutoff: 10,
          collisionCutoff: 4,

          pairCt: 100,
          chainBinderCt: 0,
          pairBinderCt: 0,
          shellCt: 0,
        
          universalRepulsion: 2,
          basePairSelfAttraction: 10,
          basePairRepulsion: -10,
          chainBinderSelfAttraction: -1,
          chainBinderStrength: 10,
          // pairBinderStrength: 1,

          pairPhysics: { mass: 1, radius: 5, momentOfInertia: Moments.NORMAL },
          chainBinderPhysics: { mass: 1, radius: 0.25, momentOfInertia: Moments.NORMAL },
          pairBinderPhysics: { mass: 1, radius: 0.25, momentOfInertia: Moments.NORMAL },
          shellPhysics: { mass: 0.1, radius: 0.5, momentOfInertia: Moments.NORMAL },
          
          initialSpread: 25,
        }
      )} turbo={true} width={1200} height={800}/>
    </div>
  );
}

export default App;
