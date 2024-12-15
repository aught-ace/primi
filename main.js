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
    timeBar: document.querySelector('#time-bar'),
    time: document.querySelector('#time'),
    vertexDiv: document.querySelector('#vertex-div'),
    spaceDiv: document.querySelector('#space-div'),
    ruler3dDiv: document.querySelector('#ruler-3d-div'),
    ruler2dDiv: document.querySelector('#ruler-2d-div'),
    texelDiv: document.querySelector('#texel-div'),
    loadForm: document.querySelector('#load-form'),
    saveForm: document.querySelector('#save-form'),
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
const loadCallback = (e) =>
{
    // フォーム送信をキャンセル
    e.stopPropagation()
    e.preventDefault()
}
element.loadForm.addEventListener('click', loadCallback)
// セーブボタンが押された時
const saveCallback = (e) =>
{
    // フォーム送信をキャンセル
    e.stopPropagation()
    e.preventDefault()
}
element.saveForm.addEventListener('submit', saveCallback)

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

/*
const getDepthInput = (clientY) =>
{
    const depthRect = element.depth.getBoundingClientRect()
    const depthBarRect = element.depthBar.getBoundingClientRect()

    // 入力された位置
    const input = Math.min(Math.max(
        0,
        (clientY - depthBarRect.top - depthRect.height / 2) / (depthBarRect.height - depthRect.height)),
        1
    )
    // 上からの位置
    const top = input * (1 - depthRect.height / depthBarRect.height)
    // つまみ上に書く数字
    const content = Math.round((1 - input) * (object.far - object.near) + object.near)
    // 離した時にフィットさせる丸めた位置
    const roundTop =
        Math.round(input * (object.far - object.near)) /
        (object.far - object.near) * (1 - depthRect.height / depthBarRect.height)

    const o =
    {
        top: top * 100,
        content: content,
        roundTop: roundTop * 100,
    }
    return o
}
*/

// バーを押した
const depthBarMoveCallback = (e) =>
{
    // 左クリックされていない時は返す
    if(!(e.buttons & 1)) return

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

    let ny = (e.clientY - outerRect.top - innerRect.height / 2) / outerRect.height * 4 - 1

    if(ny < -1) ny = -1
    if(ny > 1) ny = 1

    innerElem.style.top = (25 + ny * 25) + '%'
}
element.depthBar.addEventListener('pointerdown', depthBarMoveCallback)
element.depth.addEventListener('pointerdown', depthBarMoveCallback)
element.depthBar.addEventListener('pointermove', depthBarMoveCallback)
element.depth.addEventListener('pointermove', depthBarMoveCallback)
element.depthBar.addEventListener('pointerover', depthBarMoveCallback)
element.depth.addEventListener('pointerover', depthBarMoveCallback)
element.timeBar.addEventListener('pointerdown', depthBarMoveCallback)
element.time.addEventListener('pointerdown', depthBarMoveCallback)
element.timeBar.addEventListener('pointermove', depthBarMoveCallback)
element.time.addEventListener('pointermove', depthBarMoveCallback)
element.timeBar.addEventListener('pointerover', depthBarMoveCallback)
element.time.addEventListener('pointerover', depthBarMoveCallback)
// バーを離した
const depthBarUpCallback = (e) =>
{
    if(
        (
            e.type === 'pointerleave' ||
            e.type === 'pointerout'
        ) && !(e.buttons & 1)
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

    innerElem.style.top = '25%'
}
element.depthBar.addEventListener('pointerup', depthBarUpCallback)
element.depth.addEventListener('pointerup', depthBarUpCallback)
element.depthBar.addEventListener('pointerleave', depthBarUpCallback)
element.depth.addEventListener('pointerleave', depthBarUpCallback)
element.depthBar.addEventListener('pointerout', depthBarUpCallback)
element.depth.addEventListener('pointerout', depthBarUpCallback)
element.timeBar.addEventListener('pointerup', depthBarUpCallback)
element.time.addEventListener('pointerup', depthBarUpCallback)
element.timeBar.addEventListener('pointerleave', depthBarUpCallback)
element.time.addEventListener('pointerleave', depthBarUpCallback)
element.timeBar.addEventListener('pointerout', depthBarUpCallback)
element.time.addEventListener('pointerout', depthBarUpCallback)


// パッドを押した
const padMoveCallback = (e) =>
{
    if(
        (
            e.type === 'pointermove' ||
            e.type === 'pointerover'
        ) &&
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

    let nx = (e.clientX - outerRect.left - innerRect.width / 2) / outerRect.width * 4 - 1
    let ny = (e.clientY - outerRect.top - innerRect.height / 2) / outerRect.height * 4 - 1

    const s = Math.sqrt(nx * nx + ny * ny)
    if(s > 1)
    {
        nx /= s
        ny /= s
    }

    innerElem.style.left = (25 + nx * 25) + '%'
    innerElem.style.top = (25 + ny * 25) + '%'
}
element.scrollPad.addEventListener('pointerdown', padMoveCallback)
element.scroll.addEventListener('pointerdown', padMoveCallback)
element.rotatePad.addEventListener('pointerdown', padMoveCallback)
element.rotate.addEventListener('pointerdown', padMoveCallback)
element.scrollPad.addEventListener('pointermove', padMoveCallback)
element.scroll.addEventListener('pointermove', padMoveCallback)
element.rotatePad.addEventListener('pointermove', padMoveCallback)
element.rotate.addEventListener('pointermove', padMoveCallback)
element.scrollPad.addEventListener('pointerover', padMoveCallback)
element.scroll.addEventListener('pointerover', padMoveCallback)
element.rotatePad.addEventListener('pointerover', padMoveCallback)
element.rotate.addEventListener('pointerover', padMoveCallback)

// パッドを離した
const padUpCallback = (e) =>
{
    // クリックせずに去った時は返す
    if(
        (
            e.type === 'pointerout' ||
            e.type === 'pointerleave'
        ) && !(e.buttons & 1)
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
element.scrollPad.addEventListener('pointerout', padUpCallback)
element.scroll.addEventListener('pointerout', padUpCallback)
element.rotatePad.addEventListener('pointerout', padUpCallback)
element.rotate.addEventListener('pointerout', padUpCallback)