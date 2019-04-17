(function(document, window) {

    var FOCUSABLE_ELEMENTS = [
        'a[href]',
        'area[href]',
        'input:not([disabled]):not([type="hidden"]):not([aria-hidden])',
        'select:not([disabled]):not([aria-hidden])',
        'textarea:not([disabled]):not([aria-hidden])',
        'button:not([disabled]):not([aria-hidden])',
        'iframe',
        'object',
        'embed',
        '[contenteditable]',
        '[tabindex]:not([tabindex^="-"])'
    ], oldFocus;

    function extend() {
        var args = arguments,
            length = args.length;
        for (var i = 1; i < length; i++) {
            for (var key in args[i]) {
                if (args[i].hasOwnProperty(key)) {
                    args[0][key] = args[i][key]
                }
            }
        }
        return args[0]
    }

    window.Modal = function(sel, options) {
        var defaults = {
            id: sel,
            onOpen: function() {},
            onClose: function() {},
            onBeforeClose: function() {return true},
            esc : true,
            click : true,
        };

        var self = this;

        self.open = false;
        self.o = extend({}, defaults, options);
        self.m = typeof sel === 'string' ? document.getElementById(sel) : sel;

        self.onClick = function(event) {
            if(event.target.hasAttribute('data-modal-close') ||
                (event.target.classList.contains('modal__open') && self.o.click)) {
                self.close();
                event.preventDefault();
            }
        };

        self.onKeydown = function(event) {
            if (event.keyCode === 27 && self.o.esc && self.shown) self.close(event);
            if (event.keyCode === 9 && self.shown) self.maintainFocus(event);
        };


        self.maintainFocus = function(event)
        {
            var focusableNodes = focusableNodes || self.getFocusableNodes();

            // if focus currently not in the modal
            if (!event || !self.m.contains(document.activeElement) && focusableNodes.length) {
                var focused = self.m.querySelector('[autofocus]') || focusableNodes[0];
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
        };

        self.getFocusableNodes = function () {
            var nodes = self.m.querySelectorAll(FOCUSABLE_ELEMENTS);

            return Object.keys(nodes).map(function (key) {
                return nodes[key];
            });
        }
    };

    Modal.prototype.show = function() {

        if(this.shown)
            return;

        this.shown = true;

        document.body.classList.add('w-modal'); // add class to body to disable scrollbars

        // Remember focus:
        oldFocus = document.activeElement

        if (oldFocus.blur) {
            oldFocus.blur();
        }

        this.m.classList.add('modal__open');
        this.m.setAttribute('aria-hidden', false);

        this.m.addEventListener('touchstart', this.onClick);
        this.m.addEventListener('click', this.onClick);
        document.addEventListener('keydown', this.onKeydown);

        this.maintainFocus();
        this.o.onOpen.call(this.m);
    }



    Modal.prototype.close = function(e) {

        if(!this.o.onBeforeClose.call(this.m))
            return;

        this.m.setAttribute('aria-hidden', true);

        // Restore focus
        if(oldFocus) oldFocus.focus();

        this.m.removeEventListener('touchstart', this.onClick);
        this.m.removeEventListener('click', this.onClick);
        document.removeEventListener('keydown', this.onKeydown);

        // Restore scroll
        document.body.classList.remove('w-modal');
        this.m.classList.remove('modal__open');
        this.shown = false;
        this.o.onClose.call(this.m);
    };

})(document, window);