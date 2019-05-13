(function(document) {

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
        var args = arguments;
        for (var i = 1; i < args.length; i++) {
            for (var key in args[i]) {
                args[0][key] = args[i][key]
            }
        }
        return args[0]
    }

    window.Modal = function(sel, options) {

        var self = this;

        self.shown = false;
        self.o = extend({}, {
            id: sel,
            onShow: function() {},
            onHide: function() {},
            onBeforeHide: function() {return true},
            esc : true,
            click : true,
        }, options);

        self.m = typeof sel === 'string' ? document.getElementById(sel) : sel;

        self.onClick = function(event) {
            if(event.target.hasAttribute('data-modal-close') ||
                (self.m.isEqualNode(event.target) && self.o.click)) {
                self.hide(event);
                event.preventDefault();
            }
        };

        self.onKeydown = function(event) {
            if (event.keyCode === 27 && self.o.esc && self.shown) self.hide(event);
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
        var self = this;

        if(self.shown)
            return;

        self.shown = true;

        document.body.classList.add('w-modal'); // add class to body to disable scrollbars

        // Remember focus:
        oldFocus = document.activeElement

        if (oldFocus.blur) {
            oldFocus.blur();
        }

        self.m.setAttribute('aria-hidden', false);

        self.m.addEventListener('touchstart', self.onClick);
        self.m.onclick = self.onClick;
        document.addEventListener('keydown', self.onKeydown);

        self.m.classList.add('modal__open');

        self.maintainFocus();

        self.o.onShow.call(self.m);
    }


    Modal.prototype.hide = function(e) {
        var self = this;

        if(!self.o.onBeforeHide.call(self.m, e))
            return;

        self.m.setAttribute('aria-hidden', true);

        // Restore focus
        if(oldFocus) oldFocus.focus();

        self.m.removeEventListener('touchstart', self.onClick);
        self.m.onclick = null;
        document.removeEventListener('keydown', self.onKeydown);

        // Restore scroll
        document.body.classList.remove('w-modal');

        self.m.classList.remove('modal__open');
        self.shown = false;
        self.o.onHide.call(self.m, e);
    };

    Modal.prototype.container = function() {
        return this.m;
    }

})(document);