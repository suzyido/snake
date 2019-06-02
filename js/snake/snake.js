$(function() {    
    var Q = window.Q = Quintus()
                       .include('Input, Sprites, Scenes, Anim, Display, Target')
                       .include('TailSection, SnakeHead')
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

    Q.scene('level1', new Q.Scene(function(stage) {
        stage.insert(new Q.Repeater({asset: 'background-wall.png',
                                     speedX: 0.50, y: -225, z:0}));
        stage.insert(new Q.GameDisplay({x: 204, y: 13, 
                                        startingFrame: Q.targetFrameStartAt,
                                        stage: 1}));
        stage.insert(new Q.SnakeHead({x: Q.width/2 - Q.width/2 % 32, 
                                  y: Q.height/2 - Q.height/2 % 32,
                                  speed: 150}));

        for(var i=Q.targetFrameStartAt; i<= Q.targetFrameEndAt; i++) {
            stage.insert(new Q.Target({value: i - Q.targetFrameStartAt + 1, 
                                       frame: i}));
        }

        stage.add('viewport');
        stage.viewport.scale *= 1.0;
    }, {sort: true}));

    Q.scene('level2', new Q.Scene(function(stage) {
        stage.insert(new Q.Repeater({asset: 'background-wall.png',
                                     speedX: 0.50, y: -225, z:0}));
        stage.insert(new Q.GameDisplay({x: 204, y: 13, 
                                        startingFrame: Q.targetFrameStartAt,
                                        stage: 2}));
        stage.insert(new Q.SnakeHead({x: Q.width/2 - Q.width/2 % 32, 
                                  y: Q.height/2 - Q.height/2 % 32,
                                  speed: 250}));

        for(var i=Q.targetFrameStartAt; i<= Q.targetFrameEndAt; i++) {
            stage.insert(new Q.Target({value: i - Q.targetFrameStartAt + 1, 
                                       frame: i}));
        }

        stage.add('viewport');
        stage.viewport.scale *= 1.0;
    }, {sort: true}));

    Q.load(['background-wall.png','sprites.png', 
            'sprites.json', 'snake.png', 'snake.json', 'display.png'], function() {
        Q.compileSheets('sprites.png','sprites.json');
        Q.compileSheets('snake.png','snake.json');
        Q.stageScene("level1");
    })
});
