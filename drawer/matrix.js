const Matrix = class extends Float32Array
{
    constructor()
    {
        super(16)

        this[ 0] = 1
        this[ 1] = 0
        this[ 2] = 0
        this[ 3] = 0

        this[ 4] = 0
        this[ 5] = 1
        this[ 6] = 0
        this[ 7] = 0
        
        this[ 8] = 0
        this[ 9] = 0
        this[10] = 1
        this[11] = 0
        
        this[12] = 0
        this[13] = 0
        this[14] = 0
        this[15] = 1
    }

    setTranslate (left, down, near)
    {
        this[ 0] = 1
        this[ 1] = 0
        this[ 2] = 0
        this[ 3] = 0

        this[ 4] = 0
        this[ 5] = 1
        this[ 6] = 0
        this[ 7] = 0

        this[ 8] = 0
        this[ 9] = 0
        this[10] = 1
        this[11] = 0

        this[12] = left
        this[13] = down
        this[14] = near
        this[15] = 1
    }

    setScale (width, height, depth)
    {
        this[ 0] = width
        this[ 1] = 0
        this[ 2] = 0
        this[ 3] = 0

        this[ 4] = 0
        this[ 5] = height
        this[ 6] = 0
        this[ 7] = 0

        this[ 8] = 0
        this[ 9] = 0
        this[10] = depth
        this[11] = 0

        this[12] = 0
        this[13] = 0
        this[14] = 0
        this[15] = 1
    }

    setRotateX (rad)
    {
        this[ 0] = 1
        this[ 1] = 0
        this[ 2] = 0
        this[ 3] = 0

        this[ 4] = 0
        this[ 5] = Math.cos(rad)
        this[ 6] = Math.sin(rad)
        this[ 7] = 0

        this[ 8] = 0
        this[ 9] = -Math.sin(rad)
        this[10] = Math.cos(rad)
        this[11] = 0

        this[12] = 0
        this[13] = 0
        this[14] = 0
        this[15] = 1
    }

    setRotateY (rad)
    {
        this[ 0] = Math.cos(rad)
        this[ 1] = 0
        this[ 2] = -Math.sin(rad)
        this[ 3] = 0

        this[ 4] = 0
        this[ 5] = 1
        this[ 6] = 0
        this[ 7] = 0

        this[ 8] = Math.sin(rad)
        this[ 9] = 0
        this[10] = Math.cos(rad)
        this[11] = 0

        this[12] = 0
        this[13] = 0
        this[14] = 0
        this[15] = 1
    }

    setRotateZ (rad)
    {
        this[ 0] = Math.cos(rad)
        this[ 1] = Math.sin(rad)
        this[ 2] = 0
        this[ 3] = 0

        this[ 4] = -Math.sin(rad)
        this[ 5] = Math.cos(rad)
        this[ 6] = 0
        this[ 7] = 0

        this[ 8] = 0
        this[ 9] = 0
        this[10] = 1
        this[11] = 0

        this[12] = 0
        this[13] = 0
        this[14] = 0
        this[15] = 1
    }

    setParallel (left, right, down, up, near, far)
    {
        this[ 0] = 2 / (right - left)
        this[ 1] = 0
        this[ 2] = 0
        this[ 3] = 0

        this[ 4] = 0
        this[ 5] = 2 / (up - down)
        this[ 6] = 0
        this[ 7] = 0

        this[ 8] = 0
        this[ 9] = 0
        this[10] = 2 / (far - near)
        this[11] = 0

        this[12] = -(right + left) / (right - left)
        this[13] = -(up + down) / (up - down)
        this[14] = -(far + near) / (far - near)
        this[15] = 1
    }

    setPerspective (left, right, down, up, far, near, size)
    {
        if(size === 1.0)
        {
            this.setParallel(left, right, down, up, near, far)
            return
        }

        this[ 0] = 2 * size / (right - left)
        this[ 1] = 0
        this[ 2] = 0
        this[ 3] = 0

        this[ 4] = 0
        this[ 5] = 2 * size / (up - down)
        this[ 6] = 0
        this[ 7] = 0

        this[ 8] = -(right + left) / (right - left)
        this[ 9] = -(up + down) / (up - down)
        this[10] = (far + near) / (far - near)
        this[11] = 1

        this[12] = 0
        this[13] = 0
        this[14] = -2 * far * near / (far - near)
        this[15] = 0
    }

    multiply (right)
    {
        const m = new Matrix()
        const l = new Matrix()
        for(let i in this){ l[i] = this[i] }
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

export { Matrix }