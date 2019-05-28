
Quintus.Display = function(Q) {
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

                ctx.fillStyle = "#FFFF00";
                ctx.fillRect(2, 2, 150, 50);

                ctx.fillStyle = "#000000";
                ctx.font = "20px Arial";
                ctx.fillText("Next Bite: ", p.x - 90, p.y + 22);

                p.frame = p.startingFrame + p.nextItemToGrab;
                this._super(ctx);
        },

        updateNextItemToGrab: function() {
            this.p.nextItemToGrab++;
        }
    }); 
}