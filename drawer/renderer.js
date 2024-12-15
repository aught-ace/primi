const Renderer = class
{
    constructor(canvas)
    {
        this._canvas = canvas
        const gl = canvas.getContext("webgl2")
        this._gl = gl

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
            precision highp float;
            
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
        if(gl.getShaderParameter(canvasVertexShader, gl.COMPILE_STATUS))
            this._canvasVertexShader = canvasVertexShader
        else
            console.error(gl.getShaderInfoLog(canvasVertexShader))
        
        const canvasFragmentShader = gl.createShader(gl.FRAGMENT_SHADER)
        gl.shaderSource(canvasFragmentShader, canvasFragmentShaderString)
        gl.compileShader(canvasFragmentShader)
        if(gl.getShaderParameter(canvasFragmentShader, gl.COMPILE_STATUS))
            this._canvasFragmentShader = canvasFragmentShader
        else
            console.error(gl.getShaderInfoLog(canvasFragmentShader))
        
        const canvasProgram = gl.createProgram()
        gl.attachShader(canvasProgram, canvasVertexShader)
        gl.attachShader(canvasProgram, canvasFragmentShader)
        gl.linkProgram(canvasProgram)
        if(gl.getProgramParameter(canvasProgram, gl.LINK_STATUS))
        {
            gl.useProgram(canvasProgram)
            this._canvasProgram = canvasProgram
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
        this._vbo = vbo

        this.index =
        [
            0, 1, 2,
            3, 2, 1,
        ]

        const ibo = gl.createBuffer()
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ibo)
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Int16Array(this.index), gl.STATIC_DRAW)
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null)
        this._ibo = ibo

        this._canvasSamplerLocation = gl.getUniformLocation(this._canvasProgram, 'sampler')
        this._canvasPositionLocation = gl.getAttribLocation(this._canvasProgram, 'position')
        this._canvasCoordinateLocation = gl.getAttribLocation(this._canvasProgram, 'coordinate')

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
        const gl = this._gl

        if(this._frameTexture != null)
        {
            gl.activeTexture(gl.TEXTURE0 + 0)
            gl.bindTexture(gl.TEXTURE_2D, this._frameTexture)
            gl.uniform1i(this.canvasSamplerLocation, 0)
        }
        else return

        if(gl.getProgramParameter(this._canvasProgram, gl.LINK_STATUS))
            gl.useProgram(this._canvasProgram)

        gl.bindBuffer(gl.ARRAY_BUFFER, this._vbo)
        
        gl.enableVertexAttribArray(this._canvasPositionLocation)
        gl.vertexAttribPointer(this._canvasPositionLocation, 3, gl.FLOAT, false, (3 + 2) * 4, 0)

        gl.enableVertexAttribArray(this._canvasCoordinateLocation)
        gl.vertexAttribPointer(this._canvasCoordinateLocation, 2, gl.FLOAT, false, (3 + 2) * 4, 3 * 4)
        
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this._ibo)

        gl.drawElements(gl.TRIANGLES, this.index.length, gl.UNSIGNED_SHORT, 0)

        gl.flush()
    }

    clear(r = 0, g = 0, b = 0, a = 0)
    {
        const gl = this._gl
        gl.clearColor(r, g, b, a)
		gl.clearDepth(1.0)
		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
    }

    clearFrame(r = 0, g = 0, b = 0, a = 0)
    {
        const gl = this._gl
		gl.bindFramebuffer(gl.FRAMEBUFFER, this._framebuffer)
        gl.clearColor(r, g, b, a)
		gl.clearDepth(1.0)
		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
		gl.bindFramebuffer(gl.FRAMEBUFFER, null)
    }

    resize(width = 256, height = 256)
    {
        const gl = this._gl
        const canvas = this._canvas
        
        canvas.width = width
        canvas.height = height
        
        gl.viewport(0, 0, width, height)
        
        this._depthRenderBuffer = gl.createRenderbuffer()
        gl.bindRenderbuffer(gl.RENDERBUFFER, this._depthRenderBuffer)
        gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, width, height)
        gl.bindRenderbuffer(gl.RENDERBUFFER, null)
        
        this._frameTexture = gl.createTexture()
        gl.bindTexture(gl.TEXTURE_2D, this._frameTexture)
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, width, height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null)
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST)
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST)
        
        this._framebuffer = gl.createFramebuffer()
        
        gl.bindFramebuffer(gl.FRAMEBUFFER, this._framebuffer)
        
        gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, this._depthRenderBuffer)
        
        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this._frameTexture, 0)

        gl.bindTexture(gl.TEXTURE_2D, null)
        gl.bindRenderbuffer(gl.RENDERBUFFER, null)
        gl.bindFramebuffer(gl.FRAMEBUFFER, null)
    }
}

export { Renderer }