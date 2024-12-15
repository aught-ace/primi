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
        // クリックされている時
        //if(!(e.buttons & 1)) return
    
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
        console.log(e)
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
        if(e.targetTouches[0].clientY != undefined) y = e.targetTouches[0].clientY

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
            e.type !== 'pointerup' &&
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
        if(e.targetTouches[0].clientX != undefined) x = e.targetTouches[0].clientX
        if(e.clientY != undefined) y = e.clientY
        if(e.targetTouches[0].clientY != undefined) y = e.targetTouches[0].clientY

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
            e.type !== 'pointerup' &&
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
// 適用ボタンが押された時のイベント
element.ruler3dForm.addEventListener('submit', callback.apply3d)
element.ruler2dForm.addEventListener('submit', callback.apply2d)
// モード変更ボタンが押された時のイベント
element.ruler3dMode.addEventListener('click', callback.changeMode)
element.vertex3dMode.addEventListener('click', callback.changeMode)
element.spaceMode.addEventListener('click', callback.changeMode)
element.ruler2dMode.addEventListener('click', callback.changeMode)
element.vertex2dMode.addEventListener('click', callback.changeMode)
element.texelMode.addEventListener('click', callback.changeMode)
// バーを押したのイベント
element.depthBar.addEventListener('pointerdown', callback.touchSlider)
element.depth.addEventListener('pointerdown', callback.touchSlider)
element.timeBar.addEventListener('pointerdown', callback.touchSlider)
element.time.addEventListener('pointerdown', callback.touchSlider)
element.depthBar.addEventListener('pointermove', callback.touchSlider)
element.depth.addEventListener('pointermove', callback.touchSlider)
element.timeBar.addEventListener('pointermove', callback.touchSlider)
element.time.addEventListener('pointermove', callback.touchSlider)
element.depthBar.addEventListener('touchstart', callback.touchSlider, { passive: false })
element.depth.addEventListener('touchstart', callback.touchSlider, { passive: false })
element.timeBar.addEventListener('touchstart', callback.touchSlider, { passive: false })
element.time.addEventListener('touchstart', callback.touchSlider, { passive: false })
element.depthBar.addEventListener('touchmove', callback.touchSlider, { passive: false })
element.depth.addEventListener('touchmove', callback.touchSlider, { passive: false })
element.timeBar.addEventListener('touchmove', callback.touchSlider, { passive: false })
element.time.addEventListener('touchmove', callback.touchSlider, { passive: false })
// バーを離したのイベント
element.depthBar.addEventListener('pointerup', callback.releaseSlider)
element.depth.addEventListener('pointerup', callback.releaseSlider)
element.timeBar.addEventListener('pointerup', callback.releaseSlider)
element.time.addEventListener('pointerup', callback.releaseSlider)
element.depthBar.addEventListener('pointerleave', callback.releaseSlider)
element.depth.addEventListener('pointerleave', callback.releaseSlider)
element.timeBar.addEventListener('pointerleave', callback.releaseSlider)
element.time.addEventListener('pointerleave', callback.releaseSlider)
element.depthBar.addEventListener('pointerout', callback.releaseSlider)
element.depth.addEventListener('pointerout', callback.releaseSlider)
element.timeBar.addEventListener('pointerout', callback.releaseSlider)
element.time.addEventListener('pointerout', callback.releaseSlider)
element.depthBar.addEventListener('pointercancel', callback.releaseSlider)
element.depth.addEventListener('pointercancel', callback.releaseSlider)
element.timeBar.addEventListener('pointercancel', callback.releaseSlider)
element.time.addEventListener('pointercancel', callback.releaseSlider)
element.depthBar.addEventListener('touchend', callback.releaseSlider)
element.depth.addEventListener('touchend', callback.releaseSlider)
element.timeBar.addEventListener('touchend', callback.releaseSlider)
element.time.addEventListener('touchend', callback.releaseSlider)
element.depthBar.addEventListener('touchcancel', callback.releaseSlider)
element.depth.addEventListener('touchcancel', callback.releaseSlider)
element.timeBar.addEventListener('touchcancel', callback.releaseSlider)
element.time.addEventListener('touchcancel', callback.releaseSlider)
// パッドを押したのイベント
element.scrollPad.addEventListener('pointerdown', callback.touchPad)
element.scroll.addEventListener('pointerdown', callback.touchPad)
element.rotatePad.addEventListener('pointerdown', callback.touchPad)
element.rotate.addEventListener('pointerdown', callback.touchPad)
element.scrollPad.addEventListener('pointermove', callback.touchPad)
element.scroll.addEventListener('pointermove', callback.touchPad)
element.rotatePad.addEventListener('pointermove', callback.touchPad)
element.rotate.addEventListener('pointermove', callback.touchPad)
element.scrollPad.addEventListener('touchstart', callback.touchPad, { passive: false })
element.scroll.addEventListener('touchstart', callback.touchPad, { passive: false })
element.rotatePad.addEventListener('touchstart', callback.touchPad, { passive: false })
element.rotate.addEventListener('touchstart', callback.touchPad, { passive: false })
element.scrollPad.addEventListener('touchmove', callback.touchPad, { passive: false })
element.scroll.addEventListener('touchmove', callback.touchPad, { passive: false })
element.rotatePad.addEventListener('touchmove', callback.touchPad, { passive: false })
element.rotate.addEventListener('touchmove', callback.touchPad, { passive: false })
// パッドを離したのイベント
element.scrollPad.addEventListener('pointerup', callback.releasePad)
element.scroll.addEventListener('pointerup', callback.releasePad)
element.rotatePad.addEventListener('pointerup', callback.releasePad)
element.rotate.addEventListener('pointerup', callback.releasePad)
element.scrollPad.addEventListener('pointerleave', callback.releasePad)
element.scroll.addEventListener('pointerleave', callback.releasePad)
element.rotatePad.addEventListener('pointerleave', callback.releasePad)
element.rotate.addEventListener('pointerleave', callback.releasePad)
element.scrollPad.addEventListener('pointerout', callback.releasePad)
element.scroll.addEventListener('pointerout', callback.releasePad)
element.rotatePad.addEventListener('pointerout', callback.releasePad)
element.rotate.addEventListener('pointerout', callback.releasePad)
element.scrollPad.addEventListener('pointercancel', callback.releasePad)
element.scroll.addEventListener('pointercancel', callback.releasePad)
element.rotatePad.addEventListener('pointercancel', callback.releasePad)
element.rotate.addEventListener('pointercancel', callback.releasePad)
element.scrollPad.addEventListener('touchend', callback.releasePad)
element.scroll.addEventListener('touchend', callback.releasePad)
element.rotatePad.addEventListener('touchend', callback.releasePad)
element.rotate.addEventListener('touchend', callback.releasePad)
element.scrollPad.addEventListener('touchcancel', callback.releasePad)
element.scroll.addEventListener('touchcancel', callback.releasePad)
element.rotatePad.addEventListener('touchcancel', callback.releasePad)
element.rotate.addEventListener('touchcancel', callback.releasePad)

// 全ての要素に対して行う
/*
for(let i = 0; i < element.all.length; i++)
{
    // 選択禁止
    element.all[i].addEventListener('selectstart', callback.returnFalse, { passive: false })
    // ダブルタップ禁止
    element.all[i].addEventListener('dblclick', callback.preventDefault, { passive: false })
    // メニュー禁止
    element.all[i].addEventListener('contextmenu', callback.returnFalse, { passive: false })
}
*/
// PWAの登録
if ('serviceWorker' in navigator)
{
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('./service-worker.js').catch((err) => {
            console.error('Service Worker registration was failed: ', err)
        })
    })
}