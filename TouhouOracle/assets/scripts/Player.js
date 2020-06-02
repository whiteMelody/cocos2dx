
cc.Class({
    extends: cc.Component,

    properties: {
        canvas: cc.Node,
        playerPrefab: {
            default: null,
            type: cc.Prefab,
        },
        player: {
            default: null,
        },
        isReady: false,
        isMoving: false,
        followSpeed: 500
    },

    onLoad () {

        //创建角色
        this.player = cc.instantiate(this.playerPrefab)

        this.node.addChild(this.player)
        //初始位置
        this.player.setPosition( this.node.width / 2, 0)
        //行动动画
        this.player.runAction(
            cc.sequence(cc.moveTo(1, this.node.width / 2, this.node.height / 5),
                cc.callFunc((target) =>{
                    this.isReady = true
        }),) );

        this.moveToPos = cc.p(0, 0);
        this.isMoving = false;
        this.canvas.on(cc.Node.EventType.TOUCH_START, (event)=> {
            let touches = event.getTouches();
            let touchLoc = touches[0].getLocation();
            this.isMoving = true;
            this.moveToPos = this.player.parent.convertToNodeSpaceAR(touchLoc);
        }, this.node);
        this.canvas.on(cc.Node.EventType.TOUCH_MOVE, (event)=> {
            let touches = event.getTouches();
            let touchLoc = touches[0].getLocation();
            this.moveToPos = this.player.parent.convertToNodeSpaceAR(touchLoc);
        }, this.node);
        this.canvas.on(cc.Node.EventType.TOUCH_END, (event)=> {
            this.isMoving = false; // when touch ended, stop moving
        }, this.node);

    },

    update (dt) {

        if (!this.isMoving) return;
        let oldPos = this.player.position;
        // get move direction
        let direction = cc.pNormalize(cc.pSub(this.moveToPos, oldPos));
        // multiply direction with distance to get new position
        let newPos = cc.pAdd(oldPos, cc.pMult(direction, this.followSpeed * dt));
        // set new position
        this.player.setPosition(newPos);
    },
});
