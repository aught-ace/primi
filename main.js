// モジュールのインポート
import * as Matrix from './draw/matrix.js'
import * as Model from './draw/model.js'
import * as Renderer from './draw/renderer.js'

// 要素
const element =
{
    ruler3dDiv: document.querySelector('#ruler-3d-div'),
    ruler2dDiv: document.querySelector('#ruler-2d-div'),
    ruler3dForm: document.querySelector('#ruler-3d-form'),
    ruler2dForm: document.querySelector('#ruler-2d-form'),
    name: document.querySelector('#name'),
    left: document.querySelector('#left'),
    right: document.querySelector('#right'),
    top: document.querySelector('#top'),
    bottom: document.querySelector('#bottom'),
    near: document.querySelector('#near'),
    far: document.querySelector('#far'),
    timeLength: document.querySelector('#time-length'),
    ruler: document.querySelector('#ruler'),
    ruler3dMode: document.querySelector('#ruler-3d-mode'),
    ruler2dMode: document.querySelector('#ruler-2d-mode'),
    vertex3dMode: document.querySelector('#vertex-3d-mode'),
    spaceMode: document.querySelector('#space-mode'),
    vertex2dMode: document.querySelector('#vertex-2d-mode'),
    texelMode: document.querySelector('#texel-mode'),
    depthBar: document.querySelector('#depth-bar'),
    depth: document.querySelector('#depth'),
    vertexDiv: document.querySelector('#vertex-div'),
    spaceDiv: document.querySelector('#space-div'),
    ruler3dDiv: document.querySelector('#ruler-3d-div'),
    ruler2dDiv: document.querySelector('#ruler-2d-div'),
    texelDiv: document.querySelector('#texel-div'),
    fileForm: document.querySelector('#file-form'),
    scrollPad: document.querySelector('#scroll-pad'),
    rotatePad: document.querySelector('#rotate-pad'),
    scroll: document.querySelector('#scroll'),
    rotate: document.querySelector('#rotate'),
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
    left: -7,
    right: 7,
    top: -7,
    bottom: 7,
    near: -7,
    far: 7,
    width: 16,
    height: 16,
}

// モード
let mode = 'vertex3d'

element.name.value = object.name

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

// セーブボタンが押された時
const saveCallback = (e) =>
{
    // フォーム送信をキャンセル
    e.stopPropagation()
    e.preventDefault()
}
element.fileForm.addEventListener('submit', saveCallback)

// オブジェクト新規作成ボタンが押された時
const setCallback = (e) =>
{
    // フォーム送信をキャンセル
    e.stopPropagation()
    e.preventDefault()

    // 入力欄の値をオブジェクトにセット
    object.name = element.name.value
    object.left = element.left.value
    object.right = element.right.value
    object.top = element.top.value
    object.bottom = element.bottom.value
    object.near = element.near.value
    object.far = element.far.value
    object.timeLength = element.timeLength.value
}
element.ruler2dForm.addEventListener('submit', setCallback)

// モード変更ボタンが押された時
const changeModeCallback = (e) =>
{
    // クリックされている時
    if(!(e.buttons & 1)) return

    addClass(element.ruler3dDiv, 'none')
    addClass(element.ruler2dDiv, 'none')
    addClass(element.vertexDiv, 'none')
    addClass(element.spaceDiv, 'none')
    addClass(element.texelDiv, 'none')

    removeClass(element.ruler3dMode, 'selected')
    removeClass(element.ruler2dMode, 'selected')
    removeClass(element.vertex3dMode, 'selected')
    removeClass(element.vertex2dMode, 'selected')
    removeClass(element.spaceMode, 'selected')
    removeClass(element.texelMode, 'selected')

    if(e.target.id === 'ruler-3d-mode') mode = 'ruler3d'
    if(e.target.id === 'vertex-3d-mode') mode = 'vertex3d'
    if(e.target.id === 'space-mode') mode = 'space'
    if(e.target.id === 'ruler-2d-mode') mode = 'ruler2d'
    if(e.target.id === 'vertex-2d-mode') mode = 'vertex2d'
    if(e.target.id === 'texel-mode') mode = 'texel'

    if(mode === 'ruler3d')
    {
        removeClass(element.ruler3dDiv, 'none')
        addClass(element.ruler3dMode, 'selected')
    }
    if(mode === 'vertex3d')
    {
        removeClass(element.vertexDiv, 'none')
        addClass(element.vertex3dMode, 'selected')
    }
    if(mode === 'space')
    {
        removeClass(element.spaceDiv, 'none')
        addClass(element.spaceMode, 'selected')
    }
    if(mode === 'vertex2d')
    {
        removeClass(element.vertexDiv, 'none')
        addClass(element.vertex2dMode, 'selected')
    }
    if(mode === 'ruler2d')
    {
        removeClass(element.ruler2dDiv, 'none')
        addClass(element.ruler2dMode, 'selected')
    }
    if(mode === 'texel')
    {
        removeClass(element.texelDiv, 'none')
        addClass(element.texelMode, 'selected')
    }
}
element.ruler3dMode.addEventListener('pointerdown', changeModeCallback)
element.vertex3dMode.addEventListener('pointerdown', changeModeCallback)
element.spaceMode.addEventListener('pointerdown', changeModeCallback)
element.ruler2dMode.addEventListener('pointerdown', changeModeCallback)
element.vertex2dMode.addEventListener('pointerdown', changeModeCallback)
element.texelMode.addEventListener('pointerdown', changeModeCallback)
element.ruler3dMode.addEventListener('pointermove', changeModeCallback)
element.vertex3dMode.addEventListener('pointermove', changeModeCallback)
element.spaceMode.addEventListener('pointermove', changeModeCallback)
element.ruler2dMode.addEventListener('pointermove', changeModeCallback)
element.vertex2dMode.addEventListener('pointermove', changeModeCallback)
element.texelMode.addEventListener('pointermove', changeModeCallback)

// 時間バー
/*
const timeBarMoveCallback = (e) =>
{
    // クリックされていない時は返す
    if(!(e.buttons & 1)) return

    let t
    if(e.target.id === 'time-bar')
        t = (e.offsetY - element.time.offsetHeight / 2) / element.timeBar.offsetHeight
    if(e.target.id === 'time')
        t = (e.clientY - element.timeBar.offsetTop - element.time.offsetHeight / 2) / element.timeBar.offsetHeight
    let s = (t * (15 + 1)) / (15 + 1)
    let c = (1 - t) * (15 + 1) - 1
    s = Math.max(0, Math.min(s, 1 - element.time.offsetHeight / element.timeBar.offsetHeight))
    c = Math.max(object.near, Math.min(c, 15))
    element.time.style.top = (s * 100) + '%'
    element.time.textContent = Math.round(c)
}
element.timeBar.addEventListener('pointerdown', timeBarMoveCallback)
element.time.addEventListener('pointerdown', timeBarMoveCallback)
element.timeBar.addEventListener('pointermove', timeBarMoveCallback)
element.time.addEventListener('pointermove', timeBarMoveCallback)
const timeBarUpCallback = (e) =>
{
    // クリックされている時は返す
    if(e.buttons & 1) return

    let t
    if(e.target.id === 'time-bar')
        t = (e.offsetY - element.time.offsetHeight / 2) / element.timeBar.offsetHeight
    if(e.target.id === 'time')
        t = (e.clientY - element.timeBar.offsetTop - element.time.offsetHeight / 2) / element.timeBar.offsetHeight
    let s = Math.round(t * (15 + 1)) / (15 + 1)
    let c = Math.round((1 - t) * (15 + 1) - 1)
    s = Math.max(0, Math.min(s, 1 - element.time.offsetHeight / element.timeBar.offsetHeight))
    c = Math.max(object.near, Math.min(c, 15))
    element.time.style.top = (s * 100) + '%'
    element.time.textContent = c
}
element.timeBar.addEventListener('pointerup', timeBarUpCallback)
element.time.addEventListener('pointerup', timeBarUpCallback)
*/

const getDepthInput = (clientY) =>
{
    const depthRect = element.depth.getBoundingClientRect()
    const depthBarRect = element.depthBar.getBoundingClientRect()

    const n = (clientY - depthBarRect.top - depthRect.height / 2) / depthBarRect.height
    const t = Math.min(Math.max(0, n), 1 - depthRect.height / depthBarRect.height)
    const c = Math.round(Math.min(Math.max(
        object.near,
        (1 - n) * (object.far - object.near + 1) + object.near - 1),
        object.far))
    const r = Math.round(t * (object.far - object.near + 1)) / (object.far - object.near + 1)

    const o =
    {
        top: t * 100,
        content: c,
        roundTop: r * 100,
    }
    return o
}

// 深度バー
const depthBarMoveCallback = (e) =>
{
    // 左クリックされていない時は返す
    if(!(e.buttons & 1)) return

    const d = getDepthInput(e.clientY)

    element.depth.style.top = d.top + '%'
    element.depth.textContent = d.content
}
element.depthBar.addEventListener('pointerdown', depthBarMoveCallback)
element.depth.addEventListener('pointerdown', depthBarMoveCallback)
element.depthBar.addEventListener('pointermove', depthBarMoveCallback)
element.depth.addEventListener('pointermove', depthBarMoveCallback)
const depthBarUpCallback = (e) =>
{
    // クリックせずに去った時は返す
    if(e.type === 'pointerleave' && !(e.buttons & 1)) return
    
    const d = getDepthInput(e.clientY)

    element.depth.style.top = d.roundTop + '%'
    element.depth.textContent = d.content
}
element.depthBar.addEventListener('pointerup', depthBarUpCallback)
element.depth.addEventListener('pointerup', depthBarUpCallback)
element.depthBar.addEventListener('pointerleave', depthBarUpCallback)
element.depth.addEventListener('pointerleave', depthBarUpCallback)


// パッドを押した
const padMoveCallback = (e) =>
{
    // 左クリックされていない時は返す
    if(!(e.buttons & 1)) return

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

    let nx = (e.clientX - outerRect.left - innerRect.width / 2) / outerRect.width * 2 - 0.5
    let ny = (e.clientY - outerRect.top - innerRect.height / 2) / outerRect.height * 2 - 0.5

    const s = Math.sqrt(nx * nx + ny * ny)
    if(s > 0.5)
    {
        nx /= s * 2
        ny /= s * 2
    }

    innerElem.style.left = (25 + nx * 50) + '%'
    innerElem.style.top = (25 + ny * 50) + '%'
}
element.scrollPad.addEventListener('pointerdown', padMoveCallback)
element.scroll.addEventListener('pointerdown', padMoveCallback)
element.rotatePad.addEventListener('pointerdown', padMoveCallback)
element.rotate.addEventListener('pointerdown', padMoveCallback)
element.scrollPad.addEventListener('pointermove', padMoveCallback)
element.scroll.addEventListener('pointermove', padMoveCallback)
element.rotatePad.addEventListener('pointermove', padMoveCallback)
element.rotate.addEventListener('pointermove', padMoveCallback)
// パッドを離した
const padUpCallback = (e) =>
{
    // クリックせずに去った時は返す
    if(e.type === 'pointerleave' && !(e.buttons & 1)) return

    let innerElem

    if(e.target.id === 'scroll' || e.target.id === 'scroll-pad')
    {
        innerElem = element.scroll
    }
    else if(e.target.id === 'rotate' || e.target.id === 'rotate-pad')
    {
        innerElem = element.rotate
    }

    innerElem.style.left = '25%'
    innerElem.style.top = '25%'
}
element.scrollPad.addEventListener('pointerup', padUpCallback)
element.scroll.addEventListener('pointerup', padUpCallback)
element.rotatePad.addEventListener('pointerup', padUpCallback)
element.rotate.addEventListener('pointerup', padUpCallback)
element.scrollPad.addEventListener('pointerleave', padUpCallback)
element.scroll.addEventListener('pointerleave', padUpCallback)
element.rotatePad.addEventListener('pointerleave', padUpCallback)
element.rotate.addEventListener('pointerleave', padUpCallback)