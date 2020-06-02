cc.Class({
    extends: cc.Component,

    properties: {
        heroPro: {
            default: null,
        },
        gamePro: {
            default: null,
        },
        gameSprites: [cc.SpriteFrame],
        block: cc.Prefab,
        heroPrefab: cc.Prefab,
        skullPrefabs: [cc.Prefab],
        shieldPrefabs: [cc.Prefab],
        swordPrefabs: [cc.Prefab],
        pheaPrefabs: [cc.Prefab],
        bg: cc.Sprite,
        turnsLable: cc.Label,
        killLable: cc.Label,
        typeLable: cc.Label,
        nextLable: cc.Label,
        gameOverMenu: cc.Node,
        moving: false
    },    

    // use this for initialization
    onLoad() {
        this.creatBgBlocks();
        this.addTouchEvents();
        this.skulls = []
    },

    start() {
        this.initData();
        this.gameOverMenu.getComponent('GameOverMenu').init(this);
    },

    restart() {
        this.initData();
        this.updateSocreLabel();
    },

    /**
     * 初始化block 4*4的格子
     */
    creatBgBlocks() {
        var betweenWidth = 8;
        var size = (cc.winSize.width - betweenWidth * 5) / 4;
        this.blockSize = size;
        var x = betweenWidth + size/2;
        var y = size;
        var s = 0;
        // 用来存储坐标点位置
        this.positions = [];
        for (var i = 0; i < 4; i++) {
            this.positions.push([]);
            for (var j = 0; j < 4; j++) {
                var b = cc.instantiate(this.block);
                // b.getChildByName('label').active = false;
                b.attr({
                    x: x,
                    y: y,
                    width: size,
                    height: size
                });
                this.positions[i].push(cc.p(x, y));
                // b.setPosition(cc.p(x, y));
                x += (size + betweenWidth);
                this.bg.node.addChild(b);
            }
            y += (size + betweenWidth);
            x = betweenWidth + size/2;

        }
        this.gamePro = {
            turns: 0,           // 回合数
            kill: 0,            // 击杀数
            type: 'day',        // day | night
            next: 10,           // 下一个出现的回合数
        }

        // console.log(this.positions);

    },

    /**
     * 初始化游戏数据
     */
    initData() {
       //销毁所有block
        // if (this.blocks) {
        //     for (let i = 0; i < this.blocks.length; i++) {
        //         for (let j = 0; j < this.blocks[i].length; j++) {
        //             if (this.blocks[i][j]) {
        //                 this.blocks[i][j].destroy();
        //             }
        //         }
        //     }
        // }
        this.data = [];
        for (let i = 0; i < 4; i++) {
            let _tmp = []
            for(let j=0; j<4; j++){
                _tmp.push({
                    val: 0,         //block值
                    node: null,     //对应的node
                    obj: null,      //区有额外的对象
                })
            }
            this.data.push(_tmp)
        }
        //添加一个block
        this.addBlock(1, 1);
        //创建hero
        this.creatHero();
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

    copy(obj){
        let newobj = {};
        for ( let attr in obj) {
            newobj[attr] = obj[attr];
        }
        return newobj;
    },

    /**
     * 创建hero
     */
    creatHero(){
        let b = cc.instantiate(this.heroPrefab);
        b.attr({
            width: this.blockSize,
            height: this.blockSize,
        });
        // b.setColor(cc.color(128,128,128,255));
        b.setColor(cc.color(255, 255, 255, 255));
        b.setPosition(this.positions[3][0]);
        this.bg.node.addChild(b);
        this.data[3][0].node = b;
        b.scaleX = 0;
        b.scaleY = 0;
        b.runAction(cc.scaleTo(0.3, 1, 1));
        //默认设置到左上角 3,0
        this.data[3][0].val = 'Hero'
        this.data[3][0].obj = {
            hp: 10,             //生命值
            atk: 1,             //攻击力
            def: 0,             //护甲值
            shield: null,         //盾（贴图）
            sword: null,          //剑（贴图）
        }

        // console.log(this.data[3][0].node.getComponent(cc.Sprite).spriteFrame = this.birdSprite);

        // console.log(this.skullPrefabs);

        // this.data[3][0].node.getComponent(cc.Sprite).spriteFrame = this.skullPrefabs[1]

    },

    /**
     * 获取hero
     * @returns {*}
     */
    getHero(){
        for (let i = 0; i < this.data.length; i++){
            for (let j = 0; j < this.data[i].length; j++) {
                if (this.data[i][j].val == 'Hero') {
                    return this.data[i][j]
                }
            }
        }
    },

    /**
     * 获取skulls
     * @returns {Array}
     */
    getSkulls(){
        let skulls = [];
        for (let i = 0; i < this.data.length; i++){
            for (let j = 0; j < this.data[i].length; j++) {
                if (this.data[i][j].val == 'Skull' || this.data[i][j].val == 'Skull2' || this.data[i][j].val == 'Skull4' || this.data[i][j].val == 'Skull8' || this.data[i][j].val == 'Skull16' || this.data[i][j].val == 'Skull32') {
                    skulls.push(this.data[i][j])
                }
            }
        }
        return skulls;
    },

    getBlockByPos(pos){

    },

    //
    // getSkullByID(id){
    //     let _tmp = this.skulls;
    //     let _result = _tmp.filter( (item)=>{
    //         return item.id == id
    //     })
    //     return _result[0]
    // },
    // getSkullByPos(pos){
    //     let _tmp = this.skulls;
    //     for(let i=0; i<_tmp.length; i++){
    //         if(_tmp[i].x == pos.x && _tmp[i].y == pos.y)
    //             return _tmp[i]
    //     }
    //     return null
    // },

    /**
     * 获取空位
     * @returns {Array}
     */
    getEmptyLocations() {
        let emptyLocations = [];
        for (let i = 0; i < this.data.length; i++){
            for (let j = 0; j < this.data[i].length; j++) {
                if (this.data[i][j].val == 0) {
                    emptyLocations.push({
                        x: i,
                        y: j
                    });
                }
            }
        }
        return emptyLocations;
    },

    /**
     * 添加一个block
     * @param x1            x坐标
     * @param y1            y坐标
     * @returns {boolean}
     */
    addBlock(x1, y1) {
        // 空闲的位置
        let emptyLocations = this.getEmptyLocations();
        /// 没有空位了
        if (emptyLocations.length == 0) {
            return false;
        }
        //随机选取一个空位
        let p1 = Math.floor(cc.random0To1() * emptyLocations.length);
        let x = emptyLocations[p1].x
        let y = emptyLocations[p1].y
        /**
         * 赋予坐标
         *  3,0 3,1 3,2 3,3
         *  2,0 2,1 2,2 2,3
         *  1,0 1,1 1,2 1,3
         *  0,0 0,1 0,2 0,3
         */
        x = x1 || x;
        y = y1 || y;
        let numbers = ['Shield2', 'Shield4', 'Sword2', 'Sword4', 'Phea2', 'Phea4'];
        let n = Math.floor(cc.random0To1() * numbers.length);
        let b = cc.instantiate(this.getPrev(numbers[n]).cur);
        b.attr({
            width: this.blockSize,
            height: this.blockSize,
        });
        // b.setColor(this.colors[numbers[n]]);
        b.setPosition(this.positions[x][y]);
        this.bg.node.addChild(b);
        this.data[x][y].node = b;
        b.scaleX = 0;
        b.scaleY = 0;
        b.runAction(cc.scaleTo(0.3, 1, 1));
        this.data[x][y].val = numbers[n];
        return true;
    },

    /**
     * 完成移动后的操作
     */
    afterMove(moved) {
        // cc.log('afterMove');
        //移动完成
        if (moved) {
            this.addBlock();
        }

        this.gamePro.next --;

        if(this.gamePro.next<=0){
            this.gamePro.next = 10
            if(this.gamePro.type == 'day'){
                this.gamePro.type = 'night'
                //创建skull
                // 空闲的位置
                let emptyLocations = this.getEmptyLocations();
                if (emptyLocations.length == 0) {
                    return false;
                }
                let p1 = Math.floor(cc.random0To1() * emptyLocations.length);
                let x = emptyLocations[p1].x
                let y = emptyLocations[p1].y
                let b = cc.instantiate(this.skullPrefabs[0]);
                b.attr({
                    width: this.blockSize,
                    height: this.blockSize,
                });
                b.setPosition(this.positions[x][y]);
                this.bg.node.addChild(b);
                this.data[x][y].node = b;
                b.scaleX = 0;
                b.scaleY = 0;
                b.runAction(cc.scaleTo(0.3, 1, 1));
                this.data[x][y].val = 'Skull2'
                this.data[x][y].obj = {
                    hp: 10,             //生命值
                    atk: 1,             //攻击力
                    def: 0,             //护甲值
                    shield: null,         //盾（贴图）
                    sword: null,          //剑（贴图）
                }

                this.skulls.push({
                    id: this.getUuid(),
                    name: 'Skull2',
                    x,
                    y,
                    node: b,
                    hp: 10,             //生命值
                    atk: 1,             //攻击力
                    def: 0,             //护甲值
                    shield: null,         //盾（贴图）
                    sword: null,          //剑（贴图）
                })

                this.changeType('night')

            }else{
                this.gamePro.type = 'day'
                this.changeType('day')
            }
            this.typeLable.getComponent(cc.Label).string = "Type: " + this.gamePro.type;
        }

        this.nextLable.getComponent(cc.Label).string = "Next: " + this.gamePro.next;

        this.moving = false;
    },

    changeType(type){
        let _hero = this.getHero().node

        let _skulls = this.getSkulls()

        // console.log(_hero);
        if(type == 'day'){
            //切换至白天模式
            _hero.setColor(cc.color(255, 255, 255, 255));

            for(let i=0; i<_skulls.length; i++){
                _skulls[i].node.setColor(cc.color(255, 255, 255, 255));
            }

        }else{
            //切换至黑夜模式
            _hero.setColor(cc.color(128,128,128,255));
            for(let i=0; i<_skulls.length; i++){
                _skulls[i].node.setColor(cc.color(128,128,128,255));
            }
        }
    },

    isGameOver() {
        return true;
    },

    gameOver() {
    },

    /// 添加手势控制
    addTouchEvents() {
        this.node.on('touchstart', (event)=> {
            this.touchStartTime = Date.now();
            this.touchStartPoint = event.getLocation();
            return true;
        });

        this.node.on('touchmove', (event)=> {
        });

        this.node.on('touchend', (event)=> {
            this.touchEndTime = Date.now();
            this.touchEndPoint = event.getLocation();
            let vec = cc.p(this.touchEndPoint.x - this.touchStartPoint.x, this.touchEndPoint.y - this.touchStartPoint.y);
            let duration = this.touchEndTime - this.touchStartTime;
            /// 少于200ms才判断上下左右滑动
            if (duration < 400) {
                if (this.moving) {
                    return;
                }
                // x比y大，左右滑动
                let startMoveDis = 50;
                if (Math.abs(vec.x) > Math.abs(vec.y)) {
                    if (vec.x > startMoveDis){
                        // cc.log("右滑");
                        this.moving = true;
                        this.moveRight();
                    } else if (vec.x < -startMoveDis){
                        // cc.log("左滑");
                        this.moving = true;
                        this.moveLeft();
                    }
                } else { // 上下滑动
                    if(vec.y > startMoveDis){
                        // cc.log("上滑");
                        this.moving = true;
                        this.moveUp();
                    } else if (vec.y < -startMoveDis){
                        // cc.log("下滑");
                        this.moving = true;
                        this.moveDown();
                    }
                }
            }

        });
    },

    /**
     * 移动操作
     */
    moveAction(block, pos, callback) {
        let m = cc.moveTo(0.08, pos);
        let finished = cc.callFunc(()=> {
            callback();
        });
        block.runAction(cc.sequence(m, finished));
    },

    /**
     * 合并操作
     */
    mergeAction(b1, b2, num, callback) {
        b1.destroy(); // 合并后销毁

        let scale1 = cc.scaleTo(0.1,1.1);
        let scale2 = cc.scaleTo(0.1, 1);
        let mid = cc.callFunc(()=> {

        });
        let finished = cc.callFunc(()=> {
            callback();
        });
        b2.runAction(cc.sequence(scale1, mid, scale2, finished));
    },

    pickUp(name, pos){

        let _item = this.data[pos.x][pos.y]

        let _atk = 0
        let _def = 0
        let _hp = 0

        if (name == 'Shield2') _def = 2
        if (name == 'Shield4') _def = 4
        if (name == 'Shield8') _def = 8
        if (name == 'Shield16') _def = 16
        if (name == 'Shield32') _def = 32

        if (name == 'Sword2') _atk = 2
        if (name == 'Sword4') _atk = 4
        if (name == 'Sword8') _atk = 8
        if (name == 'Sword16') _atk = 16
        if (name == 'Sword32') _atk = 32

        if (name == 'Phea2') _hp = 2
        if (name == 'Phea4') _hp = 4
        if (name == 'Phea8') _hp = 8
        if (name == 'Phea16') _hp = 16
        if (name == 'Phea32') _hp = 32

        if(_atk!= 0 && _item.obj.atk < _atk){
            _item.obj.atk = _atk
        } if(_def!= 0 && _item.obj.def < _def){
            _item.obj.def = _def
        } if(_hp!= 0){
            _item.obj.hp += _hp
            if(_item.obj.hp > 10) _item.obj.hp = 10
        }

        _item.node.getChildByName("hp_label").getComponent(cc.Label).string = 'hp:' + _item.obj.hp
        _item.node.getChildByName("atk_label").getComponent(cc.Label).string = 'atk:' + _item.obj.atk
        _item.node.getChildByName("def_label").getComponent(cc.Label).string = 'def:' + _item.obj.def

    },

    getPrev(name){

        let _tmp = null
        if(name == 'Shield2'){
            _tmp = {
                cur: this.shieldPrefabs[0],
                next: this.shieldPrefabs[1],
                curName: 'Shield2',
                nextName: 'Shield4'
            }
        }
        else if(name == 'Shield4'){
            _tmp = {
                cur: this.shieldPrefabs[1],
                next: this.shieldPrefabs[2],
                curName: 'Shield4',
                nextName: 'Shield8'
            }
        }
        else if(name == 'Shield8'){
            _tmp = {
                cur: this.shieldPrefabs[2],
                next: this.shieldPrefabs[3],
                curName: 'Shield8',
                nextName: 'Shield16'
            }
        }
        else if(name == 'Shield16'){
            _tmp = {
                cur: this.shieldPrefabs[3],
                next: this.shieldPrefabs[4],
                curName: 'Shield16',
                nextName: 'Shield32'
            }
        }
        else if(name == 'Sword2'){
            _tmp = {
                cur: this.swordPrefabs[0],
                next: this.swordPrefabs[1],
                curName: 'Sword2',
                nextName: 'Sword4'
            }
        }
        else if(name == 'Sword4'){
            _tmp = {
                cur: this.swordPrefabs[1],
                next: this.swordPrefabs[2],
                curName: 'Sword4',
                nextName: 'Sword8'
            }
        }else if(name == 'Sword8'){
            _tmp = {
                cur: this.swordPrefabs[2],
                next: this.swordPrefabs[3],
                curName: 'Sword8',
                nextName: 'Sword16'
            }
        }else if(name == 'Sword16'){
            _tmp = {
                cur: this.swordPrefabs[3],
                next: this.swordPrefabs[4],
                curName: 'Sword16',
                nextName: 'Sword32'
            }
        }else if(name == 'Phea2'){
            _tmp = {
                cur: this.pheaPrefabs[0],
                next: this.pheaPrefabs[1],
                curName: 'Phea2',
                nextName: 'Phea4'
            }
        }else if(name == 'Phea4'){
            _tmp = {
                cur: this.pheaPrefabs[1],
                next: this.pheaPrefabs[2],
                curName: 'Phea4',
                nextName: 'Phea8'
            }
        }else if(name == 'Phea8'){
            _tmp = {
                cur: this.pheaPrefabs[2],
                next: this.pheaPrefabs[3],
                curName: 'Phea8',
                nextName: 'Phea16'
            }
        }else if(name == 'Phea16'){
            _tmp = {
                cur: this.pheaPrefabs[3],
                next: this.pheaPrefabs[4],
                curName: 'Phea16',
                nextName: 'Phea32'
            }
        }else if(name == 'Skull2'){
            _tmp = {
                cur: this.skullPrefabs[0],
                next: this.skullPrefabs[1],
                curName: 'Skull2',
                nextName: 'Skull4'
            }
        }else if(name == 'Skull4'){
            _tmp = {
                cur: this.skullPrefabs[1],
                next: this.skullPrefabs[2],
                curName: 'Skull4',
                nextName: 'Skull8'
            }
        }else if(name == 'Skull8'){
            _tmp = {
                cur: this.skullPrefabs[2],
                next: this.skullPrefabs[3],
                curName: 'Skull8',
                nextName: 'Skull16'
            }
        }else if(name == 'Skull16'){
            _tmp = {
                cur: this.skullPrefabs[3],
                next: this.skullPrefabs[4],
                curName: 'Skull16',
                nextName: 'Skull32'
            }
        }

        return _tmp

    },

    moveLeft() {
        // 递归移动操作
        let isMoved = false;
        let merged = [];
        for (let i = 0; i < 4; i++) {
            merged.push([0,0,0,0]);
        }
        let move = (x, y, callback)=> {
            //已经最左边了
            if (y == 0) {
                if (callback) {
                    callback();
                }
                return;
            }
            //和前一个方块不同   保持不动
            else if (this.data[x][y-1].val != 0 && this.data[x][y-1].val != this.data[x][y].val) {
                if(this.data[x][y].val == 'Hero'){
                    //day type
                    if(this.gamePro.type == 'day' && merged[x][y-1]!=2){

                        //攻击 Hero先攻 Skull反击
                        if(this.data[x][y-1].val == 'Skull2' || this.data[x][y-1].val == 'Skull4' || this.data[x][y-1].val == 'Skull8' || this.data[x][y-1].val == 'Skull16'){

                        }else{
                            //拾取道具
                            let __name = this.data[x][y-1]

                            //合并至hero块，并提升hero属性
                            merged[x][y-1] = 2;
                            let b2 = this.data[x][y-1].node;
                            let b1 = this.data[x][y].node;
                            let p = this.positions[x][y-1];
                            let b3 = cc.instantiate(this.heroPrefab);
                            b3.attr({
                                width: this.blockSize,
                                height: this.blockSize,
                            });
                            b3.setPosition(this.positions[x][y-1]);
                            //销毁当前
                            b1.destroy()
                            b2.destroy()
                            this.bg.node.addChild(b3);
                            b3.scaleX = 0;
                            b3.scaleY = 0;
                            b3.runAction(cc.scaleTo(0.1, 1, 1));
                            //解锁引用
                            this.data[x][y-1] = this.copy(this.data[x][y])
                            this.data[x][y-1].node = b3;

                            //删除当前
                            this.data[x][y].val = 0
                            this.data[x][y].node = null
                            this.data[x][y].val = 0

                            //移动完成
                            isMoved = true;

                            this.pickUp(__name, { x, y: y-1 })

                            if (callback) {
                                callback();
                            }
                        }

                    }else{
                        if (callback) {
                            callback();
                        }
                        return;
                    }

                }else if(this.data[x][y].val == 'Skull2' || this.data[x][y].val == 'Skull4' || this.data[x][y].val == 'Skull8' || this.data[x][y].val == 'Skull16'){
                    //Skull 也可以拾取道具

                    //day type
                    if(this.gamePro.type == 'day' && merged[x][y-1]!=3){

                        let __name = this.data[x][y-1].val

                        //合并至Skull块，并提升Skull属性

                        merged[x][y-1] = 3;
                        this.data[x][y].val = 0;

                        let b2 = this.data[x][y-1].node;
                        let b1 = this.data[x][y].node;
                        let p = this.positions[x][y-1];
                        this.data[x][y].node = null;

                        let b3 = cc.instantiate(this.getPrev(b1.name).cur);
                        this.data[x][y-1].val = this.getPrev(b1.name).curName

                        b3.attr({
                            width: this.blockSize,
                            height: this.blockSize,
                        });
                        b3.setPosition(this.positions[x][y-1]);

                        //销毁当前
                        b1.destroy()
                        b2.destroy()

                        this.bg.node.addChild(b3);
                        this.data[x][y-1].node = b3;
                        b3.scaleX = 0;
                        b3.scaleY = 0;
                        b3.runAction(cc.scaleTo(0.1, 1, 1));
                        //移动完成
                        isMoved = true;

                        this.pickUp(__name, { x, y: y-1 })

                        if (callback) {
                            callback();
                        }

                    }else{
                        if (callback) {
                            callback();
                        }
                        return;
                    }

                }else{
                    if (callback) {
                        callback();
                    }
                    return;
                }

            }
            // 如果和前一个方块相同  合并操作
            else if (this.data[x][y-1].val == this.data[x][y].val && !merged[x][y-1]) {

                merged[x][y-1] = 1;

                let b2 = this.data[x][y-1].node;
                let b1 = this.data[x][y].node;
                let p = this.positions[x][y-1];

                let b3 = cc.instantiate(this.getPrev(b1.name).next);

                b3.attr({
                    width: this.blockSize,
                    height: this.blockSize,
                });
                b3.setPosition(this.positions[x][y-1]);

                //销毁当前
                b1.destroy()
                b2.destroy()

                this.bg.node.addChild(b3);

                this.data[x][y-1] = this.copy(this.data[x][y])
                this.data[x][y-1].node = b3;

                this.data[x][y].val = 0;
                this.data[x][y].node = null;
                this.data[x][y].obj = null;

                b3.scaleX = 0;
                b3.scaleY = 0;
                b3.runAction(cc.scaleTo(0.1, 1, 1));
                //移动完成
                isMoved = true;
                if (callback) {
                    callback();
                }
            }
            //如果没有前一个块  移动至前一个块
            else if (this.data[x][y-1].val == 0) {
                let b = this.data[x][y].node;
                let p = this.positions[x][y-1];
                //移动块
                this.moveAction(b, p, ()=> {
                    this.data[x][y-1] = this.copy(this.data[x][y])
                    this.data[x][y].val = 0;
                    this.data[x][y].node = null;
                    this.data[x][y].obj = null;
                    move(x, y-1, callback);
                });

                isMoved = true;

                if (callback) {
                    callback();
                }

            } else {
                callback();
            }

        };

        //移动个数
        let total = 0;
        //移动进度
        let counter = 0;
        //移动的块
        let willMove = [];
        for (let y = 1; y < 4; y++) {
            for (let x = 0; x < 4; x++){
                let n = this.data[x][y].val;
                if (n != 0){
                    total += 1;
                    willMove.push({x: x, y: y});
                }
            }
        }

        //递归移动
        for (let i = 0; i < willMove.length; i++) {
            let x = willMove[i].x;
            let y = willMove[i].y;
            move(x, y, ()=> {
                counter += 1;
                if (counter == total) {
                    this.afterMove(isMoved);
                    // cc.log('counter: ' + counter + " total: " + total);
                }
            });
        }

    },

    moveRight() {
        // 递归移动操作
        let isMoved = false;
        let merged = [];
        for (let i = 0; i < 4; i++) {
            merged.push([0,0,0,0]);
        }
        let move = (x, y, callback)=> {
            if (y == 3) {
                if (callback) {
                    callback();
                }
                return;
            }
            else if (this.data[x][y+1].val != 0 && this.data[x][y+1].val != this.data[x][y].val) {

                if(this.data[x][y].val == 'Hero'){

                    //day type
                    if(this.gamePro.type == 'day' && merged[x][y+1]!=2){

                        //攻击 Hero先攻 Skull反击
                        if(this.data[x][y+1].val == 'Skull2' || this.data[x][y+1].val == 'Skull4' || this.data[x][y+1].val == 'Skull8' || this.data[x][y+1].val == 'Skull16'){

                        }else{

                            let __name = this.data[x][y+1]

                            merged[x][y+1] = 2;

                            this.data[x][y+1].node.destroy()
                            this.data[x][y+1].val = 0
                            this.data[x][y+1].obj = null
                            this.data[x][y+1].node = null

                            let b = this.data[x][y].node;
                            let p = this.positions[x][y+1];

                            this.data[x][y+1] = this.copy(this.data[x][y])

                            this.moveAction(b, p, ()=> {

                                this.data[x][y].val = 0
                                this.data[x][y].obj = null
                                this.data[x][y].node = null

                                this.pickUp(__name, { x, y: y+1 })

                                // console.log('------------[3][0]------------')
                                // console.log(this.data[3][0])
                                // console.log('------------[3][1]------------')
                                // console.log(this.data[3][1])
                                // console.log('------------[3][2]------------')
                                // console.log(this.data[3][2])
                                // console.log('------------[3][3]------------')
                                // console.log(this.data[3][3])

                                move(x, y+1, callback);


                            });



                            //拾取道具

                            //
                            // //合并至hero块，并提升hero属性
                            // merged[x][y+1] = 2;
                            // let b2 = this.data[x][y+1].node;
                            // let b1 = this.data[x][y].node;
                            // let p = this.positions[x][y+1];
                            // let b3 = cc.instantiate(this.heroPrefab);
                            // b3.attr({
                            //     width: this.blockSize,
                            //     height: this.blockSize,
                            // });
                            // b3.setPosition(this.positions[x][y+1]);
                            // //销毁当前
                            // b1.destroy()
                            // b2.destroy()
                            // this.bg.node.addChild(b3);
                            // b3.scaleX = 0;
                            // b3.scaleY = 0;
                            // b3.runAction(cc.scaleTo(0.1, 1, 1));
                            // //解锁引用
                            // this.data[x][y+1] = this.copy(this.data[x][y])
                            // this.data[x][y+1].node = b3;
                            //
                            // //删除当前
                            // this.data[x][y].val = 0
                            // this.data[x][y].node = null
                            // this.data[x][y].val = 0
                            //
                            // //移动完成
                            // isMoved = true;
                            //
                            // this.pickUp(__name, { x, y: y+1 })
                            //
                            // if (callback) {
                            //     callback();
                            // }
                        }


                    }else{

                        if (callback) {
                            callback();
                        }
                        return;
                    }

                }else{

                    if (callback) {
                        callback();
                    }
                    return;
                }


            }
            else if (this.data[x][y+1].val == this.data[x][y].val && !merged[x][y+1]) {

                merged[x][y+1] = 1;

                let b2 = this.data[x][y+1].node;
                let b1 = this.data[x][y].node;
                let p = this.positions[x][y+1]

                let b3 = cc.instantiate(this.getPrev(b1.name).next);

                b3.attr({
                    width: this.blockSize,
                    height: this.blockSize,
                });
                b3.setPosition(this.positions[x][y+1]);

                //销毁当前
                b1.destroy()
                b2.destroy()

                this.bg.node.addChild(b3);

                this.data[x][y+1] = this.copy(this.data[x][y])
                this.data[x][y+1].node = b3;

                this.data[x][y].val = 0;
                this.data[x][y].node = null;
                this.data[x][y].obj = null;

                b3.scaleX = 0;
                b3.scaleY = 0;
                b3.runAction(cc.scaleTo(0.1, 1, 1));
                //移动完成
                isMoved = true;
                if (callback) {
                    callback();
                }
            }
            else if (this.data[x][y+1].val == 0) {
                let b = this.data[x][y].node;
                let p = this.positions[x][y+1];

                this.moveAction(b, p, ()=> {

                    this.data[x][y+1] = this.copy(this.data[x][y])
                    this.data[x][y].val = 0
                    this.data[x][y].node = null
                    this.data[x][y].obj = null
                    move(x, y+1, callback);
                });

                isMoved = true;

                if (callback) {
                    callback();
                }

            } else {
                callback();
            }

        };

        let total = 0;
        let counter = 0;
        let willMove = [];
        for (let y = 2; y >=0; y--) {
            for (let x = 0; x < 4; x++){
                let n = this.data[x][y].val;
                if (n != 0){
                    total += 1;
                    willMove.push({x: x, y: y});
                }
            }
        }
        for (let i = 0; i < willMove.length; i++) {
            let x = willMove[i].x;
            let y = willMove[i].y;
            move(x, y, ()=> {
                counter += 1;
                if (counter == total) {
                    // cc.log('counter: ' + counter + " total: " + total);
                    this.afterMove(isMoved);
                }
            });
        }
    },

    moveUp() {
        // 递归移动操作
        let isMoved = false;
        let merged = [];
        for (let i = 0; i < 4; i++) {
            merged.push([0,0,0,0]);
        }
        let move = (x, y, callback) => {
            if (x == 3) {
                if (callback) {
                    callback();
                }
                return;
            }
            else if (this.data[x+1][y].val != 0 && this.data[x+1][y].val != this.data[x][y].val) {
                if(this.data[x][y].val == 'Hero'){
                    //day type
                    if(this.gamePro.type == 'day' && merged[x+1][y]!=2){

                        let __name = this.data[x+1][y].val

                        merged[x+1][y] = 2;

                        let b1 = this.data[x+1][y].node;
                        let b = this.data[x][y].node;
                        let p = this.positions[x+1][y];

                        let b3 = cc.instantiate(this.heroPrefab);

                        b3.attr({
                            width: this.blockSize,
                            height: this.blockSize,
                        });
                        b3.setPosition(this.positions[x+1][y]);

                        b.destroy()
                        b1.destroy()

                        this.bg.node.addChild(b3);

                        this.data[x+1][y] = this.copy(this.data[x][y])
                        this.data[x][y].val = 0
                        this.data[x][y].node = null
                        this.data[x][y].obj = null

                        this.data[x+1][y].node = b3;
                        b3.scaleX = 0;
                        b3.scaleY = 0;
                        b3.runAction(cc.scaleTo(0.1, 1, 1));

                        //移动完成
                        isMoved = true;

                        this.pickUp(__name, { x: x+1, y: y })

                        if (callback) {
                            callback();
                        }

                    }else{
                        if (callback) {
                            callback();
                        }
                        return;
                    }

                }else{
                    if (callback) {
                        callback();
                    }
                    return;
                }

            }
            else if (this.data[x+1][y].val == this.data[x][y].val && !merged[x+1][y]) {
                merged[x+1][y] = 1;
                let b1 = this.data[x+1][y].node;
                let b = this.data[x][y].node;
                let p = this.positions[x+1][y];
                let b3 = cc.instantiate(this.getPrev(b1.name).next);
                b3.attr({
                    width: this.blockSize,
                    height: this.blockSize,
                });
                b3.setPosition(this.positions[x+1][y]);

                b.destroy()
                b1.destroy()

                this.bg.node.addChild(b3);
                this.data[x+1][y] = this.copy(this.data[x][y])
                this.data[x][y].val = 0
                this.data[x][y].node = null
                this.data[x][y].obj = null
                this.data[x+1][y].node = b3;
                b3.scaleX = 0;
                b3.scaleY = 0;
                b3.runAction(cc.scaleTo(0.1, 1, 1));

                //移动完成
                isMoved = true;

                if (callback) {
                    callback();
                }
            }
            else if (this.data[x+1][y].val == 0) {
                let b = this.data[x][y].node;
                let p = this.positions[x+1][y];

                this.moveAction(b, p, ()=> {
                    this.data[x+1][y] = this.copy(this.data[x][y])
                    this.data[x][y].val = 0
                    this.data[x][y].node = null
                    this.data[x][y].obj = null
                    move(x+1, y, callback);
                });

                isMoved = true;

                if (callback) {
                    callback();
                }

            } else {
                callback();
            }

        };

        let total = 0;
        let counter = 0;
        let willMove = [];
        for (let x = 2; x >= 0; x--) {
            for (let y = 0; y < 4; y++){
                let n = this.data[x][y].val;
                if (n != 0){
                    total += 1;
                    willMove.push({x: x, y: y});
                }
            }
        }
        for (let i = 0; i < willMove.length; i++) {
            let x = willMove[i].x;
            let y = willMove[i].y;
            move(x, y, ()=> {
                counter += 1;
                if (counter == total) {
                    // cc.log('counter: ' + counter + " total: " + total);
                    this.afterMove(isMoved);
                }
            });
        }
    },

    moveDown() {
        // 递归移动操作
        let isMoved = false;
        let merged = [];
        for (let i = 0; i < 4; i++) {
            merged.push([0,0,0,0]);
        }
        let move = (x, y, callback)=> {
            if (x == 0) {
                if (callback) {
                    callback();
                }
                return;
            }
            else if (this.data[x-1][y].val != 0 && this.data[x-1][y].val != this.data[x][y].val) {
                if(this.data[x][y].val == 'Hero' && !merged[x-1][y]){
                    //day type
                    if(this.gamePro.type == 'day' && merged[x-1][y]!= 2){

                        let __name = this.data[x-1][y].val

                        merged[x-1][y] = 2;
                        let b1 = this.data[x-1][y].node;
                        let b = this.data[x][y].node;
                        let p = this.positions[x-1][y];
                        let b3 = cc.instantiate(this.heroPrefab);

                        b3.attr({
                            width: this.blockSize,
                            height: this.blockSize,
                        });
                        b3.setPosition(this.positions[x-1][y]);

                        b.destroy()
                        b1.destroy()

                        this.bg.node.addChild(b3);
                        this.data[x-1][y] = this.copy(this.data[x][y])
                        this.data[x][y].val = 0
                        this.data[x][y].node = null
                        this.data[x][y].obj = null
                        this.data[x-1][y].node = b3;
                        b3.scaleX = 0;
                        b3.scaleY = 0;
                        b3.runAction(cc.scaleTo(0.1, 1, 1));

                        //移动完成
                        isMoved = true;

                        this.pickUp(__name, { x: x-1, y: y})

                        if (callback) {
                            callback();
                        }

                    }else{
                        if (callback) {
                            callback();
                        }
                        return;
                    }

                }else{
                    if (callback) {
                        callback();
                    }
                    return;
                }

            }
            else if (this.data[x-1][y].val == this.data[x][y].val && !merged[x-1][y]) {
                merged[x-1][y] = 1;
                let b1 = this.data[x-1][y].node;
                let b = this.data[x][y].node;
                let p = this.positions[x-1][y];
                let b3 = cc.instantiate(this.getPrev(b1.name).next);
                b3.attr({
                    width: this.blockSize,
                    height: this.blockSize,
                });
                b3.setPosition(this.positions[x-1][y]);
                b.destroy()
                b1.destroy()
                this.bg.node.addChild(b3);
                this.data[x-1][y] = this.copy(this.data[x][y])
                this.data[x][y].val = 0
                this.data[x][y].node = null
                this.data[x][y].obj = null
                this.data[x-1][y].node = b3;
                b3.scaleX = 0;
                b3.scaleY = 0;
                b3.runAction(cc.scaleTo(0.1, 1, 1));

                //移动完成
                isMoved = true;

                if (callback) {
                    callback();
                }
            }
            else if (this.data[x-1][y].val == 0) {
                let b = this.data[x][y].node;
                let p = this.positions[x-1][y];

                this.moveAction(b, p, ()=> {

                    this.data[x-1][y] = this.copy(this.data[x][y])
                    this.data[x][y].val = 0
                    this.data[x][y].node = null
                    this.data[x][y].obj = null
                    move(x-1, y, callback);
                });

                isMoved = true;

                if (callback) {
                    callback();
                }

            } else {
                callback();
            }

        };

        let total = 0;
        let counter = 0;
        let willMove = [];
        for (let x = 1; x < 4; x++) {
            for (let y = 0; y < 4; y++){
                let n = this.data[x][y].val;
                if (n != 0){
                    total += 1;
                    willMove.push({x: x, y: y});
                }
            }
        }
        for (let i = 0; i < willMove.length; i++) {
            let x = willMove[i].x;
            let y = willMove[i].y;
            move(x, y, ()=> {
                counter += 1;
                if (counter == total) {
                    // cc.log('counter: ' + counter + " total: " + total);
                    this.afterMove(isMoved);
                }
            });
        }
    },


    updateSocreLabel() {
        // this.currentScoreLabel.getComponent(cc.Label).string = "分数: " + this.currentScore;
    }

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
