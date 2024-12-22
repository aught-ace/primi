// 描画モジュールのインポート
import { Matrix, Shader, Model, Renderer } from './renderer.js'

// バージョン
const version = 'U'

// モード
let mode = 
{
    name: 'param3d',
    dimension: 3,
}

// ストレージのデータリストの名前
const dataListName = 'data-list'

// 要素
const element =
{
    canvas: document.querySelector('#canvas'),
    version: document.querySelector('#version'),
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
    surfaceDiv: document.querySelector('#surface-div'),
    vertexDiv: document.querySelector('#vertex-div'),
    matrixDiv: document.querySelector('#matrix-div'),
    param3dDiv: document.querySelector('#param-3d-div'),
    param2dDiv: document.querySelector('#param-2d-div'),
    pose3dDiv: document.querySelector('#pose-3d-div'),
    pose2dDiv: document.querySelector('#pose-2d-div'),
    texelDiv: document.querySelector('#texel-div'),
    import: document.querySelector('#import'),
    export: document.querySelector('#export'),
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
    all: document.querySelector('#all'),
    grab: document.querySelector('#grab'),
    remove: document.querySelector('#remove'),
    texelColor: document.querySelector('#texel-color'),
    vertexColor: document.querySelector('#vertex-color'),
    vertexList: document.querySelector('#vertex-list'),
    surfaceList: document.querySelector('#surface-list'),
    vertexListSurface: document.querySelector('#vertex-list-surface'),
    openStrage: document.querySelector('#open-strage'),
    openFile: document.querySelector('#open-file'),
    strageDiv: document.querySelector('#strage-div'),
    strageList: document.querySelector('#strage-list'),
    loadButton: document.querySelector('#load-button'),
    deleteButton: document.querySelector('#delete-button'),
    cancelButton: document.querySelector('#cancel-button'),
    saveButton: document.querySelector('#save-button'),
    nameStrage: document.querySelector('#name-strage'),
    nameFile: document.querySelector('#name-file'),
    strageForm: document.querySelector('#strage-form'),
    fileForm: document.querySelector('#file-form'),
    cancelFile: document.querySelector('#cancel-file'),
    fileDiv: document.querySelector('#file-div'),
    importFile: document.querySelector('#import-file'),
    buttonVertexColor: document.querySelector('#button-vertex-color'),
    buttonTexelColor: document.querySelector('#button-texel-color'),
    vertexColorSurface: document.querySelector('#vertex-color-surface'),
    buttonVertexColorSurface: document.querySelector('#button-vertex-color-surface'),
}

element.version.textContent = version

// 操作オブジェクト
let control

// オブジェクト本体
let object

// 現在のカーソル位置などの更新
const updateCursor = () =>
{
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
    control.current.x += control.delta.x
    control.current.y += control.delta.y
    control.current.z += control.delta.z
    control.current.t += control.delta.t
    control.current.rotX += control.delta.rotX
    control.current.rotY += control.delta.rotY
    control.current.texX += control.delta.texX
    control.current.texY += control.delta.texY
    control.goal.x += control.delta.x
    control.goal.y += control.delta.y
    control.goal.z += control.delta.z
    control.goal.t += control.delta.t
    control.goal.rotX += control.delta.rotX
    control.goal.rotY += control.delta.rotY
    control.goal.texX += control.delta.texX
    control.goal.texY += control.delta.texY

    // 速度を0にする
    control.delta.x = 0
    control.delta.y = 0
    control.delta.z = 0
    control.delta.t = 0
    control.delta.rotX = 0
    control.delta.rotY = 0
    control.delta.texX = 0
    control.delta.texY = 0

    // テクスチャの限界
    if(control.current.texX < 0) control.current.texX = 0
    if(1 <= control.current.texX) control.current.texX = 0.99999999
    if(control.current.texY < 0) control.current.texY = 0
    if(1 <= control.current.texY) control.current.texY = 0.99999999
    if(control.goal.texX < 0) control.goal.texX = 0
    if(1 <= control.goal.texX) control.goal.texX = 0.99999999
    if(control.goal.texY < 0) control.goal.texY = 0
    if(1 <= control.goal.texY) control.goal.texY = 0.99999999

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
    const e = 1 / 256
    if(Math.abs(control.current.x - control.goal.x) < e) control.current.x  = control.goal.x
    if(Math.abs(control.current.y - control.goal.y) < e) control.current.y  = control.goal.y
    if(Math.abs(control.current.z - control.goal.z) < e) control.current.z  = control.goal.z
    if(Math.abs(control.current.t - control.goal.t) < e) control.current.t  = control.goal.t
    if(Math.abs(control.current.rotX - control.goal.rotX) < e) control.current.rotX  = control.goal.rotX
    if(Math.abs(control.current.rotY - control.goal.rotY) < e) control.current.rotY  = control.goal.rotY
    if(Math.abs(control.current.texX - control.goal.texX) < e) control.current.texX  = control.goal.texX
    if(Math.abs(control.current.texY - control.goal.texY) < e) control.current.texY  = control.goal.texY
    if(Math.abs(control.current.scale - control.goal.scale) < e) control.current.scale  = control.goal.scale

    // つかんだ頂点の位置を変化させる
    if(control.vertex.grab)
    {
        if(
            mode.name === 'vertex3d' ||
            mode.name === 'surface'
        )
        {
            // 選択していなければ全て
            if(!control.selectedList.length)
            {
                for(let i = 0; i < object.vertexCount; i++)
                {
                    object.position[i * 3 + 0] += control.current.x - x
                    object.position[i * 3 + 1] += control.current.y - y
                    object.position[i * 3 + 2] += control.current.z - z
                }
            }
            // 選択していればそれら
            else
            {
                for(let n = 0; n < control.selectedList.length; n++)
                {
                    const i = control.selectedList[n]
                    object.position[i * 3 + 0] += control.current.x - x
                    object.position[i * 3 + 1] += control.current.y - y
                    object.position[i * 3 + 2] += control.current.z - z
                }
            }
        // 2D
        } else if(mode.name === 'vertex2d')
        {
            if(!control.selectedList.length)
            {
                for(let i = 0; i < object.vertexCount; i++)
                {
                    object.coordinate[i * 2 + 0] += (control.current.texX - texX)
                    object.coordinate[i * 2 + 1] += (control.current.texY - texY)
                }
            }
            else
            {
                for(let n = 0; n < control.vertex.selected.length; n++)
                {
                    const i = control.vertex.selected[n]
                    object.coordinate[i * 2 + 0] += (control.current.texX - texX)
                    object.coordinate[i * 2 + 1] += (control.current.texY - texY)
                }
            }
        }

        if(
            control.current.x !== x ||
            control.current.y !== y ||
            control.current.z !== z ||
            control.current.texX !== texX ||
            control.current.texY !== texY
        )
            updateModel()
    }

    // 照準の位置に変化があった
    const g = control.grid
    const tw = object.texture.width * 2
    const th = object.texture.height * 2
    if(
        Math.round(control.current.x * g) !== Math.round(x * g) ||
        Math.round(control.current.y * g) !== Math.round(y * g) ||
        Math.round(control.current.z * g) !== Math.round(z * g)
    ) update()
    if(
        Math.round(control.current.texX * tw) !== Math.round(texX * tw) ||
        Math.round(control.current.texY * th) !== Math.round(texY * th)
    )
    {
        if(mode.name === 'texel') putTexel()
        update()
    }

    // 表示
    element.positionX.textContent = 'x: ' + Math.round(control.current.x * control.grid)
    element.positionY.textContent = 'y: ' + Math.round(control.current.y * control.grid)
    element.positionZ.textContent = 'z: ' + Math.round(control.current.z * control.grid)
    element.time.textContent = 't: ' + Math.round(control.current.t)
    element.rotateX.textContent = 'rx: ' + Math.round(control.current.rotX)
    element.rotateY.textContent = 'ry: ' + Math.round(control.current.rotY)
    element.textureX.textContent = 'tx: ' + Math.floor(control.current.texX * object.texture.width)
    element.textureY.textContent = 'ty: ' + Math.floor(control.current.texY * object.texture.height)
}

// 描画フレームワーク
const renderer = new Renderer(element.canvas)

const shader = {}
shader.texture = new Shader('texture', renderer)
shader.sprite = new Shader('sprite', renderer)

const model = {
    disc3d: new Model(renderer),
    bg3d: new Model(renderer),
    bg2d: new Model(renderer),
    point3d: new Model(renderer),
    point2d: new Model(renderer),
    originalPoint: new Model(renderer),
    strongPoint: new Model(renderer),
    texture: new Model(renderer),
    center: new Model(renderer),
    object: new Model(renderer),
}

const matrix = {
    bg3d: new Matrix(),
    bg2d: new Matrix(),
    point3d: new Matrix(),
    point2d: new Matrix(),
    originalPoint: new Matrix(),
    strongPoint: new Matrix(),
    texture: new Matrix(),
    center: new Matrix(),
    object: new Matrix(),
}

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

// テクセル描き状態などの終了
const resetState = () =>
{
    control.vertex.grab = false
    control.texel.remove = false
    control.texel.put = false
    removeClass(element.grab, 'selected')
    removeClass(element.remove, 'selected')
    removeClass(element.put, 'selected')
}


// 選択した頂点と面を全て頂点として集めた配列とオブジェクトを作成
const updateSelect = () =>
{
    control.selectedList = []
    control.selectedObject = {}

    const s = {}
    for(let v = 0; v < object.vertexCount; v++) s[v] = false

    // 頂点
    for(let v of control.vertex.selected)
    {
        control.selectedList.push(v)
        s[v] = true
    }

    // 面
    for(let v of control.surface.selected)
    {
        const i0 = object.index[v * 3 + 0]
        const i1 = object.index[v * 3 + 1]
        const i2 = object.index[v * 3 + 2]
        if(!s[i0]) control.selectedList.push(i0)
        s[i0] = true
        if(!s[i1]) control.selectedList.push(i1)
        s[i1] = true
        if(!s[i2]) control.selectedList.push(i2)
        s[i2] = true
    }

    control.selectedObject = s
}

// 面リスト更新
const updateSurfaceList = () =>
{
    element.surfaceList.innerHTML = ''

    const g = control.grid
    const cx = Math.round(control.current.x * g)
    const cy = Math.round(control.current.y * g)
    const cz = Math.round(control.current.z * g)

    // グリッド範囲内の頂点を列挙
    const vl = []
    for(let n = 0; n < object.vertexCount; n++)
    {
        const x = Math.round(object.position[n * 3 + 0] * g)
        const y = Math.round(object.position[n * 3 + 1] * g)
        const z = Math.round(object.position[n * 3 + 2] * g)

        const r = 
            cx === x &&
            cy === y &&
            cz === z
        if(r) vl.push(n)
    }
    // 列挙した頂点を含む三角形を列挙
    let cm = false
    const i = object.index
    const sl = []
    for(let n = 0; n < vl.length; n++)
        for(let m = 0; m < i.length; m++)
        {
            // 違う頂点ならスキップ
            if(i[m] !== vl[n]) continue

            const c = Math.floor(m / 3)

            // かぶっていたらスキップ
            cm = false
            for(let s of sl) if(s === c) cm = true
            if(cm) continue

            sl.push(c)
        }
                
    // それらの三角形をリスト
    for(let n = 0; n < sl.length; n++)
    {
        const s = sl[n]
        const li = document.createElement('li')
        li.textContent = s
        addClass(li, 'surface')
        for(let j = 0; j < control.surface.selected.length; j++)
        {
            if(control.surface.selected[j] === s) addClass(li, 'selected')
        }
        li.addEventListener('click', callback.selectSurface)
        element.surfaceList.append(li)
    }
}
    
// 頂点リスト更新
const updateVertexList = () =>
{
    element.vertexList.innerHTML = ''
    element.vertexListSurface.innerHTML = ''

    const g = control.grid
    const cx = Math.round(control.current.x * g)
    const cy = Math.round(control.current.y * g)
    const cz = Math.round(control.current.z * g)
    const tw = object.texture.width * 2
    const th = object.texture.height * 2
    const ctx = Math.round(control.current.texX * tw)
    const cty = Math.round(control.current.texY * th)

    for(let n = 0; n < object.vertexCount; n++)
    {
        const x = Math.round(object.position[n * 3 + 0] * g)
        const y = Math.round(object.position[n * 3 + 1] * g)
        const z = Math.round(object.position[n * 3 + 2] * g)
        const texX = Math.round(object.coordinate[n * 2 + 0] * tw)
        const texY = Math.round(object.coordinate[n * 2 + 1] * th)

        // グリッド範囲内の頂点をリスト表示
        const r = 
            mode.dimension === 3 &&
            cx === x &&
            cy === y &&
            cz === z ||
            mode.dimension === 2 &&
            ctx === texX &&
            cty === texY
        if(r)
        {
            const li = document.createElement('li')
            li.textContent = n
            addClass(li, 'vertex')
            for(let i = 0; i < control.vertex.selected.length; i++)
            {
                if(control.vertex.selected[i] === n) addClass(li, 'selected')
            }
            li.addEventListener('click', callback.selectVertex)
            element.vertexList.append(li)

            const lic = li.cloneNode()
            lic.textContent = n
            lic.addEventListener('click', callback.selectVertex)
            element.vertexListSurface.append(lic)
        }
    }

    if(mode.name !== 'surface')
    {
        if(object.vertexCount && control.vertex.selected.length === object.vertexCount)
            addClass(element.all, 'selected')
        else
            removeClass(element.all, 'selected')
    }
}

// テクスチャ更新
const updateTexture = () =>
{
    model.texture.texture = 
    {
        width: object.texture.width,
        height: object.texture.height,
        data: object.texture.data,
    }
    model.object.texture = 
    {
        width: object.texture.width,
        height: object.texture.height,
        data: object.texture.data,
    }
}

// モデルの中身を更新
const updateModel = () =>
{
    const position3d = []
    const pointColor = []
    const color = []
    const position2d = []
    const coordinate = []
    const pointIndex = []
    const index = []

    let count = 0

    const o = control.selectedObject

    // 各頂点に行う
    for(let i = 0; i < object.vertexCount; i++)
    {
        // 座標3D
        position3d[i * 3 + 0] = object.position[i * 3 + 0]
        position3d[i * 3 + 1] = object.position[i * 3 + 1]
        position3d[i * 3 + 2] = object.position[i * 3 + 2]

        // 点モデル用の頂点の色 選択されていたら色を濃くする
        if(o[i])
        {
            pointColor[i * 3 + 0] = object.color[i * 3 + 0]
            pointColor[i * 3 + 1] = object.color[i * 3 + 1]
            pointColor[i * 3 + 2] = object.color[i * 3 + 2]
        }
        else
        {
            pointColor[i * 3 + 0] = (object.color[i * 3 + 0] + 0.5) / 2
            pointColor[i * 3 + 1] = (object.color[i * 3 + 1] + 0.5) / 2
            pointColor[i * 3 + 2] = (object.color[i * 3 + 2] + 0.5) / 2
        }

        // 本体モデル用の頂点の色
        color[i * 3 + 0] = object.color[i * 3 + 0]
        color[i * 3 + 1] = object.color[i * 3 + 1]
        color[i * 3 + 2] = object.color[i * 3 + 2]

        // 点モデル用のインデクス
        pointIndex[i] = i

        // 2D点モデル用の座標2D
        position2d[i * 3 + 0] = object.coordinate[i * 2 + 0] * 2
        position2d[i * 3 + 1] = object.coordinate[i * 2 + 1] * 2
        position2d[i * 3 + 2] = 0

        // 本体用のUV
        coordinate[i * 2 + 0] = object.coordinate[i * 2 + 0]
        coordinate[i * 2 + 1] = object.coordinate[i * 2 + 1]

        // 頂点を数える
        count++
    }
    
    // 本体モデル用インデクス
    for(let i = 0; i < object.index.length; i++)
    {
        index[i] = object.index[i]
    }

    model.point3d.position = position3d
    model.point3d.color = pointColor
    model.point3d.index = pointIndex
    model.point2d.position = position2d
    model.point2d.color = pointColor
    model.point2d.index = pointIndex
    model.object.position = position3d
    model.object.color = color
    model.object.coordinate = coordinate
    model.object.index = index
    object.vertexCount = count
}

// 全て更新
const update = () =>
{
    const n = object.name
    element.nameStrage.value = n
    element.nameFile.value = n
    element.name.value = n

    updateVertexList()
    updateSurfaceList()
    updateSelect()
    updateTexture()
    updateModel()
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
    model.object.texture = 
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
    addClass(element.param2dDiv, 'none')
    addClass(element.vertexDiv, 'none')
    addClass(element.surfaceDiv, 'none')
    addClass(element.matrixDiv, 'none')
    addClass(element.texelDiv, 'none')

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

    // 3Dモデルのオブジェクト
    object =
    {
        type: 'space',
        version: version,
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
            texX: 0.5 / object.texture.width,
            texY: 0.5 / object.texture.height,
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
            texX: 0.5 / object.texture.width,
            texY: 0.5 / object.texture.height,
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
            selected: [],
            color: [1, 1, 1, 1],
            grab: false,
        },
        surface:
        {
            selected: [],
        },
        texel:
        {
            put: false,
            remove: false,
            color: [1, 1, 1, 1],
        },
        selectedList: [],
        selectedObject: {},
        grid: 7,
        strage:
        {
            selected: '',
        },
        rotate: false,
        scroll: false,
        prevPointer:
        {
            normalizedX: 0,
            normalizedY: 0,
        },
    }

    element.name.value = object.name
    element.nameStrage.value = object.name
    element.nameFile.value = object.name
    
    // 描いてあるものを消去
    renderer.clearFrame(0.5, 0.5, 0.5, 1)
    renderer.clear(0.5, 0.5, 0.5, 1)

    // 円盤の背景の板
    model.disc3d.shader = shader.texture

    model.disc3d.position = 
    [
        -1, -1, 1,
         1, -1, 1,
        -1,  1, 1,
         1,  1, 1,
    ]
    model.disc3d.color =
    [
        1, 1, 1,
        1, 1, 1,
        1, 1, 1,
        1, 1, 1,
    ]
    model.disc3d.coordinate = 
    [
        0, 0,
        1, 0,
        0, 1,
        1, 1,
    ]
    model.disc3d.index = 
    [
        0, 1, 2,
        3, 2, 1,
    ]
    // 円盤を描く
    const discTextureData = []
    const dw = 512, dh = 512
    for(let y = 0; y < dw; y++)
        for(let x = 0; x < dh; x++)
        {
            discTextureData[(y * dw + x) * 4 + 0] = 0x00
            discTextureData[(y * dw + x) * 4 + 1] = 0x00
            discTextureData[(y * dw + x) * 4 + 2] = 0x00
            discTextureData[(y * dw + x) * 4 + 3] = 0x11
            const r = (x - dw / 2) * (x - dw / 2) + (y - dh / 2) * (y - dh / 2)
            const p = (dw / 2 * 6 / 8) * (dw / 2 * 6 / 8)
            const q = (dw / 2 * 2 / 8) * (dw / 2 * 2 / 8)
            if(r < p) discTextureData[(y * dw + x) * 4 + 3] = 0x00
            if(r < q) discTextureData[(y * dw + x) * 4 + 3] = 0x11
        }
    model.disc3d.texture = 
    {
        width: dw,
        height: dh,
        data: discTextureData,
    }

    // 3d背景の板
    model.bg3d.shader = shader.texture

    model.bg3d.position = 
    [
        -4, -4, 0.8,
         4, -4, 0.8,
        -4,  4, 0.8,
         4,  4, 0.8,
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
            background3dTextureData[(y * bg3w + x) * 4 + 0] = 0x00
            background3dTextureData[(y * bg3w + x) * 4 + 1] = 0x00
            background3dTextureData[(y * bg3w + x) * 4 + 2] = 0x00
            background3dTextureData[(y * bg3w + x) * 4 + 3] = 0x00
            const p = 1
            if(
                (bg3w - p <= x || x < p) &&
                (bg3h - p <= y || y < p)
            )
            {
                background3dTextureData[(y * bg3w + x) * 4 + 0] = 0x66
                background3dTextureData[(y * bg3w + x) * 4 + 1] = 0x66
                background3dTextureData[(y * bg3w + x) * 4 + 2] = 0x66
                background3dTextureData[(y * bg3w + x) * 4 + 3] = 0xFF
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
    const bgw = 32, bgh = 32
    for(let y = 0; y < bgw; y++)
        for(let x = 0; x < bgh; x++)
        {
            background2dTextureData[(y * bgw + x) * 4 + 0] = 0x00
            background2dTextureData[(y * bgw + x) * 4 + 1] = 0x00
            background2dTextureData[(y * bgw + x) * 4 + 2] = 0x00
            background2dTextureData[(y * bgw + x) * 4 + 3] = 0x33
            const xw = x - bgw / 2
            const yh = y - bgh / 2
            const p = bgw / 2 - 1
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
    const pw = 16, ph = 16
    for(let y = 0; y < pw; y++)
        for(let x = 0; x < ph; x++)
        {
            pointTextureData[(y * pw + x) * 4 + 0] = 0x00
            pointTextureData[(y * pw + x) * 4 + 1] = 0x00
            pointTextureData[(y * pw + x) * 4 + 2] = 0x00
            pointTextureData[(y * pw + x) * 4 + 3] = 0x00
            const r = (x - pw / 2) * (x - pw / 2) + (y - ph / 2) * (y - ph / 2)
            const q = (pw / 2 - 1) * (pw / 2 - 1)
            if(r < q)
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
    model.point3d.pointSize = 16

    // 2Dモデルの点群
    model.point2d.shader = shader.sprite
    model.point2d.position = []
    model.point2d.color = []
    model.point2d.index = []
    // スプライト点を描く
    const point2dTextureData = []
    const p2w = 16, p2h = 16
    for(let y = 0; y < p2w; y++)
        for(let x = 0; x < p2h; x++)
        {
            point2dTextureData[(y * p2w + x) * 4 + 0] = 0x00
            point2dTextureData[(y * p2w + x) * 4 + 1] = 0x00
            point2dTextureData[(y * p2w + x) * 4 + 2] = 0x00
            point2dTextureData[(y * p2w + x) * 4 + 3] = 0x00
            const r = (x - p2w / 2) * (x - p2w / 2) + (y - p2h / 2) * (y - p2h / 2)
            const q = (p2w / 2 - 1) * (p2w / 2 - 1)
            if(r < q)
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
    model.point2d.pointSize = 16

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
    model.strongPoint.pointSize = 128 / control.grid

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
    model.originalPoint.pointSize = 256 / control.grid

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

    // 3Dモデルの本体
    model.object.shader = shader.texture
    model.object.position = []
    model.object.coordinate = []
    model.object.color = []
    model.object.index = []
    model.object.texture =
    {
        width: pw,
        height: ph,
        data: pointTextureData,
    }
    model.object.matrix = matrix.object

    // テクスチャ初期化
    initTexture()

    // テクセル置きなどの状態をリセット
    resetState()

    // 画面更新
    update()
}
init()

// 頂点の削除
const deleteVertex = (i) =>
{
    object.position.splice(i * 3, 3)
    object.color.splice(i * 3, 3)
    object.coordinate.splice(i * 2, 2)

    // 関連した面も消す
    for(let m = 0; m < object.index.length; m++)
    {
        if(object.index[m] === i)
        {
            object.index.splice(Math.floor(m / 3) * 3, 3)
        }
    }
    // 面のインデクスをつめる
    for(let m = 0; m < object.index.length; m++)
    {
        if(object.index[m] > i) object.index[m]--
    }
}

// テクセル描き
const putTexel = () =>
{
    let c = []
    if(control.texel.put)
    {
        c[0] = control.texel.color[0] * 0xFF
        c[1] = control.texel.color[1] * 0xFF
        c[2] = control.texel.color[2] * 0xFF
        c[3] = control.texel.color[3] * 0xFF
    }
    else if(control.texel.remove) c = [0, 0, 0, 0]
    else return
    const w = object.texture.width
    const h = object.texture.height
    const x = Math.floor(control.current.texX * w)
    const y = Math.floor(control.current.texY * h)
    if
    (
        x < 0 || w <= x ||
        y < 0 || h <= y
    ) return

    object.texture.data[(y * w + x) * 4 + 0] = c[0]
    object.texture.data[(y * w + x) * 4 + 1] = c[1]
    object.texture.data[(y * w + x) * 4 + 2] = c[2]
    object.texture.data[(y * w + x) * 4 + 3] = c[3]
}

// xを半分の値で丸める
const halfRound = (x, a) =>
{
    const h = (a / 2)
    return Math.floor(x * h) / h
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
    updateCursor()

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
        let rx = control.current.rotX
        let ry = control.current.rotY
        while(3 < ry) ry -= 4
        while(ry < 0) ry += 4

        // 背景の円盤を描く
        model.disc3d.drawTriangles()

        // カメラが回っていなくかつ
        if(!control.rotate && mode.name !== 'param3d')
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
        matrix.object.initialize()

        // 平行投影にする
        matrix.originalPoint.parallel(-1, 1, -1, 1, 1, 100)
        matrix.strongPoint.parallel(-1, 1, -1, 1, 1, 100)
        matrix.point3d.parallel(-1, 1, -1, 1, 1, 100)
        matrix.object.parallel(-1, 1, -1, 1, 1, 100)

        // カメラが回っている
        if(control.current.scale !== 1)
        {
            // すべて50だけ前進させて全体が映るようにする
            matrix.originalPoint.translateZ(50)
            matrix.strongPoint.translateZ(50)
            matrix.point3d.translateZ(50)
            matrix.object.translateZ(50)
        }
        // 回っていない
        else
        {
            // すべて1と少しだけ前進させてカメラの前方のものだけ映るようにする
            matrix.originalPoint.translateZ(1.125)
            matrix.strongPoint.translateZ(1.125)
            matrix.point3d.translateZ(1.125)
            matrix.object.translateZ(1.125)
        }

        // 「3D」モード以外
        if(mode.name !== 'param3d')
        {
            // 強調する点を描く
            matrix.strongPoint.scaleX(control.current.scale)
            matrix.strongPoint.scaleY(control.current.scale)
            matrix.strongPoint.scaleZ(control.current.scale)
            matrix.strongPoint.rotateX(rx * Math.PI / 2)
            matrix.strongPoint.rotateY(ry * Math.PI / 2)
            matrix.strongPoint.translateX(halfRound(-mx, cvw))
            matrix.strongPoint.translateY(halfRound(-my, cvh))
            matrix.strongPoint.translateZ(halfRound(-mz, cvh))
            model.strongPoint.drawPoints()

            // 原点を描く
            matrix.originalPoint.scaleX(control.current.scale)
            matrix.originalPoint.scaleY(control.current.scale)
            matrix.originalPoint.scaleZ(control.current.scale)
            matrix.originalPoint.rotateX(rx * Math.PI / 2)
            matrix.originalPoint.rotateY(ry * Math.PI / 2)
            matrix.originalPoint.translateX(halfRound(-cx, cvw))
            matrix.originalPoint.translateY(halfRound(-cy, cvh))
            matrix.originalPoint.translateZ(halfRound(-cz, cvh))
            model.originalPoint.drawPoints()
        }

        // 点モデルを描く
        if(
            mode.name === 'vertex3d' ||
            mode.name === 'surface'
        )
        {
            matrix.point3d.scaleX(control.current.scale)
            matrix.point3d.scaleY(control.current.scale)
            matrix.point3d.scaleZ(control.current.scale)
            matrix.point3d.rotateX(rx * Math.PI / 2)
            matrix.point3d.rotateY(ry * Math.PI / 2)
            matrix.point3d.translateX(halfRound(-cx, cvw))
            matrix.point3d.translateY(halfRound(-cy, cvh))
            matrix.point3d.translateZ(halfRound(-cz, cvh))
            model.point3d.drawPoints()
        }

        // モデル本体を描く
        if(mode.name !== 'vertex3d')
        {
            matrix.originalPoint.scaleX(control.current.scale)
            matrix.originalPoint.scaleY(control.current.scale)
            matrix.originalPoint.scaleZ(control.current.scale)
            matrix.object.scaleX(control.current.scale)
            matrix.object.scaleY(control.current.scale)
            matrix.object.scaleZ(control.current.scale)
            matrix.object.rotateX(rx * Math.PI / 2)
            matrix.object.rotateY(ry * Math.PI / 2)
            matrix.object.translateX(halfRound(-cx, cvw))
            matrix.object.translateY(halfRound(-cy, cvh))
            matrix.object.translateZ(halfRound(-cz, cvh))
            model.object.drawTriangles()
        }

        if(mode.name !== 'param3d')
        {
            // 真ん中の照準を描く
            matrix.center.initialize()
            matrix.center.translateZ(-1)
            model.center.drawPoints()
        }
    }

    // 2D表示
    if(mode.dimension === 2)
    {
        let cx = control.current.texX * 2
        while(2 < cx) cx -= 2
        while(cx < -2) cx += 2
        let cy = control.current.texY * 2
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

        // 「2D」モード以外
        if(mode.name !== 'param2d')
        {
            // 薄い四角を描画
            matrix.bg2d.initialize()
            matrix.bg2d.translateX(halfRound(-cx, cvw))
            matrix.bg2d.translateY(halfRound(-cy, cvh))
            model.bg2d.drawTriangles()

            // 真ん中の照準を描く
            matrix.center.initialize()
            matrix.center.translateZ(-1)
            model.center.drawPoints()
        }
    }

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
    name: (e) =>
    {
        const n = e.target.value
        object.name = n

        // 普段のとストレージ画面の名前
        if(e.target !== element.nameStrage) element.nameStrage.value = n
        if(e.target !== element.nameFile) element.nameFile.value = n
        if(e.target !== element.name) element.name.value = n
    },
    // インポートファイルのロード完了
    fileImported: (e) =>
    {
        const json = e.target.result
        const o = JSON.parse(json)

        // spaceファイルなら読み込み
        if(o.type === 'space') object = o
        else return

        object.version = version

        update()

        addClass(element.fileDiv, 'none')
    },
    // インポートファイルの中身を取得後に処理を行う
    importFile: (e) =>
    {
        const file = e.target.files[0]
        const reader = new FileReader()
        reader.addEventListener('load', callback.fileImported)
        reader.readAsText(file)
    },
    import: (e) =>
    {
        element.importFile.value = ''
        const i = element.importFile
        i.click()
    },
    // ファイルに出力
    export: (e) =>
    {
        e.stopPropagation()
        e.preventDefault()

        // json作成
        const json = JSON.stringify(object, null, 0)

        // blob化
        const blob = new Blob([json], { type: 'application/x-space', })

        // ダウンロード用のaタグ
        const a = document.createElement('a')
        a.href =  URL.createObjectURL(blob)
        a.download = object.name + '.space'

        // クリックした事にしてダウンロード
        a.click()

        addClass(element.fileDiv, 'none')
    },
    // ファイルをキャンセル
    cancelFile: (e) =>
    {
        addClass(element.fileDiv, 'none')
    },
    // ファイル画面を開く
    openFile: (e) =>
    {
        removeClass(element.fileDiv, 'none')
    },
    // ストレージをキャンセル
    cancelButton: (e) =>
    {
        addClass(element.strageDiv, 'none')
        control.strage.selected = ''
        updateStrageList()
    },
    // ストレージから削除
    deleteButton: (e) =>
    {
        // 削除
        delete listObject[control.strage.selected]
        const listJson = JSON.stringify(listObject, null, 0)
        localStorage.setItem(dataListName, listJson)
        control.strage.selected = ''
    
        updateStrageList()
    },
    // ストレージからロード実行
    loadButton: (e) =>
    {
        const s = control.strage.selected
        if(!s) return

        const json = localStorage.getItem(s)

        object = JSON.parse(json)
        object.version = version

        addClass(element.strageDiv, 'none')

        control.strage.selected = ''
        updateStrageList()

        update()
    },
    // ストレージ画面を開く
    openStrage: (e) =>
    {
        removeClass(element.strageDiv, 'none')
    },
    // ストレージに保存
    saveButton: (e) =>
    {
        e.stopPropagation()
        e.preventDefault()

        const json = JSON.stringify(object, null, 0)
        localStorage.setItem(object.name, json)

        // データリスト更新
        const dataListName = 'data-list'
        let listJson, listObject = {}
        if(localStorage.hasOwnProperty(dataListName))
        {
            listJson = localStorage.getItem(dataListName)
            listObject = JSON.parse(listJson)
        }

        if(listObject[object.name] == undefined) listObject[object.name] = true

        listJson = JSON.stringify(listObject, null, 0)
        localStorage.setItem(dataListName, listJson)

        updateStrageList()
    },
    // ストレージのリストから選択した
    selectStrage: (e) =>
    {
        const s = document.querySelectorAll('.strage')
        for(let v of s) removeClass(v, 'selected')
        addClass(e.target, 'selected')
        const n = e.target.textContent
        control.strage.selected = n
        object.name = n
        element.name.value = n
        element.nameStrage.value = n
        element.nameFile.value = n
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

        model.strongPoint.pointSize = 128 / g
        model.originalPoint.pointSize = 256 / g
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
    
        // 各モード
        if(mode.name === 'param3d')
        {
            addClass(element.put, 'disabled')
            addClass(element.remove, 'disabled')
            addClass(element.grab, 'disabled')
            addClass(element.all, 'disabled')
            removeClass(element.param3dDiv, 'none')
            addClass(element.param3dMode, 'selected')
            mode.dimension = 3
            update()
        }
        if(mode.name === 'vertex3d')
        {
            removeClass(element.put, 'disabled')
            removeClass(element.remove, 'disabled')
            removeClass(element.grab, 'disabled')
            removeClass(element.all, 'disabled')
            removeClass(element.vertexDiv, 'none')
            addClass(element.vertex3dMode, 'selected')
            mode.dimension = 3
            update()
        }
        if(mode.name === 'surface')
        {
            removeClass(element.put, 'disabled')
            removeClass(element.remove, 'disabled')
            removeClass(element.grab, 'disabled')
            removeClass(element.all, 'disabled')
            removeClass(element.all, 'selected')
            removeClass(element.surfaceDiv, 'none')
            addClass(element.surfaceMode, 'selected')
            mode.dimension = 3
            update()
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
        if(mode.name === 'vertex2d')
        {
            removeClass(element.put, 'disabled')
            removeClass(element.remove, 'disabled')
            removeClass(element.grab, 'disabled')
            removeClass(element.all, 'disabled')
            removeClass(element.vertexDiv, 'none')
            addClass(element.vertex2dMode, 'selected')
            mode.dimension = 2
            update()
        }
        if(mode.name === 'param2d')
        {
            addClass(element.put, 'disabled')
            addClass(element.remove, 'disabled')
            addClass(element.grab, 'disabled')
            addClass(element.all, 'disabled')
            removeClass(element.param2dDiv, 'none')
            addClass(element.param2dMode, 'selected')
            mode.dimension = 2
        }
        if(mode.name === 'texel')
        {
            removeClass(element.put, 'disabled')
            removeClass(element.remove, 'disabled')
            addClass(element.grab, 'disabled')
            addClass(element.all, 'disabled')
            removeClass(element.texelDiv, 'none')
            addClass(element.texelMode, 'selected')
            mode.dimension = 2

            // グリッド半分の位置に照準があった時に丸める
            const w = object.texture.width / 2
            const h = object.texture.height / 2
            control.goal.texX = (Math.floor(control.current.texX * w * 2) + 0.5) / w / 2
            control.goal.texY = (Math.floor(control.current.texY * h * 2) + 0.5) / h / 2
        }
        if(mode.name === 'pose2d')
        {
            removeClass(element.pose2dDiv, 'none')
            addClass(element.pose2dMode, 'selected')
            mode.dimension = 2
        }

        resetState()
    },
    touchCanvas: (e) =>
    {
        e.preventDefault()

        if(
            e.type !== 'touchstart' &&
            e.type !== 'touchmove' &&
            !(e.buttons & 1)
        ) return

        const t = e.target
        const rect = t.getBoundingClientRect()
    
        let x = -1, y = -1
        if(e.clientX != undefined) x = e.clientX
        if(e.targetTouches != undefined) x = e.targetTouches[0].clientX
        if(e.clientY != undefined) y = e.clientY
        if(e.targetTouches != undefined) y = e.targetTouches[0].clientY

        // ノーマライズされたポインター座標
        const nx = (x - rect.left - rect.width / 2) / rect.width * 2
        const ny = (y - rect.top - rect.height / 2) / rect.height * 2

        // 範囲によってスクロールか回転かを判断
        const r = nx * nx + ny * ny
        const scr = 1 / 4
        const rot = 3 / 4
        if(scr * scr < r && r < rot * rot && mode.dimension === 3)
        {
            control.rotate = true
            control.goal.scale = 1 / 2
        }
        else
        {
            control.scroll = true
        }

        control.prevPointer.normalizedX = nx
        control.prevPointer.normalizedY = ny
    },
    slideCanvas: (e) =>
    {
        e.preventDefault()

        if(
            e.type !== 'touchstart' &&
            e.type !== 'touchmove' &&
            !(e.buttons & 1)
        ) return

        const t = e.target
        const rect = t.getBoundingClientRect()
    
        let x = -1, y = -1
        if(e.clientX != undefined) x = e.clientX
        if(e.targetTouches != undefined) x = e.targetTouches[0].clientX
        if(e.clientY != undefined) y = e.clientY
        if(e.targetTouches != undefined) y = e.targetTouches[0].clientY

        // ノーマライズされたポインター座標
        const nx =  (x - rect.left - rect.width / 2) / rect.width * 2
        const ny = (y - rect.top - rect.height / 2) / rect.height * 2

        // 前回のポインターとの差
        const dx = nx - control.prevPointer.normalizedX
        const dy = ny - control.prevPointer.normalizedY

        // 3dスクロール
        if(mode.dimension === 3 && control.scroll)
        {
            // 回転の状態によって動かす方向が変わる
            let rx = Math.round(control.current.rotX)
            let ry = Math.round(control.current.rotY)
            while(ry < 0) ry += 4
            while(ry > 3) ry -= 4
            const x = -dx
            const y = dy
            if(rx === 0 && ry === 0) { control.delta.x += x ; control.delta.y += y }
            if(rx === 0 && ry === 1) { control.delta.z += x ; control.delta.y += y }
            if(rx === 0 && ry === 2) { control.delta.x += -x ; control.delta.y += y }
            if(rx === 0 && ry === 3) { control.delta.z += -x ; control.delta.y += y }
            if(rx === 1 && ry === 0) { control.delta.x += x ; control.delta.z += -y }
            if(rx === 1 && ry === 1) { control.delta.z += x ; control.delta.x += y }
            if(rx === 1 && ry === 2) { control.delta.x += -x ; control.delta.z += y }
            if(rx === 1 && ry === 3) { control.delta.z += -x ; control.delta.x += -y }
            if(rx === -1 && ry === 0) { control.delta.x += x ; control.delta.z += y }
            if(rx === -1 && ry === 1) { control.delta.z += x ; control.delta.x += -y }
            if(rx === -1 && ry === 2) { control.delta.x += -x ; control.delta.z += -y }
            if(rx === -1 && ry === 3) { control.delta.z += -x ; control.delta.x += y }
        }
        // 3d回転
        if(mode.dimension === 3 && control.rotate)
        {
            control.delta.rotX += -dy * 2
            control.delta.rotY += -dx * 2
        }
        // 2dスクロール
        if(mode.dimension === 2)
        {
            control.delta.texX += -dx / 2
            control.delta.texY += dy / 2
        }

        // 前回のポインター位置を記憶
        control.prevPointer.normalizedX = nx
        control.prevPointer.normalizedY = ny
    },
    releaseCanvas: (e) =>
    {
        e.preventDefault()
        
        if(
            e.type !== 'touchend' &&
            e.type !== 'touchcancel' &&
            e.type !== 'mouseup' &&
            e.type !== 'mousecancel' &&
            !(e.buttons & 1)
        ) return
    
        // const t = e.target

        // 停止して丸める
        if(mode.dimension === 3 && control.scroll)
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
            control.scroll = false
        }
        if(mode.dimension === 3 && control.rotate)
        {
            control.delta.rotX = 0
            control.delta.rotY = 0
            control.goal.rotX = Math.round(control.current.rotX)
            control.goal.rotY = Math.round(control.current.rotY)
            control.goal.scale = 1
            control.rotate = false
        }
        // 2dモード
        if(mode.dimension === 2 && mode.name !== 'vertex2d')
        {
            control.delta.texX = 0
            control.delta.texY = 0
            const w = object.texture.width / 2
            const h = object.texture.height / 2
            control.goal.texX = (Math.floor(control.current.texX * w * 2) + 0.5) / w / 2
            control.goal.texY = (Math.floor(control.current.texY * h * 2) + 0.5) / h / 2
            control.scroll = false
        }
        // テクセル以外のモードではグリッドの半分の位置に停止できる
        if(mode.dimension === 2 && mode.name !== 'texel')
        {
            control.delta.texX = 0
            control.delta.texY = 0
            const w = object.texture.width
            const h = object.texture.height
            control.goal.texX = Math.round(control.current.texX * w * 2) / w / 2
            control.goal.texY = Math.round(control.current.texY * h * 2) / h / 2
            control.scroll = false
        }

        // 速度を0にする
        control.delta.x = 0
        control.delta.y = 0
        control.delta.z = 0
        control.delta.t = 0
        control.delta.texX = 0
        control.delta.texY = 0

        // 前回のポインター位置を記憶
        control.prevPointer.normalizedX = 0
        control.prevPointer.normalizedY = 0
    },
    selectVertex: (e) =>
    {
        const t = e.target
        const i = parseInt(t.textContent)

        let c = -1
        for(let n = 0; n < control.vertex.selected.length; n++)
        {
            if(control.vertex.selected[n] === i) c = n
        }
        // 選択されていなかったら選択
        if(c === -1)
        {
            control.vertex.selected.push(i)
            addClass(t, 'selected')

            // 色をスポイト
            const r = object.color[i * 3 + 0]
            const g = object.color[i * 3 + 1]
            const b = object.color[i * 3 + 2]
            const hr = (r * 0xFF).toString(16).padStart(2, '0').toUpperCase()
            const hg = (g * 0xFF).toString(16).padStart(2, '0').toUpperCase()
            const hb = (b * 0xFF).toString(16).padStart(2, '0').toUpperCase()

            const h = '#' + hr + hg + hb
            let c
            if(r + g + b > 3 / 2) c = '#000'
            else c = '#FFF'
            element.buttonVertexColor.style.backgroundColor = h
            element.buttonVertexColor.textContent = h
            element.vertexColor.value = h
            element.buttonVertexColor.style.color = c
            element.buttonVertexColorSurface.style.backgroundColor = h
            element.buttonVertexColorSurface.textContent = h
            element.vertexColorSurface.value = h
            element.buttonVertexColorSurface.style.color = c

            control.vertex.color[0] = r
            control.vertex.color[1] = g
            control.vertex.color[2] = b
        }
        // 選択されていたら選択解除
        else
        {
            control.vertex.selected.splice(c, 1)
            removeClass(t, 'selected')
        }

        update()
    },
    selectSurface: (e) =>
    {
        const t = e.target
        const i = parseInt(t.textContent)

        let c = -1
        for(let n = 0; n < control.surface.selected.length; n++)
        {
            if(control.surface.selected[n] === i) c = n
        }
        // 選択されていなかったら選択
        if(c === -1)
        {
            control.surface.selected.push(i)
            addClass(t, 'selected')
        }
        // 選択されていたら選択解除
        else
        {
            control.surface.selected.splice(c, 1)
            removeClass(t, 'selected')
        }

        update()
    },
    // 全選択
    all: (e) =>
    {
        if(mode.name === 'vertex3d' || mode.name === 'vertex2d')
        {
            const s = control.vertex.selected
            // 何も選択されていなかったら
            if(!s.length)
            {
                // 全選択
                for(let i = 0; i < object.vertexCount; i++)
                    s.push(i)
                addClass(e.target, 'selected')
            }
            // 何かが選択されていたら
            else
            {
                // 全解除
                control.vertex.selected = []
                removeClass(e.target, 'selected')
            }
            update()
        }
        if(mode.name === 'surface')
        {
            const s = control.selectedList
            // 何も選択されていなかったら
            if(!s.length)
            {
                // 全選択
                for(let i = 0; i < object.vertexCount; i++)
                    control.vertex.selected.push(i)
                for(let i = 0; i < object.index.length / 3; i++)
                    control.surface.selected.push(i)
                addClass(e.target, 'selected')
            }
            // 何かが選択されていたら
            else
            {
                // 全解除
                control.vertex.selected = []
                control.surface.selected = []
                removeClass(e.target, 'selected')
            }
            update()
        }
    },
    // データを置く
    put: (e) =>
    {
        // 頂点置き
        if(
            mode.name === 'vertex3d' ||
            mode.name === 'vertex2d'
        )
        {
            const n = object.vertexCount++
            const gw = control.grid
            const gh = control.grid
            const gd = control.grid
            const tw = object.texture.width * 2
            const th = object.texture.height * 2

            object.position[n * 3 + 0] = Math.round(control.current.x * gw) / gw
            object.position[n * 3 + 1] = Math.round(control.current.y * gh) / gh
            object.position[n * 3 + 2] = Math.round(control.current.z * gd) / gd
            object.color[n * 3 + 0] = control.vertex.color[0]
            object.color[n * 3 + 1] = control.vertex.color[1]
            object.color[n * 3 + 2] = control.vertex.color[2]
            object.coordinate[n * 2 + 0] = Math.round(control.current.texX * tw) / tw
            object.coordinate[n * 2 + 1] = Math.round(control.current.texY * th) / th

            update()
        }
        // 面張り
        if(mode.name === 'surface')
        {
            const v = control.vertex.selected
            // 三角形以上
            if(v.length >= 3)
            {
                // 多角形のインデクスを作る
                for(let i = 1; i < v.length - 1; i++)
                {
                    object.index.push(v[0])
                    object.index.push(v[i])
                    object.index.push(v[i + 1])
                }
                control.vertex.selected = []

                update()
            }
        }
        // テクセル描き
        if(mode.name === 'texel')
        {
            control.texel.put = !control.texel.put
            control.texel.remove = false

            if(control.texel.put) addClass(element.put, 'selected')
            else removeClass(element.put, 'selected')
            removeClass(element.remove, 'selected')
            
            putTexel()
            update()
        }
    },
    remove: (e) =>
    {
        // 頂点消し
        if(
            mode.name === 'vertex3d' ||
            mode.name === 'vertex2d' ||
            mode.name === 'surface'
        )
        {
            const s = control.vertex.selected

            // 頂点の選択削除
            const l = s.length
            for(let n = 0; n < l; n++)
            {
                deleteVertex(s[0])
            }

            control.vertex.selected = []
            
            update()
        }
        // 面消し
        if(mode.name === 'surface')
        {
            const s = control.surface.selected

            // 面の選択削除
            const l = s.length
            for(let n = 0; n < l; n++)
            {
                const i = s[0]
                object.index.splice(i * 3, 3)
            }
            control.surface.selected = []

            update()
        }
        // テクセル消し
        if(mode.name === 'texel')
        {
            control.texel.remove = !control.texel.remove
            control.texel.put = false

            if(control.texel.remove) addClass(element.remove, 'selected')
            else removeClass(element.remove, 'selected')
            removeClass(element.put, 'selected')
            
            putTexel()
            update()
        }
    },
    // つかんで移動ツール
    grab: (e) =>
    {
        if(
            mode.name !== 'vertex3d' &&
            mode.name !== 'surface' &&
            mode.name !== 'vertex2d'
        ) return

        control.vertex.grab = !control.vertex.grab

        // 選択されている
        if(control.vertex.grab) addClass(element.grab, 'selected')
        // 選択されていない
        else
        {
            removeClass(element.all, 'selected')
            removeClass(element.grab, 'selected')
            control.vertex.selected = []
            control.surface.selected = []
            update()
        }
    },
    buttonVertexColor: (e) =>
    {
    },
    vertexColor: (e) =>
    {
        const h = e.target.value.toUpperCase()
        const hr = h.substring(1, 3)
        const hg = h.substring(3, 5)
        const hb = h.substring(5, 7)
        const r = parseInt(hr, 16) / 0xFF
        const g = parseInt(hg, 16) / 0xFF
        const b = parseInt(hb, 16) / 0xFF

        control.vertex.color[0] = r
        control.vertex.color[1] = g
        control.vertex.color[2] = b
        control.vertex.color[3] = 1

        let c
        if(r + g + b > 3 / 2) c = '#000'
        else c = '#FFF'
        element.buttonVertexColor.style.backgroundColor = h
        element.buttonVertexColor.textContent = h
        element.buttonVertexColor.style.color = c
        element.vertexColor.value = h
        element.buttonVertexColorSurface.style.backgroundColor = h
        element.buttonVertexColorSurface.textContent = h
        element.vertexColorSurface.value = h
        element.buttonVertexColorSurface.style.color = c

        // 選択されていたら塗る
        if(control.selectedList.length)
        {
            for(let n = 0; n < control.selectedList.length; n++)
            {
                const v = control.selectedList[n]
                object.color[v * 3 + 0] = control.vertex.color[0]
                object.color[v * 3 + 1] = control.vertex.color[1]
                object.color[v * 3 + 2] = control.vertex.color[2]
            }

            update()
        }
    },
    // スポイト
    buttonTexelColor: (e) =>
    {
        const x = Math.floor(control.current.texX * object.texture.width)
        const y = Math.floor(control.current.texY * object.texture.height)
        const w = object.texture.width
        const r = object.texture.data[(y * w + x) * 4 + 0] / 0xFF
        const g = object.texture.data[(y * w + x) * 4 + 1] / 0xFF
        const b = object.texture.data[(y * w + x) * 4 + 2] / 0xFF
        const a = object.texture.data[(y * w + x) * 4 + 3] / 0xFF
        const hr = (r * 0xFF).toString(16).padStart(2, '0').toUpperCase()
        const hg = (g * 0xFF).toString(16).padStart(2, '0').toUpperCase()
        const hb = (b * 0xFF).toString(16).padStart(2, '0').toUpperCase()
        const ha = (a * 0xFF).toString(16).padStart(2, '0').toUpperCase()
        control.texel.color[0] = r
        control.texel.color[1] = g
        control.texel.color[2] = b
        control.texel.color[3] = a

        const h = '#' + hr + hg + hb
        element.buttonTexelColor.style.backgroundColor = h
        element.buttonTexelColor.textContent = h
        element.texelColor.value = h

        let c
        if(r + g + b > 3 / 2) c = '#000'
        else c = '#FFF'
        element.buttonTexelColor.style.color = c
    },
    texelColor: (e) =>
    {
        const v = element.texelColor.value.toUpperCase()
        const hr = parseInt(v.substring(1, 3), 16)
        const hg = parseInt(v.substring(3, 5), 16)
        const hb = parseInt(v.substring(5, 7), 16)
        const r = hr / 0xFF
        const g = hg / 0xFF
        const b = hb / 0xFF
        element.buttonTexelColor.style.backgroundColor = v
        element.buttonTexelColor.textContent = v
        let c
        if(r + g + b > 3 / 2) c = '#000'
        else c = '#FFF'
        element.buttonTexelColor.style.color = c

        control.texel.color[0] = r
        control.texel.color[1] = g
        control.texel.color[2] = b
        control.texel.color[3] = 1

        putTexel()
        update()
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
    // このWebアプリを最新版にする
    version: (e) =>
    {
        if ('serviceWorker' in navigator)
            navigator.serviceWorker.getRegistration()
                .then(registration => {
                    registration.unregister()
                })
        location.reload()
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

// キャンバスを押した時のイベント
element.canvas.addEventListener('mousedown', callback.touchCanvas)
element.canvas.addEventListener('touchstart', callback.touchCanvas)
element.canvas.addEventListener('mousemove', callback.slideCanvas)
element.canvas.addEventListener('touchmove', callback.slideCanvas)
element.canvas.addEventListener('mouseup', callback.releaseCanvas)
element.canvas.addEventListener('mouseout', callback.releaseCanvas)
element.canvas.addEventListener('touchend', callback.releaseCanvas)
// ストレージ系のイベント
element.name.addEventListener('input', callback.name)
element.nameStrage.addEventListener('input', callback.name)
element.nameFile.addEventListener('input', callback.name)
element.loadButton.addEventListener('click', callback.loadButton)
element.deleteButton.addEventListener('click', callback.deleteButton)
element.cancelButton.addEventListener('click', callback.cancelButton)
element.strageForm.addEventListener('submit', callback.saveButton)
// ファイル系イベント
element.cancelFile.addEventListener('click', callback.cancelFile)
element.fileForm.addEventListener('submit', callback.export)
element.import.addEventListener('click', callback.import)
element.importFile.addEventListener('change', callback.importFile)
// ストレージとファイルの画面を開くボタン
element.openStrage.addEventListener('click', callback.openStrage)
element.openFile.addEventListener('click', callback.openFile)
// アプリアップデートボタン
element.version.addEventListener('click', callback.version)
// パラメータ適用
element.param3dForm.addEventListener('submit', callback.apply3d)
element.param2dForm.addEventListener('submit', callback.apply2d)
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
// 編集用ボタンを押した時のイベント
element.all.addEventListener('click', callback.all)
element.put.addEventListener('click', callback.put)
element.remove.addEventListener('click', callback.remove)
element.grab.addEventListener('click', callback.grab)
// 色選択をした時のイベント
element.buttonVertexColor.addEventListener('click', callback.buttonVertexColor)
element.buttonVertexColorSurface.addEventListener('click', callback.buttonVertexColor)
element.buttonTexelColor.addEventListener('click', callback.buttonTexelColor)
element.vertexColor.addEventListener('input', callback.vertexColor)
element.vertexColorSurface.addEventListener('input', callback.vertexColor)
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


// ストレージのリスト更新
let listObject = {}
const updateStrageList = () =>
{
    // データリスト更新
    let listJson
    if(localStorage.hasOwnProperty(dataListName))
    {
        listJson = localStorage.getItem(dataListName)
        listObject = JSON.parse(listJson)
    }

    // リストを表示
    element.strageList.innerHTML = ''
    for(let k in listObject)
    {
        const li = document.createElement('li')
        li.textContent = k
        addClass(li, 'strage')
        li.addEventListener('pointerdown', callback.selectStrage)
        element.strageList.append(li)
    }
}
updateStrageList()

// PWAの登録
if ('serviceWorker' in navigator)
{
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('./service-worker.js').catch((err) => {
            console.error('Service Worker registration was failed: ', err)
        })
    })
}