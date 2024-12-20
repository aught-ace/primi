// 描画モジュールのインポート
import { Matrix, Shader, Model, Renderer } from './renderer.js'

// モード
let mode = 
{
    name: 'param3d',
    dimension: 3,
}

// 要素
const element =
{
    canvas: document.querySelector('#canvas'),
    param3dDiv: document.querySelector('#param-3d-div'),
    param2dDiv: document.querySelector('#param-2d-div'),
    param3dForm: document.querySelector('#param-3d-form'),
    param2dForm: document.querySelector('#param-2d-form'),
    name: document.querySelector('#name'),
    left: document.querySelector('#left'),
    right: document.querySelector('#right'),
    top: document.querySelector('#top'),
    bottom: document.querySelector('#bottom'),
    near: document.querySelector('#near'),
    far: document.querySelector('#far'),
    timeLength: document.querySelector('#time-length'),
    param: document.querySelector('#param'),
    param3dMode: document.querySelector('#param-3d-mode'),
    param2dMode: document.querySelector('#param-2d-mode'),
    vertex3dMode: document.querySelector('#vertex-3d-mode'),
    matrixMode: document.querySelector('#matrix-mode'),
    surfaceMode: document.querySelector('#surface-mode'),
    vertex2dMode: document.querySelector('#vertex-2d-mode'),
    texelMode: document.querySelector('#texel-mode'),
    pose3dMode: document.querySelector('#pose-3d-mode'),
    pose2dMode: document.querySelector('#pose-2d-mode'),
    depthBar: document.querySelector('#depth-bar'),
    depth: document.querySelector('#depth'),
    timeBar: document.querySelector('#time-bar'),
    time: document.querySelector('#time'),
    surfaceDiv: document.querySelector('#surface-div'),
    vertexDiv: document.querySelector('#vertex-div'),
    matrixDiv: document.querySelector('#matrix-div'),
    param3dDiv: document.querySelector('#param-3d-div'),
    param2dDiv: document.querySelector('#param-2d-div'),
    pose3dDiv: document.querySelector('#pose-3d-div'),
    pose2dDiv: document.querySelector('#pose-2d-div'),
    texelDiv: document.querySelector('#texel-div'),
    saveForm: document.querySelector('#save-form'),
    import: document.querySelector('#import'),
    export: document.querySelector('#export'),
    newButton: document.querySelector('#new'),
    scrollPad: document.querySelector('#scroll-pad'),
    rotatePad: document.querySelector('#rotate-pad'),
    scroll: document.querySelector('#scroll'),
    rotate: document.querySelector('#rotate'),
    grid: document.querySelector('#grid'),
    textureWidth: document.querySelector('#texture-width'),
    textureHeight: document.querySelector('#texture-height'),
    positionX: document.querySelector('#position-x'),
    positionY: document.querySelector('#position-y'),
    positionZ: document.querySelector('#position-z'),
    time: document.querySelector('#position-t'),
    rotateX: document.querySelector('#rotate-x'),
    rotateY: document.querySelector('#rotate-y'),
    textureX: document.querySelector('#texture-x'),
    textureY: document.querySelector('#texture-y'),
    put: document.querySelector('#put'),
    up: document.querySelector('#up'),
    down: document.querySelector('#down'),
    select: document.querySelector('#select'),
    grab: document.querySelector('#grab'),
    remove: document.querySelector('#remove'),
    texelColor: document.querySelector('#texel-color'),
    vertexColor: document.querySelector('#vertex-color'),
    verticeList: document.querySelector('#vertice-list'),
}

// 操作オブジェクト
let control

// オブジェクト本体
let object

// 現在のカーソル位置などの更新
const updateCursor = (deltaTime) =>
{
    const d = deltaTime / 1000

    // 前回の値を対比
    const x = control.current.x
    const y = control.current.y
    const z = control.current.z
    const t = control.current.t
    const rotX = control.current.rotX
    const rotY = control.current.rotY
    const texX = control.current.texX
    const texY = control.current.texY

    // 位置に速度を加算
    control.current.x += control.delta.x * d
    control.current.y += control.delta.y * d
    control.current.z += control.delta.z * d
    control.current.t += control.delta.t * d
    control.current.rotX += control.delta.rotX * d
    control.current.rotY += control.delta.rotY * d
    control.current.texX += control.delta.texX * d
    control.current.texY += control.delta.texY * d

    // はじくように移動
    control.goal.x += control.delta.x * d
    control.goal.y += control.delta.y * d
    control.goal.z += control.delta.z * d
    control.goal.t += control.delta.t * d
    control.goal.rotX += control.delta.rotX * d
    control.goal.rotY += control.delta.rotY * d
    control.goal.texX += control.delta.texX * d
    control.goal.texY += control.delta.texY * d

    // テクスチャの限界
    if(control.current.texX < 0) control.current.texX = 0
    if(2 <= control.current.texX) control.current.texX = 1.9999999
    if(control.current.texY < 0) control.current.texY = 0
    if(2 <= control.current.texY) control.current.texY = 1.9999999
    if(control.goal.texX < 0) control.goal.texX = 0
    if(2 <= control.goal.texX) control.goal.texX = 1.9999999
    if(control.goal.texY < 0) control.goal.texY = 0
    if(2 <= control.goal.texY) control.goal.texY = 1.9999999

    // X軸回転の限界
    if(control.current.rotX < -1) control.current.rotX = -1
    if(1 < control.current.rotX) control.current.rotX = 1
    if(control.goal.rotX < -1) control.goal.rotX = -1
    if(1 < control.goal.rotX) control.goal.rotX = 1

    // 丸める時のはじくような挙動
    const div = 1.125
    control.current.x = (control.current.x - control.goal.x) / div + control.goal.x
    control.current.y = (control.current.y - control.goal.y) / div + control.goal.y
    control.current.z = (control.current.z - control.goal.z) / div + control.goal.z
    control.current.t = (control.current.t - control.goal.t) / div + control.goal.t
    control.current.rotX = (control.current.rotX - control.goal.rotX) / div + control.goal.rotX
    control.current.rotY = (control.current.rotY - control.goal.rotY) / div + control.goal.rotY
    control.current.texX = (control.current.texX - control.goal.texX) / div + control.goal.texX
    control.current.texY = (control.current.texY - control.goal.texY) / div + control.goal.texY
    control.current.scale = (control.current.scale - control.goal.scale) / div + control.goal.scale
    // 十分近づいたら同じ値にしてしまう
    const e = 0.03125
    if(Math.abs(control.current.x - control.goal.x) < e) control.current.x  = control.goal.x
    if(Math.abs(control.current.y - control.goal.y) < e) control.current.y  = control.goal.y
    if(Math.abs(control.current.z - control.goal.z) < e) control.current.z  = control.goal.z
    if(Math.abs(control.current.t - control.goal.t) < e) control.current.t  = control.goal.t
    if(Math.abs(control.current.rotX - control.goal.rotX) < e) control.current.rotX  = control.goal.rotX
    if(Math.abs(control.current.rotY - control.goal.rotY) < e) control.current.rotY  = control.goal.rotY
    if(Math.abs(control.current.texX - control.goal.texX) < e) control.current.texX  = control.goal.texX
    if(Math.abs(control.current.texY - control.goal.texY) < e) control.current.texY  = control.goal.texY
    if(Math.abs(control.current.scale - control.goal.scale) < e) control.current.scale  = control.goal.scale

    // 照準位置に変化があった
    const g = control.grid * 2
    if(
        Math.round(control.current.x * g) !== Math.round(x * g) ||
        Math.round(control.current.y * g) !== Math.round(y * g) ||
        Math.round(control.current.z * g) !== Math.round(z * g)
    )
    {
        if(mode.name === 'vertex3d')
            updateVertexList()
        if(!control.vertex.grab) control.vertex.selected = -1
    }
    const tw = object.texture.width * 2
    const th = object.texture.height * 2
    if(
        Math.floor(control.current.texX * tw) !== Math.floor(texX * tw) ||
        Math.floor(control.current.texY * th) !== Math.floor(texY * th)
    )
    {
        if(mode.name === 'vertex2d')
            updateVertexList()
        if(!control.vertex.grab) control.vertex.selected = -1
    }

    // つかんだ頂点の位置を変化させる
    if(control.vertex.grab)
    {
        if(mode.name === 'vertex3d')
        {
            if(control.vertex.selected === -1)
            {
                for(let i = 0; i < object.vertexCount; i++)
                {
                    object.position[i * 3 + 0] += control.current.x - x
                    object.position[i * 3 + 1] += control.current.y - y
                    object.position[i * 3 + 2] += control.current.z - z
                }
            }
            else
            {
                const i = control.vertex.selected
                object.position[i * 3 + 0] += control.current.x - x
                object.position[i * 3 + 1] += control.current.y - y
                object.position[i * 3 + 2] += control.current.z - z
            }
        } else if(mode.name === 'vertex2d')
        {
            if(control.vertex.selected === -1)
            {
                for(let i = 0; i < object.vertexCount; i++)
                {
                    object.coordinate[i * 2 + 0] += control.current.texX - texX
                    object.coordinate[i * 2 + 1] += control.current.texY - texY
                }
            }
            else
            {
                const i = control.vertex.selected
                object.coordinate[i * 2 + 0] += control.current.texX - texX
                object.coordinate[i * 2 + 1] += control.current.texY - texY
            }
        }
        updateModel()
    }

    // 表示
    element.positionX.textContent = 'x: ' + Math.round(control.current.x * control.grid)
    element.positionY.textContent = 'y: ' + Math.round(control.current.y * control.grid)
    element.positionZ.textContent = 'z: ' + Math.round(control.current.z * control.grid)
    element.time.textContent = 't: ' + Math.round(control.current.t)
    element.rotateX.textContent = 'rx: ' + Math.round(control.current.rotX)
    element.rotateY.textContent = 'ry: ' + Math.round(control.current.rotY)
    element.textureX.textContent = 'tx: ' + Math.floor(control.current.texX * object.texture.width / 2)
    element.textureY.textContent = 'ty: ' + Math.floor(control.current.texY * object.texture.height / 2)
}

// 描画フレームワーク
const renderer = new Renderer(element.canvas)

const shader = {}
shader.texture = new Shader('texture', renderer)
shader.sprite = new Shader('sprite', renderer)

const model = {}
model.bg3d = new Model(renderer)
model.bg2d = new Model(renderer)
model.point3d = new Model(renderer)
model.point2d = new Model(renderer)
model.originalPoint = new Model(renderer)
model.strongPoint = new Model(renderer)
model.texture = new Model(renderer)
model.center = new Model(renderer)

const matrix = {}
matrix.bg3d = new Matrix()
matrix.bg2d = new Matrix()
matrix.point3d = new Matrix()
matrix.point2d = new Matrix()
matrix.originalPoint = new Matrix()
matrix.strongPoint = new Matrix()
matrix.texture = new Matrix()
matrix.center = new Matrix()

// クラス追加
const addClass = (element, className) =>
{
    if(!element.classList.contains(className)) element.classList.add(className)
}
// クラス削除
const removeClass = (element, className) =>
{
    if(element.classList.contains(className)) element.classList.remove(className)
}


// 頂点リスト更新
const updateVertexList = () =>
{
    control.vertex.elementList = []
    element.verticeList.innerHTML = ''

    const s = 1 / control.grid / 2
    const sw = 1 / object.texture.width / 2
    const sh = 1 / object.texture.height / 2
    for(let n = 0; n < object.vertexCount; n++)
    {
        // グリッド範囲内の頂点をリスト表示
        const r = 
            mode.dimension === 3 &&
            object.position[n * 3 + 0] > control.current.x - s &&
            object.position[n * 3 + 0] < control.current.x + s &&
            object.position[n * 3 + 1] > control.current.y - s &&
            object.position[n * 3 + 1] < control.current.y + s &&
            object.position[n * 3 + 2] > control.current.z - s &&
            object.position[n * 3 + 2] < control.current.z + s ||
            mode.dimension === 2 &&
            object.coordinate[n * 2 + 0] > control.current.texX - sw &&
            object.coordinate[n * 2 + 0] < control.current.texX + sw &&
            object.coordinate[n * 2 + 1] > control.current.texY - sh &&
            object.coordinate[n * 2 + 1] < control.current.texY + sh
        if(r)
        {
            const li = document.createElement('li')
            li.textContent = n
            addClass(li, 'vertex')
            if(n == control.vertex.selected) addClass(li, 'selected')
            li.addEventListener('pointerdown', callback.selectVertex)
            element.verticeList.append(li)
            control.vertex.elementList.push(li)
        }
    }
}

// テクスチャ初期化
const initTexture = () =>
{
    for(let i = 0; i < object.texture.width * object.texture.height * 4; i++)
        object.texture.data[i] = 255
    model.texture.texture = 
    {
        width: object.texture.width,
        height: object.texture.height,
        data: object.texture.data,
    }
}

// 初期化
const init = () =>
{
    // モードを戻す
    mode.name = 'param3d'
    mode.dimension = 3
    
    addClass(element.pose3dDiv, 'none')
    addClass(element.pose2dDiv, 'none')
    addClass(element.param3dDiv, 'none')
    addClass(element.param2dDiv, 'none')
    addClass(element.vertexDiv, 'none')
    addClass(element.surfaceDiv, 'none')
    addClass(element.matrixDiv, 'none')
    addClass(element.texelDiv, 'none')

    removeClass(element.param3dMode, 'selected')
    removeClass(element.param2dMode, 'selected')
    removeClass(element.vertex3dMode, 'selected')
    removeClass(element.vertex2dMode, 'selected')
    removeClass(element.matrixMode, 'selected')
    removeClass(element.texelMode, 'selected')
    removeClass(element.surfaceMode, 'selected')
    removeClass(element.pose3dMode, 'selected')
    removeClass(element.pose2dMode, 'selected')

    removeClass(element.param3dDiv, 'none')
    addClass(element.param3dMode, 'selected')

    // 操作オブジェクト
    control =
    {
        delta:
        {
            x: 0,
            y: 0,
            z: 0,
            t: 0,
            rotX: 0,
            rotY: 0,
            texX: 0,
            texY: 0,
        },
        current:
        {
            x: 0,
            y: 0,
            z: 0,
            t: 0,
            rotX: 0,
            rotY: 0,
            texX: 0,
            texY: 0,
            scale: 1,
        },
        goal:
        {
            x: 0,
            y: 0,
            z: 0,
            t: 0,
            rotX: 0,
            rotY: 0,
            texX: 0,
            texY: 0,
            scale: 1,
        },
        update:
        {
            x: false,
            y: false,
            z: false,
            t: false,
            rotX: false,
            rotY: false,
            texX: false,
            texY: false,
        },
        vertex:
        {
            selected: -1,
            elementList: [],
            color: [1, 1, 1, 1],
            grab: false,
        },
        texel:
        {
            put: false,
            remove: false,
            color: [0, 0, 0, 255],
        },
        grid: 7,
    }

    // 3Dモデルのオブジェクト
    object =
    {
        name: new Date()
            .toLocaleDateString(
                [],
                {
                    year: '2-digit',
                    month: '2-digit',
                    day: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                }
            ).replaceAll(/[\/: ]/g, ''),
        position: [],
        coordinate: [],
        color: [],
        index: [],
        vertexCount: 0,
        texture:
        {
            width: 16,
            height: 16,
            data: [],
        },
    }
    element.name.value = object.name

    // テクセル描き状態などのオフ
    control.vertex.grab = false
    control.texel.remove = false
    control.texel.put = false
    removeClass(element.remove, 'selected')
    removeClass(element.put, 'selected')

    // 頂点リスト更新
    updateVertexList()

    // 描いてあるものを消去
    renderer.clearFrame(0.5, 0.5, 0.5, 1)
    renderer.clear(0.5, 0.5, 0.5, 1)

    // 3d背景の板
    model.bg3d.shader = shader.texture

    model.bg3d.position = 
    [
        -4, -4, 1,
         4, -4, 1,
        -4,  4, 1,
         4,  4, 1,
    ]
    model.bg3d.color = 
    [
        1, 1, 1,
        1, 1, 1,
        1, 1, 1,
        1, 1, 1,
    ]
    const g = control.grid * 8
    model.bg3d.coordinate = 
    [
        0, 0,
        g, 0,
        0, g,
        g, g,
    ]
    model.bg3d.index = 
    [
        0, 1, 2,
        3, 2, 1,
    ]
    // 点を描く
    const background3dTextureData = []
    const bg3w = 16, bg3h = 16
    for(let y = 0; y < bg3w; y++)
        for(let x = 0; x < bg3h; x++)
        {
            background3dTextureData[(y * bg3w + x) * 4 + 0] = 0x88
            background3dTextureData[(y * bg3w + x) * 4 + 1] = 0x88
            background3dTextureData[(y * bg3w + x) * 4 + 2] = 0x88
            background3dTextureData[(y * bg3w + x) * 4 + 3] = 0xFF
            const p = 1
            if(
                (bg3w - p <= x || x < p) &&
                (bg3h - p <= y || y < p)
            )
            {
                background3dTextureData[(y * bg3w + x) * 4 + 0] = 0x66
                background3dTextureData[(y * bg3w + x) * 4 + 1] = 0x66
                background3dTextureData[(y * bg3w + x) * 4 + 2] = 0x66
            }
        }
        model.bg3d.texture = 
    {
        width: bg3w,
        height: bg3h,
        data: background3dTextureData,
    }
    model.bg3d.matrix = matrix.bg3d

    // 2d背景の板
    model.bg2d.shader = shader.texture
    model.bg2d.position = 
    [
        -4, -4, 0.2,
         4, -4, 0.2,
        -4,  4, 0.2,
         4,  4, 0.2,
    ]
    model.bg2d.color = 
    [
        1, 1, 1,
        1, 1, 1,
        1, 1, 1,
        1, 1, 1,
    ]
    model.bg2d.coordinate = 
    [
         0,  0,
        64,  0,
         0, 64,
        64, 64,
    ]
    model.bg2d.index = 
    [
        0, 1, 2,
        3, 2, 1,
    ]
    // 四角を描く
    const background2dTextureData = []
    const bgw = 16, bgh = 16
    for(let y = 0; y < bgw; y++)
        for(let x = 0; x < bgh; x++)
        {
            background2dTextureData[(y * bgw + x) * 4 + 0] = 0x66
            background2dTextureData[(y * bgw + x) * 4 + 1] = 0x66
            background2dTextureData[(y * bgw + x) * 4 + 2] = 0x66
            background2dTextureData[(y * bgw + x) * 4 + 3] = 0x22
            const xw = x - bgw / 2
            const yh = y - bgh / 2
            const p = 7
            if(-p <= xw && xw < p && -p <= yh && yh < p)
            {
                background2dTextureData[(y * bgw + x) * 4 + 3] = 0x00
            }
        }
    model.bg2d.texture = 
    {
        width: bgw,
        height: bgh,
        data: background2dTextureData,
    }
    model.bg2d.matrix = matrix.bg2d

    // 照準の板
    model.center.shader = shader.sprite
    model.center.position = 
    [
        0, 0, 0,
    ]
    model.center.color = 
    [
        1, 1, 1,
    ]
    model.center.index = 
    [
        0,
    ]
    // 十字を描く
    const centerTextureData = []
    for(let y = 0; y < 16; y++)
        for(let x = 0; x < 16; x++)
        {
            centerTextureData[(y * 16 + x) * 4 + 0] = 255
            centerTextureData[(y * 16 + x) * 4 + 1] = 255
            centerTextureData[(y * 16 + x) * 4 + 2] = 255
            centerTextureData[(y * 16 + x) * 4 + 3] = 0
            if(6 <= x && x <= 9 || 6 <= y && y <= 9)
            {
                centerTextureData[(y * 16 + x) * 4 + 0] = 0
                centerTextureData[(y * 16 + x) * 4 + 1] = 0
                centerTextureData[(y * 16 + x) * 4 + 2] = 0
                centerTextureData[(y * 16 + x) * 4 + 3] = 255
            }
            if(
                x !== 0 && x !== 15 && y !== 0 && y !== 15 &&
                (x === 7 || x === 8 || y === 7 || y === 8)
            )
            {
                centerTextureData[(y * 16 + x) * 4 + 0] = 255
                centerTextureData[(y * 16 + x) * 4 + 1] = 255
                centerTextureData[(y * 16 + x) * 4 + 2] = 255
                centerTextureData[(y * 16 + x) * 4 + 3] = 255
            }
        }
    model.center.texture = 
    {
        width: 16,
        height: 16,
        data: centerTextureData,
    }
    model.center.matrix = matrix.center
    model.center.pointSize = 16

    
    // 3Dモデルの点群
    model.point3d.shader = shader.sprite
    model.point3d.position = []
    model.point3d.color = []
    model.point3d.index = []
    // スプライト点を描く
    const pointTextureData = []
    const pw = 64, ph = 64
    for(let y = 0; y < pw; y++)
        for(let x = 0; x < ph; x++)
        {
            pointTextureData[(y * pw + x) * 4 + 0] = 0x00
            pointTextureData[(y * pw + x) * 4 + 1] = 0x00
            pointTextureData[(y * pw + x) * 4 + 2] = 0x00
            pointTextureData[(y * pw + x) * 4 + 3] = 0x00
            const r = (x - pw / 2) * (x - pw / 2) + (y - ph / 2) * (y - ph / 2)
            const p = 32 * 32
            const q = 28 * 28
            if(r <= p)
            {
                pointTextureData[(y * pw + x) * 4 + 3] = 0xFF
            }
            if(r <= q)
            {
                pointTextureData[(y * pw + x) * 4 + 0] = 0xFF
                pointTextureData[(y * pw + x) * 4 + 1] = 0xFF
                pointTextureData[(y * pw + x) * 4 + 2] = 0xFF
                pointTextureData[(y * pw + x) * 4 + 3] = 0xFF
            }
        }
    model.point3d.texture = 
    {
        width: pw,
        height: ph,
        data: pointTextureData,
    }
    model.point3d.matrix = matrix.point3d
    model.point3d.pointSize = 100 / control.grid

    // 2Dモデルの点群
    model.point2d.shader = shader.sprite
    model.point2d.position = []
    model.point2d.color = []
    model.point2d.index = []
    // スプライト点を描く
    const point2dTextureData = []
    const p2w = 64, p2h = 64
    for(let y = 0; y < p2w; y++)
        for(let x = 0; x < p2h; x++)
        {
            point2dTextureData[(y * p2w + x) * 4 + 0] = 0x00
            point2dTextureData[(y * p2w + x) * 4 + 1] = 0x00
            point2dTextureData[(y * p2w + x) * 4 + 2] = 0x00
            point2dTextureData[(y * p2w + x) * 4 + 3] = 0x00
            const r = (x - p2w / 2) * (x - p2w / 2) + (y - p2h / 2) * (y - p2h / 2)
            const p = 32 * 32
            const q = 28 * 28
            if(r <= p)
            {
                point2dTextureData[(y * p2w + x) * 4 + 3] = 0xFF
            }
            if(r <= q)
            {
                point2dTextureData[(y * p2w + x) * 4 + 0] = 0xFF
                point2dTextureData[(y * p2w + x) * 4 + 1] = 0xFF
                point2dTextureData[(y * p2w + x) * 4 + 2] = 0xFF
                point2dTextureData[(y * p2w + x) * 4 + 3] = 0xFF
            }
        }
    model.point2d.texture = 
    {
        width: p2w,
        height: p2h,
        data: point2dTextureData,
    }
    model.point2d.matrix = matrix.point2d
    model.point2d.pointSize = 128 / control.grid

    // 強調する点のモデル
    model.strongPoint.shader = shader.sprite
    model.strongPoint.position = [
        -2, -2, -2,
        -1, -2, -2,
         0, -2, -2,
         1, -2, -2,
         2, -2, -2,

        -2, -1, -2,
        -1, -1, -2,
         0, -1, -2,
         1, -1, -2,
         2, -1, -2,

        -2, 0, -2,
        -1, 0, -2,
         0, 0, -2,
         1, 0, -2,
         2, 0, -2,
         
        -2, 1, -2,
        -1, 1, -2,
         0, 1, -2,
         1, 1, -2,
         2, 1, -2,

        -2, 2, -2,
        -1, 2, -2,
         0, 2, -2,
         1, 2, -2,
         2, 2, -2,

         -2, -2, -1,
         -1, -2, -1,
          0, -2, -1,
          1, -2, -1,
          2, -2, -1,
 
         -2, -1, -1,
         -1, -1, -1,
          0, -1, -1,
          1, -1, -1,
          2, -1, -1,
 
         -2, 0, -1,
         -1, 0, -1,
          0, 0, -1,
          1, 0, -1,
          2, 0, -1,
          
         -2, 1, -1,
         -1, 1, -1,
          0, 1, -1,
          1, 1, -1,
          2, 1, -1,
 
         -2, 2, -1,
         -1, 2, -1,
          0, 2, -1,
          1, 2, -1,
          2, 2, -1,

        -2, -2, 0,
        -1, -2, 0,
         0, -2, 0,
         1, -2, 0,
         2, -2, 0,

        -2, -1, 0,
        -1, -1, 0,
         0, -1, 0,
         1, -1, 0,
         2, -1, 0,

        -2, 0, 0,
        -1, 0, 0,
        1, 0, 0,
         2, 0, 0,
         
        -2, 1, 0,
        -1, 1, 0,
        0, 1, 0,
        1, 1, 0,
        2, 1, 0,

        -2, 2, 0,
        -1, 2, 0,
        0, 2, 0,
        1, 2, 0,
        2, 2, 0,
        
        -2, -2, 1,
        -1, -2, 1,
         0, -2, 1,
         1, -2, 1,
         2, -2, 1,

        -2, -1, 1,
        -1, -1, 1,
         0, -1, 1,
         1, -1, 1,
         2, -1, 1,

        -2, 0, 1,
        -1, 0, 1,
         0, 0, 1,
         1, 0, 1,
         2, 0, 1,
         
        -2, 1, 1,
        -1, 1, 1,
         0, 1, 1,
         1, 1, 1,
         2, 1, 1,

        -2, 2, 1,
        -1, 2, 1,
         0, 2, 1,
         1, 2, 1,
         2, 2, 1,

         -2, -2, 2,
         -1, -2, 2,
          0, -2, 2,
          1, -2, 2,
          2, -2, 2,
 
         -2, -1, 2,
         -1, -1, 2,
          0, -1, 2,
          1, -1, 2,
          2, -1, 2,
 
         -2, 0, 2,
         -1, 0, 2,
          0, 0, 2,
          1, 0, 2,
          2, 0, 2,
          
         -2, 1, 2,
         -1, 1, 2,
          0, 1, 2,
          1, 1, 2,
          2, 1, 2,
 
         -2, 2, 2,
         -1, 2, 2,
          0, 2, 2,
          1, 2, 2,
          2, 2, 2,
    ]
    const c = [], i = []
    for(let n = 0; n < 124; n++)
    {
        c[n * 3 + 0] = 0.4
        c[n * 3 + 1] = 0.4
        c[n * 3 + 2] = 0.4
        i[n] = n
    }
    model.strongPoint.color = c
    model.strongPoint.index = i
    // 強調する点を描く
    const strongPointTextureData = []
    const sw = 8, sh = 8
    for(let y = 0; y < sw; y++)
        for(let x = 0; x < sh; x++)
        {
            strongPointTextureData[(y * sw + x) * 4 + 0] = 0x00
            strongPointTextureData[(y * sw + x) * 4 + 1] = 0x00
            strongPointTextureData[(y * sw + x) * 4 + 2] = 0x00
            strongPointTextureData[(y * sw + x) * 4 + 3] = 0x00
            if(
                (x === sw / 2 || x ===  sw / 2 - 1) ||
                (y === sh / 2 || y === sh / 2 - 1)
            )
            {
                strongPointTextureData[(y * sw + x) * 4 + 0] = 0xFF
                strongPointTextureData[(y * sw + x) * 4 + 1] = 0xFF
                strongPointTextureData[(y * sw + x) * 4 + 2] = 0xFF
                strongPointTextureData[(y * sw + x) * 4 + 3] = 0xFF
            }
        }
    model.strongPoint.texture = 
    {
        width: sw,
        height: sh,
        data: strongPointTextureData,
    }
    model.strongPoint.matrix = matrix.strongPoint
    model.strongPoint.pointSize = 200 / control.grid

    // 原点のモデル
    model.originalPoint.shader = shader.sprite
    model.originalPoint.position = [ 0, 0, 0, ]
    model.originalPoint.color = [ 0.4, 0.4, 0.4, ]
    model.originalPoint.index = [ 0 ]
    const originalPointTextureData = []
    const ow = 16, oh = 16
    for(let y = 0; y < ow; y++)
        for(let x = 0; x < oh; x++)
        {
            originalPointTextureData[(y * ow + x) * 4 + 0] = 0x00
            originalPointTextureData[(y * ow + x) * 4 + 1] = 0x00
            originalPointTextureData[(y * ow + x) * 4 + 2] = 0x00
            originalPointTextureData[(y * ow + x) * 4 + 3] = 0x00
            if(
                (x === ow / 2 || x ===  ow / 2 - 1) ||
                (y === oh / 2 || y === oh / 2 - 1)
            )
            {
                originalPointTextureData[(y * ow + x) * 4 + 0] = 0xFF
                originalPointTextureData[(y * ow + x) * 4 + 1] = 0xFF
                originalPointTextureData[(y * ow + x) * 4 + 2] = 0xFF
                originalPointTextureData[(y * ow + x) * 4 + 3] = 0xFF
            }
        }
    model.originalPoint.texture = 
    {
        width: ow,
        height: oh,
        data: originalPointTextureData,
    }
    model.originalPoint.matrix = matrix.originalPoint
    model.originalPoint.pointSize = 400 / control.grid

    // テクスチャ表示用の板
    model.texture.shader = shader.texture
    model.texture.position = 
    [
         0, 0, 0.4,
         2, 0, 0.4,
         0, 2, 0.4,
         2, 2, 0.4,
    ]
    model.texture.color = 
    [
        1, 1, 1,
        1, 1, 1,
        1, 1, 1,
        1, 1, 1,
    ]
    model.texture.coordinate = 
    [
        0, 0,
        1, 0,
        0, 1,
        1, 1,
    ]
    model.texture.index = 
    [
        0, 1, 2,
        3, 2, 1,
    ]
    model.texture.matrix = matrix.texture
    initTexture()
}
init()



// テクスチャ更新
const updateTexture = () =>
{
    model.texture.texture = 
    {
        width: object.texture.width,
        height: object.texture.height,
        data: object.texture.data,
    }
}

// テクセル描き
const putTexel = () =>
{
    let c
    if(control.texel.put) c = control.texel.color
    else if(control.texel.remove) c = [0, 0, 0, 0]
    else return
    const w = object.texture.width
    const h = object.texture.height
    const x = Math.floor(control.current.texX * w / 2)
    const y = Math.floor(control.current.texY * h / 2)
    if(
        x < 0 || w <= x ||
        y < 0 || h <= y
    ) return

    object.texture.data[(y * w + x) * 4 + 0] = c[0]
    object.texture.data[(y * w + x) * 4 + 1] = c[1]
    object.texture.data[(y * w + x) * 4 + 2] = c[2]
    object.texture.data[(y * w + x) * 4 + 3] = c[3]

    updateTexture()
}

// xを半分の値で丸める
const halfRound = (x, a) =>
{
    const h = (a / 2)
    return Math.floor(x * h) / h
}

// モデルの中身を更新
const updateModel = () =>
{
    const position3d = []
    const color = []
    const position2d = []
    const index = []

    let count = 0

    // 各頂点に行う
    for(let i = 0; i < object.position.length / 3; i++)
    {
        // 点モデル3D
        position3d[i * 3 + 0] = object.position[i * 3 + 0]
        position3d[i * 3 + 1] = object.position[i * 3 + 1]
        position3d[i * 3 + 2] = object.position[i * 3 + 2]

        // 共通
        color[i * 3 + 0] = object.color[i * 3 + 0]
        color[i * 3 + 1] = object.color[i * 3 + 1]
        color[i * 3 + 2] = object.color[i * 3 + 2]
        index[i] = i

        // 点モデル2D
        position2d[i * 3 + 0] = object.coordinate[i * 2 + 0]
        position2d[i * 3 + 1] = object.coordinate[i * 2 + 1]
        position2d[i * 3 + 2] = 0

        // 頂点を数える
        count++
    }

    model.point3d.position = position3d
    model.point3d.color = color
    model.point3d.index = index
    model.point2d.position = position2d
    model.point2d.color = color
    model.point2d.index = index
    object.vertexCount = count
}



// メインのアニメーションフレーム
let prevTimestamp = 0
const animationFrame = (timestamp) =>
{
    requestAnimationFrame(animationFrame)
    let deltaTime
    if(!prevTimestamp) deltaTime = 0
    else deltaTime = timestamp - prevTimestamp
    prevTimestamp = timestamp

    // カーソル更新
    updateCursor(deltaTime)

    // テクセルを置く
    if(mode.name === 'texel') putTexel()

    // 単色で塗りつぶす
    renderer.clearFrame(0.5, 0.5, 0.5, 1)

    const cvw = canvas.width
    const cvh = canvas.height

    // 3D表示
    if(mode.dimension === 3)
    {
        let cx = control.current.x
        let cy = control.current.y
        let cz = control.current.z
        let mx = control.current.x
        while(2 < mx) mx -= 2
        while(mx < -2) mx += 2
        let my = control.current.y
        while(2 < my) my -= 2
        while(my < -2) my += 2
        let mz = control.current.z
        while(2 < mz) mz -= 2
        while(mz < -2) mz += 2
        let rf =
            (
                control.delta.rotX ||
                control.delta.rotY ||
                control.goal.rotX !== control.current.rotX ||
                control.goal.rotY !== control.current.rotY
            )
        let rx = control.current.rotX
        let ry = control.current.rotY
        while(3 < ry) ry -= 4
        while(ry < 0) ry += 4

        // カメラが回っていなければ
        if(!rf)
        {
            // 小さな点の背景を描画
            matrix.bg3d.initialize()
            let x, y
            if(rx === 0 && ry === 0) { x = mx ; y = my }
            if(rx === 0 && ry === 1) { x = mz ; y = my }
            if(rx === 0 && ry === 2) { x = -mx ; y = my }
            if(rx === 0 && ry === 3) { x = -mz ; y = my }
            if(rx === 1 && ry === 0) { x = mx ; y = -mz }
            if(rx === 1 && ry === 1) { x = mz ; y = mx }
            if(rx === 1 && ry === 2) { x = -mx ; y = mz }
            if(rx === 1 && ry === 3) { x = -mz ; y = -mx }
            if(rx === -1 && ry === 0) { x = mx ; y = mz }
            if(rx === -1 && ry === 1) { x = mz ; y = -mx }
            if(rx === -1 && ry === 2) { x = -mx ; y = -mz }
            if(rx === -1 && ry === 3) { x = -mz ; y = mx }
            matrix.bg3d.translateX(halfRound(-x, cvw))
            matrix.bg3d.translateY(halfRound(-y, cvh))
            model.bg3d.drawTriangles()
        }

        // 行列を初期化
        matrix.originalPoint.initialize()
        matrix.strongPoint.initialize()
        matrix.point3d.initialize()

        // 平行投影にする
        matrix.originalPoint.parallel(-1, 1, -1, 1, 1, 100)
        matrix.strongPoint.parallel(-1, 1, -1, 1, 1, 100)
        matrix.point3d.parallel(-1, 1, -1, 1, 1, 100)

        // カメラが回っている
        if(rf)
        {
            // すべて50だけ前進させて映るようにする
            matrix.originalPoint.translateZ(50)
            matrix.strongPoint.translateZ(50)
            matrix.point3d.translateZ(50)
        }
        // 回っていない
        else
        {
            // すべて1だけ前進させてカメラの前方のものだけ映るようにする
            matrix.originalPoint.translateZ(1)
            matrix.strongPoint.translateZ(1)
            matrix.point3d.translateZ(1)
        }

        // 回転時の縮小
        matrix.originalPoint.scaleX(control.current.scale)
        matrix.originalPoint.scaleY(control.current.scale)
        matrix.originalPoint.scaleZ(control.current.scale)
        matrix.strongPoint.scaleX(control.current.scale)
        matrix.strongPoint.scaleY(control.current.scale)
        matrix.strongPoint.scaleZ(control.current.scale)
        matrix.point3d.scaleX(control.current.scale)
        matrix.point3d.scaleY(control.current.scale)
        matrix.point3d.scaleZ(control.current.scale)

        // 原点を描く
        matrix.originalPoint.rotateX(rx * Math.PI / 2)
        matrix.originalPoint.rotateY(ry * Math.PI / 2)
        matrix.originalPoint.translateX(halfRound(-cx, cvw))
        matrix.originalPoint.translateY(halfRound(-cy, cvh))
        matrix.originalPoint.translateZ(halfRound(-cz, cvh))
        model.originalPoint.drawPoints()

        // 強調する点を描く
        matrix.strongPoint.rotateX(rx * Math.PI / 2)
        matrix.strongPoint.rotateY(ry * Math.PI / 2)
        matrix.strongPoint.translateX(halfRound(-mx, cvw))
        matrix.strongPoint.translateY(halfRound(-my, cvh))
        matrix.strongPoint.translateZ(halfRound(-mz, cvh))
        model.strongPoint.drawPoints()

        // 点モデルを描く
        matrix.point3d.rotateX(rx * Math.PI / 2)
        matrix.point3d.rotateY(ry * Math.PI / 2)
        matrix.point3d.translateX(halfRound(-cx, cvw))
        matrix.point3d.translateY(halfRound(-cy, cvh))
        matrix.point3d.translateZ(halfRound(-cz, cvh))
        model.point3d.drawPoints()
    }

    // 2D表示
    if(mode.dimension === 2)
    {
        let cx = control.current.texX
        while(2 < cx) cx -= 2
        while(cx < -2) cx += 2
        let cy = control.current.texY
        while(2 < cy) cy -= 2
        while(cy < -2) cy += 2

        // テクスチャ板
        matrix.texture.initialize()
        matrix.texture.translateX(halfRound(-cx, cvw))
        matrix.texture.translateY(halfRound(-cy, cvh))
        model.texture.drawTriangles()

        // 点モデルを描く
        matrix.point2d.initialize()
        matrix.point2d.translateX(halfRound(-cx, cvw))
        matrix.point2d.translateY(halfRound(-cy, cvh))
        model.point2d.drawPoints()

        // 背景のバツを描画
        matrix.bg2d.initialize()
        matrix.bg2d.translateX(halfRound(-cx, cvw))
        matrix.bg2d.translateY(halfRound(-cy, cvh))
        model.bg2d.drawTriangles()
    }

    // 真ん中の照準を描く
    matrix.center.initialize()
    matrix.center.translateZ(-1)
    model.center.drawPoints()

    // 全描画
    renderer.render()
}
requestAnimationFrame(animationFrame)


// コールバック関数のオブジェクト
const callback =
{
    new: (e) =>
    {
        init()
    },
    // インポートファイルのロード完了
    fileLoaded: (e) =>
    {
        const json = e.target.result
        object = JSON.parse(json)

        updateModel()
        updateTexture()
    },
    // インポートファイルの中身を取得後に処理を行う
    fileInput: (e) =>
    {
        const file = e.target.files[0]
        const reader = new FileReader()
        reader.readAsText(file)
        reader.addEventListener('load', callback.fileLoaded)
    },
    import: (e) =>
    {
        // フォーム送信をキャンセル
        e.stopPropagation()
        e.preventDefault()

        // ロード用のinputタグ
        const inputFile = document.createElement('input')
        inputFile.type = 'file'
        inputFile.addEventListener('change', callback.fileInput)
        inputFile.click()
    },
    export: (e) =>
    {
        e.stopPropagation()
        e.preventDefault()

        // json作成
        const json = JSON.stringify(object, null, 0)

        // blob化
        const blob = new Blob([json], { type: 'application/json', })

        // ダウンロード用のaタグ
        const a = document.createElement('a')
        a.href =  URL.createObjectURL(blob)
        a.download = object.name + '.space'

        // クリックした事にしてダウンロード
        a.click()
    },
    load: (e) =>
    {
        e.stopPropagation()
        e.preventDefault()
    },
    save: (e) =>
    {
        e.stopPropagation()
        e.preventDefault()
    },
    apply3d: (e) =>
    {
        // フォーム送信をキャンセル
        e.stopPropagation()
        e.preventDefault()

        const g = control.grid = element.grid.value
        
        model.bg3d.coordinate = 
        [
                0,     0,
            g * 8,     0,
                0, g * 8,
            g * 8, g * 8,
        ]

        // 位置を戻す
        control.goal.x = 0
        control.goal.y = 0
        control.goal.z = 0
        control.goal.t = 0
        control.goal.rotX = 0
        control.goal.rotY = 0

        model.strongPoint.pointSize = 200 / g
        model.originalPoint.pointSize = 400 / g
        model.point3d.pointSize = 100 / g
    },
    apply2d: (e) =>
    {
        // フォーム送信をキャンセル
        e.stopPropagation()
        e.preventDefault()

        // 入力欄の値をオブジェクトにセット
        object.texture.width = element.textureWidth.value
        object.texture.height = element.textureHeight.value

        // 位置をリセット
        control.goal.texX = 0.5 / (object.texture.width / 2)
        control.goal.texY = 0.5 / (object.texture.height / 2)

        initTexture()
    },
    changeMode: (e) =>
    {
        addClass(element.pose3dDiv, 'none')
        addClass(element.pose2dDiv, 'none')
        addClass(element.param3dDiv, 'none')
        addClass(element.param2dDiv, 'none')
        addClass(element.vertexDiv, 'none')
        addClass(element.surfaceDiv, 'none')
        addClass(element.matrixDiv, 'none')
        addClass(element.texelDiv, 'none')
    
        removeClass(element.param3dMode, 'selected')
        removeClass(element.param2dMode, 'selected')
        removeClass(element.vertex3dMode, 'selected')
        removeClass(element.vertex2dMode, 'selected')
        removeClass(element.matrixMode, 'selected')
        removeClass(element.texelMode, 'selected')
        removeClass(element.surfaceMode, 'selected')
        removeClass(element.pose3dMode, 'selected')
        removeClass(element.pose2dMode, 'selected')
    
        if(e.target.id === 'param-3d-mode') mode.name = 'param3d'
        if(e.target.id === 'vertex-3d-mode') mode.name = 'vertex3d'
        if(e.target.id === 'matrix-mode') mode.name = 'matrix'
        if(e.target.id === 'param-2d-mode') mode.name = 'param2d'
        if(e.target.id === 'vertex-2d-mode') mode.name = 'vertex2d'
        if(e.target.id === 'texel-mode') mode.name = 'texel'
        if(e.target.id === 'pose-3d-mode') mode.name = 'pose3d'
        if(e.target.id === 'pose-2d-mode') mode.name = 'pose2d'
        if(e.target.id === 'surface-mode') mode.name = 'surface'
    
        if(mode.name === 'param3d')
        {
            removeClass(element.param3dDiv, 'none')
            addClass(element.param3dMode, 'selected')
            mode.dimension = 3
            updateVertexList()
        }
        if(mode.name === 'vertex3d')
        {
            removeClass(element.vertexDiv, 'none')
            addClass(element.vertex3dMode, 'selected')
            mode.dimension = 3
            updateVertexList()
        }
        if(mode.name === 'matrix')
        {
            removeClass(element.matrixDiv, 'none')
            addClass(element.matrixMode, 'selected')
            mode.dimension = 3
        }
        if(mode.name === 'pose3d')
        {
            removeClass(element.pose3dDiv, 'none')
            addClass(element.pose3dMode, 'selected')
            mode.dimension = 3
        }
        if(mode.name === 'surface')
        {
            removeClass(element.surfaceDiv, 'none')
            addClass(element.surfaceMode, 'selected')
            mode.dimension = 3
        }
        if(mode.name === 'vertex2d')
        {
            removeClass(element.vertexDiv, 'none')
            addClass(element.vertex2dMode, 'selected')
            mode.dimension = 2
        }
        if(mode.name === 'param2d')
        {
            removeClass(element.param2dDiv, 'none')
            addClass(element.param2dMode, 'selected')
            mode.dimension = 2
        }
        if(mode.name === 'texel')
        {
            removeClass(element.texelDiv, 'none')
            addClass(element.texelMode, 'selected')
            mode.dimension = 2

            // グリッド半分の位置に照準があった時に丸める
            const w = object.texture.width / 2
            const h = object.texture.height / 2
            control.goal.texX = (Math.floor(control.current.texX * w) + 0.5) / w
            control.goal.texY = (Math.floor(control.current.texY * h) + 0.5) / h
        }
        if(mode.name === 'pose2d')
        {
            removeClass(element.pose2dDiv, 'none')
            addClass(element.pose2dMode, 'selected')
            mode.dimension = 2
        }

        // テクセル描きの終了
        control.texel.remove = false
        control.texel.put = false
        removeClass(element.remove, 'selected')
        removeClass(element.put, 'selected')
    },
    touchSlider: (e) =>
    {
        e.preventDefault()

        // 左クリックされていない時は返す
        if(
            e.type !== 'touchstart' &&
            e.type !== 'touchmove' &&
            !(e.buttons & 1)
        ) return
    
        let innerElem, innerRect, outerRect
    
        if(e.target.id === 'depth' || e.target.id === 'depth-bar')
        {
            innerElem = element.depth
            innerRect = element.depth.getBoundingClientRect()
            outerRect = element.depthBar.getBoundingClientRect()
        }
        else if(e.target.id === 'time' || e.target.id === 'time-bar')
        {
            innerElem = element.time
            innerRect = element.time.getBoundingClientRect()
            outerRect = element.timeBar.getBoundingClientRect()
        }
        else return
    
        let y = -1
        if(e.clientY != undefined) y = e.clientY
        if(e.targetTouches != undefined) y = e.targetTouches[0].clientY

        let ny = (y - outerRect.top - innerRect.height / 2) / outerRect.height * 4 - 1
    
        // 大きさ制限
        if(ny < -1) ny = -1
        if(ny > 1) ny = 1

        // 1グリッドの大きさ
        const g = 1 / control.grid * 8

        if(innerElem.id === 'depth')
        {
            // 回転の状態によって動かす方向が変わる
            let rx = Math.round(control.current.rotX)
            let ry = Math.round(control.current.rotY)
            while(ry < 0) ry += 4
            while(ry > 3) ry -= 4
            const z = -ny * g
            if(rx === 0 && ry === 0) { control.delta.z = z }
            if(rx === 0 && ry === 1) { control.delta.x = -z }
            if(rx === 0 && ry === 2) { control.delta.z = -z }
            if(rx === 0 && ry === 3) { control.delta.x = z }
            if(rx === 1) { control.delta.y = z }
            if(rx === -1) { control.delta.y = -z }
        }
        if(innerElem.id === 'time')
        {
            control.delta.t = -ny / 2
        }
    
        innerElem.style.top = (25 + ny * 25) + '%'
    },
    releaseSlider: (e) =>
    {
        e.preventDefault()
        
        if(
            e.type !== 'touchend' &&
            e.type !== 'touchcancel' &&
            e.type !== 'mouseup' &&
            e.type !== 'mousecancel' &&
            !(e.buttons & 1)
        ) return

        let innerElem
    
        if(e.target.id === 'depth' || e.target.id === 'depth-bar')
        {
            innerElem = element.depth
        }
        else if(e.target.id === 'time' || e.target.id === 'time-bar')
        {
            innerElem = element.time
        }
        else return
        
        if(innerElem.id === 'depth')
        {
            control.delta.x = 0
            control.delta.y = 0
            control.delta.z = 0
            const w = control.grid
            const h = control.grid
            const d = control.grid
            control.goal.x = Math.round(control.current.x * w) / w
            control.goal.y = Math.round(control.current.y * h) / h
            control.goal.z = Math.round(control.current.z * d) / d
        }
        if(innerElem.id === 'time')
        {
            control.delta.t = 0
        }
    
        innerElem.style.top = '25%'
    },
    touchPad: (e) =>
    {
        e.preventDefault()

        if(
            e.type !== 'touchstart' &&
            e.type !== 'touchmove' &&
            !(e.buttons & 1)
        ) return

        let innerElem, innerRect, outerRect
    
        if(e.target.id === 'scroll' || e.target.id === 'scroll-pad')
        {
            innerElem = element.scroll
            innerRect = element.scroll.getBoundingClientRect()
            outerRect = element.scrollPad.getBoundingClientRect()
        }
        else if(e.target.id === 'rotate' || e.target.id === 'rotate-pad')
        {
            innerElem = element.rotate
            innerRect = element.rotate.getBoundingClientRect()
            outerRect = element.rotatePad.getBoundingClientRect()
        }
        else return
    
        let x = -1, y = -1
        if(e.clientX != undefined) x = e.clientX
        if(e.targetTouches != undefined) x = e.targetTouches[0].clientX
        if(e.clientY != undefined) y = e.clientY
        if(e.targetTouches != undefined) y = e.targetTouches[0].clientY

        let nx = (x - outerRect.left - innerRect.width / 2) / outerRect.width * 4 - 1
        let ny = (y - outerRect.top - innerRect.height / 2) / outerRect.height * 4 - 1
    
        // 丸い範囲を出なくする
        const s = Math.sqrt(nx * nx + ny * ny)
        if(s > 1)
        {
            nx /= s
            ny /= s
        }

        // 縦横に動かしやすくする為に0にする範囲
        const m = 0.2
        if(-m < nx && nx < m) nx = 0
        if(-m < ny && ny < m) ny = 0

        // グリッドの大きさによって速さを変える
        const g = 1 / control.grid * 8

        // 速度
        if(mode.dimension === 3 && innerElem.id === 'scroll')
        {
            // 回転の状態によって動かす方向が変わる
            let rx = Math.round(control.current.rotX)
            let ry = Math.round(control.current.rotY)
            while(ry < 0) ry += 4
            while(ry > 3) ry -= 4
            const x = nx * g
            const y = -ny * g
            if(rx === 0 && ry === 0) { control.delta.x = x ; control.delta.y = y }
            if(rx === 0 && ry === 1) { control.delta.z = x ; control.delta.y = y }
            if(rx === 0 && ry === 2) { control.delta.x = -x ; control.delta.y = y }
            if(rx === 0 && ry === 3) { control.delta.z = -x ; control.delta.y = y }
            if(rx === 1 && ry === 0) { control.delta.x = x ; control.delta.z = -y }
            if(rx === 1 && ry === 1) { control.delta.z = x ; control.delta.x = y }
            if(rx === 1 && ry === 2) { control.delta.x = -x ; control.delta.z = y }
            if(rx === 1 && ry === 3) { control.delta.z = -x ; control.delta.x = -y }
            if(rx === -1 && ry === 0) { control.delta.x = x ; control.delta.z = y }
            if(rx === -1 && ry === 1) { control.delta.z = x ; control.delta.x = -y }
            if(rx === -1 && ry === 2) { control.delta.x = -x ; control.delta.z = -y }
            if(rx === -1 && ry === 3) { control.delta.z = -x ; control.delta.x = y }
        }
        if(mode.dimension === 3 && innerElem.id === 'rotate')
        {
            control.delta.rotX = ny
            control.delta.rotY = nx
            control.goal.scale = 1 / 2
        }
        if(mode.dimension === 2 && innerElem.id === 'scroll')
        {
            control.delta.texX = nx * g
            control.delta.texY = -ny * g
        }
        if(mode.dimension === 2 && innerElem.id === 'rotate')
        {
            control.delta.texX = nx * 4 * g
            control.delta.texY = -ny * 4 * g
        }

        // パッドの位置
        innerElem.style.left = (25 + nx * 25) + '%'
        innerElem.style.top = (25 + ny * 25) + '%'
    },
    releasePad: (e) =>
    {
        e.preventDefault()
        
        if(
            e.type !== 'touchend' &&
            e.type !== 'touchcancel' &&
            e.type !== 'mouseup' &&
            e.type !== 'mousecancel' &&
            !(e.buttons & 1)
        ) return
    
        let innerElem
    
        if(e.target.id === 'scroll' || e.target.id === 'scroll-pad')
        {
            innerElem = element.scroll
        }
        else if(e.target.id === 'rotate' || e.target.id === 'rotate-pad')
        {
            innerElem = element.rotate
        }
        else return

        // 停止して丸める
        if(mode.dimension === 3 && innerElem.id === 'scroll')
        {
            control.delta.x = 0
            control.delta.y = 0
            control.delta.z = 0
            const w = control.grid
            const h = control.grid
            const d = control.grid
            control.goal.x = Math.round(control.current.x * w) / w
            control.goal.y = Math.round(control.current.y * h) / h
            control.goal.z = Math.round(control.current.z * d) / d
        }
        if(mode.dimension === 3 && innerElem.id === 'rotate')
        {
            control.delta.rotX = 0
            control.delta.rotY = 0
            control.goal.rotX = Math.round(control.current.rotX)
            control.goal.rotY = Math.round(control.current.rotY)
            control.goal.scale = 1
        }
        // 2dモード
        if(mode.dimension === 2 && mode.name !== 'vertex2d')
        {
            control.delta.texX = 0
            control.delta.texY = 0
            const w = object.texture.width / 2
            const h = object.texture.height / 2
            control.goal.texX = (Math.floor(control.current.texX * w) + 0.5) / w
            control.goal.texY = (Math.floor(control.current.texY * h) + 0.5) / h
        }
        // 頂点2dモードの時はグリッドの半分の位置に停止できる
        if(mode.dimension === 2 && mode.name === 'vertex2d')
        {
            control.delta.texX = 0
            control.delta.texY = 0
            const w = object.texture.width
            const h = object.texture.height
            control.goal.texX = Math.round(control.current.texX * w) / w
            control.goal.texY = Math.round(control.current.texY * h) / h
        }

        control.delta.x = 0
        control.delta.y = 0
        control.delta.z = 0
        control.delta.t = 0
        control.delta.texX = 0
        control.delta.texY = 0
    
        innerElem.style.left = '25%'
        innerElem.style.top = '25%'
    },
    deleteCaches: () =>
    {
        if (!('serviceWorker' in navigator)) return
        navigator.serviceWorker.getRegistration()
        .then(registration => {
            registration.unregister();
        })
    },
    selectVertex: (e) =>
    {
        const t = e.target
        const i = t.textContent

        for(let i = 0; i < control.vertex.elementList.length; i++)
        {
            removeClass(control.vertex.elementList[i], 'selected')
        }

        control.vertex.selected = i
        addClass(t, 'selected')
    },
    put: (e) =>
    {
        // 頂点置き3D
        if(mode.name === 'vertex3d')
        {
            const n = object.vertexCount++

            object.position[n * 3 + 0] = control.current.x
            object.position[n * 3 + 1] = control.current.y
            object.position[n * 3 + 2] = control.current.z
            object.color[n * 3 + 0] = control.vertex.color[0]
            object.color[n * 3 + 1] = control.vertex.color[1]
            object.color[n * 3 + 2] = control.vertex.color[2]
            object.coordinate[n * 2 + 0] = control.current.texX
            object.coordinate[n * 2 + 1] = control.current.texY

            updateModel()

            const li = document.createElement('li')
            li.textContent = n
            addClass(li, 'vertex')
            li.addEventListener('pointerdown', callback.selectVertex)
            element.verticeList.append(li)
            control.vertex.elementList.push(li)
        }
        // 頂点置き2D
        if(mode.name === 'vertex2d')
        {
            const n = object.vertexCount++

            object.position[n * 3 + 0] = control.current.x
            object.position[n * 3 + 1] = control.current.y
            object.position[n * 3 + 2] = control.current.z
            object.color[n * 3 + 0] = control.vertex.color[0]
            object.color[n * 3 + 1] = control.vertex.color[1]
            object.color[n * 3 + 2] = control.vertex.color[2]
            object.coordinate[n * 2 + 0] = control.current.texX
            object.coordinate[n * 2 + 1] = control.current.texY

            updateModel()

            const li = document.createElement('li')
            li.textContent = n
            addClass(li, 'vertex')
            li.addEventListener('pointerdown', callback.selectVertex)
            element.verticeList.append(li)
            control.vertex.elementList.push(li)
        }
        // テクセル描き
        if(mode.name === 'texel')
        {
            control.texel.put = !control.texel.put
            control.texel.remove = false

            if(control.texel.put) addClass(element.put, 'selected')
            else removeClass(element.put, 'selected')
            removeClass(element.remove, 'selected')
        }
    },
    remove: (e) =>
    {
        // 頂点消し3D
        if(mode.name === 'vertex3d')
        {
            const n = control.vertex.selected
            if(n === -1) return
            object.position.splice(n * 3, 3)
            object.color.splice(n * 3, 3)
            object.coordinate.splice(n * 2, 2)
            control.vertex.selected = -1
            updateVertexList()
            updateModel()
        }
        // 頂点消し
        if(mode.name === 'vertex2d')
        {
            const n = control.vertex.selected
            if(n === -1) return
            object.position.splice(n * 3, 3)
            object.color.splice(n * 3, 3)
            object.coordinate.splice(n * 2, 2)
            control.vertex.selected = -1
            updateVertexList()
            updateModel()
        }
        // テクセル消し
        if(mode.name === 'texel')
        {
            control.texel.remove = !control.texel.remove
            control.texel.put = false

            if(control.texel.remove) addClass(element.remove, 'selected')
            else removeClass(element.remove, 'selected')
            removeClass(element.put, 'selected')
        }
    },
    // つかんで移動ツール
    grab: (e) =>
    {
        if(mode.name !== 'vertex3d' && mode.name !== 'vertex2d') return

        control.vertex.grab = !control.vertex.grab

        if(control.vertex.grab) addClass(element.grab, 'selected')
        else removeClass(element.grab, 'selected')
    },
    vertexColor: (e) =>
    {
        const v = element.vertexColor.value
        const r = v.substring(1, 3)
        const g = v.substring(3, 5)
        const b = v.substring(5, 7)

        control.vertex.color[0] = parseInt(r, 16) / 0xFF
        control.vertex.color[1] = parseInt(g, 16) / 0xFF
        control.vertex.color[2] = parseInt(b, 16) / 0xFF
        control.vertex.color[3] = 1
    },
    texelColor: (e) =>
    {
        const v = element.texelColor.value
        const r = v.substring(1, 3)
        const g = v.substring(3, 5)
        const b = v.substring(5, 7)

        control.texel.color[0] = parseInt(r, 16)
        control.texel.color[1] = parseInt(g, 16)
        control.texel.color[2] = parseInt(b, 16)
        control.texel.color[3] = 255
    },
    positionReset: (e) =>
    {
        const t = e.target
        if(t.id === 'position-x')
        {
            control.goal.x = 0
            element.positionX.textContent = 'x: 0'
        }
        if(t.id === 'position-y')
        {
            control.goal.y = 0
            element.positionY.textContent = 'y: 0'
        }
        if(t.id === 'position-z')
        {
            control.goal.z = 0
            element.positionZ.textContent = 'z: 0'
        }
        if(t.id === 'position-t')
        {
            control.goal.t = 0
            element.time.textContent = 't: 0'
        }
        if(t.id === 'rotate-x')
        {
            control.goal.rotX = 0
            element.rotateX.textContent = 'rx: 0'
        }
        if(t.id === 'rotate-y')
        {
            control.goal.rotY = 0
            element.rotateY.textContent = 'ry: 0'
        }
        if(t.id === 'texture-x')
        {
            control.goal.texX = 0
            element.textureX.textContent = 'tx: 0'
        }
        if(t.id === 'texture-y')
        {
            control.goal.texY = 0
            element.textureY.textContent = 'ty: 0'
        }
    },
    preventDefault: (e) =>
    {
        e.stopPropagation()
        e.preventDefault()
    },
    returnFalse: (e) =>
    {
        e.stopPropagation()
        return false
    },
}

// ロードとセーブのイベント
//element.saveForm.addEventListener('submit', callback.save)
element.export.addEventListener('click', callback.export)
element.import.addEventListener('click', callback.import)
// パラメータ適用
element.param3dForm.addEventListener('submit', callback.apply3d)
element.param2dForm.addEventListener('submit', callback.apply2d)
element.newButton.addEventListener('click', callback.new)
// モード変更ボタンが押された時のイベント
element.param3dMode.addEventListener('pointerdown', callback.changeMode)
element.vertex3dMode.addEventListener('pointerdown', callback.changeMode)
element.param2dMode.addEventListener('pointerdown', callback.changeMode)
element.vertex2dMode.addEventListener('pointerdown', callback.changeMode)
element.texelMode.addEventListener('pointerdown', callback.changeMode)
element.surfaceMode.addEventListener('pointerdown', callback.changeMode)
//element.matrixMode.addEventListener('pointerdown', callback.changeMode)
//element.pose3dMode.addEventListener('pointerdown', callback.changeMode)
//element.pose2dMode.addEventListener('pointerdown', callback.changeMode)
// バーを押したのイベント
element.depthBar.addEventListener('mousedown', callback.touchSlider)
element.depth.addEventListener('mousedown', callback.touchSlider)
element.timeBar.addEventListener('mousedown', callback.touchSlider)
element.time.addEventListener('mousedown', callback.touchSlider)
element.depthBar.addEventListener('mousemove', callback.touchSlider)
element.depth.addEventListener('mousemove', callback.touchSlider)
element.timeBar.addEventListener('mousemove', callback.touchSlider)
element.time.addEventListener('mousemove', callback.touchSlider)
element.depthBar.addEventListener('touchstart', callback.touchSlider, { passive: true })
element.depth.addEventListener('touchstart', callback.touchSlider, { passive: true })
element.timeBar.addEventListener('touchstart', callback.touchSlider, { passive: true })
element.time.addEventListener('touchstart', callback.touchSlider, { passive: true })
element.depthBar.addEventListener('touchmove', callback.touchSlider, { passive: true })
element.depth.addEventListener('touchmove', callback.touchSlider, { passive: true })
element.timeBar.addEventListener('touchmove', callback.touchSlider, { passive: true })
element.time.addEventListener('touchmove', callback.touchSlider, { passive: true })
// バーを離したのイベント
element.depthBar.addEventListener('mouseup', callback.releaseSlider)
element.depth.addEventListener('mouseup', callback.releaseSlider)
element.timeBar.addEventListener('mouseup', callback.releaseSlider)
element.time.addEventListener('mouseup', callback.releaseSlider)
element.depthBar.addEventListener('mouseleave', callback.releaseSlider)
element.depth.addEventListener('mouseleave', callback.releaseSlider)
element.timeBar.addEventListener('mouseleave', callback.releaseSlider)
element.time.addEventListener('mouseleave', callback.releaseSlider)
element.depthBar.addEventListener('mousecancel', callback.releaseSlider)
element.depth.addEventListener('mousecancel', callback.releaseSlider)
element.timeBar.addEventListener('mousecancel', callback.releaseSlider)
element.time.addEventListener('mousecancel', callback.releaseSlider)
element.depthBar.addEventListener('touchend', callback.releaseSlider)
element.depth.addEventListener('touchend', callback.releaseSlider)
element.timeBar.addEventListener('touchend', callback.releaseSlider)
element.time.addEventListener('touchend', callback.releaseSlider)
element.depthBar.addEventListener('touchcancel', callback.releaseSlider)
element.depth.addEventListener('touchcancel', callback.releaseSlider)
element.timeBar.addEventListener('touchcancel', callback.releaseSlider)
element.time.addEventListener('touchcancel', callback.releaseSlider)
// パッドを押したのイベント
element.scrollPad.addEventListener('mousedown', callback.touchPad)
element.scroll.addEventListener('mousedown', callback.touchPad)
element.rotatePad.addEventListener('mousedown', callback.touchPad)
element.rotate.addEventListener('mousedown', callback.touchPad)
element.scrollPad.addEventListener('mousemove', callback.touchPad)
element.scroll.addEventListener('mousemove', callback.touchPad)
element.rotatePad.addEventListener('mousemove', callback.touchPad)
element.rotate.addEventListener('mousemove', callback.touchPad)
element.scrollPad.addEventListener('touchstart', callback.touchPad, { passive: true })
element.scroll.addEventListener('touchstart', callback.touchPad, { passive: true })
element.rotatePad.addEventListener('touchstart', callback.touchPad, { passive: true })
element.rotate.addEventListener('touchstart', callback.touchPad, { passive: true })
element.scrollPad.addEventListener('touchmove', callback.touchPad, { passive: true })
element.scroll.addEventListener('touchmove', callback.touchPad, { passive: true })
element.rotatePad.addEventListener('touchmove', callback.touchPad, { passive: true })
element.rotate.addEventListener('touchmove', callback.touchPad, { passive: true })
// パッドを離したのイベント
element.scrollPad.addEventListener('mouseup', callback.releasePad)
element.scroll.addEventListener('mouseup', callback.releasePad)
element.rotatePad.addEventListener('mouseup', callback.releasePad)
element.rotate.addEventListener('mouseup', callback.releasePad)
element.scrollPad.addEventListener('mouseleave', callback.releasePad)
element.scroll.addEventListener('mouseleave', callback.releasePad)
element.rotatePad.addEventListener('mouseleave', callback.releasePad)
element.rotate.addEventListener('mouseleave', callback.releasePad)
element.scrollPad.addEventListener('mousecancel', callback.releasePad)
element.scroll.addEventListener('mousecancel', callback.releasePad)
element.rotatePad.addEventListener('mousecancel', callback.releasePad)
element.rotate.addEventListener('mousecancel', callback.releasePad)
element.scrollPad.addEventListener('touchend', callback.releasePad)
element.scroll.addEventListener('touchend', callback.releasePad)
element.rotatePad.addEventListener('touchend', callback.releasePad)
element.rotate.addEventListener('touchend', callback.releasePad)
element.scrollPad.addEventListener('touchcancel', callback.releasePad)
element.scroll.addEventListener('touchcancel', callback.releasePad)
element.rotatePad.addEventListener('touchcancel', callback.releasePad)
element.rotate.addEventListener('touchcancel', callback.releasePad)
// 編集用ボタンを押した時のイベント
element.put.addEventListener('pointerdown', callback.put)
element.remove.addEventListener('pointerdown', callback.remove)
element.grab.addEventListener('pointerdown', callback.grab)
// 色選択をした時のイベント
element.vertexColor.addEventListener('input', callback.vertexColor)
element.texelColor.addEventListener('input', callback.texelColor)
// 座標の表示を押した時のイベント
element.positionX.addEventListener('pointerdown', callback.positionReset)
element.positionY.addEventListener('pointerdown', callback.positionReset)
element.positionZ.addEventListener('pointerdown', callback.positionReset)
element.time.addEventListener('pointerdown', callback.positionReset)
element.rotateX.addEventListener('pointerdown', callback.positionReset)
element.rotateY.addEventListener('pointerdown', callback.positionReset)
element.textureX.addEventListener('pointerdown', callback.positionReset)
element.textureY.addEventListener('pointerdown', callback.positionReset)

// 選択禁止
document.addEventListener('selectstart', callback.returnFalse, { passive: false })
// ダブルタップ禁止
document.addEventListener('dblclick', callback.preventDefault, { passive: false })
// メニュー禁止
document.addEventListener('contextmenu', callback.returnFalse, { passive: false })

// PWAの登録
if ('serviceWorker' in navigator)
{
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('./service-worker.js').catch((err) => {
            console.error('Service Worker registration was failed: ', err)
        })
    })
}