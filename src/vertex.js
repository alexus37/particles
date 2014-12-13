function Vertex() {}
Vertex.prototype = {
    //set the elements of the particle
    setElements: function(position, diffuse, texture) {
        //vec3
        // Vertex position
        this.m_Pos = position;
        //vec4
        // Diffuse color
        this.m_Diffuse = diffuse;
        //vec2
       // Texture coordinate
        this.m_Tex0 = texture;

        return this;
    },

    // Returns a copy of the particle
    copy: function() {
        return Vertex.create(this.m_Pos, this.m_Diffuse, this.m_Tex0);
    }
};
  
// Constructor function
Vertex.create = function(position, diffuse, texture)  {
    var V = new Vertex();
    return V.setElements(position, diffuse, texture);
};

// Utility functions
var $V = Vertex.create;