function ParticleEffect() {}
ParticleEffect.prototype = {
    //set the elements of the particle
    setElements: function() {
        this.VertexBuffer = null;
        this.m_pCamera = null
        this.m_pParticleEmitter = null;
        // no ColorInterpolator
        //this.m_ColorInterpolator = null;
        this.m_Particles  = new Array();
        this.m_VertexBuffer = new Array();
        this.m_LocalToWorldMatrix = new THREE.Matrix4();
        this.m_TextureID = null;
        this.m_Force = new THREE.Vector3(0.0, -9.81, 0.0);
        
        
        return this;
    },
    // The particle effect is initialized with the maximum number of particles that will be used to render this effect
    ParticleEffect: function(numParticles) {},
    // The method is used to store the instance of the camera class that is used to orient the particle facing the camera 
    SetCamera: function(pCamera) {
        this.m_pCamera = pCamera;
    },
    // method stores the instance to an emitter class that determines the position and velocity of newly emitted particles
    SetParticleEmitter: function(pEmitter) {
        this.m_pParticleEmitter = pEmitter;
    },
    /*
    SetColorInterplator: function(colors) {
        this.m_ColorInterpolator = colors;
    },
    */
    // method is used to randomly distribute all of the particles in the particle effect giving them a (pseudo) random 
    // position and velocity around a unit sphere center at the origin of the effect
    RandomizeParticles: function() {
        for(var i = 0; i < this.m_Particles.length; i++) {
            this.m_Particles[i] = this.RandomizeParticle(this.m_Particles[i]);
        }
    },
    EmitParticles: function() {
        if(this.m_pParticleEmitter == null) {
            this.RandomizeParticles();
        } else {
            for(var i = 0; i < this.m_Particles.length; i++) {
                this.EmitParticle(this.m_Particles[i]);
            }
        }
    },
    
    Update: function(fDeltaTime) {
        for (var i = 0; i < this.m_Particles.length; i++ ) {
            var particle = this.m_Particles[i];

            particle.m_fAge += fDeltaTime;
            if ( particle.m_fAge > particle.m_fLifeTime ) {
                if (this.m_pParticleEmitter != null ) {
                    EmitParticle(particle);
                } else {
                    RandomizeParticle(particle);
                }
            }

            var lifeRatio = particle.m_fAge / particle.m_fLifeTime;
            if (lifeRatio < 0) {
                lifeRatio = 0;
            }
            if (lifeRatio > 1) {
                lifeRatio = 1;
            }

            particle.m_Velocity = particle.m_Velocity.add(this.m_Force.multiplyScalar(fDeltaTime));
            particle.m_Position = particle.m_Position.add(particle.m_Velocity.multiplyScalar(fDeltaTime));
            //particle.m_Color = m_ColorInterpolator.GetValue( lifeRatio );
            particle.m_fRotate = 0.0 +  ((720.0 - 0.0) * lifeRatio);
            particle.m_fSize = 5.0 +  ((0.0 - 5.0) * lifeRatio);
            
             this.m_Particles[i] = particle;
        }

        this.BuildVertexBuffer();
    },
    
    Render: function() {
        // implement rendering
    },
    
    LoadTexture: function(fileName) {
        // implement loading of texture
    },
    // Resize the particle buffer with numParticles
    Resize: function(numParticles) {
        //check this
        this.m_Particles.resize( numParticles,  Particle() );
        this.m_VertexBuffer.resize( numParticles * 4, Vertex() );
    },
    RandomizeParticle: function(particle) {
        particle.m_fAge = 0.0;
        particle.m_fLifeTime = (Math.random() * 2) + 3;

        var unitVec = THREE.Vector3(Math.random(), Math.random(), Math.random());
        
        unitVec.normalize;

        particle.m_Position = unitVec;
        particle.m_Velocity = unitVec.multiplyScalar((Math.random() * 10) + 10);
        return particle;
    },
    EmitParticle: function(particle) {
        if(this.m_pParticleEmitter != null) {
            this.m_pParticleEmitter.EmitParticle(particle);
        }
    },
    // Build the vertex buffer from the particle buffer
    BuildVertexBuffer: function() {
        var X = new THREE.Vector3( 0.5, 0, 0 );
        var Y = new THREE.Vector3( 0.5, 0.5, 0 );
        var Z = new THREE.Vector3( 0.5, 0, 1.0 );
        
        var cameraRoation = new THREE.Quaternion();
        
        if(this.m_pCamera != null) {
            cameraRotation.setRotationFromEuler(THREE.degToRad(this.m_pCamera.GetRotation()));
        }
        for(var i = 0; i < this.m_Particles.length; i++) {
            var particle = this.m_Particles[i];
            var roation = new THREE.Quaternion();
            roation.setFromAxisAngle(Z, particle.m_fRotate);
            
            var vertexIndex = i *4;
            var v0 = this.m_VertexBuffer[vertexIndex + 0];
            var v1 = this.m_VertexBuffer[vertexIndex + 1];
            var v2 = this.m_VertexBuffer[vertexIndex + 2];
            var v3 = this.m_VertexBuffer[vertexIndex + 3];
            
            
            // Bottom-left
            var tempVector =  (X.multiplyScalar(-1)).sub(Y);
            tempVector.applyQuaternion(rotation);
            tempVector.multiplyScalar(particle.m_fSize);
            tempVector.applyQuaternion(cameraRoation);
            
            v0.m_Pos = particle.m_Position.add(tempVector);
            v0.m_Tex0 = new THREE.Vector2( 0, 1 );
            v0.m_Diffuse = particle.m_Color;

            // Bottom-right
            var tempVector =  (X).sub(Y);
            tempVector.applyQuaternion(rotation);
            tempVector.multiplyScalar(particle.m_fSize);
            tempVector.applyQuaternion(cameraRoation);
            
            v1.m_Pos = particle.m_Position.add(tempVector);
            v1.m_Tex0 = new THREE.Vector2( 1, 1 );
            v1.m_Diffuse = particle.m_Color;

            // Top-right
            var tempVector =  (X).add(Y);
            tempVector.applyQuaternion(rotation);
            tempVector.multiplyScalar(particle.m_fSize);
            tempVector.applyQuaternion(cameraRoation);
            
            v2.m_Pos = particle.m_Position.add(tempVector);
            v2.m_Tex0 = gnew THREE.Vector2( 1, 0 );
            v2.m_Diffuse = particle.m_Color;

            // Top-left
            var tempVector =  (X.multiplyScalar(-1)).add(Y);
            tempVector.applyQuaternion(rotation);
            tempVector.multiplyScalar(particle.m_fSize);
            tempVector.applyQuaternion(cameraRoation);
            
            v3.m_Pos = particle.m_Position.add(tempVector);
            v3.m_Tex0 = new THREE.Vector2( 0, 0 );
            v3.m_Diffuse = particle.m_Color;
            
            this.m_VertexBuffer[vertexIndex + 0] = v0;
            this.m_VertexBuffer[vertexIndex + 1] = v1;
            this.m_VertexBuffer[vertexIndex + 2] = v2;
            this.m_VertexBuffer[vertexIndex + 3] = v3;
        }
        
        
        
    },
    
    
    // Returns a copy of the particle
    copy: function() {
        return Particle.create(this.m_Position, this.m_Velocity, this.m_Color, this.m_fRotate, this.m_fsize, this.m_fAge, this.m_fLifeTime);
    }
};
  
// Constructor function
ParticleEffect.create = function(position, velocity, color, roation, size, age, lifetime) {
    var P = new Particle();
    return P.setElements(position, velocity, color, roation, size, age, lifetime);
};

// Utility functions
var $PE = ParticleEffect.create;