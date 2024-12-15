// モジュールのインポート
import * as Matrix from './drawer/matrix.js'
import * as Model from './drawer/model.js'
import * as Renderer from './drawer/renderer.js'

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
    saveForm: document.querySelector('#save-form'),
    exportForm: document.querySelector('#export-form'),
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
    apply2d: (e) =>
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
    },
    changeMode: (e) =>
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
    },
    touchSlider: (e) =>
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
    },
    releaseSlider: (e) =>
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
    },
    touchPad: (e) =>
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
    },
    releasePad: (e) =>
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
    },
    // その操作を禁止
    prevent: (e) =>
    {
        e.preventDefault()
        return false
    },
}

// ロードとセーブのイベント
element.saveForm.addEventListener('click', callback.load)
element.exportForm.addEventListener('submit', callback.save)
// オブジェクト新規作成ボタンが押された時のイベント
element.ruler2dForm.addEventListener('submit', callback.apply2d)
// モード変更ボタンが押された時のイベント
element.ruler3dMode.addEventListener('pointerdown', callback.changeMode)
element.vertex3dMode.addEventListener('pointerdown', callback.changeMode)
element.spaceMode.addEventListener('pointerdown', callback.changeMode)
element.ruler2dMode.addEventListener('pointerdown', callback.changeMode)
element.vertex2dMode.addEventListener('pointerdown', callback.changeMode)
element.texelMode.addEventListener('pointerdown', callback.changeMode)
element.ruler3dMode.addEventListener('pointermove', callback.changeMode)
element.vertex3dMode.addEventListener('pointermove', callback.changeMode)
element.spaceMode.addEventListener('pointermove', callback.changeMode)
element.ruler2dMode.addEventListener('pointermove', callback.changeMode)
element.vertex2dMode.addEventListener('pointermove', callback.changeMode)
element.texelMode.addEventListener('pointermove', callback.changeMode)
// バーを押したのイベント
element.depthBar.addEventListener('pointerdown', callback.touchSlider)
element.depth.addEventListener('pointerdown', callback.touchSlider)
element.depthBar.addEventListener('pointermove', callback.touchSlider)
element.depth.addEventListener('pointermove', callback.touchSlider)
element.timeBar.addEventListener('pointerdown', callback.touchSlider)
element.time.addEventListener('pointerdown', callback.touchSlider)
element.timeBar.addEventListener('pointermove', callback.touchSlider)
element.time.addEventListener('pointermove', callback.touchSlider)
// バーを離したのイベント
element.depthBar.addEventListener('pointerup', callback.releaseSlider)
element.depth.addEventListener('pointerup', callback.releaseSlider)
element.depthBar.addEventListener('pointerleave', callback.releaseSlider)
element.depth.addEventListener('pointerleave', callback.releaseSlider)
element.timeBar.addEventListener('pointerup', callback.releaseSlider)
element.time.addEventListener('pointerup', callback.releaseSlider)
element.timeBar.addEventListener('pointerleave', callback.releaseSlider)
element.time.addEventListener('pointerleave', callback.releaseSlider)
// パッドを押したのイベント
element.scrollPad.addEventListener('pointerdown', callback.touchPad)
element.scroll.addEventListener('pointerdown', callback.touchPad)
element.rotatePad.addEventListener('pointerdown', callback.touchPad)
element.rotate.addEventListener('pointerdown', callback.touchPad)
element.scrollPad.addEventListener('pointermove', callback.touchPad)
element.scroll.addEventListener('pointermove', callback.touchPad)
element.rotatePad.addEventListener('pointermove', callback.touchPad)
element.rotate.addEventListener('pointermove', callback.touchPad)
// パッドを離したのイベント
element.scrollPad.addEventListener('pointerup', callback.releasePad)
element.scroll.addEventListener('pointerup', callback.releasePad)
element.rotatePad.addEventListener('pointerup', callback.releasePad)
element.rotate.addEventListener('pointerup', callback.releasePad)
element.scrollPad.addEventListener('pointerleave', callback.releasePad)
element.scroll.addEventListener('pointerleave', callback.releasePad)
element.rotatePad.addEventListener('pointerleave', callback.releasePad)
element.rotate.addEventListener('pointerleave', callback.releasePad)
// メニュー禁止
document.addEventListener('contextmenu', callback.prevent, { passive: false })
// ダブルタップ禁止
document.addEventListener('dblclick', callback.prevent, { passive: false })