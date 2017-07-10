(function(config) {


    config.containers = document.getElementsByClassName('slide-container');

    function template(data) {
        var self = this;
        self.status = true;
        self.container = data;
        self.template = data.children[0];
        self.items = self.template.children;
        self.options = { startIndex: 0, timer: 3000 };
        self.dotContainer = document.createElement('div');
        self.dotContainer.className = 'slide-container-dots';
        self.container.appendChild(self.dotContainer);

        self.eventnames = {
            click: ['click', 'touchend'],
            mousedown: ['mousedown', 'touchstart'],
            mouseup: ['mouseup', 'touchend'],
            mousemove: ['mousemove', 'touchmove']
        }

        self.bind = function(obj, name, action) {

            function sets(a) {
                if (obj.addEventListener)
                    obj.addEventListener(a, action);
                else
                    obj.attachEvent('on' + a, action);
            }
            for (var i = 0; i < self.eventnames[name].length; i++)
                sets(self.eventnames[name][i]);
        }

        self.add = function(n, i) {
            var dot = document.createElement('span');
            self.bind(dot, 'click', function() {
                self.options.startIndex = i;
                self.selectedItem();
            });
            self.dotContainer.appendChild(dot);
        }

        self.selectedItem = function() {
            for (var i = 0, u = self.dotContainer.children; i < u.length; i++) {
                u[i].className = '';
            }

            u[self.options.startIndex].className = 'active';
            self.template.style.left = -(self.options.startIndex * self.container.clientWidth) + 'px';
            self.watch();
        }


        for (var i = 0; i < self.items.length; i++) {
            self.add(self.items[i], i);
        }

        self.getPosition = function(e) {
            var result = { pageX: 0, pageY: 0 };
            result.pageX = e.touches ? e.touches[0].pageX : e.pageX;
            result.pageY = e.touches ? e.touches[0].pageY : e.pageY;
            return result;
        }

        self.bind(self.container, 'mousedown', function(e) {
            var x = self.getPosition(e).pageX;
            self.position = { leftX: x, x: x - self.template.offsetLeft };
            self.template.classList.add('handle');
            e.preventDefault();
            self.status = false;
            return;
        });

        self.bind(self.container, 'mousemove', function(e) {
            e.preventDefault();
            if (!self.status) {
                var x = self.getPosition(e).pageX;
                self.position.left = self.position.leftX > x;
                self.position.right = self.position.leftX < x;
                var min = (self.template.children.length * self.container.offsetWidth) - self.container.offsetWidth;
                self.position.current = x - self.container.offsetLeft - self.position.x;
                if (self.position.current > 0)
                    self.position.current = 0;
                else if (self.position.current < -min)
                    self.position.current = -min;
                self.template.style.left = self.position.current + 'px';
            }
            return false;
        });
        self.bind(window, 'mouseup', function() {
            self.template.classList.remove('handle');
            if (self.position.left) {
                self.options.startIndex++;
                self.checkPosition();
                self.selectedItem();
            } else if (self.position.right) {
                self.options.startIndex--;
                self.checkPosition();
                self.selectedItem();
            }

            self.status = true;
            self.watch();

            self.position.left = self.position.right = false;
        });

        self.checkPosition = function() {
            if (self.options.startIndex > self.items.length - 1)
                self.options.startIndex = self.items.length - 1;

            if (self.options.startIndex < 0)
                self.options.startIndex = 0;
        }
        var time = 0;
        self.watch = function() {
            clearTimeout(time);
            time = setTimeout(function() {
                if (self.status) {

                    if (self.options.startIndex < self.items.length - 1) {
                        self.options.startIndex++;
                    } else
                        self.options.startIndex = 0;

                    self.selectedItem(self.options.startIndex);

                }
            }, self.options.timer);
        }
        self.selectedItem(self.options.startIndex);

    }

    (function(a) {
        for (var n = 0; n < a.length; n++) {
            var t = new template(a[n]);
        }
    })(config.containers);
})({});