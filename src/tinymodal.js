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
    ];

    function extend() {
        var args = arguments,
            length = args.length;
        for (var i = 1; i < length; i++) {
            //if (!arguments[i])
              //  continue;
            for (var key in args[i]) {
                if (args[i].hasOwnProperty(key)) {
                    args[0][key] = args[i][key]
                }
            }
        }
        return args[0]
    }


    window.Tinymodal = function(sel, options) {
        var defaults = {
            id: sel,
            onClose: function() {},
            onOpen: function() {},
            onBeforeOpen: function() {},
            onBeforeClose: function() {},
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
            if (event.keyCode === 27 && self.o.esc) self.close(event);
            if (event.keyCode === 9) self.maintainFocus(event);
        };

        self.maintainFocus = function(event)
        {
            var focusableNodes = focusableNodes || self.getFocusableNodes();

            // if disableFocus is true
            if (!self.m.contains(document.activeElement) && focusableNodes.length) {
                focusableNodes[0].focus()
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

    Tinymodal.prototype.show = function() {

        if(this.open)
            return;

        this.open = true;

        this.o.onBeforeOpen.call(this.m);

        document.body.classList.add('w-modal'); // add class to body to disable scrollbars

        // Remember focus:
        this.oldFocus = document.activeElement

        if (this.oldFocus.blur) {
            this.oldFocus.blur();
        }

        this.m.classList.add('modal__open');
        this.m.setAttribute('aria-hidden', false);

        this.m.addEventListener('touchstart', this.onClick);
        this.m.addEventListener('click', this.onClick);
        document.addEventListener('keydown', this.onKeydown);

        this.o.onOpen.call(this.m);
        this.maintainFocus();
    }



    Tinymodal.prototype.close = function(e) {

        if (typeof this.o.beforeClose === 'function') {
            var close = this.o.beforeClose.call(this.m);
            if (!close) {
                this._busy(false);
                return;
            }
        }

        this.m.setAttribute('aria-hidden', true);
        this.m.classList.remove('modal__open');

        // Restore focus
        if(self.oldFocus) self.oldFocus.focus();

        this.m.removeEventListener('touchstart', this.onClick);
        this.m.removeEventListener('click', this.onClick);
        document.removeEventListener('keydown', this.onKeydown);

        // Restore scroll
        document.body.classList.remove('w-modal');
        this.o.onClose.call(this.m);

        this.open = false;
    };

})(document, window);