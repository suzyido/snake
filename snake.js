$(function() {    
    var Q = window.Q = Quintus()
                       .include('Input, Sprites, Scenes, Anim')
                       .setup('quintus', {maximize: true})
                       .controls();

    Q.objectType = {
        none: 0,
        snake: 1,
        tail: 2,
        target: 4,
        display: 8
    };

    Q.snakeFrame = {
        left: 0,
        down: 1,
        right: 2,
        up: 3,
        standing: 16
    };

    Q.tailFrame = {
        left: 4,
        right: 5,
        up: 6,
        down: 7,
        upRight: 8,
        upLeft: 9,
        downLeft: 10,
        downRight: 11,
        bottomTail: 12,
        rightTail: 13,
        topTail: 14,
        leftTail: 15
    }

    Q.targetFrameStartAt = 17;
    Q.targetFrameEndAt = 34;

    Q.Snake = Q.Sprite.extend({
        init: function(props) {
            this._super(_(props).extend({
                sheet: 'snake',
                sprite: 'snake',
                type: Q.objectType.snake,
                frame: Q.snakeFrame.standing,
                speed: 150,
                direction: null,
                currentTarget: 1,
                deltaFromLastTime: 0,
                lastTailItem: this,
                z: 3
            }));
            
            this.add('tail');
            
            _.bindAll(this, "_checkCollision", "_handleStep", "_adjustDirection", "_adjustLocation");
        },

        step: function(dt) {
            var p = this.p;
            var delta = dt * p.speed;

            this._checkCollision(dt);
            this._handleStep(dt);
        },

        _checkCollision: function(dt) {
            var p = this.p;
            var delta = dt * p.speed;

            var hit = Q.stage().collide(this, Q.objectType.target | Q.objectType.tail);
            if(hit) {
                if((hit.p.type == 4 && hit.p.value == p.currentTarget)) {
                    p.currentTarget++;
                    hit.trigger('collision', this);

                    var stage = Q.stage();
                    var obj = stage.item(Q.objectType.display);
                    if(obj) {
                        obj.trigger('collision', this);
                    }

                    this.tail.grow();
                }
                else if(hit.p.type == Q.objectType.tail && hit.p.following == this) {
                    return;
                }
                else {
                    Q.stageScene("level");
                }
            }
        },

        _handleStep: function(dt) {
            var p = this.p;

            this._adjustDirection();

            if(!p.direction) {
                return;
            }

            this._adjustLocation(dt);

        },

        _adjustDirection: function() {
            var p = this.p;

            if(!p.hasTail) {
                this.tail.grow();
                p.hasTail = true;
            }

            if(Q.inputs['right'] && p.direction != 'left') {
                p.direction = 'right';
                p.nextFrame = Q.snakeFrame.right;
            }
            else if(Q.inputs['left'] && p.direction != 'right') {
                p.direction = 'left';
                p.nextFrame = Q.snakeFrame.left;
            }
            else if(Q.inputs['up'] && p.direction != 'down') {
                p.direction = 'up';
                p.nextFrame = Q.snakeFrame.up;
            }
            else if(Q.inputs['down'] && p.direction != 'up') {
                p.direction = 'down';
                p.nextFrame = Q.snakeFrame.down;
            }                        
        },
        
        _adjustLocation: function(dt) {
            var p = this.p;
            
            p.deltaFromLastTime += dt * p.speed;
            if(p.deltaFromLastTime < p.w) {
                return;
            }
            
            p.deltaFromLastTime = 0;
            p.frame = p.nextFrame;        
            
            if(p.direction == 'right') {
                p.x += p.w;
            }
            else if(p.direction == 'left') {
                p.x -= p.w;
            }
            else if(p.direction == 'up') {
                p.y -= p.h;
            }
            else if(p.direction == 'down') {
                p.y += p.h;
            }          

            if(p.x > Q.width || p.x < 0 || p.y > Q.height || p.y < 0) {
                Q.stageScene("level");
            }  
        },

        collision: function() {
        }

    });

    Q.register('tail', {
        added: function() {
        },

        grow: function() {
            var p = this.entity.p,
                stage = this.entity.parent,
                tailPart = new Q.TailSection({x: p.lastTailItem.p.x, 
                                              y: p.lastTailItem.p.y,
                                              following: p.lastTailItem});

            stage.insert(tailPart);
            p.lastTailItem.p.trailling = tailPart;
            p.lastTailItem = tailPart;
        }

    });

    Q.TailSection = Q.FollowingSprite.extend({
        init: function(props) {
            this._super(_(props).extend({
                sheet: 'snake',
                sprite: 'snake',
                type: Q.objectType.tail,
                parts: 0,
                z: 3
            }));
        },

        step: function(dt) {
            var p = this.p;
            // Moving up
            if(p.x == p.lastFollowingLocX && 
               (!p.trailling || p.x == p.trailling.p.x) &&
               p.y > p.lastFollowingLocY) {
                if(p.trailling) {
                    p.frame = Q.tailFrame.up;                    
                }
                else {
                    p.frame = Q.tailFrame.bottomTail;
                }
            }
            // Moving down
            else if(p.x == p.lastFollowingLocX && 
                    (!p.trailling || p.x == p.trailling.p.x) &&
                    p.y < p.lastFollowingLocY) {
                if(p.trailling) {
                    p.frame = Q.tailFrame.down;
                }
                else {
                    p.frame = Q.tailFrame.topTail;
                }
            }          
            // Moving right
            else if(p.y == p.lastFollowingLocY && 
                    (!p.trailling || p.y == p.trailling.p.y) &&
                    p.x < p.lastFollowingLocX) {
                if(p.trailling) {
                    p.frame = Q.tailFrame.right;
                }
                else {
                    p.frame = Q.tailFrame.leftTail;
                }
            }          
            // Moving left
            else if(p.y == p.lastFollowingLocY && 
                    (!p.trailling || p.y == p.trailling.p.y) &&
                    p.x > p.lastFollowingLocX) {
                if(p.trailling) {
                    p.frame = Q.tailFrame.left;
                }
                else {
                    p.frame = Q.tailFrame.rightTail;
                }
            }          
            // Moving down or up turning left
            else if(p.y == p.lastFollowingLocY && 
                    p.x > p.lastFollowingLocX && 
                    (p.trailling == undefined || p.trailling && p.x == p.trailling.p.x)) {
                // Moving down
                if(p.y > p.trailling.p.y) {
                    p.frame = Q.tailFrame.upLeft;
                }
                // Moving up
                else {
                    p.frame = Q.tailFrame.downLeft;
                }
            }
            // Moving down or up turning right
            else if(p.y == p.lastFollowingLocY && 
                    p.x < p.lastFollowingLocX && 
                    p.trailling && p.x == p.trailling.p.x) {
                // Moving down
                if(p.y > p.trailling.p.y) {
                    p.frame = Q.tailFrame.upRight;
                }
                else {
                    p.frame = Q.tailFrame.downRight;
                }
            }   
            // Moving left or right turning down
            else if(p.x == p.lastFollowingLocX && 
                p.y < p.lastFollowingLocY && 
                p.trailling && p.y == p.trailling.p.y) {
                // Coming from left
                if(p.x > p.trailling.p.x) {
                    p.frame = Q.tailFrame.downLeft;
                }
                // Coming from right
                else {
                    p.frame = Q.tailFrame.downRight;
                }
            }   
            // Moving left or right turning up
            else if(p.x == p.lastFollowingLocX && 
                p.y > p.lastFollowingLocY && 
                p.trailling && p.y == p.trailling.p.y) {
                // Coming from left
                if(p.x > p.trailling.p.x) {
                    p.frame = Q.tailFrame.upLeft;
                }
                // Coming from right
                else {
                    p.frame = Q.tailFrame.upRight;
                }
            }
         
            this._super(dt);
        },

        draw: function(ctx) {
            var p = this.p;
            
            if(p.frame) {
                this._super(ctx);
            }
        }

    });

    Q.GameDisplay = Q.Sprite.extend({
       init: function(props) {
            this._super(_(props).extend({z: 2,
                                         sheet: 'snake',
                                         sprite: 'snake',
                                         type: Q.objectType.display,
                                         nextItemToGrab: 0}));
   
            this.bind('collision', this, 'updateNextItemToGrab');
       },
        
       draw: function(ctx) {
            var p = this.p;

            ctx.beginPath();
            ctx.lineWidth = "6";
            ctx.strokeStyle = "red";
            ctx.rect(p.x, p.y, p.w, p.h); 
            ctx.stroke();

            p.frame = p.startingFrame + p.nextItemToGrab;
            this._super(ctx);
        },

        updateNextItemToGrab: function() {
            this.p.nextItemToGrab++;
        }

    });

    Q.Target = Q.Sprite.extend({
        init: function(props) {
            var x, y;
            do {
                x = Math.floor(Math.random() * Q.width);
                y = Math.floor(Math.random() * Q.height);

                x = x - x % 32;
                y = y - y % 32;
            }
            while(!(x > 32 * 2 &&
                    x < Q.width - 32 * 2 &&
                    y > 32 * 2 &&
                    y < Q.height - 32 * 2));

            this._super(_(props).extend({x: x, y: y, z: 2,
                                         sheet: 'snake',
                                         sprite: 'snake',
                                         type: Q.objectType.target
                                        }));
                            
            this.bind('collision', this, 'collision');
        },

        draw: function(ctx) {
            var p = this.p;
            
            if(!p.onScreen) {
                return;
            }
            this._super(ctx);
        }, 

        step: function() {
            var p = this.p;

            if(!p.onScreen) {
                var hit = Q.stage().collide(this, 21);
                if(hit) {
                    p.x = Math.floor(Math.random() * Q.width);
                    p.y = Math.floor(Math.random() * Q.height);
                }
                else {
                    p.onScreen = true;
                }
            }
        },

        collision: function() {
            var p = this.p;

            if(p.value == Q.targetFrameEndAt - Q.targetFrameStartAt + 1) {
                Q.stageScene("level");
            }
            this.destroy();
        }
    });

    Q.scene('level', new Q.Scene(function(stage) {
        stage.insert(new Q.Repeater({asset: 'background-wall.png',
                                     speedX: 0.50, y: -225, z:0}));
        stage.insert(new Q.GameDisplay({x: 10, y: 10, 
                                        startingFrame: Q.targetFrameStartAt}));
        stage.insert(new Q.Snake({x: Q.width/2 - Q.width/2 % 32, 
                                  y: Q.height/2 - Q.height/2 % 32}));

        var targetFrameRange = Q.targetFrameEndAt - Q.targetFrameStartAt + 1;
        for(var i=Q.targetFrameStartAt; i<= Q.targetFrameEndAt; i++) {
            stage.insert(new Q.Target({value: i - Q.targetFrameStartAt + 1, 
                                       frame: i}));
        }

        stage.add('viewport');
        stage.viewport.scale *= 1.0;
    }, {sort: true}));

    Q.load(['background-wall.png','sprites.png', 
            'sprites.json', 'snake.png', 'snake.json'], function() {
        Q.compileSheets('sprites.png','sprites.json');
        Q.compileSheets('snake.png','snake.json');
        Q.stageScene("level");
    })
});
