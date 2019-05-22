$(function() {    
    var Q = window.Q = Quintus()
                       .include('Input, Sprites, Scenes, Anim')
                       .setup('quintus', {maximize: true})
                       .controls();

    Q.objectTypes = {
        none: 0,
        snake: 1,
        tail: 2,
        target: 4,
        display: 8
    };

    Q.Snake = Q.Sprite.extend({
        init: function(props) {
            this._super(_(props).extend({
                sheet: 'snake',
                sprite: 'snake',
                type: Q.objectTypes.snake,
                frame: 1,
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

            var hit = Q.stage().collide(this, Q.objectTypes.target | Q.objectTypes.tail);
            if(hit) {
                if((hit.p.type == 4 && hit.p.value == p.currentTarget)) {
                    p.currentTarget++;
                    hit.trigger('collision', this);

                    var stage = Q.stage();
                    var obj = stage.item(Q.objectTypes.display);
                    if(obj) {
                        obj.trigger('collision', this);
                    }

                    this.tail.grow();
                }
                else if(hit.p.type == Q.objectTypes.tail && hit.p.following == this) {
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

            if(Q.inputs['right'] && p.direction != 'left') {
                p.direction = 'right';
                p.nextFrame = 2;
            }
            else if(Q.inputs['left'] && p.direction != 'right') {
                p.direction = 'left';
                p.nextFrame = 0;
            }
            else if(Q.inputs['up'] && p.direction != 'down') {
                p.direction = 'up';
                p.nextFrame = 3;
            }
            else if(Q.inputs['down'] && p.direction != 'up') {
                p.direction = 'down';
                p.nextFrame = 1;
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
                type: Q.objectTypes.tail,
//                frame: 5,
                parts: 0,
                z: 3
            }));
        },

        step: function(dt) {
            var p = this.p;
            // Moving up
            if(p.x == p.lastFollowingLocX && 
               (p.trailling == undefined || p.x == p.trailling.p.x) &&
               p.y > p.lastFollowingLocY) {
                p.frame = 6;
            }
            // Moving down
            else if(p.x == p.lastFollowingLocX && 
                    (p.trailling == undefined || p.x == p.trailling.p.x) &&
                    p.y < p.lastFollowingLocY) {
                p.frame = 7;
            }          
            // Moving right
            else if(p.y == p.lastFollowingLocY && 
                    (p.trailling == undefined || p.y == p.trailling.p.y) &&
                    p.x < p.lastFollowingLocX) {
                p.frame = 4;
            }          
            // Moving left
            else if(p.y == p.lastFollowingLocY && 
                    (p.trailling == undefined || p.y == p.trailling.p.y) &&
                    p.x > p.lastFollowingLocX) {
                    p.frame = 5;
            }          
            // Moving down or up turning left
            else if(p.y == p.lastFollowingLocY && 
                    p.x > p.lastFollowingLocX && 
                    (p.trailling == undefined || p.trailling && p.x == p.trailling.p.x)) {
                // Moving down
                if(p.y > p.trailling.p.y) {
                    p.frame = 9;
                }
                // Moving up
                else {
                    p.frame = 10;
                }
            }
            // Moving down or up turning right
            else if(p.y == p.lastFollowingLocY && 
                    p.x < p.lastFollowingLocX && 
                    p.trailling && p.x == p.trailling.p.x) {
                // Moving down
                if(p.y > p.trailling.p.y) {
                    p.frame = 8;
                }
                else {
                    p.frame = 11;
                }
            }   
            // Moving left or right turning down
            else if(p.x == p.lastFollowingLocX && 
                p.y < p.lastFollowingLocY && 
                p.trailling && p.y == p.trailling.p.y) {
                // Coming from left
                if(p.x > p.trailling.p.x) {
                    p.frame = 10;
                }
                // Coming from right
                else {
                    p.frame = 11;
                }
            }   
            // Moving left or right turning up
            else if(p.x == p.lastFollowingLocX && 
                p.y > p.lastFollowingLocY && 
                p.trailling && p.y == p.trailling.p.y) {
                // Coming from left
                if(p.x > p.trailling.p.x) {
                    p.frame = 9;
                }
                // Coming from right
                else {
                    p.frame = 8;
                }
            }
            else {
                p.frame = 0;
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
            this._super(_(props).extend({3: 40, w: 50, h: 30, 
                                         z: 10, type: Q.objectTypes.display,
                                         nextItemToGrab: 1}));           
            
            this.bind('collision', this, 'updateNextItemToGrab');
       },
        
       draw: function(ctx) {
            var p = this.p;

            ctx.beginPath();
            ctx.lineWidth = "6";
            ctx.strokeStyle = "red";
            ctx.rect(p.x, p.y, p.w, p.h); 
            ctx.stroke();

            ctx.fillStyle = "blue";
            ctx.font = "20px Arial";
            ctx.fillText(p.nextItemToGrab, p.x + p.w/2 - 10, p.y + p.h/2 + 10);
        },

        updateNextItemToGrab: function() {
            this.p.nextItemToGrab++;
        }

    });

    Q.Target = Q.Sprite.extend({
        init: function(props) {
            x = Math.floor(Math.random() * Q.width);
            y = Math.floor(Math.random() * Q.height);

            x = x - x % 40;
            y = y - y % 40;
            
            this._super(_(props).extend({h: 40, w: 40, 
                                         x: x, y: y, z: 2,
                                         onScreen: false,
                                         type: Q.objectTypes.target}));

            this.bind('collision', this, 'collision');
        },

        draw: function(ctx) {
            var p = this.p;
            
            if(!p.onScreen) {
                return;
            }

            ctx.fillStyle = "#000";
            
            ctx.beginPath();
            ctx.arc(p.x + p.w/2, p.y + p.h/2, p.w/2, 0, 2*Math.PI);
            ctx.stroke();
            ctx.fill();

            ctx.fillStyle = "#FFF";
            ctx.font = "20px Arial";
            ctx.fillText(p.value, p.x + p.w/2 - 10, p.y + p.h/2 + 10);
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
            this.destroy();
        }
    });

    Q.scene('level', new Q.Scene(function(stage) {
        stage.insert(new Q.GameDisplay({x: 10, y: 10}));
        stage.insert(new Q.Snake({x: Q.width/2, y: Q.height/2}));

        for(var i=1; i<= 20; i++) {
            stage.insert(new Q.Target({value: i}));
        }

        stage.add('viewport');
        stage.viewport.scale *= 0.8;
    }, {sort: true}));

    Q.load(['sprites.png', 'sprites.json', 'snake.png', 'snake.json'], function() {
        Q.compileSheets('sprites.png','sprites.json');
        Q.compileSheets('snake.png','snake.json');
        Q.stageScene("level");
    })
});
