$(function() {
    var Q = window.Q = Quintus()
                       .include('Input, Sprites, Scenes, Anim')
                       .setup('quintus', {maximize: true})
                       .controls();

    Q.Snake = Q.Sprite.extend({
        init: function(props) {
            this._super(_(props).extend({
                sheet: 'block',
                sprite: 'snake',
                type: 1,
                frame: 28,
                speed: 100,
                currentTarget: 1,
                lastTailItem: this,
                z: 3
            }));

            this.add('tail');
            this.bind('collision', this, 'collision');
        },

        step: function(dt) {
            var p = this.p;
            var delta = dt * p.speed;

            var hit = Q.stage().collide(this, 4);
            if(hit) {
                if(hit.p.value == p.currentTarget) {
                    p.currentTarget++;
                    hit.trigger('collision', this);
                    this.tail.grow();
                }
                else {
                    this.destroy();
                }
            }

            if(Q.inputs['right']) {
                p.x += delta;
            }
            else if(Q.inputs['left']) {
                p.x -= delta;
            }
            else if(Q.inputs['up']) {
                p.y -= delta;
            }
            else if(Q.inputs['down']) {
                p.y += delta;
            }
        },

        collision: function() {
            this.destroy();
        }
    });

    Q.register('tail', {
        added: function() {
            var a = 8;
        },

        grow: function() {
            var p = this.entity.p,
                stage = this.entity.parent,
                tailPart = new Q.TailSection({x: p.x, 
                                              y: p.y,
                                              following: p.lastTailItem});

            stage.insert(tailPart);
            p.lastTailItem = tailPart;
        },

        getLoc: function() {
            var p = this.entity.p;
            
            return {x: p.x, y: p.y};
        }

    });

    Q.TailSection = Q.FollowingSprite.extend({
        init: function(props) {
            this._super(_(props).extend({
                sheet: 'block',
                sprite: 'snake tail',
                type: 2,
                frame: 20,
                parts: 0,
                z: 3
            }));
        }
    });

    Q.Target = Q.Sprite.extend({
        init: function(props) {
            x = Math.floor(Math.random() * 400); // TODO - calculate real screen size
            y = Math.floor(Math.random() * 300); // TODO - calculate real screen size
            
            this._super(_(props).extend({h: 40, w: 40, 
                                         x: x, y: y, z: 2,
                                         onScreen: false,
                                         type: 4}));

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
                var hit = Q.stage().collide(this, 4);
                if(hit) {
                    p.x = Math.floor(Math.random() * 400); // TODO - calculate real screen size
                    p.y = Math.floor(Math.random() * 300); // TODO - calculate real screen size
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
        stage.insert(new Q.Snake({x: 200, y: 0}));

        for(var i=1; i<= 5; i++) {
            stage.insert(new Q.Target({value: i}));
        }
    }, {sort: true}));

    Q.load(['sprites.png', 'sprites.json'], function() {
        Q.compileSheets('sprites.png','sprites.json');
        Q.stageScene("level");
    })
});
