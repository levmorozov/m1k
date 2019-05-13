m1k
============

Tiny vanilla js module for modal windows. JS size 2.1k minified, 906 bytes gziped.


* No dependencies 
* A11Y
* Tiny
* Supports any modern browsers

Install
__________

```
    npm install m1k --save // via npm
    yarn add m1k --save // via yarn
```

Example
----------


```html
<a href="#" id="some-link">Open popup</a>


<div class="modal" id="popup-example" aria-hidden="true">
    <div class="modal__content">
        <button class="modal-close" data-modal-close></button>

        Modal window content here.
        
    </div>
</div>
```

```javascript

    let modal = new Modal('popup-example');
    document.getElementById('test-modal-link1').onclick = function() {
        modal.show();
        return false;
    }

```

Options
--------

List of options with default values:
```
{
    single: false,    // Close other modal windows when open new window
    esc: true,        // Close window on esc
    click: true,      // Close window on click in back,
    // Callbacks:
    onShow: function() {}, 
    onHide: function() {},
    onBeforeHide: function() {return true}
}
```
