let Player = require("Player");

cc.Class({
    // extends: Enemy,

    properties: {
        elf: {
            default: null,
            type: cc.Prefab,
        },
        bg: cc.Node,
        disable: false,
        isFire: false,
        //计数器
        timer: 0,
        //弹幕移动速度
        bulletSpeed: 5,
        //弹幕集合
        bullets: [],
        //角度集合
        angles: [cc.Integer],
    },

    ctor() {

    },

    /**
     * 创建elf
     */
    createElf(){
        this.elf = cc.instantiate(this.elfsPrefab[0])
        this.node.addChild(this.elf)
        //初始位置
        // this.elf.setPosition( this.node.width / 2, this.node.height)
        this.elf.setPosition(cc.v2(100,100))
        //行动动画
        this.elf.runAction(
            cc.sequence(cc.moveTo(1, this.node.width / 2, this.node.height / 4 * 3),
                cc.callFunc((target) =>{
                    this.isFire = true
                }),
                cc.moveTo(2, this.node.width / 2, this.node.height / 4 * 3),
                cc.moveTo(3, this.node.width / 2, this.node.height + 40)) );
    },

    /**
     * elf 监听
     */
    elfMove(){
        if(this.elf.active == true){
            if(this.elf.x >= this.node.width || this.elf.x <= 0) {
                this.elf.active = false
            }if(this.elf.y >= this.node.height || this.elf.y <= 0){
                this.elf.active = false
            }
        }else{
            if(this.bullets.length > 0){
                //回收资源
                let _tmp = this.bullets.filter((item)=> {
                    return item.node.active == true
                })
                if(_tmp.length == 0){
                    //启动回收机制
                    this.elf.destroy()
                    for(let i=0; i<this.bullets.length; i++){
                        this.bullets[i].node.destroy()
                    }
                    this.bullets = []
                }
            }else{
                // console.log('回收已完成')
                this.disable = true
            }
        }
    },

    /**
     * 绑定该elf的弹幕
     */
    createBullet(){

        if(this.timer % 6 == 0 && this.elf.active){
            for(let i=0; i<this.angles.length; i++ ){
                this.angles[i] += 10
                if(this.angles[i] >= 360)
                    this.angles[i] = 0
                let _node = {}

                //3色间隔弹幕
                if(i == 0)  _node = cc.instantiate(this.bulletsPrefab[1])
                if(i == 1)  _node = cc.instantiate(this.bulletsPrefab[5])
                if(i == 2)  _node = cc.instantiate(this.bulletsPrefab[8])
                if(i == 3)  _node = cc.instantiate(this.bulletsPrefab[1])
                if(i == 4)  _node = cc.instantiate(this.bulletsPrefab[5])
                if(i == 5)  _node = cc.instantiate(this.bulletsPrefab[8])
                if(i == 6)  _node = cc.instantiate(this.bulletsPrefab[1])
                if(i == 7)  _node = cc.instantiate(this.bulletsPrefab[5])
                if(i == 8)  _node = cc.instantiate(this.bulletsPrefab[8])

                this.node.addChild(_node);
                _node.runAction(cc.rotateTo(0, 90 - this.angles[i] ));
                let bullte = {
                    node: _node,
                    angle: this.angles[i],
                    cx: this.elf.x,
                    cy: this.elf.y,
                    bulletSpeed: this.bulletSpeed,
                }
                this.bullets.push(bullte);
            }
        }
    },

    //overhide  onLoad()
    onLoad () {
        this.angles = [0, 45, 90, 135, 180, 225, 270, 315]
        // this.createElf()

        this.creatPrefab()

    },

    //生成实例
    creatPrefab(){
        let b = cc.instantiate(this.elf);

        b.setPosition(cc.v2(100,100));
        // b.getChildByName('label').getComponent(cc.Label).string = numbers[n];

        //- 2018年8月22日18:25:27
        //优化道具刷新事件，现在会额外触发一次移动

        // this.bg.node.addChild(b);

    },

    //overhide  update()
    update (dt) {

        //到达指定位置
        if(!this.disable && this.isFire){
            //单独的计时器
            this.timer ++
            //弹幕发射器
            this.createBullet()
            this.elfMove()
            for(let i=0; i<this.bullets.length; i++){
                let _b = this.bullets[i]
                let _angle = Math.PI / 180 * _b.angle
                let vx = Math.cos(_angle) * _b.bulletSpeed
                let vy = Math.sin(_angle) * _b.bulletSpeed
                _b.cx += vx
                _b.cy += vy
                if(_b.cx >= this.node.width || _b.cx <= 0){
                    _b.node.active = false
                    // this.bullets.splice(i, 1)
                }
                if(_b.cy >= this.node.height || _b.cy <= 0){
                    _b.node.active = false
                    // this.bullets.splice(i, 1)
                }
                _b.node.setPosition( _b.cx, _b.cy)

                //监听碰撞



            }
        }

    },

});