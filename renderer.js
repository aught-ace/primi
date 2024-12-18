// GL2フレームワーク

//行列
const Matrix = class
{
    matrix = null
    rotateMatrix = null

    constructor()
    {
        this.initialize()
    }

    initialize()
    {
        this.matrix = new Float32Array(16)
        this.matrix[ 0] = 1
        this.matrix[ 1] = 0
        this.matrix[ 2] = 0
        this.matrix[ 3] = 0
        this.matrix[ 4] = 0
        this.matrix[ 5] = 1
        this.matrix[ 6] = 0
        this.matrix[ 7] = 0
        this.matrix[ 8] = 0
        this.matrix[ 9] = 0
        this.matrix[10] = 1
        this.matrix[11] = 0
        this.matrix[12] = 0
        this.matrix[13] = 0
        this.matrix[14] = 0
        this.matrix[15] = 1

        this.rotateMatrix = new Float32Array(16)
        this.rotateMatrix[ 0] = 1
        this.rotateMatrix[ 1] = 0
        this.rotateMatrix[ 2] = 0
        this.rotateMatrix[ 3] = 0
        this.rotateMatrix[ 4] = 0
        this.rotateMatrix[ 5] = 1
        this.rotateMatrix[ 6] = 0
        this.rotateMatrix[ 7] = 0
        this.rotateMatrix[ 8] = 0
        this.rotateMatrix[ 9] = 0
        this.rotateMatrix[10] = 1
        this.rotateMatrix[11] = 0
        this.rotateMatrix[12] = 0
        this.rotateMatrix[13] = 0
        this.rotateMatrix[14] = 0
        this.rotateMatrix[15] = 1
    }

    translateX (x)
    {
        const t = [16]
        t[ 0] = 1
        t[ 1] = 0
        t[ 2] = 0
        t[ 3] = 0
        t[ 4] = 0
        t[ 5] = 1
        t[ 6] = 0
        t[ 7] = 0
        t[ 8] = 0
        t[ 9] = 0
        t[10] = 1
        t[11] = 0
        t[12] = x
        t[13] = 0
        t[14] = 0
        t[15] = 1
        this.matrix = this.multiply(this.matrix, t)
    }

    translateY (y)
    {
        const t = [16]
        t[ 0] = 1
        t[ 1] = 0
        t[ 2] = 0
        t[ 3] = 0
        t[ 4] = 0
        t[ 5] = 1
        t[ 6] = 0
        t[ 7] = 0
        t[ 8] = 0
        t[ 9] = 0
        t[10] = 1
        t[11] = 0
        t[12] = 0
        t[13] = y
        t[14] = 0
        t[15] = 1
        this.matrix = this.multiply(this.matrix, t)
    }

    translateZ (z)
    {
        const t = [16]
        t[ 0] = 1
        t[ 1] = 0
        t[ 2] = 0
        t[ 3] = 0
        t[ 4] = 0
        t[ 5] = 1
        t[ 6] = 0
        t[ 7] = 0
        t[ 8] = 0
        t[ 9] = 0
        t[10] = 1
        t[11] = 0
        t[12] = 0
        t[13] = 0
        t[14] = z
        t[15] = 1
        this.matrix = this.multiply(this.matrix, t)
    }

    scaleX (x)
    {
        const s = [16]
        s[ 0] = x
        s[ 1] = 0
        s[ 2] = 0
        s[ 3] = 0
        s[ 4] = 0
        s[ 5] = 1
        s[ 6] = 0
        s[ 7] = 0
        s[ 8] = 0
        s[ 9] = 0
        s[10] = 1
        s[11] = 0
        s[12] = 0
        s[13] = 0
        s[14] = 0
        s[15] = 1
        this.matrix = this.multiply(this.matrix, s)
    }

    scaleY (y)
    {
        const s = [16]
        s[ 0] = 1
        s[ 1] = 0
        s[ 2] = 0
        s[ 3] = 0
        s[ 4] = 0
        s[ 5] = y
        s[ 6] = 0
        s[ 7] = 0
        s[ 8] = 0
        s[ 9] = 0
        s[10] = 1
        s[11] = 0
        s[12] = 0
        s[13] = 0
        s[14] = 0
        s[15] = 1
        this.matrix = this.multiply(this.matrix, s)
    }

    scaleZ (z)
    {
        const s = [16]
        s[ 0] = 1
        s[ 1] = 0
        s[ 2] = 0
        s[ 3] = 0
        s[ 4] = 0
        s[ 5] = 1
        s[ 6] = 0
        s[ 7] = 0
        s[ 8] = 0
        s[ 9] = 0
        s[10] = z
        s[11] = 0
        s[12] = 0
        s[13] = 0
        s[14] = 0
        s[15] = 1
        this.matrix = this.multiply(this.matrix, s)
    }

    rotateX (x)
    {
        const r = [16]
        r[ 0] = 1
        r[ 1] = 0
        r[ 2] = 0
        r[ 3] = 0
        r[ 4] = 0
        r[ 5] = Math.cos(x)
        r[ 6] = Math.sin(x)
        r[ 7] = 0
        r[ 8] = 0
        r[ 9] = -Math.sin(x)
        r[10] = Math.cos(x)
        r[11] = 0
        r[12] = 0
        r[13] = 0
        r[14] = 0
        r[15] = 1
        this.matrix = this.multiply(this.matrix, r)
        this.rotateMatrix = this.multiply(this.rotateMatrix, r)
    }

    rotateY (y)
    {
        const r = [16]
        r[ 0] = Math.cos(y)
        r[ 1] = 0
        r[ 2] = -Math.sin(y)
        r[ 3] = 0
        r[ 4] = 0
        r[ 5] = 1
        r[ 6] = 0
        r[ 7] = 0
        r[ 8] = Math.sin(y)
        r[ 9] = 0
        r[10] = Math.cos(y)
        r[11] = 0
        r[12] = 0
        r[13] = 0
        r[14] = 0
        r[15] = 1
        this.matrix = this.multiply(this.matrix, r)
        this.rotateMatrix = this.multiply(this.rotateMatrix, r)
    }

    rotateZ (z)
    {
        const r = [16]
        r[ 0] = Math.cos(z)
        r[ 1] = Math.sin(z)
        r[ 2] = 0
        r[ 3] = 0
        r[ 4] = -Math.sin(z)
        r[ 5] = Math.cos(z)
        r[ 6] = 0
        r[ 7] = 0
        r[ 8] = 0
        r[ 9] = 0
        r[10] = 1
        r[11] = 0
        r[12] = 0
        r[13] = 0
        r[14] = 0
        r[15] = 1
        this.matrix = this.multiply(this.matrix, r)
        this.rotateMatrix = this.multiply(this.rotateMatrix, r)
    }

    parallel (left, right, down, up, near, far)
    {
        this.matrix[ 0] = 2 / (right - left)
        this.matrix[ 1] = 0
        this.matrix[ 2] = 0
        this.matrix[ 3] = 0
        this.matrix[ 4] = 0
        this.matrix[ 5] = 2 / (up - down)
        this.matrix[ 6] = 0
        this.matrix[ 7] = 0
        this.matrix[ 8] = 0
        this.matrix[ 9] = 0
        this.matrix[10] = 2 / (far - near)
        this.matrix[11] = 0
        this.matrix[12] = -(right + left) / (right - left)
        this.matrix[13] = -(up + down) / (up - down)
        this.matrix[14] = -(far + near) / (far - near)
        this.matrix[15] = 1
    }

    perspective (left, right, down, up, far, near, size)
    {
        if(size === 1.0)
        {
            this.setParallel(left, right, down, up, near, far)
            return
        }

        this.matrix[ 0] = 2 * size / (right - left)
        this.matrix[ 1] = 0
        this.matrix[ 2] = 0
        this.matrix[ 3] = 0
        this.matrix[ 4] = 0
        this.matrix[ 5] = 2 * size / (up - down)
        this.matrix[ 6] = 0
        this.matrix[ 7] = 0
        this.matrix[ 8] = -(right + left) / (right - left)
        this.matrix[ 9] = -(up + down) / (up - down)
        this.matrix[10] = (far + near) / (far - near)
        this.matrix[11] = 1
        this.matrix[12] = 0
        this.matrix[13] = 0
        this.matrix[14] = -2 * far * near / (far - near)
        this.matrix[15] = 0
    }

    multiply (left, right)
    {
        const m = [16]
        const l = left
        const r = right
        
        m[ 0] = l[ 0] * r[ 0] + l[ 4] * r[ 1] + l[ 8] * r[ 2] + l[12] * r[ 3]
        m[ 1] = l[ 1] * r[ 0] + l[ 5] * r[ 1] + l[ 9] * r[ 2] + l[13] * r[ 3]
        m[ 2] = l[ 2] * r[ 0] + l[ 6] * r[ 1] + l[10] * r[ 2] + l[14] * r[ 3]
        m[ 3] = l[ 3] * r[ 0] + l[ 7] * r[ 1] + l[11] * r[ 2] + l[15] * r[ 3]
        
        m[ 4] = l[ 0] * r[ 4] + l[ 4] * r[ 5] + l[ 8] * r[ 6] + l[12] * r[ 7]
        m[ 5] = l[ 1] * r[ 4] + l[ 5] * r[ 5] + l[ 9] * r[ 6] + l[13] * r[ 7]
        m[ 6] = l[ 2] * r[ 4] + l[ 6] * r[ 5] + l[10] * r[ 6] + l[14] * r[ 7]
        m[ 7] = l[ 3] * r[ 4] + l[ 7] * r[ 5] + l[11] * r[ 6] + l[15] * r[ 7]
        
        m[ 8] = l[ 0] * r[ 8] + l[ 4] * r[ 9] + l[ 8] * r[10] + l[12] * r[11]
        m[ 9] = l[ 1] * r[ 8] + l[ 5] * r[ 9] + l[ 9] * r[10] + l[13] * r[11]
        m[10] = l[ 2] * r[ 8] + l[ 6] * r[ 9] + l[10] * r[10] + l[14] * r[11]
        m[11] = l[ 3] * r[ 8] + l[ 7] * r[ 9] + l[11] * r[10] + l[15] * r[11]
        
        m[12] = l[ 0] * r[12] + l[ 4] * r[13] + l[ 8] * r[14] + l[12] * r[15]
        m[13] = l[ 1] * r[12] + l[ 5] * r[13] + l[ 9] * r[14] + l[13] * r[15]
        m[14] = l[ 2] * r[12] + l[ 6] * r[13] + l[10] * r[14] + l[14] * r[15]
        m[15] = l[ 3] * r[12] + l[ 7] * r[13] + l[11] * r[14] + l[15] * r[15]
        
        return m
    }
}

// シェーダー
const Shader = class
{
    type = null

    constructor(type, renderer)
    {
        this.type = type
        const gl = renderer.gl
        
        let vertexShaderString, fragmentShaderString
        
        if(type === 'color')
        {
            vertexShaderString =
                `#version 300 es
                
                    in vec3 position;
                    in vec3 color;
                    
                    out vec2 varColor;

                    uniform mat4 matrix;
                    
                    void main(void)
                    {
                        varColor = color;
                        gl_Position = matrix * vec4(position, 1.0);
                    }
                `
            
            fragmentShaderString =
                `#version 300 es
                    precision highp sampler2D;
                    precision mediump float;
                    
                    in vec2 varColor;

                    out vec4 outColor;

                    void main(void)
                    {
                        outColor = varColor;
                    }
                `
        }
        else if(type === 'texture')
        {
            vertexShaderString =
                `#version 300 es
                
                    in vec3 position;
                    in vec3 color;
                    in vec2 coordinate;
                    
                    out vec3 varColor;
                    out vec2 varCoordinate;

                    uniform mat4 matrix;
                    
                    void main(void)
                    {
                        varColor = color;
                        varCoordinate = coordinate;
                        gl_Position = matrix * vec4(position, 1.0);
                    }
                `
            
            fragmentShaderString =
                `#version 300 es
                    precision highp sampler2D;
                    precision highp float;
                    
                    in vec3 varColor;
                    in vec2 varCoordinate;

                    out vec4 outColor;

                    uniform sampler2D sampler;
                    
                    void main(void)
                    {
                        outColor = vec4(varColor, 1.0) * texture(sampler, varCoordinate);
                    }
                `
        }
        else if(type === 'sprite')
        {
            vertexShaderString =
                `#version 300 es
                
                    in vec3 position;
                    in vec3 color;
                    
                    out vec3 varColor;

                    uniform float pointSize;
                    uniform mat4 matrix;
                    
                    void main(void)
                    {
                        varColor = color;
                        gl_Position = matrix * vec4(position, 1.0);
                        gl_PointSize = pointSize;
                    }
                `
            
            fragmentShaderString =
                `#version 300 es
                    precision highp sampler2D;
                    precision highp float;
                    
                    in vec3 varColor;

                    out vec4 outColor;

                    uniform sampler2D sampler;
                    
                    void main(void)
                    {
                        outColor = vec4(varColor, 1.0) * texture(sampler, gl_PointCoord);
                    }
                `
        }
        else
        {
            console.error('Shader type error.')
            return
        }

        const vertexShader = gl.createShader(gl.VERTEX_SHADER)
        gl.shaderSource(vertexShader, vertexShaderString)
        gl.compileShader(vertexShader)
        if(!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS))
            console.error(gl.getShaderInfoLog(vertexShader))
        
        const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER)
        gl.shaderSource(fragmentShader, fragmentShaderString)
        gl.compileShader(fragmentShader)
        if(!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS))
            console.error(gl.getShaderInfoLog(fragmentShader))
        
        const program = gl.createProgram()
        gl.attachShader(program, vertexShader)
        gl.attachShader(program, fragmentShader)
        gl.linkProgram(program)
        if(gl.getProgramParameter(program, gl.LINK_STATUS))
        {
            gl.useProgram(program)
            this.program = program
        }
        else
            console.error(gl.getProgramInfoLog(program))
        
        // ロケーション
        this.matrixLocation = gl.getUniformLocation(program, 'matrix')
        this.positionLocation = gl.getAttribLocation(program, 'position')
        this.colorLocation = gl.getAttribLocation(program, 'color')
        if(type !== 'color' && type !== 'sprite')
        {
            this.samplerLocation = gl.getUniformLocation(program, 'sampler')
            this.coordinateLocation = gl.getAttribLocation(program, 'coordinate')
        }
        if(type === 'sprite')
            this.pointSizeLocation = gl.getUniformLocation(program, 'pointSize')
        //this.#renderRotateMatrixLocation = gl.getUniformLocation(program, 'rotateMatrix')
    }
}

// モデル
const Model = class
{
    gl = null
    #renderer = null
    #position = null
    #color = null
    #coordinate = null
    #index = null
    #vbo = null
    #ibo = null
    #texture = null
    #pointSize = 16
    #matrix = null
    #shader = null

    constructor(renderer = null)
    {
        if(renderer === null) return
        this.#renderer = renderer
        const gl = renderer.gl
        this.gl = gl
        this.#texture = {}

        this.#matrix = new Matrix()
        
        this.#texture.glTexture = gl.createTexture()
        gl.activeTexture(gl.TEXTURE0)
        gl.bindTexture(gl.TEXTURE_2D, this.#texture.glTexture)
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST)
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST)
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT)
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT)
        gl.bindTexture(gl.TEXTURE_2D, null)
    }

    // シェーダーをセット
    set shader(s)
    {
        this.#shader = s
    }

    #drawReady()
    {
        const gl = this.gl

        gl.useProgram(this.#shader.program)

        if(this.#texture.glTexture != undefined)
        {
            gl.activeTexture(gl.TEXTURE0)
            gl.bindTexture(gl.TEXTURE_2D, this.#texture.glTexture)
            gl.uniform1i(this.#shader.samplerLocation, 0)
        }

        if(gl.getProgramParameter(this.#shader.program, gl.LINK_STATUS))
            gl.useProgram(this.#shader.program)

        gl.uniformMatrix4fv(this.#shader.matrixLocation, false, this.#matrix.matrix)
        
		//gl.uniformMatrix4fv(this.#renderRotateMatrixLocation, false, this.#matrix.rotateMatrix)

        gl.bindBuffer(gl.ARRAY_BUFFER, this.#vbo)
        
        if(this.#shader.type === 'color')
        {
            gl.enableVertexAttribArray(this.#shader.positionLocation)
            gl.vertexAttribPointer(this.#shader.positionLocation, 3, gl.FLOAT, false, (3 + 3) * 4, 0)
            
            gl.enableVertexAttribArray(this.#shader.colorLocation)
            gl.vertexAttribPointer(this.#shader.colorLocation, 3, gl.FLOAT, false, (3 + 3) * 4, 3 * 4)
        }
        if(this.#shader.type === 'texture')
        {
            gl.enableVertexAttribArray(this.#shader.positionLocation)
            gl.vertexAttribPointer(this.#shader.positionLocation, 3, gl.FLOAT, false, (3 + 3 + 2) * 4, 0)
            
            gl.enableVertexAttribArray(this.#shader.colorLocation)
            gl.vertexAttribPointer(this.#shader.colorLocation, 3, gl.FLOAT, false, (3 + 3 + 2) * 4, 3 * 4)
            
            gl.enableVertexAttribArray(this.#shader.coordinateLocation)
            gl.vertexAttribPointer(this.#shader.coordinateLocation, 2, gl.FLOAT, false, (3 + 3 + 2) * 4, (3 + 3) * 4)
        }
        if(this.#shader.type === 'sprite')
        {
            gl.uniform1f(this.#shader.pointSizeLocation, this.#pointSize)
            gl.enableVertexAttribArray(this.#shader.positionLocation)
            gl.vertexAttribPointer(this.#shader.positionLocation, 3, gl.FLOAT, false, (3 + 3) * 4, 0)
            
            gl.enableVertexAttribArray(this.#shader.colorLocation)
            gl.vertexAttribPointer(this.#shader.colorLocation, 3, gl.FLOAT, false, (3 + 3) * 4, 3 * 4)
        }
        
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.#ibo)
    }

    drawPoints()
    {
        const gl = this.gl

        this.#drawReady()

		gl.bindFramebuffer(gl.FRAMEBUFFER, this.#renderer.framebuffer)
        gl.drawElements(gl.POINTS, this.#index.length, gl.UNSIGNED_SHORT, 0)
		gl.bindFramebuffer(gl.FRAMEBUFFER, null)
    }

    drawTriangles()
    {
        const gl = this.gl

        this.#drawReady()

		gl.bindFramebuffer(gl.FRAMEBUFFER, this.#renderer.framebuffer)
        gl.drawElements(gl.TRIANGLES, this.#index.length, gl.UNSIGNED_SHORT, 0)
		gl.bindFramebuffer(gl.FRAMEBUFFER, null)
    }

    #createVbo()
    {
        const gl = this.gl

        const position = this.#position
        const color = this.#color
        const coordinate = this.#coordinate

        const vertex = []
        for(let i = 0; i < position.length / 3; i++)
        {
            if(position)
            {
                vertex.push(position[i * 3 + 0])
                vertex.push(position[i * 3 + 1])
                vertex.push(position[i * 3 + 2])
            }
            if(color)
            {
                vertex.push(color[i * 3 + 0])
                vertex.push(color[i * 3 + 1])
                vertex.push(color[i * 3 + 2])
            }
            if(coordinate)
            {
                vertex.push(coordinate[i * 2 + 0])
                vertex.push(coordinate[i * 2 + 1])
            }
        }

        const vbo = gl.createBuffer()
        gl.bindBuffer(gl.ARRAY_BUFFER, vbo)
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertex), gl.DYNAMIC_DRAW)
        gl.bindBuffer(gl.ARRAY_BUFFER, null)
        this.#vbo = vbo
    }

    set position(p)
    {
        this.#position = p
        this.#createVbo()
    }

    set coordinate(c)
    {
        this.#coordinate = c
        this.#createVbo()
    }

    set color(c)
    {
        this.#color = c
        this.#createVbo()
    }

    set index(i)
    {
        const gl = this.gl
        this.#index = i
        const ibo = gl.createBuffer()
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ibo)
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Int16Array(i), gl.DYNAMIC_DRAW)
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null)
        this.#ibo = ibo
    }

    set texture(t)
    {
        const gl = this.gl

        gl.bindTexture(gl.TEXTURE_2D, this.#texture.glTexture)
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

    set pointSize(s)
    {
        this.#pointSize = s
    }
}


// レンダラー
const Renderer = class
{
    gl = null
    framebuffer = null
    #canvas = null
    #canvasProgram = null
    #vbo = null
    #ibo = null
    #frameTexture = null
    #depthRenderBuffer = null
    #canvasSamplerLocation = null
    #canvasPositionLocation = null
    #canvasCoordinateLocation = null

    constructor(canvas)
    {
        this.#canvas = canvas
        const gl = canvas.getContext("webgl2")
        this.gl = gl

        if (gl == null)
        {
            console.error('WebGL2 unsuppoted.')
            return
        }

        const canvasVertexShaderString =
        `#version 300 es
            in vec3 position;
            in vec2 coordinate;
            
            out vec2 varCoordinate;
            
            void main(void)
            {
                varCoordinate = coordinate;
                gl_Position = vec4(position, 1.0);
            }
        `
        const canvasFragmentShaderString =
        `#version 300 es
            precision highp sampler2D;
            precision mediump float;
            
            in vec2 varCoordinate;
            
            out vec4 outColor;
            
            uniform sampler2D sampler;
            
            void main(void)
            {
                outColor = texture(sampler, varCoordinate);
            }
        `
        
        const canvasVertexShader = gl.createShader(gl.VERTEX_SHADER)
        gl.shaderSource(canvasVertexShader, canvasVertexShaderString)
        gl.compileShader(canvasVertexShader)
        if(!gl.getShaderParameter(canvasVertexShader, gl.COMPILE_STATUS))
            console.error(gl.getShaderInfoLog(canvasVertexShader))
        
        const canvasFragmentShader = gl.createShader(gl.FRAGMENT_SHADER)
        gl.shaderSource(canvasFragmentShader, canvasFragmentShaderString)
        gl.compileShader(canvasFragmentShader)
        if(!gl.getShaderParameter(canvasFragmentShader, gl.COMPILE_STATUS))
            console.error(gl.getShaderInfoLog(canvasFragmentShader))
        
        const canvasProgram = gl.createProgram()
        gl.attachShader(canvasProgram, canvasVertexShader)
        gl.attachShader(canvasProgram, canvasFragmentShader)
        gl.linkProgram(canvasProgram)
        if(gl.getProgramParameter(canvasProgram, gl.LINK_STATUS))
        {
            gl.useProgram(canvasProgram)
            this.#canvasProgram = canvasProgram
        }
        else
            console.error(gl.getProgramInfoLog(canvasProgram))



        this.positionArray = 
        [
            -1.0, -1.0, 0.0,
             1.0, -1.0, 0.0,
            -1.0 , 1.0, 0.0, 
             1.0 , 1.0, 0.0,
        ]

        this.coordinateArray =
        [
            0, 0,
            1, 0,
            0, 1,
            1, 1,
        ]

        this.vertex = []
        for(let i = 0; i < 4; i++)
        {
            this.vertex.push(this.positionArray[i * 3 + 0])
            this.vertex.push(this.positionArray[i * 3 + 1])
            this.vertex.push(this.positionArray[i * 3 + 2])
            this.vertex.push(this.coordinateArray[i * 2 + 0])
            this.vertex.push(this.coordinateArray[i * 2 + 1])
        }

        const vbo = gl.createBuffer()
        gl.bindBuffer(gl.ARRAY_BUFFER, vbo)
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.vertex), gl.STATIC_DRAW)
        gl.bindBuffer(gl.ARRAY_BUFFER, null)
        this.#vbo = vbo

        this.index =
        [
            0, 1, 2,
            3, 2, 1,
        ]

        const ibo = gl.createBuffer()
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ibo)
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Int16Array(this.index), gl.STATIC_DRAW)
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null)
        this.#ibo = ibo

        this.#canvasSamplerLocation = gl.getUniformLocation(this.#canvasProgram, 'sampler')
        this.#canvasPositionLocation = gl.getAttribLocation(this.#canvasProgram, 'position')
        this.#canvasCoordinateLocation = gl.getAttribLocation(this.#canvasProgram, 'coordinate')

        gl.clearColor(0.0, 0.0, 0.0, 0.0)
		gl.clearDepth(1.0)
		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)

        gl.blendEquationSeparate(gl.FUNC_ADD, gl.FUNC_ADD)
        gl.blendFuncSeparate(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA, gl.ONE, gl.ONE)
        gl.enable(gl.BLEND)

        gl.frontFace(gl.CCW)
        gl.enable(gl.CULL_FACE)

        gl.enable(gl.DEPTH_TEST)
        gl.depthFunc(gl.LEQUAL)
    }

    render()
    {
        const gl = this.gl

        if(this.#frameTexture != undefined)
        {
            gl.activeTexture(gl.TEXTURE0 + 0)
            gl.bindTexture(gl.TEXTURE_2D, this.#frameTexture)
            gl.uniform1i(this.#canvasSamplerLocation, 0)
        }
        else return

        if(gl.getProgramParameter(this.#canvasProgram, gl.LINK_STATUS))
            gl.useProgram(this.#canvasProgram)

        gl.bindBuffer(gl.ARRAY_BUFFER, this.#vbo)
        
        gl.enableVertexAttribArray(this.#canvasPositionLocation)
        gl.vertexAttribPointer(this.#canvasPositionLocation, 3, gl.FLOAT, false, (3 + 2) * 4, 0)

        gl.enableVertexAttribArray(this.#canvasCoordinateLocation)
        gl.vertexAttribPointer(this.#canvasCoordinateLocation, 2, gl.FLOAT, false, (3 + 2) * 4, 3 * 4)
        
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.#ibo)

        gl.drawElements(gl.TRIANGLES, this.index.length, gl.UNSIGNED_SHORT, 0)

        gl.flush()
    }

    clear(r = 0, g = 0, b = 0, a = 0)
    {
        const gl = this.gl
        gl.clearColor(r, g, b, a)
		gl.clearDepth(1.0)
		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
    }

    clearFrame(r = 0, g = 0, b = 0, a = 0)
    {
        const gl = this.gl
		gl.bindFramebuffer(gl.FRAMEBUFFER, this.framebuffer)
        gl.clearColor(r, g, b, a)
		gl.clearDepth(1.0)
		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
		gl.bindFramebuffer(gl.FRAMEBUFFER, null)
    }

    resize(width = 256, height = 256)
    {
        const gl = this.gl
        const canvas = this.#canvas
        
        canvas.width = width
        canvas.height = height
        
        gl.viewport(0, 0, width, height)
        
        this.#depthRenderBuffer = gl.createRenderbuffer()
        gl.bindRenderbuffer(gl.RENDERBUFFER, this.#depthRenderBuffer)
        gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, width, height)
        gl.bindRenderbuffer(gl.RENDERBUFFER, null)
        
        this.#frameTexture = gl.createTexture()
        gl.bindTexture(gl.TEXTURE_2D, this.#frameTexture)
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, width, height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null)
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST)
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST)
        
        this.framebuffer = gl.createFramebuffer()
        
        gl.bindFramebuffer(gl.FRAMEBUFFER, this.framebuffer)
        
        gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, this.#depthRenderBuffer)
        
        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this.#frameTexture, 0)

        gl.bindTexture(gl.TEXTURE_2D, null)
        gl.bindRenderbuffer(gl.RENDERBUFFER, null)
        gl.bindFramebuffer(gl.FRAMEBUFFER, null)
    }
}

export {Matrix, Shader, Model, Renderer}
