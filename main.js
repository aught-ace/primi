// モジュールのインポート
import { Matrix } from './drawer/matrix.js'
import { Model } from './drawer/model.js'
import { Renderer } from './drawer/renderer.js'

// モード
let mode = 'vertex3d'

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
    animation3dMode: document.querySelector('#animation-3d-mode'),
    animation2dMode: document.querySelector('#animation-2d-mode'),
    depthBar: document.querySelector('#depth-bar'),
    depth: document.querySelector('#depth'),
    timeBar: document.querySelector('#time-bar'),
    time: document.querySelector('#time'),
    surfaceDiv: document.querySelector('#surface-div'),
    vertexDiv: document.querySelector('#vertex-div'),
    matrixDiv: document.querySelector('#matrix-div'),
    param3dDiv: document.querySelector('#param-3d-div'),
    param2dDiv: document.querySelector('#param-2d-div'),
    animation3dDiv: document.querySelector('#animation-3d-div'),
    animation2dDiv: document.querySelector('#animation-2d-div'),
    texelDiv: document.querySelector('#texel-div'),
    saveForm: document.querySelector('#save-form'),
    exportForm: document.querySelector('#export-form'),
    newButton: document.querySelector('#new'),
    scrollPad: document.querySelector('#scroll-pad'),
    rotatePad: document.querySelector('#rotate-pad'),
    scroll: document.querySelector('#scroll'),
    rotate: document.querySelector('#rotate'),
    all: document.querySelector('*'),
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
element.name.value = object.name

// 描画
const renderer = new Renderer(element.canvas)
renderer.clearFrame(0.5, 0.5, 0.5, 1)
renderer.clear(0.5, 0.5, 0.5, 1)

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
        addClass(element.animation3dDiv, 'none')
        addClass(element.animation2dDiv, 'none')
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
        removeClass(element.animation3dMode, 'selected')
        removeClass(element.animation2dMode, 'selected')
    
        if(e.target.id === 'param-3d-mode') mode = 'param3d'
        if(e.target.id === 'vertex-3d-mode') mode = 'vertex3d'
        if(e.target.id === 'matrix-mode') mode = 'matrix'
        if(e.target.id === 'param-2d-mode') mode = 'param2d'
        if(e.target.id === 'vertex-2d-mode') mode = 'vertex2d'
        if(e.target.id === 'texel-mode') mode = 'texel'
        if(e.target.id === 'animation-3d-mode') mode = 'animation3d'
        if(e.target.id === 'animation-2d-mode') mode = 'animation2d'
        if(e.target.id === 'surface-mode') mode = 'surface'
    
        if(mode === 'param3d')
        {
            removeClass(element.param3dDiv, 'none')
            addClass(element.param3dMode, 'selected')
        }
        if(mode === 'vertex3d')
        {
            removeClass(element.vertexDiv, 'none')
            addClass(element.vertex3dMode, 'selected')
        }
        if(mode === 'matrix')
        {
            removeClass(element.matrixDiv, 'none')
            addClass(element.matrixMode, 'selected')
        }
        if(mode === 'vertex2d')
        {
            removeClass(element.vertexDiv, 'none')
            addClass(element.vertex2dMode, 'selected')
        }
        if(mode === 'param2d')
        {
            removeClass(element.param2dDiv, 'none')
            addClass(element.param2dMode, 'selected')
        }
        if(mode === 'texel')
        {
            removeClass(element.texelDiv, 'none')
            addClass(element.texelMode, 'selected')
        }
        if(mode === 'animation3d')
        {
            removeClass(element.animation3dDiv, 'none')
            addClass(element.animation3dMode, 'selected')
        }
        if(mode === 'animation2d')
        {
            removeClass(element.animation2dDiv, 'none')
            addClass(element.animation2dMode, 'selected')
        }
        if(mode === 'surface')
        {
            removeClass(element.surfaceDiv, 'none')
            addClass(element.surfaceMode, 'selected')
        }
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
element.newButton.addEventListener('click', callback.deleteCaches)
// モード変更ボタンが押された時のイベント
element.param3dMode.addEventListener('pointerdown', callback.changeMode)
element.vertex3dMode.addEventListener('pointerdown', callback.changeMode)
element.matrixMode.addEventListener('pointerdown', callback.changeMode)
element.param2dMode.addEventListener('pointerdown', callback.changeMode)
element.vertex2dMode.addEventListener('pointerdown', callback.changeMode)
element.texelMode.addEventListener('pointerdown', callback.changeMode)
element.animation3dMode.addEventListener('pointerdown', callback.changeMode)
element.animation2dMode.addEventListener('pointerdown', callback.changeMode)
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