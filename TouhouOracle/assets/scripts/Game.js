
cc.Class({
    extends: cc.Component,

    properties: {
        playerPro: {
            default: null,
        },
        gamePro: {
            default: null,
        },
        movePro:{
            default: null,
        },
        //妖精们
        elfs:[],
        //妖精的弹幕
        elfBullets: [],
        //道具
        props: [],
        boomPrefab: cc.Prefab,
        magicCirclePrefab: cc.Prefab,
        // 游戏音效数组
        gameAudios : [cc.AudioClip],
        gameScore: cc.Label,
        // 灵梦 预设对象
        reimuPrefab: cc.Prefab,
        reimuSkillNode: cc.Node,
        // 妖精
        elfPrefabs: [cc.Prefab],
        // 灵梦弹幕
        reimuBullet: [cc.Prefab],
        // 琪露诺 预设对象
        cirnoPrefab: cc.Prefab,
        // 道具 预设对象
        propPrefabs: [cc.Prefab],
        // 琪露诺 血条
        hpBar: cc.Node,
        // 扇形弹幕
        bulletPrefabs: [cc.Prefab],
        // 圆形弹幕
        bulletCircles: [cc.Prefab],
        // 实心圆弹幕
        bulletSolids: [cc.Prefab],
        bulletSpirits: [cc.Sprite],
        // 背景图
        gameBg: cc.Sprite,
        // 背景网格
        gameGrid: cc.Sprite,

        //数据缓存
        chapterOneCache: {
            default: null
        }

    },

    onLoad () {

        this.gameInit()

        this.creatReimu()

        this.movePro = {
            moveLeft: false,
            moveUp: false,
            moveRight: false,
            moveDown: false,
        }

        //绑定键盘事件
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);

        // this.chapterOne()

        this.chapterOneCache = {
            elfs4s_count_32: 0,
            cirnoPro: {},
        }

        let _w = this.node.width

        let _h = this.node.height

        var f = cc.callFunc(()=> {

        });

        let array = [
            cc.v2(_w * 0.5, _h * 0.5),
            cc.v2(_w * 0.25, _h * 0.75),
            cc.v2(_w * 0.25, _h * 0.25),
            cc.v2(_w * 0.5, _h * 0.5),
            cc.v2(_w * 0.75, _h * 0.75),
            cc.v2(_w * 0.75, _h * 0.25),
            cc.v2(_w * 0.5, _h * 0.5),
        ];

        let seq = cc.repeatForever(cc.sequence( cc.cardinalSplineTo(50, array, 0), f));

        // this.gameGrid.node.setRotation(270)

        this.gameGrid.node.runAction(seq);

    },

    onKeyDown (event) {

        switch(event.keyCode) {
            case 37:
                // move left
                this.movePro.moveLeft = true
                // this.playerPro.x -= this.playerPro.speed
                break;
            case 38:
                // move up
                this.movePro.moveUp = true
                // this.playerPro.y -= this.playerPro.speed
                break;
            case 39:
                // move right
                this.movePro.moveRight = true
                // this.playerPro.x+= this.playerPro.speed
                break;
            case 40:
                // move left
                this.movePro.moveDown = true
                // this.playerPro.y+= this.playerPro.speed
                break;
            case 88:
                // skill
                this.reimuSkill()
                break;
            case 90:
                // fire
                this.playerPro.fire = true
                break;
        }

    },

    onKeyUp(event){

        switch(event.keyCode) {
            case 37:
                // move left
                this.movePro.moveLeft = false
                // this.playerPro.x -= this.playerPro.speed
                break;
            case 38:
                // move up
                this.movePro.moveUp = false
                // this.playerPro.y -= this.playerPro.speed
                break;
            case 39:
                // move right
                this.movePro.moveRight = false
                // this.playerPro.x+= this.playerPro.speed
                break;
            case 40:
                // move left
                this.movePro.moveDown = false
                // this.playerPro.y+= this.playerPro.speed
                break;
            case 90:
                // fire
                this.playerPro.fire = false
            break;
        }
    },

    start () {

    },

    /**
     * 生成一个UUID
     * @returns {string}
     */
    getUuid() {
        const len = 32; //32长度
        let radix = 16; //16进制
        const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
        const uuid = [];
        let i;
        radix = radix || chars.length;if (len) {
            for (i = 0; i < len; i++) {
                uuid[i] = chars[0 | Math.random() * radix];
            }
        } else {
            let r;uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';uuid[14] = '4';for (i = 0; i < 36; i++) {
                if (!uuid[i]) {
                    r = 0 | Math.random() * 16;uuid[i] = chars[i == 19 ? r & 0x3 | 0x8 : r];
                }
            }
        }
        return uuid.join('');
    },

    /**
     * 检测2个矩形是否相交
     * @param rect1
     * @param rect2
     * @returns {boolean}
     */
    collide (rect1, rect2) {
        let maxX, maxY, minX, minY

        maxX = rect1.x + rect1.width >= rect2.x + rect2.width ? rect1.x + rect1.width : rect2.x + rect2.width
        maxY = rect1.y + rect1.height >= rect2.y + rect2.height ? rect1.y + rect1.height : rect2.y + rect2.height
        minX = rect1.x <= rect2.x ? rect1.x : rect2.x
        minY = rect1.y <= rect2.y ? rect1.y : rect2.y

        if (maxX - minX <= rect1.width + rect2.width && maxY - minY <= rect1.height + rect2.height) {
            return true
        } else {
            return false
        }
    },

    gameInit(){
        this.gamePro = {
            pause: false,               // true | false
            state: 'gameing',           // gameing | gameover | gamemenu
            timer: 0,                   // 游戏时间
            count: 0,                   // 刷新次数
            second: 0,                  // 秒数
            score: 0,                   // 分数
        }
    },

    /**
     * 创建爆炸效果
     */
    creatBoom(x, y){

        let b = cc.instantiate(this.magicCirclePrefab);
        b.setPosition(cc.v2( x, y));
        this.gameBg.node.addChild(b);
        var f = cc.callFunc(()=> {
            b.destroy()
        });
        // 放大 旋转  消失
        var seq = cc.sequence(cc.spawn( cc.rotateBy(0.5, 360, 360), cc.scaleTo(0.5, 1, 1), cc.fadeOut(0.5)), f);
        b.runAction(seq);
    },

    /**
     * 创建魔法阵效果
     */
    creatMagicCircle (x, y){
        let b = cc.instantiate(this.magicCirclePrefab);
        b.setPosition(cc.v2( x, y));
        this.gameBg.node.addChild(b);
        var f = cc.callFunc(()=> {
            b.destroy()
        });
        // 放大 旋转  消失
        var seq = cc.sequence(cc.spawn( cc.rotateBy(0.5, 360, 360), cc.scaleTo(0.5, 1, 1), cc.fadeOut(0.5)), f);
        b.runAction(seq);
    },

    /**
     * 创建灵梦
     */
    creatReimu(){

        let b = cc.instantiate(this.reimuPrefab);

        //屏幕中心
        b.setPosition(cc.v2( this.node.width / 2, 100));

        this.gameBg.node.addChild(b);

        this.playerPro = {
            x: this.node.width / 2,
            y: 100,
            width: 29,
            height: 43,
            atk: 10,                //10 - 10v
            node: b,
            hp: 3,                  //残机数
            speed: 5,               //移动速度
            bullteSpeed: 20,        //子弹速度
            fire: true,             //正在攻击
            immune: false,          //无敌时间
            bullets: [],            //子弹数组
        }

    },

    /**
     * 为灵梦设计一个技能
     */
    reimuSkill(){

        if(this.playerPro.immune){
            return false
        }

        let node = this.reimuSkillNode

        var showAction = cc.show();

        node.x = this.playerPro.x
        node.y = this.playerPro.y
        let finished = cc.callFunc(function () {

            //无敌时间结束
            this.playerPro.immune = false
            node.x = -1000
            node.y = -1000

        }, this);

        this.playerPro.immune = true

        let seq = cc.sequence(
            cc.spawn(
                cc.rotateBy(2, 360), cc.scaleBy(2, 3), cc.fadeOut(2)
            ),
            finished,
            cc.fadeIn(0.01),
            cc.rotateBy(0.01, 0),
            cc.scaleBy(0.01, 0.33333)
        )

        node.runAction(seq);

        //清除所有弹幕和范围内的elf，持续时间内保持无敌

    },

    reimuBlink(){

        if(this.playerPro.immune){
            return false
        }

        let node = this.reimuSkillNode

        let showAction = cc.show();

        //被击中 掉落point和power
        this.playerPro.atk -= 10
        this.gamePro.score -= 2000

        if(this.gamePro.score<=0){
            this.gamePro.score = 0
        }
        this.gameScore.string = this.gamePro.score

        if(this.playerPro.atk<=10){
            this.playerPro.atk = 10
        }

        this.boomProp(this.playerPro.x, this.playerPro.y)

        node.x = this.playerPro.x
        node.y = this.playerPro.y
        let finished = cc.callFunc(function () {
            //无敌时间结束
            this.playerPro.immune = false
            node.x = -1000
            node.y = -1000
        }, this);

        this.playerPro.immune = true

        let seq = cc.sequence(
            cc.spawn(
                cc.rotateBy(2, 360), cc.fadeOut(2)
            ),
            finished,
            cc.fadeIn(0.01),
            cc.rotateBy(0.01, 0),
        )

        node.runAction(seq);

        //清除所有弹幕和范围内的elf，持续时间内保持无敌

    },

    /**
     * 创建妖精
     */
    creatElf(params){

        let options = {
            spriteType: params.spriteType || 0,                             // elf贴图
            hp: params.hp || 10,                                            // hp
            width: params.width || 32,                                      // width
            height: params.height || 32,                                    // height
            score: params.score || 100,                                     // elf分数
            moveDirection: params.moveDirection || 100,                     // 移动类型，详见moveDirection枚举
            bullteType: params.bullteType || 1,                             // 攻击类型，详见bullteType枚举
            bullteCount: params.bullteCount || 1,                           // 单次弹幕数量
            bullteColor: params.bullteColor || 1,                           // 弹幕颜色
            bullteChangeColor: params.bullteChangeColor || [],              // 多色弹幕
            bullteWidth: params.bullteWidth || 15,                          // 弹幕width
            bullteHeight: params.bullteHeight || 15,                        // 弹幕height
            bullteInterval: params.bullteInterval || 60,                    // 弹幕发射速率
            count: params.count || 1,                                       // elf个数
            x: params.x || (this.node.width + 32) / 2,                      // 初始X
            y: params.y || (this.node.height + 32) / 2,                     // 初始Y
            offsetX: params.offsetX || 0,                                   // x偏移量
            offsetY: params.offsetY || 0,                                   // y偏移量
            moveSpeed: params.moveSpeed || 1,                               // 移动速度
            moveSpeed_VX: params.moveSpeed_VX || 0,                         // 移动的X加速度
            moveSpeed_VY: params.moveSpeed_VY || 0,                         // 移动的Y加速度
            SVspeed: params.moveSpeed || 1,                                 // 移动加速度
            moveFlag: params.moveFlag || 1,                                 // 移动类型切换
            bullteSpeed: params.bullteSpeed || 4,                           // 弹幕速度
            bullteSpeed_VX: params.bullteSpeed_VX || 0,                     // 弹幕的X加速度
            bullteSpeed_VY: params.bullteSpeed_VY || 0,                     // 弹幕的Y加速度
            BVspeed: params.bullteSpeed || 4,                               // 弹幕加速度
            bullteFlag: params.bullteFlag || 1,                             // 弹幕类型切换
            bullteOnce: params.bullteOnce || false,                         // 弹幕只发射一次
            onceFlag: false,                                                // 弹幕只发射一次标记
            angle: params.angle || 180,                                     // 角度
            isClockwise: params.isClockwise || false,                       // 顺时针 | 逆时针
            circleFlag: true,                                               // 圆形扩散flag
            visible: true,                                                  // 是否显示(不可见）
            isMove: false,                                                  // 移动中
            immune:  params.immune || false,                                // 无敌单位
            bullets: params.bullets || [],                                  // 当前elf下的弹幕
            _timer: params._timer || 0,                                     // 内置timer（存活时间）
            _timer2: params._timer2 || 0,                                   // 另一个内置timer
            preheat: params.preheat || false,                               // 到达指定地点后开火
            backTimer: params.backTimer || 200,                             // 折返时间（启用后到达目的X时间后折返）
            fireTimer: params.fireTimer || 9999,                            // 开火时间（开火时间结束后，停止开火）
            preheatTimer: params.preheatTimer || 0,                         // 预热时间（预热时间到达前，不会开火）
            isMoveAnimation: params.isMoveAnimation || false,               // 是否启用动画
        }

        if(params.spriteType == 'cirno'){
            options.spriteType = 'cirno'
            options.width = 45
            options.height = 54
            //创建妖精
            let elf =  cc.instantiate(this.cirnoPrefab);
            elf.setPosition(cc.v2(options.x, options.y));
            this.gameBg.node.addChild(elf)
            options.uuid = this.getUuid()
            options.node = elf
            this.elfs.push(options)

        }else{

            //创建妖精
            let elf =  cc.instantiate(this.elfPrefabs[options.spriteType]);
            elf.setPosition(cc.v2(options.x, options.y));
            this.gameBg.node.addChild(elf)

            options.uuid = this.getUuid()
            options.node = elf

            this.elfs.push(options)
        }

        return options

        // this.elfMove()

    },

    /**
     * 创建道具
     */
    creatProp(params){

        let b = cc.instantiate(this.propPrefabs[params.type]);
        //屏幕中心
        b.setPosition(cc.v2( params.x, params.y));
        this.gameBg.node.addChild(b);
        this.props.push({
            x: params.x,
            y: params.y,
            type: params.type,
            node: b,
            timer: 0,
        })

        //
    },

    boomProp(){

        // 5个power

        // 10个point
        console.log('boomProp')

        return false

        let x = this.playerPro.x - 60
        let y = this.playerPro.y

        for(let i=0; i<5; i++){
            this.creatProp({
                x: x + i * 30,
                y,
                type: 0,
                typeName: 'player'
            })
        }

        // for(let i=0; i<5; i++){
        //     this.creatProp({
        //         x: x + i * 30,
        //         y,
        //         type: 0,
        //         typeName: 'player'
        //     })
        // }

    },

    /**
     * 琪露诺符卡：霜冻之王
     */
    cirnoSkill(){

        let node = this.reimuSkillNode

        var showAction = cc.show();

        node.x = this.playerPro.x
        node.y = this.playerPro.y
        let finished = cc.callFunc(function () {

            //无敌时间结束
            this.playerPro.immune = false
            node.x = -1000
            node.y = -1000

        }, this);

        this.playerPro.immune = true

        let seq = cc.sequence(
            cc.spawn(
                cc.rotateBy(2, 360), cc.scaleBy(2, 3), cc.fadeOut(2)
            ),
            finished,
            cc.fadeIn(0.01),
            cc.rotateBy(0.01, 0),
            cc.scaleBy(0.01, 0.33333)
        )

        node.runAction(seq);

        //清除所有弹幕和范围内的elf，持续时间内保持无敌

    },

    resetCirno(){
      //
        let _cirno = this.chapterOneCache.cirnoPro
        let anim = _cirno.node.getComponent(cc.Animation);
        let _w = this.node.width
        let _h = this.node.height
        let move = cc.callFunc(() => {
            anim.play('Cirno-move')
        });
        _cirno.state ++
        _cirno._timer = 0
        _cirno.hp = 2000
        _cirno.immune = true
        this.hpBar.width = 0

        for(let i=0; i<this.elfBullets.length; i++){
            this.elfBullets[i].node.destroy()
        }

        this.elfBullets = []

        _cirno.node.stopAllActions();
        let seq = cc.sequence(move, cc.moveTo(2, cc.v2(_w * 0.5, _h * 0.7)));
        _cirno.node.runAction(seq);

        let card = ''
        if(_cirno.state == 1){
            card = '冰符「Icicle Fall」'        //（冰瀑）
        }else if(_cirno.state == 2){
            card = '雹符「Hailstorm」'          //（冰雹暴风）
        }else if(_cirno.state == 3){
            card = '霜符「Frost Columns」'     //（冰袭方阵）
        }else if(_cirno.state == 4){
            card = '雪符「Diamond Blizzard」'   //（钻石风暴）
        }else if(_cirno.state == 5){
            card = '冻符「Perfect Freeze」'      //（完美冻结）
        }else if(_cirno.state == 6){
            card = '冻符「Cold Divinity」'      //（冷冻之神）
        }else if(_cirno.state == 7){
            card = '冻符「Minus K」'            //（负K）
        }else if(_cirno.state == 8){
            card = '冰符「Ultimate Blizzard」'  //（终焉暴雪）
        }else if(_cirno.state == 9){
            card = '冰符「Perfect Glacialist」' //（完美冰川学家）
        }else if(_cirno.state == 10){
            card = '冰王「Frost King」'         //（霜冻之王）
        }

        this.hpBar.getChildByName("card").getComponent(cc.Label).string = card
    },

    /**
     * 冰符「Icicle Fall」（冰瀑
     */
    cirnoAtk1(){
        let _cirno = this.chapterOneCache.cirnoPro
        let anim = _cirno.node.getComponent(cc.Animation);
        let _w = this.node.width
        let _h = this.node.height
        let move = cc.callFunc(() => {
            anim.play('Cirno-move')
        });
        let moveLeft = cc.callFunc(() => {
            anim.play('Cirno-moveLeft')
        });
        let moveRight = cc.callFunc(() => {
            anim.play('Cirno-moveRight')
        });
        let moved = cc.callFunc(() => {
            anim.play('Cirno-move')
            _cirno._timer = 0
            this.cirnoAtk1()
        });
        if(_cirno._timer >= 150 && _cirno._timer < 190){
            let _x = _cirno.node.x + _cirno.offsetX + _cirno.width / 2
            let _y = _cirno.node.y + _cirno.offsetY + _cirno.height / 2
            let _arr = []
            let __angles = [15, 75, 105, 165, 195, 255, 285, 345]
            if (_cirno._timer % 8 == 0) {
                for(let i=0; i<__angles.length; i++) {
                    let _angle = __angles[i]
                    let bullet = null
                    bullet = cc.instantiate(this.bulletCircles[16])
                    bullet.setPosition(cc.v2(_x - _cirno.width / 2, _y - _cirno.height / 2))
                    bullet.rotation = _angle - 270
                    this.gameBg.node.addChild(bullet)
                    let _uuid = this.getUuid()
                    this.elfBullets.push({
                        uuid: _uuid,
                        node: bullet,
                        cx: _x - _cirno.width / 2,
                        cy: _y - _cirno.height / 2,
                        type: 'cirno_cirele_line4',
                        angle: _angle,
                        speed: _cirno.bullteSpeed,
                        xSpeed: Math.cos(_angle * Math.PI / 180) * _cirno.bullteSpeed,
                        ySpeed: -Math.sin(_angle * Math.PI / 180) * _cirno.bullteSpeed,
                        visible: true
                    })
                }
            }
        }
        if (_cirno._timer >= 130 && _cirno._timer < 180) {
            let _x = _cirno.node.x + _cirno.offsetX + _cirno.width / 2
            let _y = _cirno.node.y + _cirno.offsetY + _cirno.height / 2
            let _arr = []
            if (this.chapterOneCache.cirnoPro._timer % 10 == 0) {
                let _angle = _cirno.angle
                let bullet = null
                for (let j = 0; j < 6; j++) {
                    _angle = _cirno.angle + j * 30
                    bullet = cc.instantiate(this.bulletPrefabs[7])
                    bullet.setPosition(cc.v2(_x - _cirno.width / 2, _y - _cirno.height / 2))
                    bullet.rotation = _angle - 270
                    this.gameBg.node.addChild(bullet)
                    let _uuid = this.getUuid()
                    this.elfBullets.push({
                        uuid: _uuid,
                        node: bullet,
                        cx: _x - _cirno.width / 2,
                        cy: _y - _cirno.height / 2,
                        type: 'cirno_rotate',
                        angle: _angle,
                        speed: _cirno.bullteSpeed,
                        xSpeed: Math.cos(_angle * Math.PI / 180) * _cirno.bullteSpeed * 0.2,
                        ySpeed: -Math.sin(_angle * Math.PI / 180) * _cirno.bullteSpeed * 0.2,
                        visible: true
                    })
                }
                _cirno.angle += _cirno.BVspeed
            }
        }
        if (_cirno._timer >= 150 && _cirno._timer < 200 ) {
            let _x = _cirno.node.x + _cirno.offsetX + _cirno.width / 2
            let _y = _cirno.node.y + _cirno.offsetY + _cirno.height / 2
            let _arr = []
            if (this.chapterOneCache.cirnoPro._timer % 10 == 0) {
                let _angle = _cirno.angle
                let bullet = null
                for (let j = 0; j < 8; j++) {
                    _angle = _cirno.angle + j * 45
                    bullet = cc.instantiate(this.bulletPrefabs[7])
                    bullet.setPosition(cc.v2(_x - _cirno.width / 2, _y - _cirno.height / 2))
                    bullet.rotation = _angle - 270
                    this.gameBg.node.addChild(bullet)
                    let _uuid = this.getUuid()
                    this.elfBullets.push({
                        uuid: _uuid,
                        node: bullet,
                        cx: _x - _cirno.width / 2,
                        cy: _y - _cirno.height / 2,
                        type: 'cirno_rotate',
                        angle: _angle,
                        speed: _cirno.bullteSpeed,
                        xSpeed: Math.cos(_angle * Math.PI / 180) * _cirno.bullteSpeed * 0.3,
                        ySpeed: -Math.sin(_angle * Math.PI / 180) * _cirno.bullteSpeed * 0.3,
                        visible: true
                    })
                }
                _cirno.angle += _cirno.BVspeed
            }
        }
        if (_cirno._timer >= 170 && _cirno._timer < 220 ) {
            let _x = _cirno.node.x + _cirno.offsetX + _cirno.width / 2
            let _y = _cirno.node.y + _cirno.offsetY + _cirno.height / 2
            let _arr = []
            if (this.chapterOneCache.cirnoPro._timer % 10 == 0) {
                let _angle = _cirno.angle
                let bullet = null
                for (let j = 0; j < 12; j++) {
                    _angle = _cirno.angle + j * 30
                    bullet = cc.instantiate(this.bulletPrefabs[7])
                    bullet.setPosition(cc.v2(_x - _cirno.width / 2, _y - _cirno.height / 2))
                    bullet.rotation = _angle - 270
                    this.gameBg.node.addChild(bullet)
                    let _uuid = this.getUuid()
                    this.elfBullets.push({
                        uuid: _uuid,
                        node: bullet,
                        cx: _x - _cirno.width / 2,
                        cy: _y - _cirno.height / 2,
                        type: 'cirno_rotate',
                        angle: _angle,
                        speed: _cirno.bullteSpeed,
                        xSpeed: Math.cos(_angle * Math.PI / 180) * _cirno.bullteSpeed * 0.4,
                        ySpeed: -Math.sin(_angle * Math.PI / 180) * _cirno.bullteSpeed * 0.4,
                        visible: true
                    })
                }
                _cirno.angle += _cirno.BVspeed
            }
        }
        if (_cirno._timer >= 190 && _cirno._timer < 240 ) {
            let _x = _cirno.node.x + _cirno.offsetX + _cirno.width / 2
            let _y = _cirno.node.y + _cirno.offsetY + _cirno.height / 2
            let _arr = []
            if (this.chapterOneCache.cirnoPro._timer % 10 == 0) {
                let _angle = _cirno.angle
                let bullet = null
                for (let j = 0; j < 18; j++) {
                    _angle = _cirno.angle + j * 20
                    bullet = cc.instantiate(this.bulletPrefabs[7])
                    bullet.setPosition(cc.v2(_x - _cirno.width / 2, _y - _cirno.height / 2))
                    bullet.rotation = _angle - 270
                    this.gameBg.node.addChild(bullet)
                    let _uuid = this.getUuid()
                    this.elfBullets.push({
                        uuid: _uuid,
                        node: bullet,
                        cx: _x - _cirno.width / 2,
                        cy: _y - _cirno.height / 2,
                        type: 'cirno_rotate',
                        angle: _angle,
                        speed: _cirno.bullteSpeed,
                        xSpeed: Math.cos(_angle * Math.PI / 180) * _cirno.bullteSpeed * 0.5,
                        ySpeed: -Math.sin(_angle * Math.PI / 180) * _cirno.bullteSpeed * 0.5,
                        visible: true
                    })
                }
                _cirno.angle += _cirno.BVspeed
            }
        }
        // 移动到右边
        if (_cirno._timer == 310) {
            let seq = cc.sequence( moveLeft, cc.moveTo(2, _w*0.2, _h*0.8), move);
            _cirno.node.runAction(seq);
        }
        if (_cirno._timer >= 550 && _cirno._timer < 600 ) {
            let _x = _cirno.node.x + _cirno.offsetX + _cirno.width / 2
            let _y = _cirno.node.y + _cirno.offsetY + _cirno.height / 2
            let _arr = []
            let __angles = [15, 75, 105, 165, 195, 255, 285, 345]
            if (this.chapterOneCache.cirnoPro._timer % 8 == 0) {
                for(let i=0; i<__angles.length; i++) {
                    let _angle = __angles[i]
                    let bullet = null
                    bullet = cc.instantiate(this.bulletCircles[16])
                    bullet.setPosition(cc.v2(_x - _cirno.width / 2, _y - _cirno.height / 2))
                    bullet.rotation = _angle - 270
                    this.gameBg.node.addChild(bullet)
                    let _uuid = this.getUuid()
                    this.elfBullets.push({
                        uuid: _uuid,
                        node: bullet,
                        cx: _x - _cirno.width / 2,
                        cy: _y - _cirno.height / 2,
                        type: 'cirno_cirele_line4',
                        angle: _angle,
                        speed: _cirno.bullteSpeed,
                        xSpeed: Math.cos(_angle * Math.PI / 180) * _cirno.bullteSpeed,
                        ySpeed: -Math.sin(_angle * Math.PI / 180) * _cirno.bullteSpeed,
                        visible: true
                    })
                }
            }
        }
        if (_cirno._timer >= 550 && _cirno._timer < 580 ) {
            let _x = _cirno.node.x + _cirno.offsetX + _cirno.width / 2
            let _y = _cirno.node.y + _cirno.offsetY + _cirno.height / 2
            let _arr = []

            //圆形扩散交替的弹幕(延迟扩散)
            if (this.chapterOneCache.cirnoPro._timer % 5 == 0) {
                let _angle = _cirno.angle
                _cirno.circleFlag = !_cirno.circleFlag
                let bullet = null
                for (let j = 0; j < 18; j++) {
                    if (_cirno.circleFlag) {
                        _angle = _cirno.angle + j * 20
                        bullet = cc.instantiate(this.bulletPrefabs[29])
                    } else {
                        _angle = _cirno.angle + j * 20 + 10
                        bullet = cc.instantiate(this.bulletPrefabs[30])
                    }
                    bullet.setPosition(cc.v2(_x - _cirno.width / 2, _y - _cirno.height / 2))
                    bullet.rotation = _angle - 270
                    this.gameBg.node.addChild(bullet)
                    let _uuid = this.getUuid()
                    this.elfBullets.push({
                        uuid: _uuid,
                        node: bullet,
                        cx: _x - _cirno.width / 2,
                        cy: _y - _cirno.height / 2,
                        type: 'cirno_cirele_cirele12',
                        angle: _angle,
                        speed: _cirno.bullteSpeed,
                        xSpeed: Math.cos(_angle * Math.PI / 180) * _cirno.bullteSpeed,
                        ySpeed: -Math.sin(_angle * Math.PI / 180) * _cirno.bullteSpeed,
                        visible: true
                    })
                }
            }
        }
        if (_cirno._timer >= 630 && _cirno._timer < 660 ) {
            let _x = _cirno.node.x + _cirno.offsetX + _cirno.width / 2
            let _y = _cirno.node.y + _cirno.offsetY + _cirno.height / 2
            let _arr = []

            //圆形扩散交替的弹幕(延迟扩散)
            if (this.chapterOneCache.cirnoPro._timer % 5 == 0) {
                let _angle = _cirno.angle
                _cirno.circleFlag = !_cirno.circleFlag
                let bullet = null
                for (let j = 0; j < 36; j++) {
                    if(_cirno.circleFlag){
                        _angle = _cirno.angle + j * 10
                        bullet = cc.instantiate(this.bulletPrefabs[29])
                    }else{
                        _angle = _cirno.angle + j * 10 + 5
                        bullet = cc.instantiate(this.bulletPrefabs[30])
                    }
                    bullet.setPosition(cc.v2(_x - _cirno.width / 2, _y - _cirno.height / 2))
                    bullet.rotation = _angle - 270
                    this.gameBg.node.addChild(bullet)
                    let _uuid = this.getUuid()
                    this.elfBullets.push({
                        uuid: _uuid,
                        node: bullet,
                        cx: _x - _cirno.width / 2,
                        cy: _y - _cirno.height / 2,
                        type: 'cirno_cirele_cirele12',
                        angle: _angle,
                        speed: _cirno.bullteSpeed,
                        xSpeed: Math.cos(_angle * Math.PI / 180) * _cirno.bullteSpeed,
                        ySpeed: -Math.sin(_angle * Math.PI / 180) * _cirno.bullteSpeed,
                        visible: true
                    })
                }
            }

        }
        if(_cirno._timer == 770){
            //移动
            if(_cirno.node.x <= _w * 0.5){
                //左边屏幕，移动至右边
                let seq = cc.sequence( moveRight, cc.moveTo(2, _w*0.8, _h*0.8), move, moved);
                _cirno.node.runAction(seq);
            }else{
                //移动至左边
                let seq = cc.sequence( moveLeft, cc.moveTo(2, _w*0.2, _h*0.8), move, moved);
                _cirno.node.runAction(seq);
            }
        }
    },

    /**
     * 雹符「Hailstorm」（冰雹暴风）
     */
    cirnoAtk2(){
        let _cirno = this.chapterOneCache.cirnoPro
        let anim = _cirno.node.getComponent(cc.Animation);
        let _w = this.node.width
        let _h = this.node.height
        let move = cc.callFunc(() => {
            anim.play('Cirno-move')
        });
        let moveLeft = cc.callFunc(() => {
            anim.play('Cirno-moveLeft')
        });
        let moveRight = cc.callFunc(() => {
            anim.play('Cirno-moveRight')
        });
        let moved = cc.callFunc(() => {
            anim.play('Cirno-move')
            _cirno._timer = 0
            this.cirnoAtk2()
        });

        if (_cirno._timer == 150) {
            let array = [
                cc.v2(_w * 0.5, _h * 0.7),
                cc.v2(_w * 0.3, _h * 0.8),
                cc.v2(_w * 0.1, _h * 0.7),
                cc.v2(_w * 0.3, _h * 0.6),
                cc.v2(_w * 0.5, _h * 0.7),
                cc.v2(_w * 0.7, _h * 0.8),
                cc.v2(_w * 0.9, _h * 0.7),
                cc.v2(_w * 0.7, _h * 0.6),
                cc.v2(_w * 0.5, _h * 0.7),
            ];
            let seq = cc.sequence(move, cc.cardinalSplineTo(8, array, 0));
            _cirno.node.runAction(seq);
        }

        if (_cirno._timer >= 150 && _cirno._timer < 600 ) {
            let _x = _cirno.node.x + _cirno.offsetX + _cirno.width / 2
            let _y = _cirno.node.y + _cirno.offsetY + _cirno.height / 2
            let _arr = []
            let __angles = [15, 75, 105, 165, 195, 255, 285, 345]
            if (_cirno._timer % 20 == 0) {
                for(let i=0; i<__angles.length; i++) {
                    let _angle = __angles[i]
                    let bullet = null
                    bullet = cc.instantiate(this.bulletPrefabs[17])
                    bullet.setPosition(cc.v2(_x - _cirno.width / 2, _y - _cirno.height / 2))
                    bullet.rotation = _angle - 270
                    this.gameBg.node.addChild(bullet)
                    let _uuid = this.getUuid()
                    this.elfBullets.push({
                        uuid: _uuid,
                        node: bullet,
                        cx: _x - _cirno.width / 2,
                        cy: _y - _cirno.height / 2,
                        type: 'cirno_cirele_line4',
                        angle: _angle,
                        speed: _cirno.bullteSpeed,
                        xSpeed: Math.cos(_angle * Math.PI / 180) * _cirno.bullteSpeed,
                        ySpeed: -Math.sin(_angle * Math.PI / 180) * _cirno.bullteSpeed,
                        visible: true
                    })
                }
            }
        }

        //
        // //符卡：湖上的冰晶
        if (_cirno._timer >= 650 && _cirno._timer < 1050 ) {
            let _x = _cirno.node.x + _cirno.offsetX + _cirno.width / 2
            let _y = _cirno.node.y + _cirno.offsetY + _cirno.height / 2
            let _arr = []
            if (_cirno._timer % 8 == 0) {
                let _angle = _cirno.angle
                let bullet = null
                for (let j = 0; j < 24; j++) {
                    _angle = _cirno.angle + j * 15
                    bullet = cc.instantiate(this.bulletPrefabs[17])
                    bullet.setPosition(cc.v2(_x - _cirno.width / 2, _y - _cirno.height / 2))
                    bullet.rotation = _angle - 270
                    this.gameBg.node.addChild(bullet)
                    let _uuid = this.getUuid()
                    this.elfBullets.push({
                        uuid: _uuid,
                        node: bullet,
                        cx: _x - _cirno.width / 2,
                        cy: _y - _cirno.height / 2,
                        type: 'cirno_ice_rotate',
                        angle: _angle,
                        speed: _cirno.bullteSpeed,
                        xSpeed: Math.cos(_angle * Math.PI / 180) * _cirno.bullteSpeed,
                        ySpeed: -Math.sin(_angle * Math.PI / 180) * _cirno.bullteSpeed,
                        visible: true
                    })
                }
            }
            _cirno.angle += _cirno.BVspeed
            if ( _cirno.angle > 360)   _cirno.BVspeed = -1
            if ( _cirno.angle < 0)     _cirno.BVspeed = 1
        }

        if (_cirno._timer == 1050 ) {
            _cirno._timer = 0
            this.cirnoAtk2()
        }

    },

    /**
     *  霜符「Frost Columns」（冰袭方阵）
     */
    cirnoAtk3(){
        let _cirno = this.chapterOneCache.cirnoPro
        let anim = _cirno.node.getComponent(cc.Animation);
        let _w = this.node.width
        let _h = this.node.height
        let move = cc.callFunc(() => {
            anim.play('Cirno-move')
        });
        let moveLeft = cc.callFunc(() => {
            anim.play('Cirno-moveLeft')
        });
        let moveRight = cc.callFunc(() => {
            anim.play('Cirno-moveRight')
        });
        let moved = cc.callFunc(() => {
            anim.play('Cirno-move')
            _cirno._timer = 0
            this.cirnoAtk3()
        });

        //8字移动模式
        if (_cirno._timer == 150) {
            let array = [
                cc.v2(_w * 0.5, _h * 0.7),
                cc.v2(_w * 0.3, _h * 0.8),
                cc.v2(_w * 0.1, _h * 0.7),
                cc.v2(_w * 0.3, _h * 0.6),
                cc.v2(_w * 0.5, _h * 0.7),
                cc.v2(_w * 0.7, _h * 0.8),
                cc.v2(_w * 0.9, _h * 0.7),
                cc.v2(_w * 0.7, _h * 0.6),
                cc.v2(_w * 0.5, _h * 0.7),
            ];
            let seq = cc.sequence( move, cc.cardinalSplineTo(20, array, 0));
            _cirno.node.runAction(seq);
        }

        //扩散和跟随的弹幕
        if (_cirno._timer >= 150 && _cirno._timer < 1300 ) {
            let _x = _cirno.node.x + _cirno.offsetX + _cirno.width / 2
            let _y = _cirno.node.y + _cirno.offsetY + _cirno.height / 2
            let _arr = []
            let _angle = _cirno.angle
            if (_cirno._timer % 75 == 0) {
                for (let j = 0; j < 24; j++) {
                    _angle = _cirno.angle + j * 15
                    let bullet = null
                    bullet = cc.instantiate(this.bulletPrefabs[17])
                    bullet.setPosition(cc.v2(_x - _cirno.width / 2, _y - _cirno.height / 2))
                    bullet.rotation = _angle - 270
                    this.gameBg.node.addChild(bullet)
                    let _uuid = this.getUuid()
                    this.elfBullets.push({
                        uuid: _uuid,
                        node: bullet,
                        cx: _x - _cirno.width / 2,
                        cy: _y - _cirno.height / 2,
                        type: 'cirno_cirele_line4',
                        angle: _angle,
                        speed: _cirno.bullteSpeed,
                        xSpeed: Math.cos(_angle * Math.PI / 180) * _cirno.bullteSpeed,
                        ySpeed: -Math.sin(_angle * Math.PI / 180) * _cirno.bullteSpeed,
                        visible: true
                    })
                }
            }

            if (_cirno._timer % 150 == 0) {
                let _angle = _cirno.angle
                let bullet = null
                for (let j = 0; j < 12; j++) {
                    _angle = _cirno.angle + j * 30
                    bullet = cc.instantiate(this.bulletPrefabs[27])
                    bullet.setPosition(cc.v2(_x - _cirno.width / 2, _y - _cirno.height / 2))
                    bullet.rotation = _angle - 270

                    this.gameBg.node.addChild(bullet)
                    let _uuid = this.getUuid()
                    this.elfBullets.push({
                        uuid: _uuid,
                        node: bullet,
                        cx: _x - _cirno.width / 2,
                        cy: _y - _cirno.height / 2,
                        type: 'cirno_cirele_track',
                        angle: _angle,
                        speed: _cirno.bullteSpeed,
                        xSpeed: Math.cos(_angle * Math.PI / 180) * _cirno.bullteSpeed * 0.3,
                        ySpeed: -Math.sin(_angle * Math.PI / 180) * _cirno.bullteSpeed * 0.3,
                        visible: true
                    })
                }
            }
        }

        if (_cirno._timer == 1400 ) {
            _cirno._timer = 0
            this.cirnoAtk3()
        }

    },

    /**
     * 雪符「Diamond Blizzard」（钻石风暴）
     */
    cirnoAtk4(){
        let _cirno = this.chapterOneCache.cirnoPro
        let anim = _cirno.node.getComponent(cc.Animation);
        let _w = this.node.width
        let _h = this.node.height
        let move = cc.callFunc(() => {
            anim.play('Cirno-move')
        });
        let moveLeft = cc.callFunc(() => {
            anim.play('Cirno-moveLeft')
        });
        let moveRight = cc.callFunc(() => {
            anim.play('Cirno-moveRight')
        });
        let moved = cc.callFunc(() => {
            anim.play('Cirno-move')
            _cirno._timer = 0
            this.cirnoAtk4()
        });

        if (_cirno._timer >= 120) {
            let _x = _cirno.node.x + _cirno.offsetX + _cirno.width / 2
            let _y = _cirno.node.y + _cirno.offsetY + _cirno.height / 2
            let _arr = []
            if (_cirno._timer % 36 == 0) {
                let _angle = _cirno.angle
                let bullet = null
                for (let j = 0; j < 12; j++) {
                    _angle = _cirno.angle + j * 30
                    bullet = cc.instantiate(this.bulletCircles[15])
                    bullet.setPosition(cc.v2(_x - _cirno.width / 2, _y - _cirno.height / 2))
                    bullet.rotation = _angle - 270
                    this.gameBg.node.addChild(bullet)
                    let _uuid = this.getUuid()
                    this.elfBullets.push({
                        uuid: _uuid,
                        node: bullet,
                        cx: _x - _cirno.width / 2,
                        cy: _y - _cirno.height / 2,
                        type: 'cirno_ice_mirror',
                        angle: _angle,
                        refractCount: 0,
                        speed: _cirno.bullteSpeed,
                        xSpeed: Math.cos(_angle * Math.PI / 180) * _cirno.bullteSpeed,
                        ySpeed: -Math.sin(_angle * Math.PI / 180) * _cirno.bullteSpeed,
                        visible: true
                    })
                }
            }
            if (_cirno._timer % 100 == 0) {
                let _angle = _cirno.angle
                let bullet = null
                for (let j = 0; j < 36; j++) {
                    _angle = _cirno.angle + j * 10
                    bullet = cc.instantiate(this.bulletCircles[15])
                    bullet.setPosition(cc.v2(_x - _cirno.width / 2, _y - _cirno.height / 2))
                    bullet.rotation = _angle - 270
                    this.gameBg.node.addChild(bullet)
                    let _uuid = this.getUuid()
                    this.elfBullets.push({
                        uuid: _uuid,
                        node: bullet,
                        cx: _x - _cirno.width / 2,
                        cy: _y - _cirno.height / 2,
                        type: 'cirno_rotate',
                        angle: _angle,
                        refractCount: 0,
                        speed: _cirno.bullteSpeed,
                        xSpeed: Math.cos(_angle * Math.PI / 180) * _cirno.bullteSpeed,
                        ySpeed: -Math.sin(_angle * Math.PI / 180) * _cirno.bullteSpeed,
                        visible: true
                    })
                }
            }
            _cirno.angle += _cirno.BVspeed
            if ( _cirno.angle > 360)   _cirno.BVspeed = -1
            if ( _cirno.angle < 0)     _cirno.BVspeed = 1
        }

    },

    /**
     * 冻符「Perfect Freeze」（完美冻结）
     */
    cirnoAtk5(){
        let _cirno = this.chapterOneCache.cirnoPro
        let anim = _cirno.node.getComponent(cc.Animation);
        let _w = this.node.width
        let _h = this.node.height
        let move = cc.callFunc(() => {
            anim.play('Cirno-move')
        });
        let moveLeft = cc.callFunc(() => {
            anim.play('Cirno-moveLeft')
        });
        let moveRight = cc.callFunc(() => {
            anim.play('Cirno-moveRight')
        });
        let moved = cc.callFunc(() => {
            anim.play('Cirno-move')
            _cirno._timer = 0
            this.cirnoAtk5()
        });

        //符卡：冻结
        if (_cirno._timer >= 150 && _cirno._timer < 260 ) {
            let _x = _cirno.node.x + _cirno.offsetX + _cirno.width / 2
            let _y = _cirno.node.y + _cirno.offsetY + _cirno.height / 2
            let _arr = []


            for(let j=0; j<3; j++){
                let rda = this.random_num(1, 360)
                let rdb = this.random_num(0, 15)
                let bullet = null
                let _angle = rda
                bullet = cc.instantiate(this.bulletSolids[rdb])
                bullet.setPosition(cc.v2(_x - _cirno.width / 2, _y - _cirno.height / 2))
                bullet.rotation = _angle - 270
                this.gameBg.node.addChild(bullet)
                let _uuid = this.getUuid()
                this.elfBullets.push({
                    uuid: _uuid,
                    node: bullet,
                    cx: _x - _cirno.width / 2,
                    cy: _y - _cirno.height / 2,
                    type: 'cirno_freeze',
                    angle: _angle,
                    speed: _cirno.bullteSpeed,
                    xSpeed: Math.cos(_angle * Math.PI / 180) * _cirno.bullteSpeed,
                    ySpeed: -Math.sin(_angle * Math.PI / 180) * _cirno.bullteSpeed,
                    visible: true
                })
            }

            if(_cirno._timer == 150){
                setTimeout(()=>{
                    for(let i=0; i<this.elfBullets.length; i++){
                        let _b = this.elfBullets[i]
                        _b.node.getComponent(cc.Sprite).spriteFrame = this.bulletSpirits[0].spriteFrame
                    }
                    this.chapterOneCache.cirnoPro.freeze = true
                },2000)

                setTimeout(()=>{
                    for(let i=0; i<this.elfBullets.length; i++){
                        let _b = this.elfBullets[i]
                        _b.xSpeed*= 0.8
                        _b.ySpeed*= 0.8
                    }
                    this.chapterOneCache.cirnoPro.freeze = false
                },4000)
            }
        }

        // 随机移动
        if (_cirno._timer == 270) {
            let rdx1 = this.random_num(-200, 200)
            let rdy1 = this.random_num(-100, 100)
            let moveType = ''
            if (_cirno.node.x + rdx1 >= _w * 0.8 || _cirno.node.x + rdx1 <= _w * 0.2) {
                rdx1 = rdx1 * -1
            }
            if (_cirno.node.y + rdy1 >= _h * 0.8 || _cirno.node.y + rdy1 <= _h * 0.6) {
                rdy1 = rdy1 * -1
            }
            if (rdx1 < 0) {
                moveType = 'Cirno-moveLeft'
            } else if (rdx1 > 0) {
                moveType = 'Cirno-moveRight'
            } else {
                moveType = 'Cirno-move'
            }
            anim.play(moveType)
            let seq = cc.sequence(cc.moveBy(1, rdx1, rdy1), move, moved)
            _cirno.node.runAction(seq);
        }

    },

    /**
     * 冻符「Cold Divinity」（冷冻之神）
     */
    cirnoAtk6(){
        let _cirno = this.chapterOneCache.cirnoPro
        let anim = _cirno.node.getComponent(cc.Animation);
        let _w = this.node.width
        let _h = this.node.height
        let move = cc.callFunc(() => {
            anim.play('Cirno-move')
        });
        let moveLeft = cc.callFunc(() => {
            anim.play('Cirno-moveLeft')
        });
        let moveRight = cc.callFunc(() => {
            anim.play('Cirno-moveRight')
        });
        let moved = cc.callFunc(() => {
            anim.play('Cirno-move')
            _cirno._timer = 0
            this.cirnoAtk6()
        });

        // if (_cirno._timer == 120) {
        //     let count = 8;
        //     let angle = 360/count;
        //     let radius = 100;
        //     let array = []
        //     let pt0 = cc.v2(0, 0);
        //     for (let i = 0; i < (count - 1) * 2; i++){
        //         if(i == 0){
        //             array.push(pt0)
        //             pt0 = cc.v2(radius, 0)
        //         }else{
        //             array.push(pt0)
        //             pt0 = pt0.rotate(angle)
        //         }
        //     }
        //     let seq = cc.sequence(cc.moveTo(1, _w*0.5, _h*0.7), cc.cardinalSplineBy(5, array, 0), moved);
        //     _cirno.node.runAction(seq);
        // }

        if (_cirno._timer >= 150 ) {
            let _cirno = this.chapterOneCache.cirnoPro
            let _x = _cirno.node.x + _cirno.offsetX + _cirno.width / 2
            let _y = _cirno.node.y + _cirno.offsetY + _cirno.height / 2
            let _arr = []
            if (_cirno._timer % 30 == 0) {
                let _angle = _cirno.angle
                let bullet = null
                for (let j = 0; j < 18; j++) {
                    _angle = _cirno.angle + j * 20
                    bullet = cc.instantiate(this.bulletPrefabs[27])
                    bullet.setPosition(cc.v2(_x - _cirno.width / 2, _y - _cirno.height / 2))
                    bullet.rotation = _angle - 270
                    this.gameBg.node.addChild(bullet)
                    let _uuid = this.getUuid()
                    this.elfBullets.push({
                        uuid: _uuid,
                        node: bullet,
                        cx: _x - _cirno.width / 2,
                        cy: _y - _cirno.height / 2,
                        type: 'cirno_rotate_snow',
                        angle: _angle,
                        speed: _cirno.bullteSpeed,
                        xSpeed: Math.cos(_angle * Math.PI / 180) * _cirno.bullteSpeed * 0.5,
                        ySpeed: -Math.sin(_angle * Math.PI / 180) * _cirno.bullteSpeed * 0.5,
                        visible: true
                    })
                }
                _cirno.angle += _cirno.BVspeed
            }

            if (_cirno._timer % 90 == 0) {
                let _angle = _cirno.angle
                let bullet = null
                for (let j = 0; j < 12; j++) {
                    _angle = _cirno.angle + j * 30
                    bullet = cc.instantiate(this.bulletPrefabs[27])
                    bullet.setPosition(cc.v2(_x - _cirno.width / 2, _y - _cirno.height / 2))
                    bullet.rotation = _angle - 270

                    this.gameBg.node.addChild(bullet)
                    let _uuid = this.getUuid()
                    this.elfBullets.push({
                        uuid: _uuid,
                        node: bullet,
                        cx: _x - _cirno.width / 2,
                        cy: _y - _cirno.height / 2,
                        type: 'cirno_cirele_track',
                        angle: _angle,
                        speed: _cirno.bullteSpeed,
                        xSpeed: Math.cos(_angle * Math.PI / 180) * _cirno.bullteSpeed * 0.3,
                        ySpeed: -Math.sin(_angle * Math.PI / 180) * _cirno.bullteSpeed * 0.3,
                        visible: true
                    })
                }
            }
        }
    },

    /**
     *  冻符「Minus K」（负K）
     */
    cirnoAtk7(){
        let _cirno = this.chapterOneCache.cirnoPro
        let anim = _cirno.node.getComponent(cc.Animation);
        let _w = this.node.width
        let _h = this.node.height
        let move = cc.callFunc(() => {
            anim.play('Cirno-move')
        });
        let moveLeft = cc.callFunc(() => {
            anim.play('Cirno-moveLeft')
        });
        let moveRight = cc.callFunc(() => {
            anim.play('Cirno-moveRight')
        });
        let moved = cc.callFunc(() => {
            anim.play('Cirno-move')
            _cirno._timer = 0
            this.cirnoAtk7()
        });

        //8字移动模式
        if (_cirno._timer == 150) {

            let array = [
                cc.v2(_w * 0.5, _h * 0.7),
                cc.v2(_w * 0.3, _h * 0.8),
                cc.v2(_w * 0.1, _h * 0.7),
                cc.v2(_w * 0.3, _h * 0.6),
                cc.v2(_w * 0.5, _h * 0.7),
                cc.v2(_w * 0.7, _h * 0.8),
                cc.v2(_w * 0.9, _h * 0.7),
                cc.v2(_w * 0.7, _h * 0.6),
                cc.v2(_w * 0.5, _h * 0.7),
            ];
            let seq = cc.sequence( move, cc.cardinalSplineTo(20, array, 0), moved);
            _cirno.node.runAction(seq);
        }

        if (_cirno._timer >= 150 ) {
            let _cirno = this.chapterOneCache.cirnoPro

            let _x = _cirno.node.x + _cirno.offsetX + _cirno.width / 2
            let _y = _cirno.node.y + _cirno.offsetY + _cirno.height / 2
            let _arr = []
            let rda = this.random_num(1, 360)
            let rdb = this.random_num(0, 15)
            let bullet = null

            let _angle = rda
            bullet = cc.instantiate(this.bulletPrefabs[17])
            bullet.setPosition(cc.v2(_x - _cirno.width / 2, _y - _cirno.height / 2))
            bullet.rotation = _angle - 270
            this.gameBg.node.addChild(bullet)
            let _uuid = this.getUuid()
            this.elfBullets.push({
                uuid: _uuid,
                node: bullet,
                cx: _x - _cirno.width / 2,
                cy: _y - _cirno.height / 2,
                type: 'cirno_freeze',
                angle: _angle,
                speed: _cirno.bullteSpeed,
                xSpeed: Math.cos(_angle * Math.PI / 180) * _cirno.bullteSpeed,
                ySpeed: -Math.sin(_angle * Math.PI / 180) * _cirno.bullteSpeed,
                visible: true
            })

            //冰锥
            if (_cirno._timer % 60 == 0) {
                let x = this.playerPro.x
                let y = _h - 12
                let bullet = cc.instantiate(this.bulletPrefabs[23])
                bullet.setPosition(cc.v2(x, y))
                this.gameBg.node.addChild(bullet)
                let _uuid = this.getUuid()
                this.elfBullets.push({
                    uuid: _uuid,
                    node: bullet,
                    cx: x,
                    cy: y,
                    type: '601',
                    speed: _cirno.bullteSpeed,
                    xSpeed: 0,
                    ySpeed: _cirno.bullteSpeed * -1,
                    visible: true
                })
            }
        }

    },

    /**
     * 冰符「Ultimate Blizzard」（终焉暴雪）
     */
    cirnoAtk8() {
        let _cirno = this.chapterOneCache.cirnoPro
        let anim = _cirno.node.getComponent(cc.Animation);
        let _w = this.node.width
        let _h = this.node.height
        let move = cc.callFunc(() => {
            anim.play('Cirno-move')
        });
        let moveLeft = cc.callFunc(() => {
            anim.play('Cirno-moveLeft')
        });
        let moveRight = cc.callFunc(() => {
            anim.play('Cirno-moveRight')
        });
        let moved = cc.callFunc(() => {
            anim.play('Cirno-move')
            _cirno._timer = 0
            this.cirnoAtk8()
        });

        //符卡：冻结
        if (_cirno._timer >= 150 && _cirno._timer < 280 ) {
            let _x = _cirno.node.x + _cirno.offsetX + _cirno.width / 2
            let _y = _cirno.node.y + _cirno.offsetY + _cirno.height / 2
            let _arr = []

            //旋转冻结
            if (_cirno._timer % 8 == 0) {
                let _angle = _cirno.angle
                let bullet = null
                for (let j = 0; j < 24; j++) {
                    _angle = _cirno.angle + j * 15
                    bullet = cc.instantiate(this.bulletPrefabs[17])
                    bullet.setPosition(cc.v2(_x - _cirno.width / 2, _y - _cirno.height / 2))
                    bullet.rotation = _angle - 270
                    this.gameBg.node.addChild(bullet)
                    let _uuid = this.getUuid()
                    this.elfBullets.push({
                        uuid: _uuid,
                        node: bullet,
                        cx: _x - _cirno.width / 2,
                        cy: _y - _cirno.height / 2,
                        type: 'cirno_ice_rotate',
                        angle: _angle,
                        rotated: false,
                        speed: _cirno.bullteSpeed,
                        xSpeed: Math.cos(_angle * Math.PI / 180) * _cirno.bullteSpeed,
                        ySpeed: -Math.sin(_angle * Math.PI / 180) * _cirno.bullteSpeed,
                        visible: true
                    })
                }
            }
            _cirno.angle += _cirno.BVspeed
            if ( _cirno.angle > 360)   _cirno.BVspeed = -1
            if ( _cirno.angle < 0)     _cirno.BVspeed = 1

            if(_cirno._timer == 200){
                setTimeout(()=>{
                    for(let i=0; i<this.elfBullets.length; i++){
                        let _b = this.elfBullets[i]
                        // _b.node.getComponent(cc.Sprite).spriteFrame = this.bulletSpirits[0].spriteFrame
                        if(!_b.rotated){
                            _b.angle = this.random_num(1, 360)
                            _b.node.rotation = _b.angle - 270
                            _b.xSpeed = Math.cos(_b.angle * Math.PI / 180) * _cirno.bullteSpeed
                            _b.ySpeed = -Math.sin(_b.angle * Math.PI / 180) * _cirno.bullteSpeed
                            _b.rotated = true
                        }
                    }
                    this.chapterOneCache.cirnoPro.freeze = true
                },2000)

                setTimeout(()=>{
                    for(let i=0; i<this.elfBullets.length; i++){
                        let _b = this.elfBullets[i]
                        _b.xSpeed*= 0.8
                        _b.ySpeed*= 0.8
                    }
                    this.chapterOneCache.cirnoPro.freeze = false
                },4000)
            }
        }

        // 随机移动
        if (_cirno._timer == 300) {
            let rdx1 = this.random_num(-200, 200)
            let rdy1 = this.random_num(-150, 150)
            let moveType = ''
            if (_cirno.node.x + rdx1 >= _w * 0.7 || _cirno.node.x + rdx1 <= _w * 0.3) {
                rdx1 = rdx1 * -1
            }
            if (_cirno.node.y + rdy1 >= _h * 0.8 || _cirno.node.y + rdy1 <= _h * 0.6) {
                rdy1 = rdy1 * -1
            }
            if (rdx1 < 0) {
                moveType = 'Cirno-moveLeft'
            } else if (rdx1 > 0) {
                moveType = 'Cirno-moveRight'
            } else {
                moveType = 'Cirno-move'
            }
            anim.play(moveType)
            let seq = cc.sequence(cc.moveBy(2, rdx1, rdy1), moved)
            _cirno.node.runAction(seq);
        }

    },

    /**
     * 冰符「Perfect Glacialist」（完美冰川学家）
     */
    cirnoAtk9() {
        let _cirno = this.chapterOneCache.cirnoPro
        let anim = _cirno.node.getComponent(cc.Animation);
        let _w = this.node.width
        let _h = this.node.height
        let move = cc.callFunc(() => {
            anim.play('Cirno-move')
        });
        let moveLeft = cc.callFunc(() => {
            anim.play('Cirno-moveLeft')
        });
        let moveRight = cc.callFunc(() => {
            anim.play('Cirno-moveRight')
        });
        let moved = cc.callFunc(() => {
            anim.play('Cirno-move')
            _cirno._timer = 0
            this.cirnoAtk9()
        });

        //符卡：冻结
        if (_cirno._timer >= 150 && _cirno._timer < 270 ) {
            let _x = _cirno.node.x + _cirno.offsetX + _cirno.width / 2
            let _y = _cirno.node.y + _cirno.offsetY + _cirno.height / 2
            let _arr = []

            //旋转冻结
            if (_cirno._timer % 8 == 0) {
                let _angle = _cirno.angle
                let bullet = null
                for (let j = 0; j < 6; j++) {
                    _angle = _cirno.angle + j * 60
                    bullet = cc.instantiate(this.bulletPrefabs[17])
                    bullet.setPosition(cc.v2(_x - _cirno.width / 2, _y - _cirno.height / 2))
                    bullet.rotation = _angle - 270
                    this.gameBg.node.addChild(bullet)
                    let _uuid = this.getUuid()
                    this.elfBullets.push({
                        uuid: _uuid,
                        node: bullet,
                        cx: _x - _cirno.width / 2,
                        cy: _y - _cirno.height / 2,
                        type: 'cirno_ice_flower',
                        freeze: false,          //冻结
                        angle: _angle,
                        rotated: false,         //是否旋转
                        speed: _cirno.bullteSpeed,
                        xSpeed: Math.cos(_angle * Math.PI / 180) * _cirno.bullteSpeed,
                        ySpeed: -Math.sin(_angle * Math.PI / 180) * _cirno.bullteSpeed,
                        visible: true
                    })
                }
            }
            _cirno.angle += _cirno.BVspeed
            if ( _cirno.angle > 360)   _cirno.BVspeed = -1
            if ( _cirno.angle < 0)     _cirno.BVspeed = 1

            if(_cirno._timer == 200){
                setTimeout(()=>{
                    for(let i=0; i<this.elfBullets.length; i++){
                        let _b = this.elfBullets[i]
                        // _b.node.getComponent(cc.Sprite).spriteFrame = this.bulletSpirits[0].spriteFrame
                        if(!_b.rotated){
                            // 随机角度
                            // _b.angle = this.random_num(1, 360)
                            // _b.node.rotation = _b.angle - 270
                            // _b.xSpeed = Math.cos(_b.angle * Math.PI / 180) * _cirno.bullteSpeed
                            // _b.ySpeed = -Math.sin(_b.angle * Math.PI / 180) * _cirno.bullteSpeed
                            _b.rotated = true

                            let _angle = _b.angle
                            let bullet = null
                            for (let j = 1; j < 6; j++) {
                                _angle = _b.angle + j * 60
                                bullet = cc.instantiate(this.bulletPrefabs[17])
                                bullet.setPosition(cc.v2(_b.node.x, _b.node.y))
                                bullet.rotation = _angle - 270
                                this.gameBg.node.addChild(bullet)
                                let _uuid = this.getUuid()
                                this.elfBullets.push({
                                    uuid: _uuid,
                                    node: bullet,
                                    cx: _b.node.x,
                                    cy: _b.node.y,
                                    type: 'cirno_ice_flower',
                                    freeze: false,          //冻结
                                    angle: _angle,
                                    rotated: true,         //是否旋转
                                    speed: _cirno.bullteSpeed,
                                    xSpeed: Math.cos(_angle * Math.PI / 180) * _cirno.bullteSpeed,
                                    ySpeed: -Math.sin(_angle * Math.PI / 180) * _cirno.bullteSpeed,
                                    visible: true
                                })
                            }

                        }
                        //生成冰之花

                    }
                    //冻结
                    this.chapterOneCache.cirnoPro.freeze = true

                },2000)

                setTimeout(()=>{
                    for(let i=0; i<this.elfBullets.length; i++){
                        let _b = this.elfBullets[i]
                        _b.xSpeed*= 0.8
                        _b.ySpeed*= 0.8
                    }
                    //解冻
                    this.chapterOneCache.cirnoPro.freeze = false
                },4000)
            }
        }

        //随机移动
        if (_cirno._timer == 500) {
            let rdx1 = this.random_num(-200, 200)
            let rdy1 = this.random_num(-150, 150)
            let moveType = ''
            if (_cirno.node.x + rdx1 >= _w * 0.7 || _cirno.node.x + rdx1 <= _w * 0.3) {
                rdx1 = rdx1 * -1
            }
            if (_cirno.node.y + rdy1 >= _h * 0.8 || _cirno.node.y + rdy1 <= _h * 0.6) {
                rdy1 = rdy1 * -1
            }
            if (rdx1 < 0) {
                moveType = 'Cirno-moveLeft'
            } else if (rdx1 > 0) {
                moveType = 'Cirno-moveRight'
            } else {
                moveType = 'Cirno-move'
            }
            anim.play(moveType)
            let seq = cc.sequence(cc.moveBy(2, rdx1, rdy1), moved)
            _cirno.node.runAction(seq);
        }

    },

    /**
     * '冰王「Frost King」（霜冻之王）
     */
    cirnoAtk10() {
        let _cirno = this.chapterOneCache.cirnoPro
        let anim = _cirno.node.getComponent(cc.Animation);
        let _w = this.node.width
        let _h = this.node.height
        let move = cc.callFunc(() => {
            anim.play('Cirno-move')
        });
        let moveLeft = cc.callFunc(() => {
            anim.play('Cirno-moveLeft')
        });
        let moveRight = cc.callFunc(() => {
            anim.play('Cirno-moveRight')
        });
        let moved = cc.callFunc(() => {
            _cirno._timer = 0
            this.cirnoAtk10()
        });

        //符卡：冻结
        if (_cirno._timer >= 150) {
            let _x = _cirno.node.x + _cirno.offsetX + _cirno.width / 2
            let _y = _cirno.node.y + _cirno.offsetY + _cirno.height / 2
            let _arr = []

            //旋转冻结
            if (_cirno._timer % 6 == 0) {
                let _angle = _cirno.angle
                let bullet = null
                for (let j = 0; j < 3; j++) {
                    _angle = _cirno.angle + j * 120
                    bullet = cc.instantiate(this.bulletPrefabs[31])
                    bullet.setPosition(cc.v2(_x - _cirno.width / 2, _y - _cirno.height / 2))
                    bullet.rotation = _angle - 270
                    this.gameBg.node.addChild(bullet)
                    let _uuid = this.getUuid()
                    this.elfBullets.push({
                        uuid: _uuid,
                        node: bullet,
                        cx: _x - _cirno.width / 2,
                        cy: _y - _cirno.height / 2,
                        type: 'cirno_rotate_k',
                        freeze: false,          //冻结
                        angle: _angle,
                        rotated: false,         //是否旋转
                        speed: _cirno.bullteSpeed,
                        xSpeed: Math.cos(_angle * Math.PI / 180) * _cirno.bullteSpeed,
                        ySpeed: -Math.sin(_angle * Math.PI / 180) * _cirno.bullteSpeed,
                        visible: true
                    })
                }
            }
            _cirno.angle += 1
            if ( _cirno.angle > 360)    _cirno.angle = 0

        }

        //随机移动
        if (_cirno._timer % 400 == 0) {
            let rdx1 = this.random_num(-200, 200)
            let rdy1 = this.random_num(-150, 150)
            let moveType = ''
            if (_cirno.node.x + rdx1 >= _w * 0.7 || _cirno.node.x + rdx1 <= _w * 0.3) {
                rdx1 = rdx1 * -1
            }
            if (_cirno.node.y + rdy1 >= _h * 0.8 || _cirno.node.y + rdy1 <= _h * 0.6) {
    rdy1 = rdy1 * -1
            }
            if (rdx1 < 0) {
                moveType = 'Cirno-moveLeft'
            } else if (rdx1 > 0) {
                moveType = 'Cirno-moveRight'
            } else {
                moveType = 'Cirno-move'
            }
            anim.play(moveType)
            let seq = cc.sequence(cc.moveBy(2, rdx1, rdy1), move)
            _cirno.node.runAction(seq);
        }

    },

    /**
     * 琪露诺攻击模式
     * @param state
     */
    loadCirno(state) {

        if (state == 1) {
            //符卡1
            this.cirnoAtk1()
        } else if (state == 2) {
            //符卡2
            this.cirnoAtk2()
        } else if (state == 3) {
            //符卡3
            this.cirnoAtk3()
        } else if (state == 4) {
            //符卡4
            this.cirnoAtk4()
        } else if (state == 5) {
            //符卡5
            this.cirnoAtk5()
        } else if (state == 6) {
            //符卡6
            this.cirnoAtk6()
        } else if (state == 7) {
            //符卡7
            this.cirnoAtk7()
        } else if (state == 8) {
            //符卡8
            this.cirnoAtk8()
        } else if (state == 9) {
            //符卡9
            this.cirnoAtk9()
        } else if (state == 10) {
            //符卡10
            this.cirnoAtk10()
        }
    },

    /**
     * 读取游戏数据
     * 游戏主进程
     */
    loadGameData(){
        //默认读取第一章
        this.chapterOne()
    },

    /**
     * 第一章
     */
    chapterOne() {

        let _w = this.node.width
        let _h = this.node.height

        //elfs

        if(this.gamePro.timer >= 50 && this.gamePro.timer < 200){
            if(this.gamePro.timer % 15 == 0){
                let rdx = this.random_num(_w * 0.8, _w * 0.95)
                let rdy = this.random_num(_h * 0.7, _h * 0.85)
                let rdx1 = this.random_num(_w * 0.4, _w * 0.6)
                let rdy1 = this.random_num(_h * 0.4, _h * 0.6)
                let rdx2 = this.random_num(_w * 0.1, _w * 0.5)
                let rdy2 = this.random_num(_h * 0.6, _h * 0.8)
                let rdy3 = this.random_num(_h * 0.5, _h * 0.7)
                let rdTime1 = this.random_num(1,2)
                let rdTime2 = this.random_num(2,4)
                let rdTime3 = this.random_num(1.5,2.5)
                let _elf = this.creatElf({
                    x: rdx,
                    y: _h - 16,
                    bullteType: 101,
                    moveDirection: -1,          // 不进行移动
                    preheat: true,              // 启用武器预热（移动时不进行开火
                    bullteInterval: 2000,
                })
                let anim = _elf.node.getComponent(cc.Animation);
                let f1 = cc.callFunc(() => {
                    anim.play('Elf1-moveLeft')
                    _elf.preheat = false;       // 预热完成，开火
                });
                let f2 = cc.callFunc(() => {
                    // anim.play('Elf1-move')
                });

                let array = [cc.v2(rdx, rdy), cc.v2(rdx1, rdy1), cc.v2(rdx2, rdy2)];
                let seq = cc.sequence(cc.moveTo(rdTime1, rdx, rdy), f1,  cc.bezierTo(rdTime2, array), f2, cc.moveTo(rdTime3, _w * 0 - 32, rdy3));
                _elf.node.runAction(seq);
            }
        }

        if(this.gamePro.timer >= 300 && this.gamePro.timer < 450){

            if(this.gamePro.timer % 15 == 0){
                let rdx = this.random_num(_w * 0.2, _w * 0.05)
                let rdy = this.random_num(_h * 0.7, _h * 0.85)
                let rdx1 = this.random_num(_w * 0.4, _w * 0.6)
                let rdy1 = this.random_num(_h * 0.4, _h * 0.6)
                let rdx2 = this.random_num(_w * 0.5, _w * 0.9)
                let rdy2 = this.random_num(_h * 0.6, _h * 0.8)
                let rdy3 = this.random_num(_h * 0.5, _h * 0.7)
                let rdTime1 = this.random_num(1,2)
                let rdTime2 = this.random_num(2,4)
                let rdTime3 = this.random_num(1.5,2.5)
                let _elf = this.creatElf({
                    x: rdx,
                    y: _h - 16,
                    bullteType: 101,
                    moveDirection: -1,          // 不进行移动
                    preheat: true,              // 启用武器预热（移动时不进行开火
                    bullteInterval: 2000,
                })
                let anim = _elf.node.getComponent(cc.Animation);
                let f1 = cc.callFunc(() => {
                    anim.play('Elf1-moveRight')
                    _elf.preheat = false;       // 预热完成，开火
                });
                let f2 = cc.callFunc(() => {
                    // anim.play('Elf1-move')
                });
                let array = [cc.v2(rdx, rdy), cc.v2(rdx1, rdy1), cc.v2(rdx2, rdy2)];
                let seq = cc.sequence(cc.moveTo(rdTime1, rdx, rdy), f1,  cc.bezierTo(rdTime2, array), f2, cc.moveTo(rdTime3, _w + 32, rdy3));
                _elf.node.runAction(seq);
            }
        }

        if(this.gamePro.timer >= 550 && this.gamePro.timer < 700){
            if(this.gamePro.timer % 15 == 0){
                let rdx = this.random_num(_w * 0.8, _w * 0.95)
                let rdy = this.random_num(_h * 0.7, _h * 0.85)
                let rdx1 = this.random_num(_w * 0.4, _w * 0.6)
                let rdy1 = this.random_num(_h * 0.4, _h * 0.6)
                let rdx2 = this.random_num(_w * 0.1, _w * 0.5)
                let rdy2 = this.random_num(_h * 0.6, _h * 0.8)
                let rdy3 = this.random_num(_h * 0.5, _h * 0.7)
                let rdTime1 = this.random_num(1,2)
                let rdTime2 = this.random_num(2,4)
                let rdTime3 = this.random_num(1.5,2.5)
                let _elf = this.creatElf({
                    x: rdx,
                    y: _h - 16,
                    bullteType: 101,
                    moveDirection: -1,          // 不进行移动
                    preheat: true,              // 启用武器预热（移动时不进行开火
                    bullteInterval: 2000,
                })
                let anim = _elf.node.getComponent(cc.Animation);
                let f1 = cc.callFunc(() => {
                    anim.play('Elf1-moveLeft')
                    _elf.preheat = false;       // 预热完成，开火
                });
                let f2 = cc.callFunc(() => {
                    // anim.play('Elf1-move')
                });

                let array = [cc.v2(rdx, rdy), cc.v2(rdx1, rdy1), cc.v2(rdx2, rdy2)];
                let seq = cc.sequence(cc.moveTo(rdTime1, rdx, rdy), f1,  cc.bezierTo(rdTime2, array), f2, cc.moveTo(rdTime3, _w * 0 - 32, rdy3));
                _elf.node.runAction(seq);
            }
        }

        if(this.gamePro.timer >= 800 && this.gamePro.timer <= 950){

            if(this.gamePro.timer % 15 == 0){
                let rdx = this.random_num(_w * 0.2, _w * 0.05)
                let rdy = this.random_num(_h * 0.7, _h * 0.85)
                let rdx1 = this.random_num(_w * 0.4, _w * 0.6)
                let rdy1 = this.random_num(_h * 0.4, _h * 0.6)
                let rdx2 = this.random_num(_w * 0.5, _w * 0.9)
                let rdy2 = this.random_num(_h * 0.6, _h * 0.8)
                let rdy3 = this.random_num(_h * 0.5, _h * 0.7)
                let rdTime1 = this.random_num(1,2)
                let rdTime2 = this.random_num(2,4)
                let rdTime3 = this.random_num(1.5,2.5)
                let _elf = this.creatElf({
                    x: rdx,
                    y: _h - 16,
                    bullteType: 101,
                    moveDirection: -1,          // 不进行移动
                    preheat: true,              // 启用武器预热（移动时不进行开火
                    bullteInterval: 2000,
                })
                let anim = _elf.node.getComponent(cc.Animation);
                let f1 = cc.callFunc(() => {
                    anim.play('Elf1-moveRight')
                    _elf.preheat = false;       // 预热完成，开火
                });
                let f2 = cc.callFunc(() => {
                    // anim.play('Elf1-move')
                });
                let array = [cc.v2(rdx, rdy), cc.v2(rdx1, rdy1), cc.v2(rdx2, rdy2)];
                let seq = cc.sequence(cc.moveTo(rdTime1, rdx, rdy), f1,  cc.bezierTo(rdTime2, array), f2, cc.moveTo(rdTime3, _w + 32, rdy3));
                _elf.node.runAction(seq);
            }
        }

        if (this.gamePro.timer == 1050 || this.gamePro.timer == 1250 || this.gamePro.timer == 1450) {
            for (let i = 1; i <= 5; i++) {
                let x = _w * 0.1 * (i * 2 - 1)
                let y = _h - 16
                let y2 = _h * 0.8
                let movex = -64
                if (i == 2 || i == 4) {
                    y2 = _h * 0.7
                    movex = _w + 64
                }
                let _elf = this.creatElf({
                    x: x,
                    y: y,
                    spriteType: 1,              // elf2
                    bullteType: 401,
                    bullteColor: 6,
                    bullteSpeed: 3,
                    moveDirection: -1,          // 不进行移动
                    preheat: true,              // 启用武器预热（移动时不进行开火
                    bullteInterval: 150,
                })
                let rdTime1 = this.random_num(1, 1.5)
                let rdx1 = this.random_num(-50, 50)
                let rdy1 = this.random_num(-50, 50)
                let rdTime2 = this.random_num(1, 1.5)
                let rdx2 = this.random_num(-50, 50)
                let rdy2 = this.random_num(-50, 50)
                let rdTime3 = this.random_num(1, 1.5)
                let rdx3 = this.random_num(-50, 50)
                let rdy3 = this.random_num(-50, 50)
                let anim = _elf.node.getComponent(cc.Animation);
                let moveType = ''
                //判断边界
                let f1 = cc.callFunc(() => {
                    anim.play('Elf2-move')
                    _elf.preheat = false;
                });
                let f2 = cc.callFunc(() => {
                    _elf.preheat = true;
                    if (_elf.node.x + rdx1 >= _w - 32 || _elf.node.x + rdx1 <= 32) {
                        rdx1 = rdx1 * -1
                    }
                    if (_elf.node.y + rdy1 >= _h - 32 || _elf.node.y + rdy1 <= 32) {
                        rdy1 = rdy1 * -1
                    }
                    if (rdx1 < 0) {
                        moveType = 'Elf2-moveLeft'
                    } else if (rdx1 > 0) {
                        moveType = 'Elf2-moveRight'
                    } else {
                        moveType = 'Elf2-move'
                    }
                    anim.play(moveType)
                });
                let f3 = cc.callFunc(() => {
                    _elf.preheat = true;
                    if (_elf.node.x + rdx2 >= _w - 32 || _elf.node.x + rdx2 <= 32) {
                        rdx2 = rdx2 * -1
                    }
                    if (_elf.node.y + rdy2 >= _h - 32 || _elf.node.y + rdy2 <= 32) {
                        rdy2 = rdy2 * -1
                    }
                    if (rdx2 < 0) {
                        moveType = 'Elf2-moveLeft'
                    } else if (rdx2 > 0) {
                        moveType = 'Elf2-moveRight'
                    } else {
                        moveType = 'Elf2-move'
                    }
                    anim.play(moveType)
                });
                let f4 = cc.callFunc(() => {
                    _elf.preheat = true;
                    if (rdx3 < 0) {
                        moveType = 'Elf2-moveLeft'
                    } else if (rdx3 > 0) {
                        moveType = 'Elf2-moveRight'
                    } else {
                        moveType = 'Elf2-move'
                    }
                    anim.play(moveType)
                });
                let f5 = cc.callFunc(() => {
                    _elf.preheat = true;
                    //折返
                    if (_elf.node.x >= _w / 2) {
                        moveType = 'Elf2-moveLeft'
                        movex = -64
                    } else {
                        moveType = 'Elf2-moveRight'
                        movex = _w + 64
                    }
                });
                // 随机移动2次后退场
                let seq = cc.sequence(
                    cc.moveTo(2, x, y2), f1,
                    cc.moveBy(1, 0, 0), f2,
                    cc.moveBy(rdTime1, rdx1, rdy1), f1,
                    cc.moveBy(1, 0, 0), f3,
                    cc.moveBy(rdTime2, rdx2, rdy2), f1,
                    cc.moveBy(1, 0, 0), f4,
                    cc.moveBy(rdTime3, rdx3, rdy3), f1,
                    cc.moveBy(1, 0, 0), f5,
                    cc.moveTo(4, movex, y2),
                )
                _elf.node.runAction(seq);
            }

        }

        if (this.gamePro.timer == 1150 || this.gamePro.timer == 1350 || this.gamePro.timer == 1550) {
            for (let i = 1; i <= 5; i++) {
                let x = _w * 0.1 * (i * 2 - 1)
                let y = _h - 16
                let y2 = _h * 0.7
                let movex = -64
                if (i == 2 || i == 4){
                    y2 = _h * 0.8
                    movex = _w + 64
                }
                let _elf = this.creatElf({
                    x: x,
                    y: y,
                    spriteType: 1,              // elf2
                    bullteType: 401,
                    bullteColor: 6,
                    bullteSpeed: 3,
                    moveDirection: -1,          // 不进行移动
                    preheat: true,              // 启用武器预热（移动时不进行开火
                    bullteInterval: 150,
                })
                let rdTime1 = this.random_num(1, 1.5)
                let rdx1 = this.random_num(-50, 50)
                let rdy1 = this.random_num(-50, 50)
                let rdTime2 = this.random_num(1, 1.5)
                let rdx2 = this.random_num(-50, 50)
                let rdy2 = this.random_num(-50, 50)
                let rdTime3 = this.random_num(1, 1.5)
                let rdx3 = this.random_num(-50, 50)
                let rdy3 = this.random_num(-50, 50)
                let anim = _elf.node.getComponent(cc.Animation);
                let moveType = ''
                //判断边界
                let f1 = cc.callFunc(() => {
                    anim.play('Elf2-move')
                    _elf.preheat = false;
                });
                let f2 = cc.callFunc(() => {
                    _elf.preheat = true;
                    if (_elf.node.x + rdx1 >= _w - 32 || _elf.node.x + rdx1 <= 32) {
                        rdx1 = rdx1 * -1
                    }
                    if (_elf.node.y + rdy1 >= _h - 32 || _elf.node.y + rdy1 <= 32) {
                        rdy1 = rdy1 * -1
                    }
                    if (rdx1 < 0) {
                        moveType = 'Elf2-moveLeft'
                    } else if (rdx1 > 0) {
                        moveType = 'Elf2-moveRight'
                    } else {
                        moveType = 'Elf2-move'
                    }
                    anim.play(moveType)
                });
                let f3 = cc.callFunc(() => {
                    _elf.preheat = true;
                    if (_elf.node.x + rdx2 >= _w - 32 || _elf.node.x + rdx2 <= 32) {
                        rdx2 = rdx2 * -1
                    }
                    if (_elf.node.y + rdy2 >= _h - 32 || _elf.node.y + rdy2 <= 32) {
                        rdy2 = rdy2 * -1
                    }
                    if (rdx2 < 0) {
                        moveType = 'Elf2-moveLeft'
                    } else if (rdx2 > 0) {
                        moveType = 'Elf2-moveRight'
                    } else {
                        moveType = 'Elf2-move'
                    }
                    anim.play(moveType)
                });
                let f4 = cc.callFunc(() => {
                    _elf.preheat = true;
                    if (rdx3 < 0) {
                        moveType = 'Elf2-moveLeft'
                    } else if (rdx3 > 0) {
                        moveType = 'Elf2-moveRight'
                    } else {
                        moveType = 'Elf2-move'
                    }
                    anim.play(moveType)
                });
                let f5 = cc.callFunc(() => {
                    _elf.preheat = true;
                    //折返
                    if (_elf.node.x >= _w / 2) {
                        moveType = 'Elf2-moveLeft'
                        movex = - 64
                    }else{
                        moveType = 'Elf2-moveRight'
                        movex = _w + 64
                    }
                });
                // 随机移动2次后退场
                let seq = cc.sequence(
                    cc.moveTo(2, x, y2), f1,
                    cc.moveBy(1, 0, 0), f2,
                    cc.moveBy(rdTime1, rdx1, rdy1), f1,
                    cc.moveBy(1, 0, 0), f3,
                    cc.moveBy(rdTime2, rdx2, rdy2), f1,
                    cc.moveBy(1, 0, 0), f4,
                    cc.moveBy(rdTime3, rdx3, rdy3), f1,
                    cc.moveBy(1, 0, 0), f5,
                    cc.moveTo(4, movex, y2),
                )
                _elf.node.runAction(seq);
            }
        }

        if(this.gamePro.timer >= 1700 && this.gamePro.timer < 1840 ){
            if(this.gamePro.timer %10 == 0){
                let _elf = this.creatElf({
                    x: _w * 0 + 16,
                    y: _h * 0.7,
                    spriteType: 3,
                    bullteType: 101,
                    moveDirection: -1,          //不进行移动
                    bullteInterval: 200,
                })
                let count = 8;
                let angle = 360/count;
                let radius = 100;
                let array = []
                let pt0 = cc.v2(0, 0);
                for (let i = 0; i < (count - 1) * 2; i++){
                    if(i == 0){
                        array.push(pt0)
                        pt0 = cc.v2(radius, 0)
                    }else{
                        array.push(pt0)
                        pt0 = pt0.rotate(angle)
                    }
                }
                let seq = cc.sequence(cc.moveTo(1, _w*0.5, _h*0.7), cc.cardinalSplineBy(5, array, 0), cc.moveTo(1, _w + 32, _h*0.7));
                _elf.node.runAction(seq);
            }
        }

        if(this.gamePro.timer >= 2000 && this.gamePro.timer < 2140 ){
            if(this.gamePro.timer %10 == 0){
                let _elf = this.creatElf({
                    x: _w - 16,
                    y: _h * 0.7,
                    spriteType: 3,
                    bullteType: 101,
                    moveDirection: -1,          //不进行移动
                    bullteInterval: 200,
                })
                let count = 8;
                let angle = 360/count;
                let radius = 100;
                let array = []
                let pt0 = cc.v2(0, 0);
                for (let i = 0; i < (count - 1) * 2; i++){
                    if(i == 0){
                        array.push(pt0)
                        pt0 = cc.v2(-radius, 0)
                    }else{
                        array.push(pt0)
                        pt0 = pt0.rotate(-angle)
                    }
                }
                let seq = cc.sequence(cc.moveTo(1, _w*0.5, _h*0.7), cc.cardinalSplineBy(5, array, 0), cc.moveTo(1, -32, _h*0.7));
                _elf.node.runAction(seq);
            }
        }

        if(this.gamePro.timer >= 2300 && this.gamePro.timer < 2400 ){
            if(this.gamePro.timer %10 == 0){
                {
                    let _elf = this.creatElf({
                        x: _w * 0 + 16,
                        y: _h * 0.7,
                        spriteType: 3,
                        bullteType: 101,
                        moveDirection: -1,          //不进行移动
                        bullteInterval: 200,
                    })
                    let count = 8;
                    let angle = 360/count;
                    let radius = 100;
                    let array = []
                    let pt0 = cc.v2(0, 0);
                    for (let i = 0; i < (count - 1) * 2; i++){
                        if(i == 0){
                            array.push(pt0)
                            pt0 = cc.v2(radius, 0)
                        }else{
                            array.push(pt0)
                            pt0 = pt0.rotate(angle)
                        }
                    }
                    let seq = cc.sequence(cc.moveTo(1, _w*0.5, _h*0.7), cc.cardinalSplineBy(5, array, 0), cc.moveTo(1, _w + 32, _h*0.7));
                    _elf.node.runAction(seq);
                }

                {
                    let _elf = this.creatElf({
                        x: _w - 16,
                        y: _h * 0.7,
                        spriteType: 3,
                        bullteType: 101,
                        moveDirection: -1,          //不进行移动
                        bullteInterval: 200,
                    })
                    let count = 8;
                    let angle = 360/count;
                    let radius = 100;
                    let array = []
                    let pt0 = cc.v2(0, 0);
                    for (let i = 0; i < (count - 1) * 2; i++){
                        if(i == 0){
                            array.push(pt0)
                            pt0 = cc.v2(-radius, 0)
                        }else{
                            array.push(pt0)
                            pt0 = pt0.rotate(-angle)
                        }
                    }
                    let seq = cc.sequence(cc.moveTo(1, _w*0.5, _h*0.7), cc.cardinalSplineBy(5, array, 0), cc.moveTo(1, -32, _h*0.7));
                    _elf.node.runAction(seq);
                }
            }
        }

        if (this.gamePro.timer >= 2700 && this.gamePro.timer < 3300) {

            if (this.gamePro.timer % 150 == 0) {
                for (let i = 1; i <= 5; i++) {
                    let x = _w * 0.1 * (i * 2 - 1)
                    let y = _h - 16
                    let y2 = _h * 0.8
                    let movex = -64
                    if (i == 2 || i == 4) {
                        y2 = _h * 0.7
                        movex = _w + 64
                    }
                    let _elf = this.creatElf({
                        x: x,
                        y: y,
                        spriteType: 1,              // elf2
                        bullteType: 402,
                        bullteColor: 8,
                        bullteSpeed: 3,
                        moveDirection: -1,          // 不进行移动
                        preheat: true,              // 启用武器预热（移动时不进行开火
                        bullteInterval: 150,
                    })
                    let rdTime1 = this.random_num(1, 1.5)
                    let rdx1 = this.random_num(-50, 50)
                    let rdy1 = this.random_num(-50, 50)
                    let rdTime2 = this.random_num(1, 1.5)
                    let rdx2 = this.random_num(-50, 50)
                    let rdy2 = this.random_num(-50, 50)
                    let rdTime3 = this.random_num(1, 1.5)
                    let rdx3 = this.random_num(-50, 50)
                    let rdy3 = this.random_num(-50, 50)
                    let anim = _elf.node.getComponent(cc.Animation);
                    let moveType = ''
                    //判断边界
                    let f1 = cc.callFunc(() => {
                        anim.play('Elf2-move')
                        _elf.preheat = false;
                    });
                    let f2 = cc.callFunc(() => {
                        _elf.preheat = true;
                        if (_elf.node.x + rdx1 >= _w - 32 || _elf.node.x + rdx1 <= 32) {
                            rdx1 = rdx1 * -1
                        }
                        if (_elf.node.y + rdy1 >= _h - 32 || _elf.node.y + rdy1 <= 32) {
                            rdy1 = rdy1 * -1
                        }
                        if (rdx1 < 0) {
                            moveType = 'Elf2-moveLeft'
                        } else if (rdx1 > 0) {
                            moveType = 'Elf2-moveRight'
                        } else {
                            moveType = 'Elf2-move'
                        }
                        anim.play(moveType)
                    });
                    let f3 = cc.callFunc(() => {
                        _elf.preheat = true;
                        if (_elf.node.x + rdx2 >= _w - 32 || _elf.node.x + rdx2 <= 32) {
                            rdx2 = rdx2 * -1
                        }
                        if (_elf.node.y + rdy2 >= _h - 32 || _elf.node.y + rdy2 <= 32) {
                            rdy2 = rdy2 * -1
                        }
                        if (rdx2 < 0) {
                            moveType = 'Elf2-moveLeft'
                        } else if (rdx2 > 0) {
                            moveType = 'Elf2-moveRight'
                        } else {
                            moveType = 'Elf2-move'
                        }
                        anim.play(moveType)
                    });
                    let f4 = cc.callFunc(() => {
                        _elf.preheat = true;
                        if (rdx3 < 0) {
                            moveType = 'Elf2-moveLeft'
                        } else if (rdx3 > 0) {
                            moveType = 'Elf2-moveRight'
                        } else {
                            moveType = 'Elf2-move'
                        }
                        anim.play(moveType)
                    });
                    let f5 = cc.callFunc(() => {
                        _elf.preheat = true;
                        //折返
                        if (_elf.node.x >= _w / 2) {
                            moveType = 'Elf2-moveLeft'
                            movex = -64
                        } else {
                            moveType = 'Elf2-moveRight'
                            movex = _w + 64
                        }
                    });
                    // 随机移动2次后退场
                    let seq = cc.sequence(
                        cc.moveTo(2, x, y2), f1,
                        cc.moveBy(1, 0, 0), f2,
                        cc.moveBy(rdTime1, rdx1, rdy1), f1,
                        cc.moveBy(1, 0, 0), f3,
                        cc.moveBy(rdTime2, rdx2, rdy2), f1,
                        cc.moveBy(1, 0, 0), f4,
                        cc.moveBy(rdTime3, rdx3, rdy3), f1,
                        cc.moveBy(1, 0, 0), f5,
                        cc.moveTo(4, movex, y2),
                    )
                    _elf.node.runAction(seq);
                }
            }

            if(this.gamePro.timer % 20 == 0){

                let rdx = this.random_num(32, _w - 32)
                let rdTime1 = this.random_num(5, 6)

                let _elf = this.creatElf({
                    x: rdx,
                    y: _h - 16,
                    spriteType: 3,              // elf2
                    bullteType: -1,
                    moveDirection: -1,          // 不进行移动
                    bullteInterval: 9999,
                })

                let f2 = cc.callFunc(() => {
                    // anim.play('Elf2-move')
                });

                let seq = cc.sequence(cc.moveTo(rdTime1, rdx, -32), f2);
                _elf.node.runAction(seq);

            }

        }

        if (this.gamePro.timer >= 3000 && this.gamePro.timer < 3600) {

            if (this.gamePro.timer % 150 == 0) {
                for (let i = 1; i <= 5; i++) {
                    let x = _w * 0.1 * (i * 2 - 1)
                    let y = _h - 16
                    let y2 = _h * 0.7
                    let movex = -64
                    if (i == 2 || i == 4) {
                        y2 = _h * 0.8
                        movex = _w + 64
                    }
                    let _elf = this.creatElf({
                        x: x,
                        y: y,
                        spriteType: 1,              // elf2
                        bullteType: 402,
                        bullteColor: 8,
                        bullteSpeed: 3,
                        moveDirection: -1,          // 不进行移动
                        preheat: true,              // 启用武器预热（移动时不进行开火
                        bullteInterval: 150,
                    })
                    let rdTime1 = this.random_num(1, 1.5)
                    let rdx1 = this.random_num(-50, 50)
                    let rdy1 = this.random_num(-50, 50)
                    let rdTime2 = this.random_num(1, 1.5)
                    let rdx2 = this.random_num(-50, 50)
                    let rdy2 = this.random_num(-50, 50)
                    let rdTime3 = this.random_num(1, 1.5)
                    let rdx3 = this.random_num(-50, 50)
                    let rdy3 = this.random_num(-50, 50)
                    let anim = _elf.node.getComponent(cc.Animation);
                    let moveType = ''
                    //判断边界
                    let f1 = cc.callFunc(() => {
                        anim.play('Elf2-move')
                        _elf.preheat = false;
                    });
                    let f2 = cc.callFunc(() => {
                        _elf.preheat = true;
                        if (_elf.node.x + rdx1 >= _w - 32 || _elf.node.x + rdx1 <= 32) {
                            rdx1 = rdx1 * -1
                        }
                        if (_elf.node.y + rdy1 >= _h - 32 || _elf.node.y + rdy1 <= 32) {
                            rdy1 = rdy1 * -1
                        }
                        if (rdx1 < 0) {
                            moveType = 'Elf2-moveLeft'
                        } else if (rdx1 > 0) {
                            moveType = 'Elf2-moveRight'
                        } else {
                            moveType = 'Elf2-move'
                        }
                        anim.play(moveType)
                    });
                    let f3 = cc.callFunc(() => {
                        _elf.preheat = true;
                        if (_elf.node.x + rdx2 >= _w - 32 || _elf.node.x + rdx2 <= 32) {
                            rdx2 = rdx2 * -1
                        }
                        if (_elf.node.y + rdy2 >= _h - 32 || _elf.node.y + rdy2 <= 32) {
                            rdy2 = rdy2 * -1
                        }
                        if (rdx2 < 0) {
                            moveType = 'Elf2-moveLeft'
                        } else if (rdx2 > 0) {
                            moveType = 'Elf2-moveRight'
                        } else {
                            moveType = 'Elf2-move'
                        }
                        anim.play(moveType)
                    });
                    let f4 = cc.callFunc(() => {
                        _elf.preheat = true;
                        if (rdx3 < 0) {
                            moveType = 'Elf2-moveLeft'
                        } else if (rdx3 > 0) {
                            moveType = 'Elf2-moveRight'
                        } else {
                            moveType = 'Elf2-move'
                        }
                        anim.play(moveType)
                    });
                    let f5 = cc.callFunc(() => {
                        _elf.preheat = true;
                        //折返
                        if (_elf.node.x >= _w / 2) {
                            moveType = 'Elf2-moveLeft'
                            movex = -64
                        } else {
                            moveType = 'Elf2-moveRight'
                            movex = _w + 64
                        }
                    });
                    // 随机移动2次后退场
                    let seq = cc.sequence(
                        cc.moveTo(2, x, y2), f1,
                        cc.moveBy(1, 0, 0), f2,
                        cc.moveBy(rdTime1, rdx1, rdy1), f1,
                        cc.moveBy(1, 0, 0), f3,
                        cc.moveBy(rdTime2, rdx2, rdy2), f1,
                        cc.moveBy(1, 0, 0), f4,
                        cc.moveBy(rdTime3, rdx3, rdy3), f1,
                        cc.moveBy(1, 0, 0), f5,
                        cc.moveTo(4, movex, y2),
                    )
                    _elf.node.runAction(seq);
                }
            }

            if(this.gamePro.timer % 20 == 0){

                let rdx = this.random_num(32, _w - 32)
                let rdTime1 = this.random_num(5, 6)

                let _elf = this.creatElf({
                    x: rdx,
                    y: _h - 16,
                    spriteType: 3,              // elf2
                    bullteType: -1,
                    moveDirection: -1,          // 不进行移动
                    bullteInterval: 9999,
                })

                let f2 = cc.callFunc(() => {
                    // anim.play('Elf2-move')
                });

                let seq = cc.sequence(cc.moveTo(rdTime1, rdx, -32), f2);
                _elf.node.runAction(seq);

            }

        }

        if (this.gamePro.timer >= 3850 && this.gamePro.timer < 4030) {
            if(this.gamePro.timer % 10 == 0){
                this.chapterOneCache.elfs4s_count_32 ++
                let x = this.chapterOneCache.elfs4s_count_32 * 32 + 16
                let _elf = this.creatElf({
                    x: x,
                    y: _h - 16,
                    spriteType: 3,              // elf4
                    bullteType: -1,
                    moveDirection: -1,          // 不进行移动
                    bullteInterval: 9999,
                })
                let f2 = cc.callFunc(() => {
                    // anim.play('Elf2-move')
                });
                let seq = cc.sequence(cc.moveTo(8, x, -32), f2);
                _elf.node.runAction(seq);
            }
            if(this.gamePro.timer == 4020){
                //创建一个旋转弹幕
                let _elf = this.creatElf({
                    x: 16,
                    y: _h * 0.7,
                    hp: 50,
                    score: 500,
                    spriteType: 1,              // elf2
                    preheat: true,
                    bullteType: 202,
                    moveDirection: -1,          // 不进行移动
                    bullteInterval: 10,
                    fireTimer: 200,             // 攻击200timer
                })
                let anim = _elf.node.getComponent(cc.Animation);
                let f2 = cc.callFunc(() => {
                    _elf.preheat = false;       // 预热完成，开火
                });
                let f3 = cc.callFunc(() => {
                    anim.play('Elf2-moveLeft')
                });
                let seq = cc.sequence(cc.moveTo(1.5, _w * 0.3, _h * 0.7), f2, cc.moveTo(3, _w * 0.3, _h * 0.7), f3, cc.moveTo(1.5, -16, _h * 0.7));
                _elf.node.runAction(seq);
            }
        }

        if (this.gamePro.timer >= 4025 && this.gamePro.timer < 4200) {
            if(this.gamePro.timer % 10 == 0){
                this.chapterOneCache.elfs4s_count_32 --
                let x = this.chapterOneCache.elfs4s_count_32 * 32 + 16
                let _elf = this.creatElf({
                    x: x,
                    y: _h - 16,
                    spriteType: 3,              // elf2
                    bullteType: -1,
                    moveDirection: -1,          // 不进行移动
                    bullteInterval: 9999,
                })
                let f2 = cc.callFunc(() => {
                    // anim.play('Elf2-move')
                });
                let seq = cc.sequence(cc.moveTo(8, x, -32), f2);
                _elf.node.runAction(seq);
            }
            if(this.gamePro.timer == 4190){
                //创建一个旋转弹幕
                let _elf = this.creatElf({
                    x: _w - 16,
                    y: _h * 0.7,
                    hp: 50,
                    score: 500,
                    spriteType: 1,              // elf2
                    preheat: true,
                    bullteType: 202,
                    moveDirection: -1,          // 不进行移动
                    bullteInterval: 10,
                    fireTimer: 200,             // 攻击200timer
                })
                let anim = _elf.node.getComponent(cc.Animation);
                let f2 = cc.callFunc(() => {
                    _elf.preheat = false;       // 预热完成，开火
                });
                let f3 = cc.callFunc(() => {
                    anim.play('Elf2-moveRight')
                });
                let seq = cc.sequence(cc.moveTo(1.5, _w * 0.7, _h * 0.7), f2, cc.moveTo(3, _w * 0.7, _h * 0.7), f3, cc.moveTo(1.5, _w + 16, _h * 0.7));
                _elf.node.runAction(seq);
            }
        }

        if (this.gamePro.timer >= 4195 && this.gamePro.timer < 4370) {
            if(this.gamePro.timer % 10 == 0){
                this.chapterOneCache.elfs4s_count_32 ++
                let x = this.chapterOneCache.elfs4s_count_32 * 32 + 16
                let _elf = this.creatElf({
                    x: x,
                    y: _h - 16,
                    spriteType: 3,              // elf2
                    bullteType: -1,
                    moveDirection: -1,          // 不进行移动
                    bullteInterval: 9999,
                })
                let f2 = cc.callFunc(() => {
                    // anim.play('Elf2-move')
                });
                let seq = cc.sequence(cc.moveTo(8, x, -32), f2);
                _elf.node.runAction(seq);
            }

            if(this.gamePro.timer == 4360){
                //创建一个旋转弹幕
                let _elf = this.creatElf({
                    x: 16,
                    y: _h * 0.7,
                    hp: 50,
                    score: 500,
                    spriteType: 1,              // elf2
                    preheat: true,
                    bullteType: 202,
                    moveDirection: -1,          // 不进行移动
                    bullteInterval: 10,
                    fireTimer: 200,             // 攻击200timer
                })
                let anim = _elf.node.getComponent(cc.Animation);
                let f2 = cc.callFunc(() => {
                    _elf.preheat = false;       // 预热完成，开火
                });
                let f3 = cc.callFunc(() => {
                    anim.play('Elf2-moveLeft')
                });
                let seq = cc.sequence(cc.moveTo(1.5, _w * 0.3, _h * 0.7), f2, cc.moveTo(3, _w * 0.3, _h * 0.7), f3, cc.moveTo(1.5, -16, _h * 0.7));
                _elf.node.runAction(seq);
            }
        }

        if (this.gamePro.timer >= 4365 && this.gamePro.timer < 4540) {
            if(this.gamePro.timer % 10 == 0){
                this.chapterOneCache.elfs4s_count_32 --
                let x = this.chapterOneCache.elfs4s_count_32 * 32 + 16
                let _elf = this.creatElf({
                    x: x,
                    y: _h - 16,
                    spriteType: 3,              // elf2
                    bullteType: -1,
                    moveDirection: -1,          // 不进行移动
                    bullteInterval: 9999,
                })
                let f2 = cc.callFunc(() => {
                    // anim.play('Elf2-move')
                });
                let seq = cc.sequence(cc.moveTo(8, x, -32), f2);
                _elf.node.runAction(seq);
            }

            if(this.gamePro.timer == 4530){
                //创建一个旋转弹幕
                let _elf = this.creatElf({
                    x: _w - 16,
                    y: _h * 0.7,
                    hp: 50,
                    score: 500,
                    spriteType: 1,              // elf2
                    preheat: true,
                    bullteType: 202,
                    moveDirection: -1,          // 不进行移动
                    bullteInterval: 10,
                    fireTimer: 200,             // 攻击200timer
                })
                let anim = _elf.node.getComponent(cc.Animation);
                let f2 = cc.callFunc(() => {
                    _elf.preheat = false;       // 预热完成，开火
                });
                let f3 = cc.callFunc(() => {
                    anim.play('Elf2-moveRight')
                });
                let seq = cc.sequence(cc.moveTo(1.5, _w * 0.7, _h * 0.7), f2, cc.moveTo(3, _w * 0.7, _h * 0.7), f3, cc.moveTo(1.5, _w + 16, _h * 0.7));
                _elf.node.runAction(seq);
            }
        }

        // //-5000

        //创建琪露诺 5060

        // Cirno
        if (this.gamePro.timer == 5060) {
            let x = 16
            let y = _h - 16
            let _elf = this.creatElf({
                x: 16,
                y: y,
                hp: 2000,  //每次2K
                spriteType: 'cirno',
                bullteType: -1,
                moveDirection: -1,
                bullteInterval: -1,
                immune: true,       //出场无敌
            })
            let anim = _elf.node.getComponent(cc.Animation);
            let f1 = cc.callFunc(() => {
                anim.play('Cirno-moveRight')
            });
            let f2 = cc.callFunc(() => {
                anim.play('Cirno-move')
                //初始化timer为0
                _elf._timer = 0
                this.resetCirno()
            });

            this.chapterOneCache.cirnoPro = _elf

            //-- 2019年1月21日16:43:14
            // 测试第8张符卡
            this.chapterOneCache.cirnoPro.state = 0

            let array = [cc.v2(x, y), cc.v2(_w * 0.5, _h * 0.7), cc.v2(_w * 0.8, _h * 0.8)];
            let seq = cc.sequence( f1,  cc.cardinalSplineTo(2, array, 0), f2);
            _elf.node.runAction(seq);

            this.hpBar.x = 30
            this.hpBar.getChildByName("card").getComponent(cc.Label).string = '冻符「Cold Divinity」'

        }

        //增加血条
        if (this.chapterOneCache.cirnoPro.immune) {
            if(this.hpBar.width<= 580)
                this.hpBar.width += 5
            else{
                this.chapterOneCache.cirnoPro.immune = false
            }
        }

        // null为不存在 0为死亡
        if(this.chapterOneCache.cirnoPro.state){
            this.loadCirno(this.chapterOneCache.cirnoPro.state)
        }

        //
        // if(this.gamePro.timer >= 400 && this.gamePro.timer <= 1000){
        //     let rd = this.random_num(this.node.width* 0.1, this.node.width * 0.9)
        //
        //     if(this.gamePro.timer % 30 == 0){
        //
        //         this.creatElf({
        //             x: rd,
        //             y: this.node.height,
        //             moveSpeed: 4,
        //             bullteSpeed: 3,
        //             bullteType: 401,
        //             moveDirection: 113,
        //             bullteInterval: 200,
        //             fireTimer: 200,  //有限的开火时间
        //             preheat: true,     //启用武器预热
        //         })
        //     }
        //
        // }

    },


    /**
     * 随机数 传数字区间
     * @param smin		最小值
     * @param smax		最大值
     * @returns {*}	随机值
     */
    random_num(smin, smax) {
        const Range = smax - smin;
        const Rand = Math.random();
        return smin + Math.round(Rand * Range);
    },

    /**
     * 更新妖精移动
     */
    updateElfsMove(){

        let _bullet = null
        let _uuid = 0

            // _timer: params._timer || 0,                                     // 内置timer（存活时间）
            // _timer2: params._timer2 || 0,                                   // 另一个内置timer
            // backTimer: params.backTimer || 0,                               // 折返时间（启用后到达目的X时间后折返）
            // fireTimer: params.fireTimer || 0,                               // 开火时间（开火时间结束后，停止开火）
            // preheatTimer: params.preheatTimer || 0,                         // 预热时间（预热时间到达前，不会开火）

        for(let i=0; i<this.elfs.length; i++){

            // 计时
            this.elfs[i]._timer ++

            /**
             * moveTypes
             */
            {
                // if(this.elfs[i].moveDirection == 100){
                //     //↓ 从起始位置向下移动
                //     this.elfs[i].y -= this.elfs[i].moveSpeed
                // }else if(this.elfs[i].moveDirection == 101){
                //     //↓ 从起始位置向下移动至屏幕10%位置
                //     if(this.elfs[i].y >= this.node.height * (1-0.1))    this.elfs[i].y -= this.elfs[i].moveSpeed
                // }else if(this.elfs[i].moveDirection == 102){
                //     //↓ 从起始位置向下移动至屏幕20%位置
                //     if(this.elfs[i].y >= this.node.height * (1-0.2))    this.elfs[i].y -= this.elfs[i].moveSpeed
                // }else if(this.elfs[i].moveDirection == 103){
                //     //↓ 从起始位置向下移动至屏幕30%位置
                //     if(this.elfs[i].y >= this.node.height * (1-0.3))    this.elfs[i].y -= this.elfs[i].moveSpeed
                // }else if(this.elfs[i].moveDirection == 104){
                //     //↓ 从起始位置向下移动至屏幕40%位置
                //     if(this.elfs[i].y >= this.node.height * (1-0.4))    this.elfs[i].y -= this.elfs[i].moveSpeed
                // }else if(this.elfs[i].moveDirection == 105){
                //     //↓ 从起始位置向下移动至屏幕50%位置
                //     if(this.elfs[i].y >= this.node.height * (1-0.5))    this.elfs[i].y -= this.elfs[i].moveSpeed
                // }else if(this.elfs[i].moveDirection == 111){
                //     //↓ 从起始位置向下移动至屏幕10%位置后停滞1秒后折返
                //     if(this.elfs[i].moveFlag == 1){
                //         if(this.elfs[i].y >= this.node.height * (1-0.1))    this.elfs[i].y -= this.elfs[i].moveSpeed
                //         else{
                //             this.elfs[i].preheat = false
                //             this.elfs[i].moveFlag = 2
                //         }
                //     }else if(this.elfs[i].moveFlag == 2){
                //         this.elfs[i]._timer2 ++
                //         if(this.elfs[i]._timer2 >= this.elfs[i].backTimer)  this.elfs[i].moveFlag = 3
                //     }else if(this.elfs[i].moveFlag == 3){
                //         this.elfs[i].y += this.elfs[i].moveSpeed
                //     }
                // }else if(this.elfs[i].moveDirection == 112){
                //     //↓ 从起始位置向下移动至屏幕20%位置后停滞1秒后折返
                //     if(this.elfs[i].moveFlag == 1){
                //         if(this.elfs[i].y >= this.node.height * (1-0.2))    this.elfs[i].y -= this.elfs[i].moveSpeed
                //         else{
                //             this.elfs[i].preheat = false
                //             this.elfs[i].moveFlag = 2
                //         }
                //     }else if(this.elfs[i].moveFlag == 2){
                //         this.elfs[i]._timer2 ++
                //         if(this.elfs[i]._timer2 >= this.elfs[i].backTimer)  this.elfs[i].moveFlag = 3
                //     }else if(this.elfs[i].moveFlag == 3){
                //         this.elfs[i].y += this.elfs[i].moveSpeed
                //     }
                // }else if(this.elfs[i].moveDirection == 113){
                //     //↓ 从起始位置向下移动至屏幕30%位置后停滞1秒后折返
                //     if(this.elfs[i].moveFlag == 1){
                //         if(this.elfs[i].y >= this.node.height * (1-0.3))    this.elfs[i].y -= this.elfs[i].moveSpeed
                //         else{
                //             this.elfs[i].preheat = false
                //             this.elfs[i].moveFlag = 2
                //         }
                //     }else if(this.elfs[i].moveFlag == 2){
                //         this.elfs[i]._timer2 ++
                //         if(this.elfs[i]._timer2 >= this.elfs[i].backTimer)  this.elfs[i].moveFlag = 3
                //     }else if(this.elfs[i].moveFlag == 3){
                //         this.elfs[i].y += this.elfs[i].moveSpeed
                //     }
                // }else if(this.elfs[i].moveDirection == 114){
                //     //↓ 从起始位置向下移动至屏幕40%位置后停滞1秒后折返
                //     if(this.elfs[i].moveFlag == 1){
                //         if(this.elfs[i].y >= this.node.height * (1-0.4))    this.elfs[i].y -= this.elfs[i].moveSpeed
                //         else{
                //             this.elfs[i].preheat = false
                //             this.elfs[i].moveFlag = 2
                //         }
                //     }else if(this.elfs[i].moveFlag == 2){
                //         this.elfs[i]._timer2 ++
                //         if(this.elfs[i]._timer2 >= this.elfs[i].backTimer)  this.elfs[i].moveFlag = 3
                //     }else if(this.elfs[i].moveFlag == 3){
                //         this.elfs[i].y += this.elfs[i].moveSpeed
                //     }
                // }else if(this.elfs[i].moveDirection == 115){
                //     //↓ 从起始位置向下移动至屏幕50%位置后停滞1秒后折返
                //     if(this.elfs[i].moveFlag == 1){
                //         if(this.elfs[i].y >= this.node.height * (1-0.5))    this.elfs[i].y -= this.elfs[i].moveSpeed
                //         else{
                //             this.elfs[i].preheat = false
                //             this.elfs[i].moveFlag = 2
                //         }
                //     }else if(this.elfs[i].moveFlag == 2){
                //         this.elfs[i]._timer2 ++
                //         if(this.elfs[i]._timer2 >= this.elfs[i].backTimer)  this.elfs[i].moveFlag = 3
                //     }else if(this.elfs[i].moveFlag == 3){
                //         this.elfs[i].y += this.elfs[i].moveSpeed
                //     }
                // }else if(this.elfs[i].moveDirection == 200){
                //     //↑ 从起始位置向上移动
                //     this.elfs[i].y += this.elfs[i].moveSpeed
                // }else if(this.elfs[i].moveDirection == 201){
                //     //↑ 从起始位置向上移动至屏幕10%位置
                //     if(this.elfs[i].y <= this.node.height * (1-0.1))    this.elfs[i].y += this.elfs[i].moveSpeed
                // }else if(this.elfs[i].moveDirection == 202){
                //     //↑ 从起始位置向上移动至屏幕20%位置
                //     if(this.elfs[i].y <= this.node.height * (1-0.2))    this.elfs[i].y += this.elfs[i].moveSpeed
                // }else if(this.elfs[i].moveDirection == 203){
                //     //↑ 从起始位置向上移动至屏幕30%位置
                //     if(this.elfs[i].y <= this.node.height * (1-0.3))    this.elfs[i].y += this.elfs[i].moveSpeed
                // }else if(this.elfs[i].moveDirection == 204){
                //     //↑ 从起始位置向上移动至屏幕40%位置
                //     if(this.elfs[i].y <= this.node.height * (1-0.4))    this.elfs[i].y += this.elfs[i].moveSpeed
                // }else if(this.elfs[i].moveDirection == 205){
                //     //↑ 从起始位置向上移动至屏幕50%位置
                //     if(this.elfs[i].y <= this.node.height * (1-0.5))    this.elfs[i].y += this.elfs[i].moveSpeed
                // }else if(this.elfs[i].moveDirection == 211){
                //     //↓ 从起始位置向下移动至屏幕10%位置后停滞1秒后折返
                //     if(this.elfs[i].moveFlag == 1){
                //         if(this.elfs[i].y <= this.node.height * (1-0.1))    this.elfs[i].y += this.elfs[i].moveSpeed
                //         else{
                //             this.elfs[i].preheat = false
                //             this.elfs[i].moveFlag = 2
                //         }
                //     }else if(this.elfs[i].moveFlag == 2){
                //         this.elfs[i]._timer2 ++
                //         if(this.elfs[i]._timer2 >= this.elfs[i].backTimer)  this.elfs[i].moveFlag = 3
                //     }else if(this.elfs[i].moveFlag == 3){
                //         this.elfs[i].y -= this.elfs[i].moveSpeed
                //     }
                // }else if(this.elfs[i].moveDirection == 212){
                //     //↓ 从起始位置向下移动至屏幕20%位置后停滞1秒后折返
                //     if(this.elfs[i].moveFlag == 1){
                //         if(this.elfs[i].y <= this.node.height * (1-0.2))    this.elfs[i].y += this.elfs[i].moveSpeed
                //         else{
                //             this.elfs[i].preheat = false
                //             this.elfs[i].moveFlag = 2
                //         }
                //     }else if(this.elfs[i].moveFlag == 2){
                //         this.elfs[i]._timer2 ++
                //         if(this.elfs[i]._timer2 >= this.elfs[i].backTimer)  this.elfs[i].moveFlag = 3
                //     }else if(this.elfs[i].moveFlag == 3){
                //         this.elfs[i].y -= this.elfs[i].moveSpeed
                //     }
                // }else if(this.elfs[i].moveDirection == 213){
                //     //↓ 从起始位置向下移动至屏幕30%位置后停滞1秒后折返
                //     if(this.elfs[i].moveFlag == 1){
                //         if(this.elfs[i].y <= this.node.height * (1-0.3))    this.elfs[i].y += this.elfs[i].moveSpeed
                //         else{
                //             this.elfs[i].preheat = false
                //             this.elfs[i].moveFlag = 2
                //         }
                //     }else if(this.elfs[i].moveFlag == 2){
                //         this.elfs[i]._timer2 ++
                //         if(this.elfs[i]._timer2 >= this.elfs[i].backTimer)  this.elfs[i].moveFlag = 3
                //     }else if(this.elfs[i].moveFlag == 3){
                //         this.elfs[i].y -= this.elfs[i].moveSpeed
                //     }
                // }else if(this.elfs[i].moveDirection == 214){
                //     //↓ 从起始位置向下移动至屏幕40%位置后停滞1秒后折返
                //     if(this.elfs[i].moveFlag == 1){
                //         if(this.elfs[i].y <= this.node.height * (1-0.4))    this.elfs[i].y += this.elfs[i].moveSpeed
                //         else{
                //             this.elfs[i].preheat = false
                //             this.elfs[i].moveFlag = 2
                //         }
                //     }else if(this.elfs[i].moveFlag == 2){
                //         this.elfs[i]._timer2 ++
                //         if(this.elfs[i]._timer2 >= this.elfs[i].backTimer)  this.elfs[i].moveFlag = 3
                //     }else if(this.elfs[i].moveFlag == 3){
                //         this.elfs[i].y -= this.elfs[i].moveSpeed
                //     }
                // }else if(this.elfs[i].moveDirection == 215){
                //     //↓ 从起始位置向下移动至屏幕50%位置后停滞1秒后折返
                //     if(this.elfs[i].moveFlag == 1){
                //         if(this.elfs[i].y <= this.node.height * (1-0.5))    this.elfs[i].y += this.elfs[i].moveSpeed
                //         else{
                //             this.elfs[i].preheat = false
                //             this.elfs[i].moveFlag = 2
                //         }
                //     }else if(this.elfs[i].moveFlag == 2){
                //         this.elfs[i]._timer2 ++
                //         if(this.elfs[i]._timer2 >= this.elfs[i].backTimer)  this.elfs[i].moveFlag = 3
                //     }else if(this.elfs[i].moveFlag == 3){
                //         this.elfs[i].y -= this.elfs[i].moveSpeed
                //     }
                // }
                // else if(this.elfs[i].moveDirection == 300){
                //     //← 从起始位置向左移动
                //     this.elfs[i].x -= this.elfs[i].moveSpeed
                // }else if(this.elfs[i].moveDirection == 301){
                //     //← 从起始位置向左移动至屏幕10%位置
                //     if(this.elfs[i].x >= this.node.width * 0.1)    this.elfs[i].x -= this.elfs[i].moveSpeed
                // }else if(this.elfs[i].moveDirection == 302){
                //     //← 从起始位置向左移动至屏幕20%位置
                //     if(this.elfs[i].x >= this.node.width * 0.2)    this.elfs[i].x -= this.elfs[i].moveSpeed
                // }else if(this.elfs[i].moveDirection == 303){
                //     //← 从起始位置向左移动至屏幕30%位置
                //     if(this.elfs[i].x >= this.node.width * 0.3)    this.elfs[i].x -= this.elfs[i].moveSpeed
                // }else if(this.elfs[i].moveDirection == 304){
                //     //← 从起始位置向左移动至屏幕40%位置
                //     if(this.elfs[i].x >= this.node.width * 0.4)    this.elfs[i].x -= this.elfs[i].moveSpeed
                // }else if(this.elfs[i].moveDirection == 305){
                //     //← 从起始位置向左移动至屏幕50%位置
                //     if(this.elfs[i].x >= this.node.width * 0.5)    this.elfs[i].x -= this.elfs[i].moveSpeed
                // }else if(this.elfs[i].moveDirection == 311){
                //     //← 从起始位置向左移动至屏幕10%位置后折返
                //     if(this.elfs[i].moveFlag == 1){
                //         if(this.elfs[i].x >= this.node.width * 0.1)    this.elfs[i].x -= this.elfs[i].moveSpeed
                //         else{
                //             this.elfs[i].preheat = false
                //             this.elfs[i].moveFlag = 2
                //         }
                //     }else if(this.elfs[i].moveFlag == 2){
                //         this.elfs[i]._timer2 ++
                //         if(this.elfs[i]._timer2 >= this.elfs[i].backTimer)  this.elfs[i].moveFlag = 3
                //     }else if(this.elfs[i].moveFlag == 3){
                //         this.elfs[i].x += this.elfs[i].moveSpeed
                //     }
                // }else if(this.elfs[i].moveDirection == 312){
                //     //← 从起始位置向左移动至屏幕20%位置后折返
                //     if(this.elfs[i].moveFlag == 1){
                //         if(this.elfs[i].x >= this.node.width * 0.2)    this.elfs[i].x -= this.elfs[i].moveSpeed
                //         else{
                //             this.elfs[i].preheat = false
                //             this.elfs[i].moveFlag = 2
                //         }
                //     }else if(this.elfs[i].moveFlag == 2){
                //         this.elfs[i]._timer2 ++
                //         if(this.elfs[i]._timer2 >= this.elfs[i].backTimer)  this.elfs[i].moveFlag = 3
                //     }else if(this.elfs[i].moveFlag == 3){
                //         this.elfs[i].x += this.elfs[i].moveSpeed
                //     }
                // }else if(this.elfs[i].moveDirection == 313){
                //     //← 从起始位置向左移动至屏幕30%位置后折返
                //     if(this.elfs[i].moveFlag == 1){
                //         if(this.elfs[i].x >= this.node.width * 0.3)    this.elfs[i].x -= this.elfs[i].moveSpeed
                //         else{
                //             this.elfs[i].preheat = false
                //             this.elfs[i].moveFlag = 2
                //         }
                //     }else if(this.elfs[i].moveFlag == 2){
                //         this.elfs[i]._timer2 ++
                //         if(this.elfs[i]._timer2 >= this.elfs[i].backTimer)  this.elfs[i].moveFlag = 3
                //     }else if(this.elfs[i].moveFlag == 3){
                //         this.elfs[i].x += this.elfs[i].moveSpeed
                //     }
                // }else if(this.elfs[i].moveDirection == 314){
                //     //← 从起始位置向左移动至屏幕40%位置后折返
                //     if(this.elfs[i].moveFlag == 1){
                //         if(this.elfs[i].x >= this.node.width * 0.4)    this.elfs[i].x -= this.elfs[i].moveSpeed
                //         else{
                //             this.elfs[i].preheat = false
                //             this.elfs[i].moveFlag = 2
                //         }
                //     }else if(this.elfs[i].moveFlag == 2){
                //         this.elfs[i]._timer2 ++
                //         if(this.elfs[i]._timer2 >= this.elfs[i].backTimer)  this.elfs[i].moveFlag = 3
                //     }else if(this.elfs[i].moveFlag == 3){
                //         this.elfs[i].x += this.elfs[i].moveSpeed
                //     }
                // }else if(this.elfs[i].moveDirection == 315){
                //     //← 从起始位置向左移动至屏幕10%位置后折返
                //     if(this.elfs[i].moveFlag == 1){
                //         if(this.elfs[i].x >= this.node.width * 0.5)    this.elfs[i].x -= this.elfs[i].moveSpeed
                //         else{
                //             this.elfs[i].preheat = false
                //             this.elfs[i].moveFlag = 2
                //         }
                //     }else if(this.elfs[i].moveFlag == 2){
                //         this.elfs[i]._timer2 ++
                //         if(this.elfs[i]._timer2 >= this.elfs[i].backTimer)  this.elfs[i].moveFlag = 3
                //     }else if(this.elfs[i].moveFlag == 3){
                //         this.elfs[i].x += this.elfs[i].moveSpeed
                //     }
                // }
                //
                // else if(this.elfs[i].moveDirection == 400){
                //     //→ 从起始位置向右移动
                //     this.elfs[i].x += this.elfs[i].moveSpeed
                // }else if(this.elfs[i].moveDirection == 401){
                //     //→ 从起始位置向右移动至屏幕10%位置
                //     if(this.elfs[i].x <= this.node.width * (1-0.1))    this.elfs[i].x += this.elfs[i].moveSpeed
                // }else if(this.elfs[i].moveDirection == 402){
                //     //→ 从起始位置向右移动至屏幕20%位置
                //     if(this.elfs[i].x <= this.node.width * (1-0.2))    this.elfs[i].x += this.elfs[i].moveSpeed
                // }else if(this.elfs[i].moveDirection == 403){
                //     //→ 从起始位置向右移动至屏幕30%位置
                //     if(this.elfs[i].x <= this.node.width * (1-0.3))    this.elfs[i].x += this.elfs[i].moveSpeed
                // }else if(this.elfs[i].moveDirection == 404){
                //     //→ 从起始位置向右移动至屏幕40%位置
                //     if(this.elfs[i].x <= this.node.width * (1-0.4))    this.elfs[i].x += this.elfs[i].moveSpeed
                // }else if(this.elfs[i].moveDirection == 405){
                //     //→ 从起始位置向右移动至屏幕50%位置
                //     if(this.elfs[i].x <= this.node.width * (1-0.5))    this.elfs[i].x += this.elfs[i].moveSpeed
                // }else if(this.elfs[i].moveDirection == 411){
                //     //→ 从起始位置向右移动至屏幕10%位置
                //     if(this.elfs[i].moveFlag == 1){
                //         if(this.elfs[i].x <= this.node.width * (1-0.1))    this.elfs[i].x += this.elfs[i].moveSpeed
                //         else{
                //             this.elfs[i].preheat = false
                //             this.elfs[i].moveFlag = 2
                //         }
                //     }else if(this.elfs[i].moveFlag == 2){
                //         this.elfs[i]._timer2 ++
                //         if(this.elfs[i]._timer2 >= this.elfs[i].backTimer)  this.elfs[i].moveFlag = 3
                //     }else if(this.elfs[i].moveFlag == 3){
                //         this.elfs[i].x -= this.elfs[i].moveSpeed
                //     }
                // }else if(this.elfs[i].moveDirection == 412){
                //     //→ 从起始位置向右移动至屏幕20%位置
                //     if(this.elfs[i].moveFlag == 1){
                //         if(this.elfs[i].x <= this.node.width * (1-0.2))    this.elfs[i].x += this.elfs[i].moveSpeed
                //         else{
                //             this.elfs[i].preheat = false
                //             this.elfs[i].moveFlag = 2
                //         }
                //     }else if(this.elfs[i].moveFlag == 2){
                //         this.elfs[i]._timer2 ++
                //         if(this.elfs[i]._timer2 >= this.elfs[i].backTimer)  this.elfs[i].moveFlag = 3
                //     }else if(this.elfs[i].moveFlag == 3){
                //         this.elfs[i].x -= this.elfs[i].moveSpeed
                //     }
                // }else if(this.elfs[i].moveDirection == 413){
                //     //→ 从起始位置向右移动至屏幕30%位置
                //     if(this.elfs[i].moveFlag == 1){
                //         if(this.elfs[i].x <= this.node.width * (1-0.3))    this.elfs[i].x += this.elfs[i].moveSpeed
                //         else{
                //             this.elfs[i].preheat = false
                //             this.elfs[i].moveFlag = 2
                //         }
                //     }else if(this.elfs[i].moveFlag == 2){
                //         this.elfs[i]._timer2 ++
                //         if(this.elfs[i]._timer2 >= this.elfs[i].backTimer)  this.elfs[i].moveFlag = 3
                //     }else if(this.elfs[i].moveFlag == 3){
                //         this.elfs[i].x -= this.elfs[i].moveSpeed
                //     }
                // }else if(this.elfs[i].moveDirection == 414){
                //     //→ 从起始位置向右移动至屏幕40%位置
                //     if(this.elfs[i].moveFlag == 1){
                //         if(this.elfs[i].x <= this.node.width * (1-0.4))    this.elfs[i].x += this.elfs[i].moveSpeed
                //         else{
                //             this.elfs[i].preheat = false
                //             this.elfs[i].moveFlag = 2
                //         }
                //     }else if(this.elfs[i].moveFlag == 2){
                //         this.elfs[i]._timer2 ++
                //         if(this.elfs[i]._timer2 >= this.elfs[i].backTimer)  this.elfs[i].moveFlag = 3
                //     }else if(this.elfs[i].moveFlag == 3){
                //         this.elfs[i].x -= this.elfs[i].moveSpeed
                //     }
                // }else if(this.elfs[i].moveDirection == 415){
                //     //→ 从起始位置向右移动至屏幕50%位置
                //     if(this.elfs[i].moveFlag == 1){
                //         if(this.elfs[i].x <= this.node.width * (1-0.5))    this.elfs[i].x += this.elfs[i].moveSpeed
                //         else    this.elfs[i].moveFlag = 2
                //     }else if(this.elfs[i].moveFlag == 2){
                //         this.elfs[i]._timer2 ++
                //         if(this.elfs[i]._timer2 >= this.elfs[i].backTimer)  this.elfs[i].moveFlag = 3
                //     }else if(this.elfs[i].moveFlag == 3){
                //         this.elfs[i].x -= this.elfs[i].moveSpeed
                //     }
                // }
                // else if(this.elfs[i].moveDirection == -1){
                //     console.log(-1)
                // }

            }

            /**
             * 创造弹幕
             * fireTypes
             */

            //判断弹幕是否存在
            if (this.elfs[i].visible) {

                //判断预热
                if(!this.elfs[i].preheat){

                    //判断开火时间
                    if(this.elfs[i].fireTimer > this.elfs[i]._timer){

                        let _x = 0, _y = 0, _arr = []

                        {
                            _x = this.elfs[i].node.x + this.elfs[i].offsetX + this.elfs[i].width / 2

                            _y = this.elfs[i].node.y + this.elfs[i].offsetY + this.elfs[i].height / 2

                            if (this.elfs[i].bullteType == 101) {
                                //锁定玩家的弹幕
                                if (this.gamePro.timer % this.elfs[i].bullteInterval == 0) {

                                    let mx = this.playerPro.x + this.playerPro.width / 2
                                    let my = this.playerPro.y + this.playerPro.height / 2

                                    let vx = this.elfs[i].bullteSpeed * (mx - _x) / Math.sqrt((mx - _x) * (mx - _x) + (my - _y) * (my - _y));
                                    let vy = this.elfs[i].bullteSpeed * (my - _y) / Math.sqrt((mx - _x) * (mx - _x) + (my - _y) * (my - _y));

                                    let bullet = cc.instantiate(this.bulletCircles[this.elfs[i].bullteColor]);
                                    bullet.setPosition(cc.v2(_x - this.elfs[i].width / 2, _y - this.elfs[i].height / 2));
                                    bullet.rotation = this.elfs[i].angle
                                    this.gameBg.node.addChild(bullet)
                                    let _uuid = this.getUuid()

                                    this.elfBullets.push({
                                        uuid: _uuid,
                                        node: bullet,
                                        cx: _x - this.elfs[i].width / 2,
                                        cy: _y - this.elfs[i].height / 2,
                                        type: this.elfs[i].bullteType,
                                        speed: this.elfs[i].bullteSpeed,
                                        angle: this.elfs[i].angle,
                                        vx: vx,
                                        vy: vy,
                                        visible: true
                                    })

                                }
                            } else if (this.elfs[i].bullteType == 102) {
                                //向玩家散射的弹幕 一组3个
                                if (this.gamePro.timer % this.elfs[i].bullteInterval == 0) {

                                    let __x = 0
                                    let __y = 0

                                    for(let j=0; j<3; j++){

                                        if(j == 0){
                                            __x = this.playerPro.x - this.playerPro.width * 10
                                            __y = this.playerPro.y - this.playerPro.height * 10
                                        }  if(j == 1){
                                            __x = this.playerPro.x
                                            __y = this.playerPro.y
                                        }  if(j == 2){
                                            __x = this.playerPro.x + this.playerPro.width * 5
                                            __y = this.playerPro.y + this.playerPro.height * 5
                                        }

                                        let mx = __x + this.playerPro.width / 2
                                        let my = __y + this.playerPro.height / 2

                                        let vx = this.elfs[i].bullteSpeed * (mx - _x) / Math.sqrt((mx - _x) * (mx - _x) + (my - _y) * (my - _y));
                                        let vy = this.elfs[i].bullteSpeed * (my - _y) / Math.sqrt((mx - _x) * (mx - _x) + (my - _y) * (my - _y));

                                        let bullet = cc.instantiate(this.bulletPrefabs[this.elfs[i].bullteColor]);
                                        bullet.setPosition(cc.v2(_x - this.elfs[i].width / 2, _y - this.elfs[i].height / 2));
                                        bullet.rotation = this.elfs[i].angle
                                        this.gameBg.node.addChild(bullet)
                                        let _uuid = this.getUuid()

                                        this.elfBullets.push({
                                            uuid: _uuid,
                                            node: bullet,
                                            cx: _x - this.elfs[i].width / 2,
                                            cy: _y - this.elfs[i].height / 2,
                                            type: this.elfs[i].bullteType,
                                            speed: this.elfs[i].bullteSpeed,
                                            angle: this.elfs[i].angle,
                                            vx: vx,
                                            vy: vy,
                                            visible: true
                                        })

                                    }

                                }
                            } else if (this.elfs[i].bullteType == 103) {
                                //向玩家散射的弹幕 一组5个
                                if (this.gamePro.timer % this.elfs[i].bullteInterval == 0) {

                                    let __x = 0
                                    let __y = 0

                                    for(let j=0; j<5; j++){

                                        if(j == 0){
                                            __x = this.playerPro.x - this.playerPro.width * 8
                                            __y = this.playerPro.y - this.playerPro.height * 8
                                        }  if(j == 1){
                                            __x = this.playerPro.x - this.playerPro.width * 4
                                            __y = this.playerPro.y  - this.playerPro.height * 4
                                        }  if(j == 2){
                                            __x = this.playerPro.x
                                            __y = this.playerPro.y
                                        }  if(j == 3){
                                            __x = this.playerPro.x + this.playerPro.width * 2
                                            __y = this.playerPro.y + this.playerPro.height * 2
                                        }  if(j == 4){
                                            __x = this.playerPro.x + this.playerPro.width * 4
                                            __y = this.playerPro.y + this.playerPro.height * 4
                                        }

                                        let mx = __x + this.playerPro.width / 2
                                        let my = __y + this.playerPro.height / 2

                                        let vx = this.elfs[i].bullteSpeed * (mx - _x) / Math.sqrt((mx - _x) * (mx - _x) + (my - _y) * (my - _y));
                                        let vy = this.elfs[i].bullteSpeed * (my - _y) / Math.sqrt((mx - _x) * (mx - _x) + (my - _y) * (my - _y));

                                        let bullet = cc.instantiate(this.bulletPrefabs[this.elfs[i].bullteColor]);
                                        bullet.setPosition(cc.v2(_x - this.elfs[i].width / 2, _y - this.elfs[i].height / 2));
                                        bullet.rotation = this.elfs[i].angle
                                        this.gameBg.node.addChild(bullet)
                                        let _uuid = this.getUuid()

                                        this.elfBullets.push({
                                            uuid: _uuid,
                                            node: bullet,
                                            cx: _x - this.elfs[i].width / 2,
                                            cy: _y - this.elfs[i].height / 2,
                                            type: this.elfs[i].bullteType,
                                            speed: this.elfs[i].bullteSpeed,
                                            angle: this.elfs[i].angle,
                                            vx: vx,
                                            vy: vy,
                                            visible: true
                                        })

                                    }

                                }
                            } else if (this.elfs[i].bullteType == 104) {
                                //向玩家锁定的弹幕 一组5个 （once）
                                if (this.gamePro.timer % this.elfs[i].bullteInterval == 0) {

                                    if(this.elfs[i].bullteOnce){
                                        // 弹幕只发射一次
                                        if(this.elfs[i].onceFlag){
                                            continue
                                        }
                                    }

                                    let mx = this.playerPro.x + this.playerPro.width / 2
                                    let my = this.playerPro.y + this.playerPro.height / 2
                                    let vx = this.elfs[i].bullteSpeed * (mx - _x) / Math.sqrt((mx - _x) * (mx - _x) + (my - _y) * (my - _y));
                                    let vy = this.elfs[i].bullteSpeed * (my - _y) / Math.sqrt((mx - _x) * (mx - _x) + (my - _y) * (my - _y));
                                    let bullet = cc.instantiate(this.bulletPrefabs[this.elfs[i].bullteColor]);
                                    bullet.setPosition(cc.v2(_x - this.elfs[i].width / 2, _y - this.elfs[i].height / 2));
                                    bullet.rotation = this.elfs[i].angle
                                    this.gameBg.node.addChild(bullet)
                                    let _uuid = this.getUuid()
                                    this.elfBullets.push({
                                        uuid: _uuid,
                                        node: bullet,
                                        cx: _x - this.elfs[i].width / 2,
                                        cy: _y - this.elfs[i].height / 2,
                                        type: this.elfs[i].bullteType,
                                        speed: this.elfs[i].bullteSpeed,
                                        angle: this.elfs[i].angle,
                                        vx: vx,
                                        vy: vy,
                                        visible: true
                                    })

                                    setTimeout(()=>{
                                        let mx = this.playerPro.x + this.playerPro.width / 2
                                        let my = this.playerPro.y + this.playerPro.height / 2
                                        let vx = this.elfs[i].bullteSpeed * (mx - _x) / Math.sqrt((mx - _x) * (mx - _x) + (my - _y) * (my - _y));
                                        let vy = this.elfs[i].bullteSpeed * (my - _y) / Math.sqrt((mx - _x) * (mx - _x) + (my - _y) * (my - _y));
                                        let bullet = cc.instantiate(this.bulletPrefabs[this.elfs[i].bullteColor]);
                                        bullet.setPosition(cc.v2(_x - this.elfs[i].width / 2, _y - this.elfs[i].height / 2));
                                        bullet.rotation = this.elfs[i].angle
                                        this.gameBg.node.addChild(bullet)
                                        let _uuid = this.getUuid()
                                        this.elfBullets.push({
                                            uuid: _uuid,
                                            node: bullet,
                                            cx: _x - this.elfs[i].width / 2,
                                            cy: _y - this.elfs[i].height / 2,
                                            type: this.elfs[i].bullteType,
                                            speed: this.elfs[i].bullteSpeed,
                                            angle: this.elfs[i].angle,
                                            vx: vx,
                                            vy: vy,
                                            visible: true
                                        })
                                    }, 250)
                                    setTimeout(()=>{
                                        let mx = this.playerPro.x + this.playerPro.width / 2
                                        let my = this.playerPro.y + this.playerPro.height / 2
                                        let vx = this.elfs[i].bullteSpeed * (mx - _x) / Math.sqrt((mx - _x) * (mx - _x) + (my - _y) * (my - _y));
                                        let vy = this.elfs[i].bullteSpeed * (my - _y) / Math.sqrt((mx - _x) * (mx - _x) + (my - _y) * (my - _y));
                                        let bullet = cc.instantiate(this.bulletPrefabs[this.elfs[i].bullteColor]);
                                        bullet.setPosition(cc.v2(_x - this.elfs[i].width / 2, _y - this.elfs[i].height / 2));
                                        bullet.rotation = this.elfs[i].angle
                                        this.gameBg.node.addChild(bullet)
                                        let _uuid = this.getUuid()
                                        this.elfBullets.push({
                                            uuid: _uuid,
                                            node: bullet,
                                            cx: _x - this.elfs[i].width / 2,
                                            cy: _y - this.elfs[i].height / 2,
                                            type: this.elfs[i].bullteType,
                                            speed: this.elfs[i].bullteSpeed,
                                            angle: this.elfs[i].angle,
                                            vx: vx,
                                            vy: vy,
                                            visible: true
                                        })
                                    }, 500)
                                    setTimeout(()=>{
                                        let mx = this.playerPro.x + this.playerPro.width / 2
                                        let my = this.playerPro.y + this.playerPro.height / 2
                                        let vx = this.elfs[i].bullteSpeed * (mx - _x) / Math.sqrt((mx - _x) * (mx - _x) + (my - _y) * (my - _y));
                                        let vy = this.elfs[i].bullteSpeed * (my - _y) / Math.sqrt((mx - _x) * (mx - _x) + (my - _y) * (my - _y));
                                        let bullet = cc.instantiate(this.bulletPrefabs[this.elfs[i].bullteColor]);
                                        bullet.setPosition(cc.v2(_x - this.elfs[i].width / 2, _y - this.elfs[i].height / 2));
                                        bullet.rotation = this.elfs[i].angle
                                        this.gameBg.node.addChild(bullet)
                                        let _uuid = this.getUuid()
                                        this.elfBullets.push({
                                            uuid: _uuid,
                                            node: bullet,
                                            cx: _x - this.elfs[i].width / 2,
                                            cy: _y - this.elfs[i].height / 2,
                                            type: this.elfs[i].bullteType,
                                            speed: this.elfs[i].bullteSpeed,
                                            angle: this.elfs[i].angle,
                                            vx: vx,
                                            vy: vy,
                                            visible: true
                                        })
                                    }, 750)
                                    setTimeout(()=>{
                                        let mx = this.playerPro.x + this.playerPro.width / 2
                                        let my = this.playerPro.y + this.playerPro.height / 2
                                        let vx = this.elfs[i].bullteSpeed * (mx - _x) / Math.sqrt((mx - _x) * (mx - _x) + (my - _y) * (my - _y));
                                        let vy = this.elfs[i].bullteSpeed * (my - _y) / Math.sqrt((mx - _x) * (mx - _x) + (my - _y) * (my - _y));
                                        let bullet = cc.instantiate(this.bulletPrefabs[this.elfs[i].bullteColor]);
                                        bullet.setPosition(cc.v2(_x - this.elfs[i].width / 2, _y - this.elfs[i].height / 2));
                                        bullet.rotation = this.elfs[i].angle
                                        this.gameBg.node.addChild(bullet)
                                        let _uuid = this.getUuid()
                                        this.elfBullets.push({
                                            uuid: _uuid,
                                            node: bullet,
                                            cx: _x - this.elfs[i].width / 2,
                                            cy: _y - this.elfs[i].height / 2,
                                            type: this.elfs[i].bullteType,
                                            speed: this.elfs[i].bullteSpeed,
                                            angle: this.elfs[i].angle,
                                            vx: vx,
                                            vy: vy,
                                            visible: true
                                        })
                                    }, 1000)

                                    if(this.elfs[i].bullteOnce){
                                        this.elfs[i].onceFlag = true
                                    }

                                }
                            }
                            else if (this.elfs[i].bullteType == 201) {
                                //交替旋转的弹幕 12个一组
                                if (this.gamePro.timer % this.elfs[i].bullteInterval == 0) {

                                    let _angle = this.elfs[i].angle
                                    let bullet = null
                                    for (let j = 0; j < 12; j++) {
                                        _angle = this.elfs[i].angle + j * 30

                                        if(j<4){
                                            bullet = cc.instantiate(this.bulletPrefabs[this.elfs[i].bullteColor + j])
                                        }else if(j>=4 && j<8){
                                            bullet = cc.instantiate(this.bulletPrefabs[this.elfs[i].bullteColor + j - 4])
                                        }else{
                                            bullet = cc.instantiate(this.bulletPrefabs[this.elfs[i].bullteColor + j - 8])
                                        }

                                        bullet.setPosition(cc.v2(_x - this.elfs[i].width / 2, _y - this.elfs[i].height / 2))
                                        bullet.rotation = _angle - 270
                                        this.gameBg.node.addChild(bullet)
                                        let _uuid = this.getUuid()

                                        this.elfBullets.push({
                                            uuid: _uuid,
                                            node: bullet,
                                            cx: _x - this.elfs[i].width / 2,
                                            cy: _y - this.elfs[i].height / 2,
                                            type: this.elfs[i].bullteType,
                                            angle: _angle,
                                            speed: this.elfs[i].bullteSpeed,
                                            xSpeed: Math.cos(_angle * Math.PI / 180) * this.elfs[i].bullteSpeed,
                                            ySpeed: -Math.sin(_angle * Math.PI / 180) * this.elfs[i].bullteSpeed,
                                            visible: true
                                        })

                                    }

                                }

                                this.elfs[i].angle += this.elfs[i].BVspeed
                                if ( this.elfs[i].angle > 360)   this.elfs[i].BVspeed = -1
                                if ( this.elfs[i].angle < 0)     this.elfs[i].BVspeed = 1

                            }
                            else if (this.elfs[i].bullteType == 202) {
                                //交替旋转的弹幕 12个一组, 每次创造4组

                                let max = 0

                                if (this.gamePro.timer % this.elfs[i].bullteInterval == 0 && max < 6) {

                                    // max ++

                                    let _angle = this.elfs[i].angle
                                    let bullet = null
                                    for (let j = 0; j < 12; j++) {
                                        _angle = this.elfs[i].angle + j * 30

                                        if(j<4){
                                            bullet = cc.instantiate(this.bulletPrefabs[this.elfs[i].bullteColor + j])
                                        }else if(j>=4 && j<8){
                                            bullet = cc.instantiate(this.bulletPrefabs[this.elfs[i].bullteColor + j - 4])
                                        }else{
                                            bullet = cc.instantiate(this.bulletPrefabs[this.elfs[i].bullteColor + j - 8])
                                        }

                                        bullet.setPosition(cc.v2(_x - this.elfs[i].width / 2, _y - this.elfs[i].height / 2))
                                        bullet.rotation = _angle - 270
                                        this.gameBg.node.addChild(bullet)
                                        let _uuid = this.getUuid()

                                        this.elfBullets.push({
                                            uuid: _uuid,
                                            node: bullet,
                                            cx: _x - this.elfs[i].width / 2,
                                            cy: _y - this.elfs[i].height / 2,
                                            type: this.elfs[i].bullteType,
                                            angle: _angle,
                                            speed: this.elfs[i].bullteSpeed,
                                            xSpeed: Math.cos(_angle * Math.PI / 180) * this.elfs[i].bullteSpeed,
                                            ySpeed: -Math.sin(_angle * Math.PI / 180) * this.elfs[i].bullteSpeed,
                                            visible: true
                                        })

                                    }

                                }

                                this.elfs[i].angle += this.elfs[i].BVspeed
                                if ( this.elfs[i].angle > 360)   this.elfs[i].BVspeed = -1
                                if ( this.elfs[i].angle < 0)     this.elfs[i].BVspeed = 1

                            } else if (this.elfs[i].bullteType == 301) {
                                //圆形扩散交替的弹幕
                                if (this.gamePro.timer % this.elfs[i].bullteInterval == 0) {
                                    this.elfs[i].circleFlag = !this.elfs[i].circleFlag
                                    let _angle = this.elfs[i].angle
                                    let bullet = null
                                    for (let j = 0; j < 36; j++) {
                                        if(this.elfs[i].circleFlag){
                                            _angle = this.elfs[i].angle + j * 10
                                            bullet = cc.instantiate(this.bulletPrefabs[this.elfs[i].bullteColor + 1])
                                        }else{
                                            _angle = this.elfs[i].angle + j * 10 + 5
                                            bullet = cc.instantiate(this.bulletPrefabs[this.elfs[i].bullteColor + 4])
                                        }
                                        bullet.setPosition(cc.v2(_x - this.elfs[i].width / 2, _y - this.elfs[i].height / 2))
                                        bullet.rotation = _angle - 270
                                        this.gameBg.node.addChild(bullet)
                                        let _uuid = this.getUuid()
                                        this.elfBullets.push({
                                            uuid: _uuid,
                                            node: bullet,
                                            cx: _x - this.elfs[i].width / 2,
                                            cy: _y - this.elfs[i].height / 2,
                                            type: this.elfs[i].bullteType,
                                            angle: _angle,
                                            speed: this.elfs[i].bullteSpeed,
                                            xSpeed: Math.cos(_angle * Math.PI / 180) * this.elfs[i].bullteSpeed,
                                            ySpeed: -Math.sin(_angle * Math.PI / 180) * this.elfs[i].bullteSpeed,
                                            visible: true
                                        })
                                    }
                                }

                            } else if (this.elfs[i].bullteType == 302) {
                                //圆形扩散交替的弹幕(延迟扩散)
                                if (this.gamePro.timer % this.elfs[i].bullteInterval == 0) {
                                    this.elfs[i].circleFlag = !this.elfs[i].circleFlag
                                    let _angle = this.elfs[i].angle
                                    let bullet = null
                                    for (let j = 0; j < 36; j++) {
                                        if(this.elfs[i].circleFlag){
                                            _angle = this.elfs[i].angle + j * 10
                                            bullet = cc.instantiate(this.bulletPrefabs[this.elfs[i].bullteColor + 1])
                                        }else{
                                            _angle = this.elfs[i].angle + j * 10 + 5
                                            bullet = cc.instantiate(this.bulletPrefabs[this.elfs[i].bullteColor + 4])
                                        }
                                        bullet.setPosition(cc.v2(_x - this.elfs[i].width / 2, _y - this.elfs[i].height / 2))
                                        bullet.rotation = _angle - 270
                                        this.gameBg.node.addChild(bullet)
                                        let _uuid = this.getUuid()
                                        this.elfBullets.push({
                                            uuid: _uuid,
                                            node: bullet,
                                            cx: _x - this.elfs[i].width / 2,
                                            cy: _y - this.elfs[i].height / 2,
                                            type: this.elfs[i].bullteType,
                                            angle: _angle,
                                            speed: this.elfs[i].bullteSpeed,
                                            xSpeed: Math.cos(_angle * Math.PI / 180) * this.elfs[i].bullteSpeed,
                                            ySpeed: -Math.sin(_angle * Math.PI / 180) * this.elfs[i].bullteSpeed,
                                            visible: true
                                        })
                                    }
                                }

                            }else if (this.elfs[i].bullteType == 401) {
                                //向前方散射的弹幕 一组3个
                                if (this.gamePro.timer % this.elfs[i].bullteInterval == 0) {
                                    let _angle = this.elfs[i].angle
                                    let bullet = null
                                    for (let j = 0; j < 3; j++) {
                                        _angle = this.elfs[i].angle + j * 20 + 270 - 2 * 20 / 2
                                        bullet = cc.instantiate(this.bulletPrefabs[this.elfs[i].bullteColor])
                                        bullet.setPosition(cc.v2(_x - this.elfs[i].width / 2, _y - this.elfs[i].height / 2))
                                        bullet.rotation = _angle - 270
                                        this.gameBg.node.addChild(bullet)
                                        let _uuid = this.getUuid()
                                        this.elfBullets.push({
                                            uuid: _uuid,
                                            node: bullet,
                                            cx: _x - this.elfs[i].width / 2,
                                            cy: _y - this.elfs[i].height / 2,
                                            type: this.elfs[i].bullteType,
                                            angle: _angle,
                                            speed: this.elfs[i].bullteSpeed,
                                            xSpeed: Math.cos(_angle * Math.PI / 180) * this.elfs[i].bullteSpeed,
                                            ySpeed: -Math.sin(_angle * Math.PI / 180) * this.elfs[i].bullteSpeed,
                                            visible: true
                                        })
                                    }
                                }
                            }  else if (this.elfs[i].bullteType == 402) {
                                //向前方散射的弹幕 一组5个
                                if (this.gamePro.timer % this.elfs[i].bullteInterval == 0) {
                                    let _angle = this.elfs[i].angle
                                    let bullet = null
                                    for (let j = 0; j < 5; j++) {
                                        _angle = this.elfs[i].angle + j * 5 + 270 - 4 * 5 / 2
                                        bullet = cc.instantiate(this.bulletPrefabs[this.elfs[i].bullteColor])
                                        bullet.setPosition(cc.v2(_x - this.elfs[i].width / 2, _y - this.elfs[i].height / 2))
                                        bullet.rotation = _angle - 270
                                        this.gameBg.node.addChild(bullet)
                                        let _uuid = this.getUuid()
                                        this.elfBullets.push({
                                            uuid: _uuid,
                                            node: bullet,
                                            cx: _x - this.elfs[i].width / 2,
                                            cy: _y - this.elfs[i].height / 2,
                                            type: this.elfs[i].bullteType,
                                            angle: _angle,
                                            speed: this.elfs[i].bullteSpeed,
                                            xSpeed: Math.cos(_angle * Math.PI / 180) * this.elfs[i].bullteSpeed,
                                            ySpeed: -Math.sin(_angle * Math.PI / 180) * this.elfs[i].bullteSpeed,
                                            visible: true
                                        })
                                    }
                                }
                            }  else if (this.elfs[i].bullteType == 403) {
                                //向前方散射的弹幕 3组
                                if (this.gamePro.timer % this.elfs[i].bullteInterval == 0) {
                                    let _angle = this.elfs[i].angle
                                    let bullet = null
                                    for (let j = 0; j < 3; j++) {
                                        _angle = this.elfs[i].angle + j * 30 + 270 - 2 * 30 / 2
                                        bullet = cc.instantiate(this.bulletPrefabs[this.elfs[i].bullteColor])
                                        bullet.setPosition(cc.v2(_x - this.elfs[i].width / 2, _y - this.elfs[i].height / 2))
                                        bullet.rotation = _angle - 270
                                        this.gameBg.node.addChild(bullet)
                                        let _uuid = this.getUuid()
                                        this.elfBullets.push({
                                            uuid: _uuid,
                                            node: bullet,
                                            cx: _x - this.elfs[i].width / 2,
                                            cy: _y - this.elfs[i].height / 2,
                                            type: this.elfs[i].bullteType,
                                            angle: _angle,
                                            speed: this.elfs[i].bullteSpeed,
                                            xSpeed: Math.cos(_angle * Math.PI / 180) * this.elfs[i].bullteSpeed,
                                            ySpeed: -Math.sin(_angle * Math.PI / 180) * this.elfs[i].bullteSpeed,
                                            visible: true
                                        })
                                    }
                                }
                            }  else if (this.elfs[i].bullteType == 501) {
                                //组合弹幕 （once）
                                /**
                                 *  2 组4弹幕
                                 *  3 组6弹幕
                                 *  2 组8弹幕
                                 *  1 组12弹幕
                                 */
                                if (this.gamePro.timer % this.elfs[i].bullteInterval == 0) {

                                    if(this.elfs[i].bullteOnce){
                                        // 弹幕只发射一次
                                        if(this.elfs[i].onceFlag){
                                            continue
                                        }
                                    }
                                    let _angle = this.elfs[i].angle
                                    let bullet = null
                                    for (let j = 0; j < 4; j++) {
                                        _angle = this.elfs[i].angle + j * 90
                                        bullet = cc.instantiate(this.bulletPrefabs[this.elfs[i].bullteColor + 1])
                                        bullet.setPosition(cc.v2(_x - this.elfs[i].width / 2, _y - this.elfs[i].height / 2))
                                        bullet.rotation = _angle - 270
                                        this.gameBg.node.addChild(bullet)
                                        let _uuid = this.getUuid()
                                        this.elfBullets.push({
                                            uuid: _uuid,
                                            node: bullet,
                                            cx: _x - this.elfs[i].width / 2,
                                            cy: _y - this.elfs[i].height / 2,
                                            type: this.elfs[i].bullteType,
                                            angle: _angle,
                                            speed: this.elfs[i].bullteSpeed,
                                            xSpeed: Math.cos(_angle * Math.PI / 180) * this.elfs[i].bullteSpeed,
                                            ySpeed: -Math.sin(_angle * Math.PI / 180) * this.elfs[i].bullteSpeed,
                                            visible: true
                                        })
                                    }

                                    setTimeout(()=>{
                                        let _angle = this.elfs[i].angle
                                        let bullet = null
                                        for (let j = 0; j < 4; j++) {
                                            _angle = this.elfs[i].angle + j * 90 + 45
                                            bullet = cc.instantiate(this.bulletPrefabs[this.elfs[i].bullteColor + 2])
                                            bullet.setPosition(cc.v2(_x - this.elfs[i].width / 2, _y - this.elfs[i].height / 2))
                                            bullet.rotation = _angle - 270
                                            this.gameBg.node.addChild(bullet)
                                            let _uuid = this.getUuid()
                                            this.elfBullets.push({
                                                uuid: _uuid,
                                                node: bullet,
                                                cx: _x - this.elfs[i].width / 2,
                                                cy: _y - this.elfs[i].height / 2,
                                                type: this.elfs[i].bullteType,
                                                angle: _angle,
                                                speed: this.elfs[i].bullteSpeed,
                                                xSpeed: Math.cos(_angle * Math.PI / 180) * this.elfs[i].bullteSpeed,
                                                ySpeed: -Math.sin(_angle * Math.PI / 180) * this.elfs[i].bullteSpeed,
                                                visible: true
                                            })
                                        }
                                    }, 250)

                                    setTimeout(()=>{
                                        let _angle = this.elfs[i].angle
                                        let bullet = null
                                        for (let j = 0; j < 6; j++) {
                                            _angle = this.elfs[i].angle + j * 60
                                            bullet = cc.instantiate(this.bulletPrefabs[this.elfs[i].bullteColor + 3])
                                            bullet.setPosition(cc.v2(_x - this.elfs[i].width / 2, _y - this.elfs[i].height / 2))
                                            bullet.rotation = _angle - 270
                                            this.gameBg.node.addChild(bullet)
                                            let _uuid = this.getUuid()
                                            this.elfBullets.push({
                                                uuid: _uuid,
                                                node: bullet,
                                                cx: _x - this.elfs[i].width / 2,
                                                cy: _y - this.elfs[i].height / 2,
                                                type: this.elfs[i].bullteType,
                                                angle: _angle,
                                                speed: this.elfs[i].bullteSpeed,
                                                xSpeed: Math.cos(_angle * Math.PI / 180) * this.elfs[i].bullteSpeed,
                                                ySpeed: -Math.sin(_angle * Math.PI / 180) * this.elfs[i].bullteSpeed,
                                                visible: true
                                            })
                                        }
                                    }, 500)

                                    setTimeout(()=>{
                                        let _angle = this.elfs[i].angle
                                        let bullet = null
                                        for (let j = 0; j < 6; j++) {
                                            _angle = this.elfs[i].angle + j * 60 + 30
                                            bullet = cc.instantiate(this.bulletPrefabs[this.elfs[i].bullteColor + 4])
                                            bullet.setPosition(cc.v2(_x - this.elfs[i].width / 2, _y - this.elfs[i].height / 2))
                                            bullet.rotation = _angle - 270
                                            this.gameBg.node.addChild(bullet)
                                            let _uuid = this.getUuid()
                                            this.elfBullets.push({
                                                uuid: _uuid,
                                                node: bullet,
                                                cx: _x - this.elfs[i].width / 2,
                                                cy: _y - this.elfs[i].height / 2,
                                                type: this.elfs[i].bullteType,
                                                angle: _angle,
                                                speed: this.elfs[i].bullteSpeed,
                                                xSpeed: Math.cos(_angle * Math.PI / 180) * this.elfs[i].bullteSpeed,
                                                ySpeed: -Math.sin(_angle * Math.PI / 180) * this.elfs[i].bullteSpeed,
                                                visible: true
                                            })
                                        }
                                    }, 750)

                                    setTimeout(()=>{
                                        let _angle = this.elfs[i].angle
                                        let bullet = null
                                        for (let j = 0; j < 8; j++) {
                                            _angle = this.elfs[i].angle + j * 45
                                            bullet = cc.instantiate(this.bulletPrefabs[this.elfs[i].bullteColor + 5])
                                            bullet.setPosition(cc.v2(_x - this.elfs[i].width / 2, _y - this.elfs[i].height / 2))
                                            bullet.rotation = _angle - 270
                                            this.gameBg.node.addChild(bullet)
                                            let _uuid = this.getUuid()
                                            this.elfBullets.push({
                                                uuid: _uuid,
                                                node: bullet,
                                                cx: _x - this.elfs[i].width / 2,
                                                cy: _y - this.elfs[i].height / 2,
                                                type: this.elfs[i].bullteType,
                                                angle: _angle,
                                                speed: this.elfs[i].bullteSpeed,
                                                xSpeed: Math.cos(_angle * Math.PI / 180) * this.elfs[i].bullteSpeed,
                                                ySpeed: -Math.sin(_angle * Math.PI / 180) * this.elfs[i].bullteSpeed,
                                                visible: true
                                            })
                                        }
                                    }, 1000)

                                    setTimeout(()=>{
                                        let _angle = this.elfs[i].angle
                                        let bullet = null
                                        for (let j = 0; j < 8; j++) {
                                            _angle = this.elfs[i].angle + j * 45 + 22.5
                                            bullet = cc.instantiate(this.bulletPrefabs[this.elfs[i].bullteColor + 6])
                                            bullet.setPosition(cc.v2(_x - this.elfs[i].width / 2, _y - this.elfs[i].height / 2))
                                            bullet.rotation = _angle - 270
                                            this.gameBg.node.addChild(bullet)
                                            let _uuid = this.getUuid()
                                            this.elfBullets.push({
                                                uuid: _uuid,
                                                node: bullet,
                                                cx: _x - this.elfs[i].width / 2,
                                                cy: _y - this.elfs[i].height / 2,
                                                type: this.elfs[i].bullteType,
                                                angle: _angle,
                                                speed: this.elfs[i].bullteSpeed,
                                                xSpeed: Math.cos(_angle * Math.PI / 180) * this.elfs[i].bullteSpeed,
                                                ySpeed: -Math.sin(_angle * Math.PI / 180) * this.elfs[i].bullteSpeed,
                                                visible: true
                                            })
                                        }
                                    }, 1250)

                                    setTimeout(()=>{
                                        let _angle = this.elfs[i].angle
                                        let bullet = null
                                        for (let j = 0; j < 12; j++) {
                                            _angle = this.elfs[i].angle + j * 30
                                            bullet = cc.instantiate(this.bulletPrefabs[this.elfs[i].bullteColor + 5])
                                            bullet.setPosition(cc.v2(_x - this.elfs[i].width / 2, _y - this.elfs[i].height / 2))
                                            bullet.rotation = _angle - 270
                                            this.gameBg.node.addChild(bullet)
                                            let _uuid = this.getUuid()
                                            this.elfBullets.push({
                                                uuid: _uuid,
                                                node: bullet,
                                                cx: _x - this.elfs[i].width / 2,
                                                cy: _y - this.elfs[i].height / 2,
                                                type: this.elfs[i].bullteType,
                                                angle: _angle,
                                                speed: this.elfs[i].bullteSpeed,
                                                xSpeed: Math.cos(_angle * Math.PI / 180) * this.elfs[i].bullteSpeed,
                                                ySpeed: -Math.sin(_angle * Math.PI / 180) * this.elfs[i].bullteSpeed,
                                                visible: true
                                            })
                                        }
                                    }, 1500)

                                    setTimeout(()=>{
                                        let _angle = this.elfs[i].angle
                                        let bullet = null
                                        for (let j = 0; j < 12; j++) {
                                            _angle = this.elfs[i].angle + j * 30 + 15
                                            bullet = cc.instantiate(this.bulletPrefabs[this.elfs[i].bullteColor + 6])
                                            bullet.setPosition(cc.v2(_x - this.elfs[i].width / 2, _y - this.elfs[i].height / 2))
                                            bullet.rotation = _angle - 270
                                            this.gameBg.node.addChild(bullet)
                                            let _uuid = this.getUuid()
                                            this.elfBullets.push({
                                                uuid: _uuid,
                                                node: bullet,
                                                cx: _x - this.elfs[i].width / 2,
                                                cy: _y - this.elfs[i].height / 2,
                                                type: this.elfs[i].bullteType,
                                                angle: _angle,
                                                speed: this.elfs[i].bullteSpeed,
                                                xSpeed: Math.cos(_angle * Math.PI / 180) * this.elfs[i].bullteSpeed,
                                                ySpeed: -Math.sin(_angle * Math.PI / 180) * this.elfs[i].bullteSpeed,
                                                visible: true
                                            })
                                        }
                                    }, 1750)


                                    setTimeout(()=>{
                                        let _angle = this.elfs[i].angle
                                        let bullet = null
                                        for (let j = 0; j < 24; j++) {
                                            _angle = this.elfs[i].angle + j * 15
                                            bullet = cc.instantiate(this.bulletPrefabs[this.elfs[i].bullteColor + 7])
                                            bullet.setPosition(cc.v2(_x - this.elfs[i].width / 2, _y - this.elfs[i].height / 2))
                                            bullet.rotation = _angle - 270
                                            this.gameBg.node.addChild(bullet)
                                            let _uuid = this.getUuid()
                                            this.elfBullets.push({
                                                uuid: _uuid,
                                                node: bullet,
                                                cx: _x - this.elfs[i].width / 2,
                                                cy: _y - this.elfs[i].height / 2,
                                                type: this.elfs[i].bullteType,
                                                angle: _angle,
                                                speed: this.elfs[i].bullteSpeed,
                                                xSpeed: Math.cos(_angle * Math.PI / 180) * this.elfs[i].bullteSpeed,
                                                ySpeed: -Math.sin(_angle * Math.PI / 180) * this.elfs[i].bullteSpeed,
                                                visible: true
                                            })
                                        }
                                    }, 2000)

                                    setTimeout(()=>{
                                        let _angle = this.elfs[i].angle
                                        let bullet = null
                                        for (let j = 0; j < 24; j++) {
                                            _angle = this.elfs[i].angle + j * 15 + 7.5
                                            bullet = cc.instantiate(this.bulletPrefabs[this.elfs[i].bullteColor + 8])
                                            bullet.setPosition(cc.v2(_x - this.elfs[i].width / 2, _y - this.elfs[i].height / 2))
                                            bullet.rotation = _angle - 270
                                            this.gameBg.node.addChild(bullet)
                                            let _uuid = this.getUuid()
                                            this.elfBullets.push({
                                                uuid: _uuid,
                                                node: bullet,
                                                cx: _x - this.elfs[i].width / 2,
                                                cy: _y - this.elfs[i].height / 2,
                                                type: this.elfs[i].bullteType,
                                                angle: _angle,
                                                speed: this.elfs[i].bullteSpeed,
                                                xSpeed: Math.cos(_angle * Math.PI / 180) * this.elfs[i].bullteSpeed,
                                                ySpeed: -Math.sin(_angle * Math.PI / 180) * this.elfs[i].bullteSpeed,
                                                visible: true
                                            })
                                        }
                                    }, 2250)

                                    if(this.elfs[i].bullteOnce){
                                        // 弹幕只发射一次
                                        this.elfs[i].onceFlag = true
                                    }
                                }
                            }

                        }
                    }
                }


            }

            //判断边界，销毁
            if(this.elfs[i].node.x>= this.node.width || this.elfs[i].node.x <= 0){
                this.elfs[i].node.destroy()
                this.elfs.splice(i, 1)
                continue
            }if(this.elfs[i].node.y>= this.node.height || this.elfs[i].node.y <= 0){
                this.elfs[i].node.destroy()
                this.elfs.splice(i, 1)
                continue
            }

            // 1、碰撞到玩家

            //与玩家碰撞检测

            let elfRect = {
                x: this.elfs[i].node.x - this.elfs[i].node.width / 2,
                y: this.elfs[i].node.y + this.elfs[i].node.height / 2,
                width: 32,
                height: 32,
            }

            let reimuRect = {
                x: this.playerPro.node.x - 2,
                y: this.playerPro.node.y + 2,
                width: 4,
                height: 4
            }

            //碰撞
            if (this.collide(elfRect, reimuRect)) {
                if(!this.playerPro.immune){
                    this.playerPro.hp --
                    let seq = cc.sequence( cc.blink(2, 9), cc.fadeIn(0.01));
                    this.playerPro.node.runAction(seq)
                    this.reimuBlink()
                }
            }

            // 2、碰撞到玩家的弹幕
            for(let j=0; j< this.playerPro.bullets.length; j++){
                let _b = this.playerPro.bullets[j]
                let bulletRect = {
                    x: _b.node.x - 6,
                    y: _b.node.y + 24,
                    width: 12,
                    height: 48,
                }

                //碰撞
                if (this.collide(elfRect, bulletRect)) {

                    if(this.elfs[i].spriteType == 'cirno'){
                        let _cirno = this.chapterOneCache.cirnoPro

                        if(!_cirno.immune){
                            this.elfs[i].hp -= this.playerPro.atk
                            this.playerPro.bullets[j].node.destroy()
                            this.playerPro.bullets.splice(j, 1)

                            if(this.elfs[i].hp<= 0){
                                if(_cirno.state == 10){
                                    //销毁
                                    this.gamePro.score += 10000
                                    this.gameScore.string = this.gamePro.score
                                    this.creatBoom( elfRect.x, elfRect.y)
                                    this.elfs[i].node.destroy()
                                    this.elfs.splice(i, 1)

                                    //-2019年2月18日17:07:56
                                    //进入结算界面



                                }else{
                                    //切换形态
                                    _cirno.immune = true
                                    this.resetCirno()
                                    this.gamePro.score += 1000
                                    this.gameScore.string = this.gamePro.score
                                }
                            }else{
                                if(this.elfs[i].spriteType == 'cirno'){
                                    //琪露诺
                                    this.hpBar.width = this.elfs[i].hp / 2000 * 580;
                                }
                            }

                        }

                    }else{
                        this.elfs[i].hp -= this.playerPro.atk
                        this.playerPro.bullets[j].node.destroy()
                        this.playerPro.bullets.splice(j, 1)

                        if(this.elfs[i].hp<= 0){
                            //有一定几率生成一个道具
                            if(this.gamePro.timer % 5 == 0){
                                this.creatProp({
                                    x: this.elfs[i].node.x,
                                    y: this.elfs[i].node.y,
                                    type: this.random_num(0,2),
                                })
                            }

                            //播放粒子效果 计分 移除elf 移除弹幕
                            this.gamePro.score += this.elfs[i].score
                            this.gameScore.string = this.gamePro.score
                            this.creatBoom( elfRect.x, elfRect.y)
                            this.elfs[i].node.destroy()
                            this.elfs.splice(i, 1)

                        }
                    }

                }
            }

        }

    },

    /**
     * 更新妖精弹幕
     */
    updateElfFires(){

        if(this.chapterOneCache.cirnoPro.freeze){
            return
        }

        for(let i=0; i<this.elfBullets.length; i++){

            let _b = this.elfBullets[i]

            if(_b.timer){
                _b.timer ++
            }else{
                _b.timer = 0
                _b.timer ++
            }

            let _flag = true

            if (_b.type == 101 || _b.type == 102 || _b.type == 103) {
                //锁定玩家的弹幕
                _b.cx += _b.vx
                _b.cy += _b.vy
            } else if (_b.type == 104) {
                //圆形弹幕
                _b.cx += _b.vx
                _b.cy += _b.vy
            } else if (_b.type == 201) {
                //圆形弹幕
                _b.cx += _b.xSpeed
                _b.cy += _b.ySpeed
            } else if (_b.type == 202) {
                //圆形弹幕
                if (_b.timer <= 10){
                    _b.cx += _b.xSpeed * 1.1;
                    _b.cy += _b.ySpeed * 1.1;
                } else if(_b.timer >= 10 && _b.timer <= 50 ) {
                    _b.cx += _b.xSpeed * 0.3
                    _b.cy += _b.ySpeed * 0.3
                }else{
                    _b.cx += _b.xSpeed
                    _b.cy += _b.ySpeed
                }
            }

            else if (_b.type == 301) {
                //圆形弹幕
                if (_b.timer <= 100){
                    _b.cx += _b.xSpeed * 0.1;
                    _b.cy += _b.ySpeed * 0.1;
                } else{
                    _b.cx += _b.xSpeed
                    _b.cy += _b.ySpeed
                }
            }else if (_b.type == 302) {
                //圆形弹幕
                if (_b.timer <= 100){
                    _b.cx += _b.xSpeed * 0.1;
                    _b.cy += _b.ySpeed * 0.1;
                } else{
                    _b.cx += _b.xSpeed
                    _b.cy += _b.ySpeed
                }
            }else if (_b.type == 303) {
                //圆形弹幕
                if (_b.timer <= 100){
                    _b.cx += _b.xSpeed * 0.1;
                    _b.cy += _b.ySpeed * 0.1;
                } else{
                    _b.cx += _b.xSpeed
                    _b.cy += _b.ySpeed
                }
            }else if (_b.type == 304) {
                //圆形弹幕
                if (_b.timer <= 100){
                    _b.cx += _b.xSpeed * 0.1;
                    _b.cy += _b.ySpeed * 0.1;
                } else{
                    _b.cx += _b.xSpeed
                    _b.cy += _b.ySpeed
                }
            }else if (_b.type == 305) {
                //圆形弹幕
                if (_b.timer <= 100){
                    _b.cx += _b.xSpeed * 0.1;
                    _b.cy += _b.ySpeed * 0.1;
                } else{
                    _b.cx += _b.xSpeed
                    _b.cy += _b.ySpeed
                }
            }
            else if (_b.type == 401) {
                //圆形弹幕
                if (_b.timer <= 100){
                    _b.cx += _b.xSpeed * 0.1;
                    _b.cy += _b.ySpeed * 0.1;
                } else{
                    _b.cx += _b.xSpeed
                    _b.cy += _b.ySpeed
                }
            } else if (_b.type == 402) {
                //圆形弹幕
                if (_b.timer <= 100){
                    _b.cx += _b.xSpeed * 0.1;
                    _b.cy += _b.ySpeed * 0.1;
                } else{
                    _b.cx += _b.xSpeed
                    _b.cy += _b.ySpeed
                }
            } else if (_b.type == 403) {
                //圆形弹幕
                _b.cx += _b.xSpeed
                _b.cy += _b.ySpeed
            } else if (_b.type == 404) {
                //圆形弹幕
                if (_b.timer <= 100){
                    _b.cx += _b.xSpeed * 0.1;
                    _b.cy += _b.ySpeed * 0.1;
                } else{
                    _b.cx += _b.xSpeed
                    _b.cy += _b.ySpeed
                }
            } else if (_b.type == 501) {
                //弹幕组合
                if (_b.timer <= 10){
                    _b.cx += _b.xSpeed * 1.2;
                    _b.cy += _b.ySpeed * 1.2;
                } else if(_b.timer >= 10 && _b.timer < 100 ) {
                    _b.cx += _b.xSpeed * 0.2
                    _b.cy += _b.ySpeed * 0.2
                }else{
                    _b.cx += _b.xSpeed
                    _b.cy += _b.ySpeed
                }
            } else if (_b.type == 601) {
                //直线弹幕
                _b.cx += _b.xSpeed
                _b.cy += _b.ySpeed
            }

            else if (_b.type == 'cirno_ice_rotate') {
                //湖上的冰晶
                if (_b.timer < 20){
                    _b.cx += _b.xSpeed * 1;
                    _b.cy += _b.ySpeed * 1;
                } else if(_b.timer >= 20 && _b.timer < 60 ) {
                    _b.cx += _b.xSpeed * 0.1
                    _b.cy += _b.ySpeed * 0.1
                } else if(_b.timer >= 60 && _b.timer < 100 ) {
                    _b.cx += _b.xSpeed * 1
                    _b.cy += _b.ySpeed * 1
                } else if(_b.timer >= 100 && _b.timer < 140 ) {
                    _b.cx += _b.xSpeed * 0.1
                    _b.cy += _b.ySpeed * 0.1
                } else if(_b.timer >= 140 && _b.timer < 180 ) {
                    _b.cx += _b.xSpeed * 0.3
                    _b.cy += _b.ySpeed * 0.3
                }else{
                    _b.cx += _b.xSpeed
                    _b.cy += _b.ySpeed
                }
            }
            else if (_b.type == 'cirno_ice_flower') {
                //冰之花
                if (_b.timer < 20){
                    _b.cx += _b.xSpeed * 1;
                    _b.cy += _b.ySpeed * 1;
                } else if(_b.timer >= 20 && _b.timer < 60 ) {
                    _b.cx += _b.xSpeed * 0.1
                    _b.cy += _b.ySpeed * 0.1
                } else if(_b.timer >= 60 && _b.timer < 100 ) {
                    _b.cx += _b.xSpeed * 1
                    _b.cy += _b.ySpeed * 1
                } else if(_b.timer >= 100 && _b.timer < 140 ) {
                    _b.cx += _b.xSpeed * 0.1
                    _b.cy += _b.ySpeed * 0.1
                } else if(_b.timer >= 140 && _b.timer < 180 ) {
                    _b.cx += _b.xSpeed * 0.3
                    _b.cy += _b.ySpeed * 0.3
                }else{
                    _b.cx += _b.xSpeed
                    _b.cy += _b.ySpeed
                }
            }
            else if (_b.type == 'cirno_rotate_snow') {

                if(_b.timer < 500){
                    _b.angle ++
                    _b.xSpeed = Math.cos(_b.angle * Math.PI / 180) * _b.speed
                    _b.ySpeed = -Math.sin(_b.angle * Math.PI / 180) * _b.speed

                    if (_b.timer < 10){
                        _b.cx += _b.xSpeed * 1;
                        _b.cy += _b.ySpeed * 1;
                    } else if(_b.timer >= 10 && _b.timer < 30 ) {
                        _b.cx += _b.xSpeed * 0.1
                        _b.cy += _b.ySpeed * 0.1
                    }else{
                        _b.cx += _b.xSpeed * 0.5
                        _b.cy += _b.ySpeed * 0.5
                    }
                }else{
                    _b.cx += _b.xSpeed
                    _b.cy += _b.ySpeed
                }

            }

            else if (_b.type == 'cirno_rotate') {
                if (_b.timer < 10){
                    _b.cx += _b.xSpeed * 1;
                    _b.cy += _b.ySpeed * 1;
                } else if(_b.timer >= 10 && _b.timer < 30 ) {
                    _b.cx += _b.xSpeed * 0.1
                    _b.cy += _b.ySpeed * 0.1
                }else{
                    _b.cx += _b.xSpeed
                    _b.cy += _b.ySpeed
                }
            }

            else if (_b.type == 'cirno_rotate_k') {
                if (_b.timer >= 60){

                    //变成其他弹幕
                    for (let j = 0; j < 18; j++) {
                        let _angle = _b.angle
                        let __x = this.random_num( _b.cx - 15, _b.cx - 15 )
                        let __y = this.random_num( _b.cy - 15, _b.cy + 15 )
                        _angle = this.random_num(_angle - 60, _angle + 60)
                        let bullet = cc.instantiate(this.bulletPrefabs[this.random_num(28,30)])
                        bullet.setPosition(cc.v2(__x, __y))
                        bullet.rotation = _angle - 270
                        this.gameBg.node.addChild(bullet)
                        let _uuid = this.getUuid()
                        this.elfBullets.push({
                            uuid: _uuid,
                            node: bullet,
                            cx: __x,
                            cy: __y,
                            type: 'cirno_rotate',
                            angle: _angle,
                            speed: _b.speed,
                            xSpeed: Math.cos(_angle * Math.PI / 180) * _b.speed * this.random_num(4,9) * 0.1,
                            ySpeed: -Math.sin(_angle * Math.PI / 180) * _b.speed * this.random_num(4,9) * 0.1,
                            visible: true
                        })
                    }

                    this.elfBullets[i].node.destroy()
                    this.elfBullets.splice(i, 1)
                    _flag = false

                }else{
                    _b.cx += _b.xSpeed
                    _b.cy += _b.ySpeed
                }
            }

            else if (_b.type == 'cirno_rotate_ice') {
                let _cirno = this.chapterOneCache.cirnoPro
                let _arr = []
                //冰蝶

                _b.cx += _b.xSpeed
                _b.cy += _b.ySpeed

                // let mx = this.playerPro.x + this.playerPro.width / 2
                // let my = this.playerPro.y + this.playerPro.height / 2
                // let _x = _b.node.x + _b.node.width / 2
                // let _y = _b.node.y + _b.node.height / 2
                // let vx = _cirno.bullteSpeed * (mx - _x) / Math.sqrt((mx - _x) * (mx - _x) + (my - _y) * (my - _y));
                // let vy = _cirno.bullteSpeed * (my - _y) / Math.sqrt((mx - _x) * (mx - _x) + (my - _y) * (my - _y));
                // _b.vx = vx
                // _b.vy = vy
                //
                // _b.cx -= _b.vx
                // _b.cy -= _b.vy


            }

            else if (_b.type == 'cirno_cirele_line4') {
                if (_b.timer < 10) {
                    _b.cx += _b.xSpeed * 1;
                    _b.cy += _b.ySpeed * 1;
                } else if (_b.timer >= 10 && _b.timer < 30) {
                    _b.cx += _b.xSpeed * 0.1
                    _b.cy += _b.ySpeed * 0.1
                } else {
                    _b.cx += _b.xSpeed
                    _b.cy += _b.ySpeed
                }
            }

            else if (_b.type == 'cirno_cirele_cirele12') {
                //圆形弹幕
                if (_b.timer <= 100){
                    _b.cx += _b.xSpeed * 0.1;
                    _b.cy += _b.ySpeed * 0.1;
                } else{
                    _b.cx += _b.xSpeed
                    _b.cy += _b.ySpeed
                }
            }
            else if (_b.type == 'cirno_cirele_track') {
                //圆形弹幕+跟踪
                if (_b.timer < 100){
                    _b.cx += _b.xSpeed * 1;
                    _b.cy += _b.ySpeed * 1;
                } else if(_b.timer == 100){
                    let _cirno = this.chapterOneCache.cirnoPro
                    let mx = this.playerPro.x + this.playerPro.width / 2
                    let my = this.playerPro.y + this.playerPro.height / 2
                    let _x = _b.node.x + _b.node.width / 2
                    let _y = _b.node.y + _b.node.height / 2
                    let vx = _cirno.bullteSpeed * (mx - _x) / Math.sqrt((mx - _x) * (mx - _x) + (my - _y) * (my - _y));
                    let vy = _cirno.bullteSpeed * (my - _y) / Math.sqrt((mx - _x) * (mx - _x) + (my - _y) * (my - _y));
                    _b.vx = vx
                    _b.vy = vy
                }else{
                    _b.cx += _b.vx
                    _b.cy += _b.vy
                }
            }

            else if (_b.type == 'cirno_ice') {
                //冰镜 + 湖上的冰晶
                if (_b.timer < 10){
                    _b.cx += _b.xSpeed * 2.5;
                    _b.cy += _b.ySpeed * 2.5;
                } else if(_b.timer >= 10 && _b.timer < 30 ) {
                    _b.cx += _b.xSpeed * 0.01
                    _b.cy += _b.ySpeed * 0.01
                } else if(_b.timer >= 30 && _b.timer < 40 ) {
                    _b.cx += _b.xSpeed * 2.5
                    _b.cy += _b.ySpeed * 2.5
                } else if(_b.timer >= 40 && _b.timer < 130 ) {
                    _b.cx += _b.xSpeed * 0.01
                    _b.cy += _b.ySpeed * 0.01
                }else{
                    _b.cx += _b.xSpeed * 0.5
                    _b.cy += _b.ySpeed * 0.5
                }
            }

            else if (_b.type == 'cirno_ice_mirror') {
                //冰镜 + 湖上的冰晶
                if (_b.timer < 10){
                    _b.cx += _b.xSpeed * 2.5;
                    _b.cy += _b.ySpeed * 2.5;
                } else if(_b.timer >= 10 && _b.timer < 30 ) {
                    _b.cx += _b.xSpeed * 0.01
                    _b.cy += _b.ySpeed * 0.01
                } else if(_b.timer >= 30 && _b.timer < 40 ) {
                    _b.cx += _b.xSpeed * 2.5
                    _b.cy += _b.ySpeed * 2.5
                } else if(_b.timer >= 40 && _b.timer < 130 ) {
                    _b.cx += _b.xSpeed * 0.01
                    _b.cy += _b.ySpeed * 0.01
                }else{
                    _b.cx += _b.xSpeed * 0.5
                    _b.cy += _b.ySpeed * 0.5
                }
            }

            else if (_b.type == 'cirno_freeze') {
                //冻结
                _b.cx += _b.xSpeed
                _b.cy += _b.ySpeed
            }

            if(_b.type == 'cirno_ice_mirror'){

                //判断边界，折射
                if (_b.cx >= this.node.width || _b.cx <= 0) {
                    _b.xSpeed *= -1
                    _b.refractCount ++
                    //只会折射5次
                    if(_b.refractCount>=5){
                        this.elfBullets[i].node.destroy()
                        this.elfBullets.splice(i, 1)
                        _flag = false
                    }
                }

            }else{
                //判断边界，销毁
                if (_b.cx >= this.node.width || _b.cx <= 0) {
                    // this.elfBullets[i].node.visible = false
                    this.elfBullets[i].node.destroy()
                    this.elfBullets.splice(i, 1)
                    _flag = false
                }

                if (_b.cy >= this.node.height || _b.cy <= 0) {
                    // this.elfBullets[i].node.visible = false
                    this.elfBullets[i].node.destroy()
                    this.elfBullets.splice(i, 1)
                    _flag = false
                }
            }

            if(_flag){
                this.elfBullets[i].node.x = this.elfBullets[i].cx
                this.elfBullets[i].node.y = this.elfBullets[i].cy
            }

            //与玩家碰撞检测

            let bRect = {
                x: _b.node.x - _b.node.width / 2,
                y: _b.node.y + _b.node.height / 2,
                width: _b.node.width,
                height: _b.node.height,
            }

            let reimuRect = {
                x: this.playerPro.node.x - 2,
                y: this.playerPro.node.y + 2,
                width: 4,
                height: 4
            }

            //碰撞
            if (this.collide(bRect, reimuRect)) {
                if(!this.playerPro.immune){
                    this.playerPro.hp --
                    let seq = cc.sequence( cc.blink(2, 9), cc.fadeIn(0.01));
                    this.playerPro.node.runAction(seq)
                    this.reimuBlink()
                }
            }

        }

    },

    updatePropMove(){
        let _bullet = null
        let _uuid = 0

        for(let i=0; i< this.props.length; i++){
            let _p = this.props[i]
            _p.timer ++

            // 道具移动
            if(_p.timer<= 30){
                _p.node.y += 1.5
            }else{
                _p.node.y -= 2.5
            }

            //与玩家碰撞检测

            let pRect = {
                x: _p.node.x - _p.node.width / 2,
                y: _p.node.y + _p.node.height / 2,
                width: _p.node.width,
                height: _p.node.height,
            }

            let reimuRect = {
                x: this.playerPro.node.x - 15,
                y: this.playerPro.node.y + 15,
                width: 30,
                height: 30
            }

            if (this.collide(pRect, reimuRect)) {
                //拾取道具

                if(_p.type == 0){
                    this.playerPro.atk++
                    if(this.playerPro.atk >= 30){
                        this.playerPro.atk = 30
                    }
                }else if(_p.type == 1){
                    this.gamePro.score += this.random_num(25,75)
                    this.gameScore.string = this.gamePro.score
                }else if(_p.type == 2){
                    this.gamePro.score += this.random_num(100,200)
                    this.gameScore.string = this.gamePro.score
                }

                this.props[i].node.destroy()
                this.props.splice(i, 1)

            }

            //判断边界，销毁
            if (_p.node.x >= this.node.width || _p.node.x <= 0) {
                this.props[i].node.destroy()
                this.props.splice(i, 1)
            }

            if (_p.node.y >= this.node.height || _p.node.y <= 0) {
                this.props[i].node.destroy()
                this.props.splice(i, 1)
            }

        }
    },

    /**
     * 更新玩家子弹
     */
    updatePlayerFire(){

        let _bullet = null
        let _uuid = 0

        if(this.playerPro.fire){
            //创建弹幕
            if(this.gamePro.timer % 6 == 0){

                if(this.playerPro.atk>=10 && this.playerPro.atk<20){
                    _uuid = this.getUuid()
                    _bullet = cc.instantiate(this.reimuBullet[0]);
                    // 子弹为28*28
                    _bullet.setPosition(cc.v2(this.playerPro.x, this.playerPro.y + 25));
                    this.gameBg.node.addChild(_bullet);

                    this.playerPro.bullets.push({
                        id: _uuid,
                        node: _bullet,
                        x: this.playerPro.x,
                        y:  this.playerPro.y + 25
                    })
                }else if(this.playerPro.atk>=20 && this.playerPro.atk<30){
                    {
                        _uuid = this.getUuid()
                        _bullet = cc.instantiate(this.reimuBullet[0]);
                        // 子弹为28*28
                        _bullet.setPosition(cc.v2(this.playerPro.x + 8, this.playerPro.y + 25));
                        this.gameBg.node.addChild(_bullet);

                        this.playerPro.bullets.push({
                            id: _uuid,
                            node: _bullet,
                            x: this.playerPro.x + 8,
                            y: this.playerPro.y + 25
                        })
                    }
                    {
                        _uuid = this.getUuid()
                        _bullet = cc.instantiate(this.reimuBullet[0]);
                        // 子弹为28*28
                        _bullet.setPosition(cc.v2(this.playerPro.x - 8, this.playerPro.y + 25));
                        this.gameBg.node.addChild(_bullet);

                        this.playerPro.bullets.push({
                            id: _uuid,
                            node: _bullet,
                            x: this.playerPro.x - 8,
                            y: this.playerPro.y + 25
                        })
                    }

                }

                if(this.playerPro.atk >= 30){
                    {
                        _uuid = this.getUuid()
                        _bullet = cc.instantiate(this.reimuBullet[0]);
                        // 子弹为28*28
                        _bullet.setPosition(cc.v2(this.playerPro.x, this.playerPro.y + 25));
                        this.gameBg.node.addChild(_bullet);

                        this.playerPro.bullets.push({
                            id: _uuid,
                            node: _bullet,
                            x: this.playerPro.x,
                            y:  this.playerPro.y + 25
                        })
                    }

                    {
                        _uuid = this.getUuid()
                        _bullet = cc.instantiate(this.reimuBullet[0]);
                        // 子弹为28*28
                        _bullet.setPosition(cc.v2(this.playerPro.x + 16, this.playerPro.y + 25));
                        this.gameBg.node.addChild(_bullet);

                        this.playerPro.bullets.push({
                            id: _uuid,
                            node: _bullet,
                            x: this.playerPro.x + 16,
                            y: this.playerPro.y + 25
                        })
                    }
                    {
                        _uuid = this.getUuid()
                        _bullet = cc.instantiate(this.reimuBullet[0]);
                        // 子弹为28*28
                        _bullet.setPosition(cc.v2(this.playerPro.x - 16, this.playerPro.y + 25));
                        this.gameBg.node.addChild(_bullet);

                        this.playerPro.bullets.push({
                            id: _uuid,
                            node: _bullet,
                            x: this.playerPro.x - 16,
                            y:  this.playerPro.y + 25
                        })
                    }
                }

            }

        }

        for(let i=0; i< this.playerPro.bullets.length; i++){
            let _b = this.playerPro.bullets[i]
            // 弹幕移动
            _b.node.y += this.playerPro.bullteSpeed
            //判断边界，销毁
            if (_b.node.x >= this.node.width || _b.node.x <= 0) {
                this.playerPro.bullets[i].node.destroy()
                this.playerPro.bullets.splice(i, 1)
            }

            if (_b.node.y >= this.node.height || _b.node.y <= 0) {
                this.playerPro.bullets[i].node.destroy()
                this.playerPro.bullets.splice(i, 1)
            }

        }

    },

    /**
     * 更新玩家
     */
    updatePlayerMove(){

        if(this.movePro.moveLeft){
            this.playerPro.x -= this.playerPro.speed
        } if(this.movePro.moveRight){
            this.playerPro.x += this.playerPro.speed
        } if(this.movePro.moveUp){
            this.playerPro.y += this.playerPro.speed
        } if(this.movePro.moveDown){
            this.playerPro.y -= this.playerPro.speed
        }

        //判断边界

        if (this.playerPro.x >= this.node.width) {
            this.playerPro.x = 0
        }
        if (this.playerPro.x < 0) {
            this.playerPro.x = this.node.width
        }

        if (this.playerPro.y >= this.node.height - 32){
            this.playerPro.y = this.node.height - 32
        }
        if (this.playerPro.y <= 32){
            this.playerPro.y = 32
        }

        this.playerPro.node.x = this.playerPro.x
        this.playerPro.node.y = this.playerPro.y
    },

    update (dt) {

        //暂停
        if(this.gamePro.pause){

        }else {
            //游戏中
            if(this.gamePro.state == 'gameing'){
                this.gamePro.timer ++
                this.gamePro.count ++

                if(this.gamePro.count == 60){
                    this.gamePro.count = 0
                    this.gamePro.second ++
                }

                //更新玩家移动
                this.updatePlayerMove()
                //更新玩家弹幕
                this.updatePlayerFire()
                //更新妖精移动
                this.updateElfsMove()
                //更新妖精弹幕
                this.updateElfFires()
                //更新道具移动
                this.updatePropMove()

                this.loadGameData()

            }

        }

    },

});
