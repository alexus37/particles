function SphereEmitter() {}
SphereEmitter.prototype = {
    //set the elements of the particle
    init: function() {
        this.MinimumRadius = 0;
        this.MaximumRadius = 1;
        
        this.MinInclination = 0;
        this.MaxInclination = 180;
        
        this.MinAzimuth = 0;
        this.MaxAzimuth = 360;
        
        this.MinSpeed = 10;
        this.MaxSpeed = 20;
        this.MinLifetime = 3;
        this.MaxLifetime = 5;
        this.Origin = new THREE.Vector3(0.0, 0.0, 0.0);

        return this;
    },
    
    EmitParticle function(particle) {
        var inclination = THREE.Math.degToRad(THREE.Math.randFloat(this.MinInclination, this.MaxInclination));
        var azimuth = THREE.Math.degToRad( THREE.Math.randFloat(this.MinAzimuth, this.MaxAzimuth ) );

        var radius = THREE.Math.randFloat( this.MinimumRadius, this.MaximumRadius );
        var speed = THREE.Math.randFloat( this.MinSpeed, this.MaxSpeed );
        var lifetime = THREE.Math.randFloat( this.MinLifetime, this.MaxLifetime );

        var sInclination = Math.sin( inclination );

        var X = sInclination * Math.cos( azimuth );
        var Y = sInclination * Math.sin( azimuth );
        var Z = Math.cos( inclination );

        var vector = new THREE.Vector3( X, Y, Z );

        particle.m_Position = Origin.add(vector.multiplyScalar(radius));
        particle.m_Velocity = vector.multiplyScalar(speed);

        particle.m_fLifeTime = lifetime;
        particle.m_fAge = 0;
    
        return particle;
    },


};
  
// Constructor function
SphereEmitter.create = function()  {
    var SE = new SphereEmitter();
    return SE.setElements();
};

// Utility functions
var $SE = SphereEmitter.create;