Quintus.TailSection = function(Q) {
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
}