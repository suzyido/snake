
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

                ctx.beginPath();
                ctx.lineWidth = "10";
                ctx.strokeStyle = "red";
                ctx.rect(10, 10, 240, 40);
                ctx.stroke();

                ctx.fillStyle = "#FFFFCA";
                ctx.fillRect(12, 12, 236, 36);

                ctx.lineWidth = "8";
                ctx.beginPath();
                ctx.moveTo(100, 12);
                ctx.lineTo(100, 52);
                ctx.stroke();

                ctx.fillStyle = "#000000";
                ctx.font = "20px Arial";
                var text = "Stage: " + p.stage + "   Next bite:"
                ctx.fillText(text, p.x - 188, p.y + 23);

                p.frame = p.startingFrame + p.nextItemToGrab;
                this._super(ctx);
        },

        updateNextItemToGrab: function() {
            this.p.nextItemToGrab++;
        }
    }); 
}