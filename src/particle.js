function Particle() {
    this.m_Position = THREE.Vector3(0.0, 0.0, 0.0);
    this.m_Velocity = THREE.Vector3(0.0, 0.0, 0.0);
    this.m_Color =  THREE.Vector3(0.0, 0.0, 0.0, 0.0);
    this.m_fRotate = 0.0;
    this.m_fsize = 1.0;
    this.m_fAge = 0.0;
    this.m_fLifeTime = 1.0;
    
}
Particle.prototype = {
    //set the elements of the particle
    setElements: function(position, velocity, color, roation, size, age, lifetime) {
        //vec3
        // The center point of the simulated particle local to the particle effect
        this.m_Position = position;
        // The velocity of the particle in 3D space
        this.m_Velocity = velocity;
        //vec4
        // The 4-component color (red, green, blue, alpha) 
        this.m_Color = color;
        //float
        // Determines the amount of rotation to apply to the particle’s local z-axis
        this.m_fRotate = roation;
        // Determines how large the particle will be and this is measured in world-coordinates
        this.m_fsize = size;
        // the duration in seconds since the particle was emitted
        this.m_fAge = age;
        // How long the particle will live for
        this.m_fLifeTime = lifetime;

        return this;
    },
    init: function() {
         this.m_Position = new THREE.Vector3(0.0, 0.0, 0.0);
        this.m_Velocity = new THREE.Vector3(0.0, 0.0, 0.0);
        this.m_Color =  new THREE.Vector3(0.0, 0.0, 0.0, 0.0);
        this.m_fRotate = 0.0;
        this.m_fsize = 1.0;
        this.m_fAge = 0.0;
        this.m_fLifeTime = 1.0;
    },
    // Returns a copy of the particle
    copy: function() {
        return Particle.create(this.m_Position, this.m_Velocity, this.m_Color, this.m_fRotate, this.m_fsize, this.m_fAge, this.m_fLifeTime);
    }
};
  
// Constructor function
Particle.create = function() {
    var P = new Particle();
    P.init()
    return P;
};

// Utility functions
var $P = Particle.create;

