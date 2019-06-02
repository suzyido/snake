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
        left: 1,
        down: 5,
        right: 9,
        up: 13,
        standing: 28
    };

    Q.tailFrame = {
        left: 16,
        right: 17,
        up: 18,
        down: 19,
        upRight: 20,
        upLeft: 21,
        downLeft: 22,
        downRight: 23,
        bottomTail: 24,
        rightTail: 25,
        topTail: 26,
        leftTail: 27
    }

    Q.targetFrameStartAt = 29;
    Q.targetFrameEndAt = 46;

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
        Q.animations('snake', {
            move_left: {frames: _.range(0, 3), rate: 1/5},
            move_down: {frames: _.range(4, 7), rate: 1/5},
            move_right: {frames: _.range(8, 11), rate: 1/5},
            move_up: {frames: _.range(12, 15), rate: 1/5},
        });
        Q.stageScene("level1");
    })
});
