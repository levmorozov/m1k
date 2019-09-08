(function (document) {

    var FOCUSABLE_ELEMENTS = [
        'a[href]',
        'input:not([disabled]):not([type="hidden"]):not([aria-hidden])',
        'select:not([disabled]):not([aria-hidden])',
        'textarea:not([disabled]):not([aria-hidden])',
        'button:not([disabled]):not([aria-hidden])',
        'iframe',
        'embed',
        '[contenteditable]',
        '[tabindex]:not([tabindex^="-"])'
    ], oldFocus;

    function extend() {
        var args = arguments;
        for (var i = 1; i < args.length; i++) {
            for (var key in args[i]) {
                args[0][key] = args[i][key]
            }
        }
        return args[0]
    }

    function noop() { return true }

    window.Modal = function (sel, options) {

        var shown = false;
        var opts = extend({}, {
            onShow: noop,
            onHide: noop,
            esc: true,
            click: true,
        }, options);

        var modal = typeof sel === 'string' ? document.getElementById(sel) : sel;

        function onKeydown(event) {
            if (event.keyCode === 27 && opts.esc && shown) hide(event);
            if (event.keyCode === 9 && shown) maintainFocus(event);
        }

        function maintainFocus(event) {
            var focusableNodes = focusableNodes ||
                Array.prototype.slice.call(modal.querySelectorAll(FOCUSABLE_ELEMENTS));

            if (!focusableNodes.length)
                return;

            // if focus currently not in the modal
            if (!event || !modal.contains(document.activeElement) && focusableNodes.length) {
                var focused = modal.querySelector('[autofocus]') || focusableNodes[0];
                if (focused)
                    focused.focus();
            } else {
                var focusedItemIndex = focusableNodes.indexOf(document.activeElement)

                if (event.shiftKey && focusedItemIndex === 0) {
                    focusableNodes[focusableNodes.length - 1].focus()
                    event.preventDefault()
                }

                if (!event.shiftKey && focusedItemIndex === focusableNodes.length - 1) {
                    focusableNodes[0].focus()
                    event.preventDefault()
                }
            }
        }

        function show() {
            if (shown)
                return;

            shown = true;

            document.body.classList.add('w-modal'); // add class to body to disable scrollbars

            // Remember focus:
            oldFocus = document.activeElement

            if (oldFocus.blur) {
                oldFocus.blur();
            }

            modal.setAttribute('aria-hidden', false);

            modal.onclick = function (event) {
                if (event.target.hasAttribute('data-modal-close') ||
                    (modal.isEqualNode(event.target) && opts.click)) {
                    hide(event);
                    event.preventDefault();
                }
            };
            document.addEventListener('keydown', onKeydown);

            modal.classList.add('modal__open');

            maintainFocus();

            opts.onShow.call(modal);
        }

        function hide(e) {
            if (!opts.onHide.call(modal, e))
                return;

            modal.setAttribute('aria-hidden', true);

            // Restore focus
            if (oldFocus) oldFocus.focus();

            document.removeEventListener('keydown', onKeydown);

            // Restore scroll
            document.body.classList.remove('w-modal');

            modal.classList.remove('modal__open');
            shown = false;
        }

        return {
            show: show,
            hide: hide
        }
    };

})(document);