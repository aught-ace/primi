const Matrix = class
{
    matrix = null
    rotateMatrix = null

    constructor()
    {
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
        this.matrix = this.multiply(this.matrix ,r)
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
        this.matrix = this.multiply(this.matrix ,r)
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
        this.matrix = this.multiply(this.matrix ,r)
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
        this.matrix = this.multiply(this.matrix ,r)
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
        this.matrix = this.multiply(this.matrix ,r)
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
        this.matrix = this.multiply(this.matrix ,r)
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
        this.matrix = this.multiply(this.matrix ,r)
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
        this.matrix = this.multiply(this.matrix ,r)
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
        this.matrix = this.multiply(this.matrix ,r)
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

export { Matrix }