import { Matrix } from "./matrix.js";

const Model = class
{
    constructor(renderer = null)
    {
        if(renderer === null) return
        this._renderer = renderer
        const gl = renderer._gl
        this._gl = gl
        this._texture = null

        this.matrix = new Matrix()
        this.rotateMatrix = new Matrix()
        
        this._texture = gl.createTexture()
        gl.activeTexture(gl.TEXTURE0)
        gl.bindTexture(gl.TEXTURE_2D, this._texture)
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST)
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST)
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
        gl.bindTexture(gl.TEXTURE_2D, null)
    }
    
    setShaderType(type) {
        this._shaderType = type
        const gl = this._gl
        
        let renderVertexShaderString, renderFragmentShaderString
        
        if(type === 'white') {
            renderVertexShaderString =
                `#version 300 es
                
                    in vec3 position;
                    
                    uniform mat4 matrix;
                    
                    void main(void)
                    {
                        gl_Position = matrix * vec4(position, 1.0);
                    }
                `
            
            renderFragmentShaderString =
                `#version 300 es
                
                    precision mediump float;
                    
                    out vec4 outColor;
                    
                    void main(void)
                    {
                        outColor = vec4(1.0, 1.0, 1.0, 1.0);
                    }
                `
        }
        else if(type === 'flat') {
            renderVertexShaderString =
                `#version 300 es
                
                    in vec3 position;
                    in vec3 normal;
                    
                    flat out vec4 varColor;
                    
                    uniform mat4 rotateMatrix;
                    uniform mat4 matrix;
                    
                    void main(void)
                    {
                        vec3 n = normalize((rotateMatrix * vec4(normal, 0.0)).xyz);
                        vec3 l = normalize(vec3(0.0, 1.0, -1.0));
                        float c = dot(n, l);
                        varColor = vec4(c, c, c, 1.0);
                        gl_Position = matrix * vec4(position, 1.0);
                    }
                `
            
            renderFragmentShaderString =
                `#version 300 es
                
                    precision mediump float;
                    
                    flat in vec4 varColor;
                    
                    out vec4 outColor;
                    
                    void main(void)
                    {
                        outColor = varColor;
                    }
                `
        }
        else if(type === 'vertex') {
            renderVertexShaderString =
                `#version 300 es
                
                    in vec3 position;
                    in vec3 normal;
                    
                    out vec4 varColor;
                    
                    uniform mat4 rotateMatrix;
                    uniform mat4 matrix;
                    
                    void main()
                    {
                        vec3 n = normalize((rotateMatrix * vec4(normal, 0.0)).xyz);
                        vec3 l = normalize(vec3(0.0, 1.0, -1.0));
                        float c = dot(n, l);
                        varColor = vec4(c, c, c, 1.0);
                        gl_Position = matrix * vec4(position, 1.0);
                    }
                `
            
            renderFragmentShaderString =
                `#version 300 es
                
                    precision mediump float;
                    
                    in vec4 varColor;
                    
                    out vec4 outColor;
                    
                    void main()
                    {
                        outColor = varColor;
                    }
                `
        }
        else if(type === 'fragment') {
            renderVertexShaderString =
                `#version 300 es
                
                    in vec3 position;
                    in vec3 normal;
                    
                    out vec3 varNormal;
                    
                    uniform mat4 rotateMatrix;
                    uniform mat4 matrix;
                    
                    void main()
                    {
                        varNormal = (rotateMatrix * vec4(normal, 0.0)).xyz;
                        gl_Position = matrix * vec4(position, 1.0);
                    }
                `
            
            renderFragmentShaderString =
                `#version 300 es
                
                    precision mediump float;
                    
                    in vec3 varNormal;
                    
                    out vec4 outColor;
                    
                    void main()
                    {
                        vec3 n = normalize(varNormal);
                        vec3 l = normalize(vec3(0.0, 1.0, -1.0));
                        float c = dot(n, l);
                        outColor = vec4(c, c, c, 1.0);
                    }
                `
        }
        else {
            console.error('Shader type error.')
            return
        }

        const renderVertexShader = gl.createShader(gl.VERTEX_SHADER)
        gl.shaderSource(renderVertexShader, renderVertexShaderString)
        gl.compileShader(renderVertexShader)
        if(gl.getShaderParameter(renderVertexShader, gl.COMPILE_STATUS))
            this._renderVertexShader = renderVertexShader
        else
            console.error(gl.getShaderInfoLog(renderVertexShader))
        
        const renderFragmentShader = gl.createShader(gl.FRAGMENT_SHADER)
        gl.shaderSource(renderFragmentShader, renderFragmentShaderString)
        gl.compileShader(renderFragmentShader)
        if(gl.getShaderParameter(renderFragmentShader, gl.COMPILE_STATUS))
            this._renderFragmentShader = renderFragmentShader
        else
            console.error(gl.getShaderInfoLog(renderFragmentShader))
        
        const renderProgram = gl.createProgram()
        gl.attachShader(renderProgram, renderVertexShader)
        gl.attachShader(renderProgram, renderFragmentShader)
        gl.linkProgram(renderProgram)
        if(gl.getProgramParameter(renderProgram, gl.LINK_STATUS))
        {
            gl.useProgram(renderProgram)
            this._renderProgram = renderProgram
        }
        else
            console.error(gl.getProgramInfoLog(renderProgram))
        
        this._renderMatrixLocation = gl.getUniformLocation(this._renderProgram, 'matrix')
        this._renderRotateMatrixLocation = gl.getUniformLocation(this._renderProgram, 'rotateMatrix')
        this._renderPositionLocation = gl.getAttribLocation(this._renderProgram, 'position')
        this._renderNormalLocation = gl.getAttribLocation(this._renderProgram, 'normal')
    }

    draw()
    {
        const renderer = this._renderer
        const gl = this._gl

        if(this._texture != null)
        {
            gl.activeTexture(gl.TEXTURE0 + 0)
            gl.bindTexture(gl.TEXTURE_2D, this._texture)
            gl.uniform1i(this._renderSamplerLocation, 0)
        }
        else return

        if(gl.getProgramParameter(this._renderProgram, gl.LINK_STATUS))
            gl.useProgram(this._renderProgram)

		gl.uniformMatrix4fv(this._renderMatrixLocation, false, this.matrix)
        
        if(this._shaderType !== 'white')
		gl.uniformMatrix4fv(this._renderRotateMatrixLocation, false, this.rotateMatrix)

        gl.bindBuffer(gl.ARRAY_BUFFER, this._vbo)
        
        gl.enableVertexAttribArray(this._renderPositionLocation)
        gl.vertexAttribPointer(this._renderPositionLocation, 3, gl.FLOAT, false, (3 + 3) * 4, 0)
        
        if(this._shaderType !== 'white'){
            gl.enableVertexAttribArray(this._renderNormalLocation)
            gl.vertexAttribPointer(this._renderNormalLocation, 3, gl.FLOAT, false, (3 + 3) * 4, 3 * 4)
        }
        
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this._ibo)

		gl.bindFramebuffer(gl.FRAMEBUFFER, renderer._framebuffer)
        
        gl.drawElements(gl.TRIANGLES, this.index.length, gl.UNSIGNED_SHORT, 0)
        //gl.drawElements(gl.LINES, this.index.length, gl.UNSIGNED_SHORT, 0)
        
		gl.bindFramebuffer(gl.FRAMEBUFFER, null)
    }

    setAttributes(
        position =
            [
                -1.0,    0.0,    0.0,
                 1.0,    0.0,    0.0,
                 0.0,   -1.0,    0.0,
                 0.0,    1.0,    0.0,
                 0.0,    0.0,   -1.0,
                 0.0,    0.0,    1.0,
            ],
        normal =
            [
                -1.0,    0.0,    0.0,
                 1.0,    0.0,    0.0,
                 0.0,   -1.0,    0.0,
                 0.0,    1.0,    0.0,
                 0.0,    0.0,   -1.0,
                 0.0,    0.0,    1.0,
            ]
    )
    {
        const gl = this._gl

        this.position = position
        this.normal = normal
        
        this.vertex = []
        for(let i = 0; i < position.length / 3; i++)
        {
            this.vertex.push(position[i * 3 + 0])
            this.vertex.push(position[i * 3 + 1])
            this.vertex.push(position[i * 3 + 2])
            this.vertex.push(normal[i * 3 + 0])
            this.vertex.push(normal[i * 3 + 1])
            this.vertex.push(normal[i * 3 + 2]) 
        }

        const vbo = gl.createBuffer()
        gl.bindBuffer(gl.ARRAY_BUFFER, vbo)
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.vertex), gl.DYNAMIC_DRAW)
        gl.bindBuffer(gl.ARRAY_BUFFER, null)
        this._vbo = vbo
    }

    //  25
    // 0*1
    // 43
    setIndex(
        index =
        [
            4, 3, 0,
            4, 0, 2,
            4, 2, 1,
            4, 1, 3,
            
            5, 3, 1,
            5, 1, 2,
            5, 2, 0,
            5, 0, 3,
        ]
    )
    {
        const gl = this._gl
        this.index = index
        const ibo = gl.createBuffer()
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ibo)
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Int16Array(index), gl.DYNAMIC_DRAW)
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null)
        this._ibo = ibo
    }

    setTexture(width, height, data)
    {
        const gl = this._gl
        
        this.textureData = {
            width: width,
            height: height,
            data: new Uint8Array(data),
        }
        
        gl.bindTexture(gl.TEXTURE_2D, this._texture)
        gl.texImage2D(
            gl.TEXTURE_2D,
            0,
            gl.RGBA,
            this.textureData.width,
            this.textureData.height,
            0,
            gl.RGBA,
            gl.UNSIGNED_BYTE,
            this.textureData.data
        )
        gl.bindTexture(gl.TEXTURE_2D, null)
    }

    setMatrix(matrix)
    {
        this.matrix = matrix
    }

    setRotateMatrix(rotateMatrix)
    {
        this.rotateMatrix = rotateMatrix
    }
}

export { Model }