import { Matrix } from "./matrix.js";

const Model = class
{
    #gl = null
    #renderer = null
    #position = null
    #index = null
    #vbo = null
    #ibo = null
    #texture = null
    #shaderType = 'white'
    #renderProgram = null
    #renderMatrixLocation = null
    #renderRotateMatrixLocation = null
    #renderPositionLocation = null
    #renderNormalLocation = null
    #renderSamplerLocation = null
    #matrix = null

    constructor(renderer = null)
    {
        if(renderer === null) return
        this.#renderer = renderer
        const gl = renderer._gl
        this.#gl = gl
        this.#texture = null

        this.#matrix = new Matrix()
        
        this.#texture = gl.createTexture()
        gl.activeTexture(gl.TEXTURE0)
        gl.bindTexture(gl.TEXTURE_2D, this.#texture)
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST)
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST)
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
        gl.bindTexture(gl.TEXTURE_2D, null)
    }
    
    setShaderType(type) {
        this.#shaderType = type
        const gl = this.#gl
        
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
        if(!gl.getShaderParameter(renderVertexShader, gl.COMPILE_STATUS))
            console.error(gl.getShaderInfoLog(renderVertexShader))
        
        const renderFragmentShader = gl.createShader(gl.FRAGMENT_SHADER)
        gl.shaderSource(renderFragmentShader, renderFragmentShaderString)
        gl.compileShader(renderFragmentShader)
        if(!gl.getShaderParameter(renderFragmentShader, gl.COMPILE_STATUS))
            console.error(gl.getShaderInfoLog(renderFragmentShader))
        
        const renderProgram = gl.createProgram()
        gl.attachShader(renderProgram, renderVertexShader)
        gl.attachShader(renderProgram, renderFragmentShader)
        gl.linkProgram(renderProgram)
        if(gl.getProgramParameter(renderProgram, gl.LINK_STATUS))
        {
            gl.useProgram(renderProgram)
            this.#renderProgram = renderProgram
        }
        else
            console.error(gl.getProgramInfoLog(renderProgram))
        
        this.#renderMatrixLocation = gl.getUniformLocation(renderProgram, 'matrix')
        this.#renderRotateMatrixLocation = gl.getUniformLocation(renderProgram, 'rotateMatrix')
        this.#renderPositionLocation = gl.getAttribLocation(renderProgram, 'position')
        this.#renderNormalLocation = gl.getAttribLocation(renderProgram, 'normal')
    }

    draw()
    {
        const renderer = this.#renderer
        const gl = this.#gl

        if(this.#texture != null)
        {
            gl.activeTexture(gl.TEXTURE0 + 0)
            gl.bindTexture(gl.TEXTURE_2D, this.#texture)
            gl.uniform1i(this.#renderSamplerLocation, 0)
        }
        else return

        if(gl.getProgramParameter(this.#renderProgram, gl.LINK_STATUS))
            gl.useProgram(this.#renderProgram)

		gl.uniformMatrix4fv(this.#renderMatrixLocation, false, this.#matrix.matrix)
        
        if(this.#shaderType !== 'white')
		gl.uniformMatrix4fv(this.#renderRotateMatrixLocation, false, this.#matrix.rotateMatrix)

        gl.bindBuffer(gl.ARRAY_BUFFER, this.#vbo)
        
        gl.enableVertexAttribArray(this.#renderPositionLocation)
        gl.vertexAttribPointer(this.#renderPositionLocation, 3, gl.FLOAT, false, (3 + 3) * 4, 0)
        
        if(this.#shaderType !== 'white'){
            gl.enableVertexAttribArray(this.#renderNormalLocation)
            gl.vertexAttribPointer(this.#renderNormalLocation, 3, gl.FLOAT, false, (3 + 3) * 4, 3 * 4)
        }
        
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.#ibo)

		gl.bindFramebuffer(gl.FRAMEBUFFER, renderer._framebuffer)
        
        gl.drawElements(gl.TRIANGLES, this.#index.length, gl.UNSIGNED_SHORT, 0)
        //gl.drawElements(gl.LINES, this.#index.length, gl.UNSIGNED_SHORT, 0)
        
		gl.bindFramebuffer(gl.FRAMEBUFFER, null)
    }

    set position(
        p =
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
        const gl = this.#gl

        this.#position = p
        
        this.vertex = []
        for(let i = 0; i < this.#position.length / 3; i++)
        {
            this.vertex.push(this.#position[i * 3 + 0])
            this.vertex.push(this.#position[i * 3 + 1])
            this.vertex.push(this.#position[i * 3 + 2])
        }

        const vbo = gl.createBuffer()
        gl.bindBuffer(gl.ARRAY_BUFFER, vbo)
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.vertex), gl.DYNAMIC_DRAW)
        gl.bindBuffer(gl.ARRAY_BUFFER, null)
        this.#vbo = vbo
    }

    //  25
    // 0*1
    // 43
    set index(
        i =
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
        const gl = this.#gl
        this.#index = i
        const ibo = gl.createBuffer()
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ibo)
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Int16Array(i), gl.DYNAMIC_DRAW)
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null)
        this.#ibo = ibo
    }

    set texture(t)
    {
        const gl = this.#gl
        
        gl.bindTexture(gl.TEXTURE_2D, this.#texture)
        gl.texImage2D(
            gl.TEXTURE_2D,
            0,
            gl.RGBA,
            t.width,
            t.height,
            0,
            gl.RGBA,
            gl.UNSIGNED_BYTE,
            new Uint8Array(t.data)
        )
        gl.bindTexture(gl.TEXTURE_2D, null)
    }

    set matrix(m)
    {
        this.#matrix = m
    }
}

export { Model }