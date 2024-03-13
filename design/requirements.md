MBody: An online playground and community for particle simulations
- Simulation Param CRUD:
    - Create (SimulationParams): return PK and SK
    - Read (PK): return params
    - Update (PK): require SK, change simulation params as realtime as possible
    - Delete (PK): require SK, 
    - Extensibility: Can be tied to user accounts & posts
    - Extensibility: Users can purchase 

- Simulation State Lifecycle (require PK and SK):
    - Initialize (InitParams):
    - Buffer (start frame, end frame):
    - Read (frame number): get each visible particle's ID, position, and orientation at that particular frame

- Simulation Capabilities/Versatility, High-level sim props (Max N = 8):
    - Particles: Up to 10^6 particles, each with up to 1 kb
    - Particle Classes: Up to 10^3 classes

    - [XSS WARNING] User can customize simulations with their own code in the form of vector functions with access to math libraries
    - Integration with Blender nodes


    - Closed, open, or looped world:
        - Fully customizable N-d boundaries for closed worlds: reduce to single function for now 
            - Enough flexibility to customize efficient computation for special boundaries 
        - Fully customizable collision mechanics
        - Global gravitational potential: mul
        - Global electric field: mul



    - Newtonian NBody with Barnes-Hutt support
    - Relativistic NBody with Barnes-Hutt support
    - Electrostatic n-pole interactions in 3D
    - Electrostatic n-pole interactions in 3D w/ Particle-In-Cell

    - Simulation in up to N dimensions w/ 3D projections
    - Particle-In-Cell support

    - Benchmarks
        - Particle Life
        - Magnetization
        - Strong Nuclear Force

    - Flexible 

- Graphics Capabilities/Versatility, High-level sim props (Max N = 8):


