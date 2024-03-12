import './App.css';
import { snakeSimulation } from './config/examples/snake';
import { Display } from './graphics/Display';

function App() {
  return (
    <div className="App">
      <Display simulation={snakeSimulation(
        {
          globalSize: 25,
          dimension: 3,
          interactionCutoff: 50,
          h: 0.005,
        },
        {  
          interactionCutoff: 50,
          diversity: 4,
          particleSize: 1,
          particleInitSigma: 50 / 4,
          particlesPerType: 50,
          backgroundRepulsion: -20,
          selfAttraction: 0,
          nextAttraction: 0,
          prevRepulsion: 0,
        }
      )} turbo={false} width={1200} height={800}/>
      {/* <Display simulation={rnaSimulation(
        {
          globalSize: 25,
          dimension: 2,
          interactionCutoff: 10,
          h: 0.01,
        },
        {
          interactionCutoff: 50,
          collisionCutoff: 4,

          pairCt: Math.round(2 * 25 / 16),
          chainBinderCt: Math.round(2 * 100 / 16),
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
      )} turbo={true} width={600} height={600}/> */}
    </div>
  );
}

export default App;
