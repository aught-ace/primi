// 描画モジュールのインポート
import { Matrix, Shader, Model, Renderer } from './renderer.js'

// モード
let mode = 
{
    name: 'vertex3d',
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
    exportForm: document.querySelector('#export-form'),
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
}

// 立体オブジェクト
const object =
{
    name:
        new Date()
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
    grid: 7,
    texture:
    {
        width: 16,
        height: 16,
        data: []
    },
}
element.name.value = object.name

// 操作オブジェクト
const control =
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
        texX: 0.5 / (object.texture.width / 2),
        texY: 0.5 / (object.texture.height / 2),
    },
    goal:
    {
        x: 0,
        y: 0,
        z: 0,
        t: 0,
        rotX: 0,
        rotY: 0,
        texX: 0.5 / (object.texture.width / 2),
        texY: 0.5 / (object.texture.height / 2),
    },
    texel:
    {
        put: false,
        remove: false,
        color: [0, 0, 0, 255],
    }
}


// 現在のカーソル位置などの更新
const updateCursor = (deltaTime) =>
{
    const d = deltaTime / 1000

    // 位置に速度を加算
    control.current.x += control.delta.x * d
    control.current.y += control.delta.y * d
    control.current.z += control.delta.z * d
    control.current.t += control.delta.t * d
    control.current.rotX += control.delta.rotX * d
    control.current.rotY += control.delta.rotY * d
    control.current.texX += control.delta.texX * d
    control.current.texY += control.delta.texY * d
    control.goal.x += control.delta.x * d
    control.goal.y += control.delta.y * d
    control.goal.z += control.delta.z * d
    control.goal.t += control.delta.t * d
    control.goal.rotX += control.delta.rotX * d
    control.goal.rotY += control.delta.rotY * d
    control.goal.texX += control.delta.texX * d
    control.goal.texY += control.delta.texY * d

    // 丸める時の挙動
    const div = 1.125
    control.current.x = (control.current.x - control.goal.x) / div + control.goal.x
    control.current.y = (control.current.y - control.goal.y) / div + control.goal.y
    control.current.z = (control.current.z - control.goal.z) / div + control.goal.z
    control.current.t = (control.current.t - control.goal.t) / div + control.goal.t
    control.current.rotX = (control.current.rotX - control.goal.rotX) / div + control.goal.rotX
    control.current.rotY = (control.current.rotY - control.goal.rotY) / div + control.goal.rotY
    control.current.texX = (control.current.texX - control.goal.texX) / div + control.goal.texX
    control.current.texY = (control.current.texY - control.goal.texY) / div + control.goal.texY

    // 表示
    element.positionX.textContent = 'x: ' + Math.floor(control.current.x * object.grid)
    element.positionY.textContent = 'y: ' + Math.floor(control.current.y * object.grid)
    element.positionZ.textContent = 'z: ' + Math.floor(control.current.z * object.grid)
    element.time.textContent = 't: ' + Math.floor(control.current.t)
    element.rotateX.textContent = 'rx: ' + Math.floor(control.current.rotX)
    element.rotateY.textContent = 'ry: ' + Math.floor(control.current.rotY)
    element.textureX.textContent = 'tx: ' + Math.floor(control.current.texX * object.texture.width / 2)
    element.textureY.textContent = 'ty: ' + Math.floor(control.current.texY * object.texture.height / 2)
}

// 描画フレームワーク
const renderer = new Renderer(element.canvas)
const textureShader = new Shader('texture', renderer)
const background3dModel = new Model(renderer)
const background3dMatrix = new Matrix()
const background2dModel = new Model(renderer)
const background2dMatrix = new Matrix()
const spriteShader = new Shader('sprite', renderer)
const pointModel = new Model(renderer)
const pointMatrix = new Matrix()
const originalModel = new Model(renderer)
const originalMatrix = new Matrix()
const textureModel = new Model(renderer)
const textureMatrix = new Matrix()
const centerModel = new Model(renderer)

// テクスチャ初期化
const initTexture = () =>
{
    for(let i = 0; i < object.texture.width * object.texture.height * 4; i++)
        object.texture.data[i] = 255
    textureModel.texture = 
    {
        width: object.texture.width,
        height: object.texture.height,
        data: object.texture.data,
    }
}

// 初期化
const init = () =>
{
    // 描いてあるものを消去
    renderer.clearFrame(0.5, 0.5, 0.5, 1)
    renderer.clear(0.5, 0.5, 0.5, 1)

    // 3d背景の板
    background3dModel.shader = textureShader
    background3dModel.position = 
    [
        -4, -4, 1,
         4, -4, 1,
        -4,  4, 1,
         4,  4, 1,
    ]
    background3dModel.color = 
    [
        1, 1, 1,
        1, 1, 1,
        1, 1, 1,
        1, 1, 1,
    ]
    const g = object.grid * 8
    background3dModel.coordinate = 
    [
        0, 0,
        g, 0,
        0, g,
        g, g,
    ]
    background3dModel.index = 
    [
        0, 1, 2,
        3, 2, 1,
    ]
    // 点を描く
    const background3dTextureData = []
    const bg3w = 64, bg3h = 64
    for(let y = 0; y < bg3w; y++)
        for(let x = 0; x < bg3h; x++)
        {
            background3dTextureData[(y * bg3w + x) * 4 + 0] = 0x88
            background3dTextureData[(y * bg3w + x) * 4 + 1] = 0x88
            background3dTextureData[(y * bg3w + x) * 4 + 2] = 0x88
            background3dTextureData[(y * bg3w + x) * 4 + 3] = 0xFF
            const a = Math.abs(x + y)
            const s = Math.abs(x - y)
            const p = 4
            if(
                a <= p && s <= p ||
                a <= p && bg3w - p <= s ||
                bg3w + bg3h - p <= a && s <= p ||
                bg3w - p <= a && bg3w - p <= s
            )
            {
                background3dTextureData[(y * bg3w + x) * 4 + 0] = 0x77
                background3dTextureData[(y * bg3w + x) * 4 + 1] = 0x77
                background3dTextureData[(y * bg3w + x) * 4 + 2] = 0x77
            }
        }
        background3dModel.texture = 
    {
        width: bg3w,
        height: bg3h,
        data: background3dTextureData,
    }
    background3dModel.matrix = background3dMatrix

    // 2d背景の板
    background2dModel.shader = textureShader
    background2dModel.position = 
    [
        -2, -2, 1,
         2, -2, 1,
        -2,  2, 1,
         2,  2, 1,
    ]
    background2dModel.color = 
    [
        1, 1, 1,
        1, 1, 1,
        1, 1, 1,
        1, 1, 1,
    ]
    background2dModel.coordinate = 
    [
         0,  0,
        32,  0,
         0, 32,
        32, 32,
    ]
    background2dModel.index = 
    [
        0, 1, 2,
        3, 2, 1,
    ]
    // 四角を描く
    const background2dTextureData = []
    const bgw = 8, bgh = 8
    for(let y = 0; y < bgw; y++)
        for(let x = 0; x < bgh; x++)
        {
            background2dTextureData[(y * bgw + x) * 4 + 0] = 0x88
            background2dTextureData[(y * bgw + x) * 4 + 1] = 0x88
            background2dTextureData[(y * bgw + x) * 4 + 2] = 0x88
            background2dTextureData[(y * bgw + x) * 4 + 3] = 0xFF
            const xw = Math.abs(x - bgw / 2)
            const yh = Math.abs(y - bgh / 2)
            const p = 4
            if(xw < p && yh < p)
            {
                background2dTextureData[(y * bgw + x) * 4 + 0] = 0x99
                background2dTextureData[(y * bgw + x) * 4 + 1] = 0x99
                background2dTextureData[(y * bgw + x) * 4 + 2] = 0x99
            }
        }
    background2dModel.texture = 
    {
        width: bgw,
        height: bgh,
        data: background2dTextureData,
    }
    background2dModel.matrix = background2dMatrix

    // 照準の板
    centerModel.shader = spriteShader
    centerModel.position = 
    [
        0, 0, 0,
    ]
    centerModel.color = 
    [
        1, 1, 1,
    ]
    centerModel.index = 
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
    centerModel.texture = 
    {
        width: 16,
        height: 16,
        data: centerTextureData,
    }
    centerModel.pointSize = 16

    
    // モデルの点群
    pointModel.shader = spriteShader
    pointModel.position = []
    pointModel.color = []
    pointModel.index = []
    // スプライト点を描く
    const pointTextureData = []
    const pw = 16, ph = 16
    for(let y = 0; y < pw; y++)
        for(let x = 0; x < ph; x++)
        {
            pointTextureData[(y * pw + x) * 4 + 0] = 0x00
            pointTextureData[(y * pw + x) * 4 + 1] = 0x00
            pointTextureData[(y * pw + x) * 4 + 2] = 0x00
            pointTextureData[(y * pw + x) * 4 + 3] = 0x00
            const a = Math.abs(pw - (x + y))
            const s = Math.abs(x - y)
            const p = 8
            if(a < p && s < p)
            {
                pointTextureData[(y * pw + x) * 4 + 0] = 0xFF
                pointTextureData[(y * pw + x) * 4 + 1] = 0xFF
                pointTextureData[(y * pw + x) * 4 + 2] = 0xFF
                pointTextureData[(y * pw + x) * 4 + 3] = 0xFF
            }
        }
    pointModel.texture = 
    {
        width: pw,
        height: ph,
        data: pointTextureData,
    }
    pointModel.matrix = pointMatrix
    pointModel.pointSize = 16

    // 強調する点のモデル
    originalModel.shader = spriteShader
    originalModel.position = [
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
        0, 0, 0,
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
    ]
    originalModel.color = [
        0.4, 0.4, 0.4,
        0.4, 0.4, 0.4,
        0.4, 0.4, 0.4,
        0.4, 0.4, 0.4,
        0.4, 0.4, 0.4,

        0.4, 0.4, 0.4,
        0.4, 0.4, 0.4,
        0.4, 0.4, 0.4,
        0.4, 0.4, 0.4,
        0.4, 0.4, 0.4,
        
        0.4, 0.4, 0.4,
        0.4, 0.4, 0.4,
        0.2, 0.2, 0.2,
        0.4, 0.4, 0.4,
        0.4, 0.4, 0.4,
        
        0.4, 0.4, 0.4,
        0.4, 0.4, 0.4,
        0.4, 0.4, 0.4,
        0.4, 0.4, 0.4,
        0.4, 0.4, 0.4,

        0.4, 0.4, 0.4,
        0.4, 0.4, 0.4,
        0.4, 0.4, 0.4,
        0.4, 0.4, 0.4,
        0.4, 0.4, 0.4,
    ]
    originalModel.index =
    [
        0, 1, 2, 3, 4,
        5, 6, 7, 8, 9,
        10, 11, 12, 13, 14,
        15, 16, 17, 18, 19,
        20, 21, 22, 23, 24,
    ]
    // 強調する点を描く
    const originalTextureData = []
    const ow = 64, oh = 64
    for(let y = 0; y < ow; y++)
        for(let x = 0; x < oh; x++)
        {
            originalTextureData[(y * ow + x) * 4 + 0] = 0x00
            originalTextureData[(y * ow + x) * 4 + 1] = 0x00
            originalTextureData[(y * ow + x) * 4 + 2] = 0x00
            originalTextureData[(y * ow + x) * 4 + 3] = 0x00
            const a = Math.abs(ow - (x + y))
            const s = Math.abs(x - y)
            const p = ow / 2
            if(a < p && s < p)
            {
                originalTextureData[(y * ow + x) * 4 + 0] = 0xFF
                originalTextureData[(y * ow + x) * 4 + 1] = 0xFF
                originalTextureData[(y * ow + x) * 4 + 2] = 0xFF
                originalTextureData[(y * ow + x) * 4 + 3] = 0xFF
            }
        }
    originalModel.texture = 
    {
        width: ow,
        height: oh,
        data: originalTextureData,
    }
    originalModel.matrix = originalMatrix
    originalModel.pointSize = 128 / object.grid

    // テクスチャ表示用の板
    textureModel.shader = textureShader
    textureModel.position = 
    [
         0, 0, 0,
         2, 0, 0,
         0, 2, 0,
         2, 2, 0,
    ]
    textureModel.color = 
    [
        1, 1, 1,
        1, 1, 1,
        1, 1, 1,
        1, 1, 1,
    ]
    textureModel.coordinate = 
    [
        0, 0,
        1, 0,
        0, 1,
        1, 1,
    ]
    textureModel.index = 
    [
        0, 1, 2,
        3, 2, 1,
    ]
    textureModel.matrix = textureMatrix
    initTexture()
}
init()

// テクセル描き
const drawTexel = () =>
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
    textureModel.texture = 
    {
        width: object.texture.width,
        height: object.texture.height,
        data: object.texture.data,
    }
}

// xを半分の値で丸める
const halfRound = (x, a) =>
{
    const h = (a / 2)
    return Math.floor(x * h) / h
}

// アニメーションフレーム
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
    if(mode.name === 'texel') drawTexel()

    // 単色で塗りつぶす
    renderer.clearFrame(0.5, 0.5, 0.5, 1)

    const cvw = canvas.width
    const cvh = canvas.height

    // 3D表示
    if(mode.dimension === 3)
    {
        // 背景のバツを描画
        let cx = control.current.x
        while(2 < cx) cx -= 2
        while(cx < -2) cx += 2
        let cy = control.current.y
        while(2 < cy) cy -= 2
        while(cy < -2) cy += 2
        background3dMatrix.initialize()
        background3dMatrix.translateX(halfRound(-cx, cvw))
        background3dMatrix.translateY(halfRound(-cy, cvh))
        background3dModel.drawTriangles()

        // 原点などを描く
        originalMatrix.initialize()
        originalMatrix.translateX(halfRound(-control.current.x, cvw))
        originalMatrix.translateY(halfRound(-control.current.y, cvh))
        originalModel.drawPoints()
    }

    // 2D表示
    if(mode.dimension === 2)
    {
        // 背景のバツを描画
        let cx = control.current.texX
        while(1 < cx) cx--
        while(cx < -1) cx++
        let cy = control.current.texY
        while(1 < cy) cy--
        while(cy < -1) cy++
        background2dMatrix.initialize()
        background2dMatrix.translateX(halfRound(-cx, cvw))
        background2dMatrix.translateY(halfRound(-cy, cvh))
        background2dModel.drawTriangles()

        // 原点などを描く
        originalMatrix.initialize()
        originalMatrix.translateX(halfRound(-control.current.texX, cvw))
        originalMatrix.translateY(halfRound(-control.current.texY, cvh))
        originalModel.drawPoints()

        // テクスチャ板
        textureMatrix.initialize()
        textureMatrix.translateX(halfRound(-control.current.texX, cvw))
        textureMatrix.translateY(halfRound(-control.current.texY, cvh))
        textureModel.drawTriangles()
    }

    // 点群を描く
    pointMatrix.initialize()
    pointMatrix.translateX(halfRound(-control.current.x, cvw))
    pointMatrix.translateY(halfRound(-control.current.y, cvh))
    pointModel.drawPoints()

    // 真ん中の照準を描く
    centerModel.drawPoints()

    // 全描画
    renderer.render()
}
requestAnimationFrame(animationFrame)


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

// コールバック関数のオブジェクト
const callback =
{
    load: (e) =>
    {
        // フォーム送信をキャンセル
        e.stopPropagation()
        e.preventDefault()
    },
    save: (e) =>
    {
        // フォーム送信をキャンセル
        e.stopPropagation()
        e.preventDefault()
    },
    apply3d: (e) =>
    {
        // フォーム送信をキャンセル
        e.stopPropagation()
        e.preventDefault()

        const g = object.grid = element.grid.value
        
        background3dModel.coordinate = 
        [
            0,  0,
            g * 8,  0,
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

        originalModel.pointSize = 128 / g
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
        }
        if(mode.name === 'vertex3d')
        {
            removeClass(element.vertexDiv, 'none')
            addClass(element.vertex3dMode, 'selected')
            mode.dimension = 3
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
    
        if(ny < -1) ny = -1
        if(ny > 1) ny = 1

        if(innerElem.id === 'depth')
        {
            control.delta.z = -ny / 2
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
            control.delta.z = 0
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
    
        const s = Math.sqrt(nx * nx + ny * ny)
        if(s > 1)
        {
            nx /= s
            ny /= s
        }

        if(mode.dimension === 3 && innerElem.id === 'scroll')
        {
            control.delta.x = nx / 2
            control.delta.y = -ny / 2
        }
        if(mode.dimension === 3 && innerElem.id === 'rotate')
        {
            control.delta.rotX = ny / 2
            control.delta.rotY = nx / 2
        }
        if(mode.dimension === 2 && innerElem.id === 'scroll')
        {
            control.delta.texX = nx / 2
            control.delta.texY = -ny / 2
        }
        if(mode.dimension === 2 && innerElem.id === 'rotate')
        {
            control.delta.texX = nx * 2
            control.delta.texY = -ny * 2
        }

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
            const w = object.grid
            const h = object.grid
            control.goal.x = Math.round(control.current.x * w) / w
            control.goal.y = Math.round(control.current.y * h) / h
        }
        if(mode.dimension === 3 && innerElem.id === 'rotate')
        {
            control.delta.rotX = 0
            control.delta.rotY = 0
        }
        if(mode.dimension === 2 && innerElem.id === 'scroll')
        {
            control.delta.texX = 0
            control.delta.texY = 0
            const w = object.texture.width / 2
            const h = object.texture.height / 2
            control.goal.texX = (Math.floor(control.current.texX * w) + 0.5) / w
            control.goal.texY = (Math.floor(control.current.texY * h) + 0.5) / h
        }
        if(mode.dimension === 2 && innerElem.id === 'rotate')
        {
            control.delta.texX = 0
            control.delta.texY = 0
            const w = object.texture.width / 2
            const h = object.texture.height / 2
            control.goal.texX = (Math.floor(control.current.texX * w) + 0.5) / w
            control.goal.texY = (Math.floor(control.current.texY * h) + 0.5) / h
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
    put: (e) =>
    {
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
element.saveForm.addEventListener('submit', callback.save)
// パラメータ適用
element.param3dForm.addEventListener('submit', callback.apply3d)
element.param2dForm.addEventListener('submit', callback.apply2d)
//element.newButton.addEventListener('click', callback.deleteCaches)
// モード変更ボタンが押された時のイベント
element.param3dMode.addEventListener('pointerdown', callback.changeMode)
element.vertex3dMode.addEventListener('pointerdown', callback.changeMode)
element.matrixMode.addEventListener('pointerdown', callback.changeMode)
element.param2dMode.addEventListener('pointerdown', callback.changeMode)
element.vertex2dMode.addEventListener('pointerdown', callback.changeMode)
element.texelMode.addEventListener('pointerdown', callback.changeMode)
element.pose3dMode.addEventListener('pointerdown', callback.changeMode)
element.pose2dMode.addEventListener('pointerdown', callback.changeMode)
element.surfaceMode.addEventListener('pointerdown', callback.changeMode)
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
// ボタンを押した時のイベント
element.put.addEventListener('pointerdown', callback.put)
element.remove.addEventListener('pointerdown', callback.remove)
// ボタンを押した時のイベント
element.texelColor.addEventListener('change', callback.texelColor)
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