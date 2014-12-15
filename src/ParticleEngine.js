particleVertexShader = [
    "uniform float amplitude;",
    "attribute float size;",
    "attribute vec3 customColor;",
    "varying vec3 vColor;",
    "void main() {",
        "vColor = customColor;",
        "vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );",
        "//gl_PointSize = size;",
        "gl_PointSize = size * ( 300.0 / length( mvPosition.xyz ) );",
        "gl_Position = projectionMatrix * mvPosition;",
    "}"
].join("\n");

particleFragmentShader = [
    "uniform vec3 color;",
    "uniform sampler2D texture;",
    "varying vec3 vColor;",
    "void main() {",
        "gl_FragColor = vec4( color * vColor, 1.0 );",
        "gl_FragColor = gl_FragColor * texture2D( texture, gl_PointCoord );",
    "}"
].join("\n");

function ParticleEngine() {
    this.emitter = $SE();
    
    this.particleArray = [];
    this.particleGeometry = new THREE.Geometry();
    this.particleTexture  = THREE.ImageUtils.loadTexture( "textures/spark.png" );
    this.particleMesh = new THREE.PointCloud();
    this.timeFactor = 0.0001;
    this.lastTime = Date.now() * this.timeFactor;
    this.particleColor = new THREE.Color("#00ff7f");
    
    this.numberOfParticles = 100;
    
    this.particleMaterial = new THREE.ShaderMaterial( 
	{
        uniforms: {
				amplitude: { type: "f", value: 1.0 },
				color:     { type: "c", value: new THREE.Color( 0xffffff ) },
				texture:   { type: "t", value: this.particleTexture },
        },
        attributes: {
				size: {	type: 'f', value: [] },
				customColor: { type: 'c', value: [] }
        },
        vertexShader:   particleVertexShader,
        fragmentShader: particleFragmentShader,
        blending:       THREE.AdditiveBlending,
        depthTest:      false,
        transparent:    true,
    });
    
    
}

ParticleEngine.prototype.setValues = function( parameters )
{
	if ( parameters === undefined ) return;
    
    for ( var key in parameters ) 
		this[ key ] = parameters[ key ];
}

ParticleEngine.prototype.createParticles = function() {
    scene.remove(this.particleMesh);
    
    this.particleMaterial = new THREE.ShaderMaterial( 
	{
        uniforms: {
				amplitude: { type: "f", value: 1.0 },
				color:     { type: "c", value: new THREE.Color( 0xffffff ) },
				texture:   { type: "t", value: this.particleTexture },
        },
        attributes: {
				size: {	type: 'f', value: [] },
				customColor: { type: 'c', value: [] }
        },
        vertexShader:   particleVertexShader,
        fragmentShader: particleFragmentShader,
        blending:       THREE.AdditiveBlending,
        depthTest:      false,
        transparent:    true,
    });
    
    this.particleArray =  this.emitter.EmitParticles(this.numberOfParticles);
    
    for(var i = 0; i < this.particleArray.length; i++) {
        this.particleArray[i].m_Color = this.particleColor;
    }
    
    this.particleGeometry = new THREE.Geometry();
    
    for ( i = 0; i < this.particleArray.length; i ++ ) {
        var vertex = new THREE.Vector3();
        vertex = this.particleArray[i].m_Position;
        this.particleGeometry.vertices.push( vertex );
    }
    
    //particles = new THREE.PointCloud( geometry, shaderMaterial );
    this.particleMesh = new THREE.PointCloud(this.particleGeometry, this.particleMaterial);
    
    var vertices = this.particleMesh.geometry.vertices;
    var values_size = this.particleMaterial.attributes.size.value;
    var values_color = this.particleMaterial.attributes.customColor.value;
    
    for ( var v = 0; v < vertices.length; v++ ) {
        values_size[ v ] = this.particleArray[v].m_fsize;
        values_color[ v ] = this.particleArray[v].m_Color;
    }
    
    this.lastTime = Date.now() * this.timeFactor;
    
    scene.add( this.particleMesh );
    
}

ParticleEngine.prototype.updateParticles = function() {
    scene.remove(this.particleMesh);
            
    var curTime = Date.now() * this.timeFactor;
    var deltaTime = curTime - this.lastTime;
    this.lastTime = curTime;
            
    this.particleGeometry  = new THREE.Geometry();

    for ( i = 0; i < this.particleArray.length; i ++ ) {
        if (this.particleArray[i].m_alive == 1.0) {
            this.particleArray[i].update(deltaTime);
            var vertex = new THREE.Vector3();
            vertex = this.particleArray[i].m_Position;
            this.particleGeometry.vertices.push( vertex );
        }
    }

    //particles = new THREE.PointCloud( geometry, shaderMaterial );
    this.particleMesh = new THREE.PointCloud(this.particleGeometry, this.particleMaterial);


    var vertices = this.particleMesh.geometry.vertices;
    var values_size = this.particleMaterial.attributes.size.value;
    var values_color = this.particleMaterial.attributes.customColor.value;
    
    for ( var v = 0; v < vertices.length; v++ ) {
        values_size[ v ] = this.particleArray[v].m_fsize;
        values_color[ v ] = this.particleArray[v].m_Color;
    }
    
    for( var i = 0; i < this.particleMaterial.attributes.size.value.length; i++ ) {
				this.particleMaterial.attributes.size.value[ i ] = 14 + 13 * Math.sin( 0.1 * i + curTime );
			}
    this.particleMaterial.attributes.size.needsUpdate = true;
    scene.add( this.particleMesh );
}






























