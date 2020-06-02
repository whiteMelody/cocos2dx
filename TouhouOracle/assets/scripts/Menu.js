// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {

        startBtn: {
            default: null,
            type: cc.Button
        },

    },

    gameStart(){
        cc.director.loadScene('game');
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        // this.testBtn.on('mousedown', function (event) {
        //     console.log('Mouse down');
        // }, this);

    },

    start () {

    },

    // update (dt) {},
});
