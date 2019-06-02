Quintus.SnakeHead = function(Q) {
    Q.SnakeHead = Q.Sprite.extend({
        init: function(props) {
            this._super(_(props).extend({
                sheet: 'snake',
                sprite: 'snake',
                type: Q.objectType.snake,
                frame: Q.snakeFrame.standing,
                direction: null,
                currentTarget: 1,
                deltaFromLastTime: 0,
                lastTailItem: this,
                z: 3
            }));
            
            this.add('tail, animation');
            _.bindAll(this, "_checkCollision", "_handleStep", "_adjustDirection", "_adjustLocation");
        },

        step: function(dt) {
            var p = this.p;
            var delta = dt * p.speed;

            this._checkCollision(dt);
            this._handleStep(dt);
            
            this._super(dt);
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
                    Q.stageScene("level1");
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
                this.play('move_right');
            }
            else if(p.direction == 'left') {
                p.x -= p.w;
                this.play('move_left');
            }
            else if(p.direction == 'up') {
                p.y -= p.h;
                this.play('move_up');
            }
            else if(p.direction == 'down') {
                p.y += p.h;
                this.play('move_down');
            }          

            if(p.x > Q.width || p.x < 0 || p.y > Q.height || p.y < 0) {
                Q.stageScene("level1");
            }  
        }
/*
        draw: function(ctx) {
            var p = this.p;

            var m_canvas = document.createElement('canvas');
            m_canvas.width = 32;
            m_canvas.height = 32;

            var m_context = m_canvas.getContext("2d");

            this.sheet().draw(m_context, 0, 0, p.frame);
            ctx.drawImage(m_canvas, p.x , p.y);

//            this._super(ctx);
        } */
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
}