Quintus.Target = function(Q) {
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
                Q.stageScene("level2");
            }
            this.destroy();
        }
    });
}