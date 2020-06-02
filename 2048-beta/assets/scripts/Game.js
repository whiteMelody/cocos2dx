cc.Class({
    extends: cc.Component,

    properties: {
        heroPro: {
            default: null,
        },
        gamePro: {
            default: null,
        },
        // 游戏音效数组
        gameAudios : [cc.AudioClip],
        // 游戏精灵数组
        gameSprites: [cc.SpriteFrame],
        // 游戏道具数组
        equipments: [cc.SpriteFrame],
        // block 方块预设对象
        block: cc.Prefab,
        // hero 预设对象
        heroPrefab: cc.Prefab,
        // 公主 预设对象
        princessPreFab: cc.Prefab,
        // 恶龙 预设对象
        dragonPreFab: cc.Prefab,
        // 敌人 预设对象
        skullPrefabs: [cc.Prefab],
        // 护甲（盾） 预设对象
        shieldPrefabs: [cc.Prefab],
        // 武器（剑） 预设对象
        swordPrefabs: [cc.Prefab],
        // 药剂 预设对象
        pheaPrefabs: [cc.Prefab],
        // 其他道具 预设对象
        propPrefabs: [cc.Prefab],
        // bg
        bg: cc.Sprite,
        // game 大背景
        gameBg: cc.Sprite,
        hpLable1: cc.Node,
        hpLable2: cc.Node,
        hpLable3: cc.Node,
        hpLable4: cc.Node,
        hpLable5: cc.Node,
        dayBg: cc.Node,
        dayState: cc.Node,
        scoreBg: cc.Node,
        scoreState: cc.Node,
        tabBars: [cc.Node],
        msgBox: cc.Node,
        msgInfo:{
            default: null,
        },
        moving: false,
        lockMove: false,
        course: 0,
        moveMissCount: 0,
    },

    // use this for initialization
    onLoad() {

        // cc.director.preloadScene('cgRoom', function () {});
        // cc.director.preloadScene('eventBook', function () {});

        // cg room button
        // this.tabBars[0].on(cc.Node.EventType.TOUCH_END, function (event) {
        //     this.toEventBook()
        // }, this);

        // event book button
        // this.tabBars[1].on(cc.Node.EventType.TOUCH_END, function (event) {
        //     this.showMenu()
        // }, this);

        // menu button
        // this.tabBars[2].on(cc.Node.EventType.TOUCH_END, function (event) {
        //     this.showSetting()
        // }, this);

        // return

        //初始化棋盘
        this.creatBgBlocks();

        // return false;
        this.addTouchEvents();

        //常驻节点
        // cc.game.addPersistRootNode(this.node);

        //初始化数据
        this.princesss = [];
        this.dragons = [];
        this.skulls = [];
        this.msgInfo ={
            index: 0,
            content: [],
            timerID: 0,
            timer: {}
        };

        this.initData();

    },

    start() {
        // this.gameOverMenu.getComponent('GameOverMenu').init(this);
    },

    toCgRoom(){
        cc.director.loadScene("cgRoom");
    },

    toEventBook(){
        cc.director.loadScene("eventBook");
    },

    restart() {
        this.initData();
    },

    /**
     * 初始化block 4*4的格子
     */
    creatBgBlocks() {

        let matrix = [
            [cc.p(110,110), cc.p(250,110), cc.p(390,110), cc.p(530,110)],
            [cc.p(110,250), cc.p(250,250), cc.p(390,250), cc.p(530,250)],
            [cc.p(110,390), cc.p(250,390), cc.p(390,390), cc.p(530,390)],
            [cc.p(110,530), cc.p(250,530), cc.p(390,530), cc.p(530,530)],
        ]

        this.positions = matrix

        this.gamePro = {
            turns: 0,           // 回合数
            kill: 0,            // 击杀数
            type: 'day',        // day | night
            course: false,       // 启用教程
            count: 0,           // 怪物波数
            next: 11,           // 下一个出现的回合数
            line: 0,            // 0 - 12
            princessLine: false,    //公主支线
            princessState: 0,       //公主线当前进度
            dragonLine: false,      //巨龙支线
            dragonState: 0,       //巨龙线当前进度
        }

        //

    },

    /**
     * 初始化游戏数据
     */
    initData() {
        if (this.blocks) {
            for (let i = 0; i < this.blocks.length; i++) {
                for (let j = 0; j < this.blocks[i].length; j++) {
                    if (this.blocks[i][j]) {
                        this.blocks[i][j].destroy();
                    }
                }
            }
        }
        this.data = [];
        this.blocks = [];
        for (let i = 0; i < 4; i++) {
            this.data.push([0,0,0,0]);
            this.blocks.push([null, null, null, null]);
        }


        //启用教程

        // this.gamePro.course = true
        // this.showMsg('谜之声', '欢迎来到2048勇者消除，用手指向左、向右、向上或向下滑动')
        // this.course = -10;

        this.creatHero(3, 0)

        //进入恶龙支线
        // this.gamePro.line = 1;
        // this.gamePro.dragonLine = true;
        // this.addDragon()

        // this.gamePro.line = 1
        // this.gamePro.dragonLine = true
        //
        // this.addSkull(1)
        // this.addSkull(1)
        // this.addSkull(1)
        // this.addSkull(1)
        //
        // this.addBlock('none')
        // this.addBlock('none')
        // this.addBlock('none')
        // this.addBlock('none')
        // this.addBlock('none')

        // this.addSkull(2, 2, 2)
        // this.addDragon()

        // this.addBlock('none','Fire')

        // this.course = 8

        // this.addBlock('Right', 1, 1, 3)
        // this.addBlock('Right', 0, 1, 2)
        // this.addBlock('Right', 3, 1, 0)

        // this.addSkull(1, 2, 0)
        // this.addBlock(1, 0)


        //测试
        // this.creatHero(3, 1)
        // this.addBlock(3, 0, 0);
        // this.addPrincess(3, 0)
        // this.addSkull(3, 3, 0)
        // this.addDragon(3, 0)

        // this.addPrincess(3, 1)
        // this.addPrincess(3, 0)
        // this.creatHero(3, 0)
        // this.addBlock(3, 0, 0);
        // this.addSkull(3, 3, 0)
        // this.addDragon(3, 0)

        // this.addSkull(3, 3, 1)
        // this.creatHero(3, 0)
        // this.addBlock(3, 0, 0);
        // this.addPrincess(3, 0)
        // this.addSkull(1, 3, 0)
        // this.addSkull(3, 3, 0)
        // this.addDragon(3, 0)

        // this.addDragon(3, 1)
        // this.creatHero(3, 0)
        // this.addBlock(3, 0, 0);
        // this.addPrincess(3, 0)
        // this.addSkull(1, 3, 0)
        // this.addSkull(3, 3, 0)
        // this.addDragon(3, 0)


        // this.addBlock(1, 3, 0);

        // this.addPrincess( 3, 1)

        // this.addDragon()

        // this.addSkull(1);
        // this.addSkull(1);
        // this.addSkull(2);
        // this.addSkull(3);
        // this.addSkull(4);

        // cc.log(this.data);
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

    isNull(obj) {
        if (obj == undefined || obj == 'undefined' || obj == null || obj == 'null' || obj == "" || obj.length == 0 || obj == 0) return true; else return false;
    },

    isRole(x, y){

        let n = this.data[x][y]

        if(n.includes('Skull')){
            //史莱姆
            return 'Skull'
        }else if(n.includes('Princess')){
            //公主
            return 'Princess'
        }else if(n.includes('Dragon')){
            //恶龙
            return 'Dragon'
        }else if(n.includes('Hero')){
            //勇者
            return 'Hero'
        }else if(n.includes('Fire')){
            //火焰陷阱
            return 'Fire'
        }else{
            //道具
            return 'prop'
        }

    },

    isHasBlock(x, y){

        let _t = []

        if(this.data[x]){
            _t = this.data[x]

            if(_t[y]){

            }else{
                return false
            }

        }else{
            return false
        }

        return true

    },

    //判断格子是否填满
    isFull() {

        if(this.gamePro.type == 'day')
            return false

        let _flag = true

        //判断全满
        for (let x = 0; x < 4; x++) {
            for (let y = 0; y < 4; y++) {
                if(this.isNull(this.data[x][y]))    _flag = false
            }
        }

        if(_flag){
            //格子全满，判断是否可以继续消除
            for (let x = 0; x < 4; x++) {
                for (let y = 0; y < 4; y++) {
                    let n = this.data[x][y];

                    if(n.includes('Skull')){
                        // //史莱姆
                        // if(this.isHasBlock(x-1, y)){
                        //     if(n.split(',')[0] == this.data[x - 1][y].split(',')[0])    _flag = false
                        // }if(this.isHasBlock(x+1, y)){
                        //     if(n.split(',')[0] == this.data[x + 1][y].split(',')[0])    _flag = false
                        // }if(this.isHasBlock(x, y-1)){
                        //     if(n.split(',')[0] == this.data[x][y - 1].split(',')[0])    _flag = false
                        // }if(this.isHasBlock(x, y+1)){
                        //     if(n.split(',')[0] == this.data[x][y + 1].split(',')[0])    _flag = false
                        // }
                    }else if(n.includes('Princess')){
                        //公主
                        //触发黑夜营救
                        if(this.isHasBlock(x-1, y)){
                            if(this.data[x - 1][y] == 'Hero')    _flag = false
                        }if(this.isHasBlock(x+1, y)){
                            if(this.data[x + 1][y] == 'Hero')    _flag = false
                        }if(this.isHasBlock(x, y-1)){
                            if(this.data[x][y - 1] == 'Hero')    _flag = false
                        }if(this.isHasBlock(x, y+1)){
                            if(this.data[x][y + 1] == 'Hero')    _flag = false
                        }
                    }else if(n.includes('Dragon')){
                        //恶龙
                        //龙不会休息
                    }else{
                        //其他
                        if(this.isHasBlock(x-1, y)){
                            if(this.data[x - 1][y] == n)    _flag = false
                        }if(this.isHasBlock(x+1, y)){
                            if(this.data[x + 1][y] == n)    _flag = false
                        }if(this.isHasBlock(x, y-1)){
                            if(this.data[x][y - 1] == n)    _flag = false
                        }if(this.isHasBlock(x, y+1)){
                            if(this.data[x][y + 1] == n)    _flag = false
                        }
                    }

                }
            }
        }

        if(_flag){
            if(this.gamePro.course){
                if(this.course == 12 ){
                    this.showMsg('谜之声', '请注意，在夜晚中网格充满后太阳会升起，立即进入白天')
                    this.course = 13;
                }
            }
        }

        // true 已满  false 未满或可消除
        return _flag;
    },

    showMsg(name, msg, callback){

        let _img = {}
        let _name = ''

        if(name == 'Hero'){
            _img = this.gameSprites[31]
            _name = '卡尔·伽蓝'
        }
        if(name == 'Princess'){
            _img = this.gameSprites[32]
            _name = '威尔士·莉莉'
        }
        if(name == 'Dragon'){
            _img = this.gameSprites[33]
            _name = '加勒亚·莱科'
        }
        else{
            _img = this.gameSprites[34]
            _name = '谜之声'
        }

        this.msgBox.opacity = 255;

        this.msgBox.getChildByName("msgBox").getChildByName("name").getComponent(cc.Label).string = _name;
        this.msgBox.getChildByName("msgBox").getChildByName("headImg").getComponent(cc.Sprite).spriteFrame = _img

        this.msgInfo.index = 0;
        this.msgInfo.content = msg.split('');

        this.msgBox.getChildByName("msgBox").getChildByName("content").getComponent(cc.Label).string = '';

        window.clearInterval(this.msgInfo.timerID)

        this.msgInfo.timerID = setInterval(()=>{
            this.msgBox.getChildByName("msgBox").getChildByName("content").getComponent(cc.Label).string += this.msgInfo.content[this.msgInfo.index];
            this.msgInfo.index++;
            if(this.msgInfo.index >= this.msgInfo.content.length){
                clearInterval(this.msgInfo.timerID)
            }
        },60)

        if(callback)
            callback()

    },

    hideMsg(){
        this.msgBox.opacity = 0
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
    creatHero(pox, poy){
        let x = 3
        let y = 0
        if(pox) x = pox
        if(poy) y = poy

        if(pox == 0) x = 0
        if(poy == 0) y = 0

        let b = cc.instantiate(this.heroPrefab);
        b.attr({
            width: this.blockSize,
            height: this.blockSize,
            info:{
                name: 'Hero',
                hp: 15,             //生命值
                atk: 1,             //攻击力
                def: 0,             //护甲值
                maxHp: 15,          //生命值上限
                maxAtk: 16,         //攻击力上限
                maxDef: 16,         //防御力上限
            }
        });
        this.bg.node.addChild(b);
        this.blocks[x][y] = b;
        b.setPosition(this.positions[x][y]);

        b.scaleX = 0;
        b.scaleY = 0;
        b.runAction(cc.scaleTo(0.3, 1, 1));

        this.data[x][y] = 'Hero'
        this.heroPro = {
            name: 'Hero',
            hp: 15,             //生命值
            atk: 1,             //攻击力
            def: 0,             //护甲值
            minHp: 15,          //生命值下限
            minAtk: 0,          //攻击力下限
            minDef: 0,          //防御力下限
            maxHp: 15,          //生命值上限
            maxAtk: 16,         //攻击力上限
            maxDef: 16,         //防御力上限
            node: b,            //node
        }

        //显示武器和护盾
        b.getChildByName("panel-atk").opacity = 255
        b.getChildByName("panel-def").opacity = 255

        //基础数值
        b.getChildByName("panel-hp").getChildByName("val").getComponent(cc.Label).string = '' + this.heroPro.hp
        b.getChildByName("panel-atk").getChildByName("val").getComponent(cc.Label).string = '' + this.heroPro.atk
        b.getChildByName("panel-def").getChildByName("val").getComponent(cc.Label).string = '' + this.heroPro.def

    },

    /**
     * 获取hero
     * @returns {*}
     */
    getHero(){
        for (let i = 0; i < 4; i++){
            for (let j = 0; j < 4; j++) {
                if (this.data[i][j] == 'Hero') {
                    return this.blocks[i][j]
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
                if (this.data[i][j].val == 'Skull' || this.data[i][j].val == 'Skull2' || this.data[i][j].val == 'Skull4' || this.data[i][j].val == 'Skull8' || this.data[i][j].val == 'Skull16') {
                    skulls.push(this.data[i][j])
                }
            }
        }
        return skulls;
    },

    getBlockByPos(pos){

    },

    getSkullByID(id){
        let _tmp = this.skulls;
        let _result = _tmp.filter( (item)=>{
            return item.id == id
        })
        return _result[0]
    },
    getDragonByID(id){
        let _tmp = this.dragons;
        let _result = _tmp.filter( (item)=>{
            return item.id == id
        })
        return _result[0]
    },
    getPrincessByID(id){
        let _tmp = this.princesss;
        let _result = _tmp.filter( (item)=>{
            return item.id == id
        })
        return _result[0]
    },

    /**
     * 获取空位
     * @returns {Array}
     */
    getEmptyLocations() {
        // 空闲的位置
        let emptyLocations = [];
        for (let i = 0; i < this.data.length; i++){
            for (let j = 0; j < this.data[i].length; j++) {
                if (this.data[i][j] == 0) {
                    emptyLocations.push(i * 4 + j);
                }
            }
        }
        return emptyLocations;
    },

    getBlocks(){
        let blocks = [];
        for (let i = 0; i < this.data.length; i++){
            for (let j = 0; j < this.data[i].length; j++) {
                if (this.data[i][j] != 0) {
                    blocks.push(this.blocks[i][j]);
                }
            }
        }
        return blocks;
    },

    getRoles(){
        let blocks = [];
        for (let i = 0; i < this.data.length; i++){
            for (let j = 0; j < this.data[i].length; j++) {
                if (this.data[i][j] != 0) {

                    if(this.blocks[i][j].getChildByName("atk_label").getComponent(cc.Label).string !=''){
                        blocks.push(this.blocks[i][j]);
                    }
                }
            }
        }
        return blocks;
    },

    /**
     * 添加一个block
     * @param moveDirection     移动方向
     * @param prop              道具索引
     * @param pox               x坐标
     * @param poy               y坐标
     * @returns {boolean}
     */
    addBlock(moveDirection, prop, pox, poy) {


        // 空闲的位置
        let emptyLocations = this.getEmptyLocations();
        // cc.log(emptyLocations);
        /// 没有空位了
        if (emptyLocations.length == 0) {
            return false;
        }
        let p1 = Math.floor(cc.random0To1() * emptyLocations.length);
        p1 = emptyLocations[p1];
        let x = Math.floor(p1/4);
        let y = Math.floor(p1%4);
        let _name = ''

        if(pox) x = pox
        if(poy) y = poy

        if(pox == 0) x = 0
        if(poy == 0) y = 0

        // let numbers = ['Shield2', 'Shield4', 'Sword2', 'Sword4', 'Phea2', 'Phea4'];
        let numbers = ['Phea2', 'Sword2', 'Shield2'];
        // let numbers = ['Phea2', 'Phea4'];
        // let numbers = ['Sword2'];
        let n = Math.floor(cc.random0To1() * numbers.length);

        if(prop) _name = prop
        else _name = numbers[n]

        //暂时冻结moveing
        this.lockMove = true;

        let b = cc.instantiate(this.getPrev(_name).cur);
        b.attr({
            width: this.blockSize,
            height: this.blockSize,
        });
        // b.setColor(this.colors[numbers[n]]);
        b.setPosition(this.positions[x][y]);
        // b.getChildByName('label').getComponent(cc.Label).string = numbers[n];

        //- 2018年8月22日18:25:27
        //优化道具刷新事件，现在会额外触发一次移动

        this.bg.node.addChild(b);
        this.blocks[x][y] = b;
        b.scaleX = 0;
        b.scaleY = 0;
        let show = cc.scaleTo(0.1, 1, 1);
        b.runAction(show);

        this.data[x][y] = _name

        if(moveDirection != 'none'){
            this.checkEmpty(moveDirection, x, y, ()=>{
                this.lockMove = false;
            })
        }else{
            this.lockMove = false;
        }

        return true;
    },

    checkEmpty(moveDirection, x, y, callback){

        if(moveDirection == 'Left'){
            if(y == 0){
                if(callback){
                    callback()
                }
                return true
            }else{
                //move to 0
                if(this.data[x][y-1]){
                    //判断和前一位是否相同
                    if(this.data[x][y] == this.data[x][y-1]){
                        //合并
                        this.data[x][y-1] = this.getPrev(this.data[x][y]).nextName
                        this.data[x][y] = 0;
                        let b2 = this.blocks[x][y-1];
                        let b1 = this.blocks[x][y];
                        let p = this.positions[x][y-1];
                        this.blocks[x][y] = null;
                        this.moveAction(b1, p, ()=> {
                            this.mergeAction(b1, b2, this.data[x][y-1], ()=>{
                                this.checkEmpty(moveDirection, x, y-1, callback)
                            });
                        });
                    }else{
                        //不相同
                        if(callback){
                            callback()
                        }
                        return true
                    }
                }else{
                    this.data[x][y-1] = this.data[x][y];
                    this.data[x][y] = 0;
                    let b = this.blocks[x][y];
                    let p = this.positions[x][y-1];
                    this.blocks[x][y-1] = b;
                    this.blocks[x][y] = null;

                    this.moveAction(b, p, ()=>{
                        this.checkEmpty(moveDirection, x, y-1, callback)
                        // move(x, y-1, callback);
                    });

                }
            }
        }else if(moveDirection == 'Right'){
            if(y == 3){
                if(callback){
                    callback()
                }
                return true
            }else{
                //move to 0
                if(this.data[x][y+1]){
                    //判断和前一位是否相同
                    if(this.data[x][y] == this.data[x][y+1]){
                        //合并
                        this.data[x][y+1] = this.getPrev(this.data[x][y]).nextName
                        this.data[x][y] = 0;
                        let b2 = this.blocks[x][y+1];
                        let b1 = this.blocks[x][y];
                        let p = this.positions[x][y+1];
                        this.blocks[x][y] = null;
                        this.moveAction(b1, p, ()=> {
                            this.mergeAction(b1, b2, this.data[x][y+1], ()=>{
                                this.checkEmpty(moveDirection, x, y+1, callback)
                            });
                        });
                    }else{
                        //不相同
                        if(callback){
                            callback()
                        }
                        return true
                    }

                }else{
                    this.data[x][y+1] = this.data[x][y];
                    this.data[x][y] = 0;
                    let b = this.blocks[x][y];
                    let p = this.positions[x][y+1];
                    this.blocks[x][y+1] = b;
                    this.blocks[x][y] = null;

                    this.moveAction(b, p, ()=>{
                        this.checkEmpty(moveDirection, x, y+1, callback)
                        // move(x, y-1, callback);
                    });

                }
            }
        }else if(moveDirection == 'Up'){
            if(x == 3){
                if(callback){
                    callback()
                }
                return true
            }else{
                //move to 0
                if(this.data[x+1][y]){
                    //判断和前一位是否相同
                    if(this.data[x][y] == this.data[x+1][y]){
                        //合并
                        this.data[x+1][y] = this.getPrev(this.data[x][y]).nextName
                        this.data[x][y] = 0;
                        let b2 = this.blocks[x+1][y];
                        let b1 = this.blocks[x][y];
                        let p = this.positions[x+1][y];
                        this.blocks[x][y] = null;
                        this.moveAction(b1, p, ()=> {
                            this.mergeAction(b1, b2, this.data[x+1][y], ()=>{
                                this.checkEmpty(moveDirection, x+1, y, callback)
                            });
                        });
                    }else{
                        //不相同
                        if(callback){
                            callback()
                        }
                        return true
                    }

                }else{
                    this.data[x+1][y] = this.data[x][y];
                    this.data[x][y] = 0;
                    let b = this.blocks[x][y];
                    let p = this.positions[x+1][y];
                    this.blocks[x+1][y] = b;
                    this.blocks[x][y] = null;

                    this.moveAction(b, p, ()=>{
                        this.checkEmpty(moveDirection, x+1, y, callback)
                        // move(x, y-1, callback);
                    });

                }
            }

        }else if(moveDirection == 'Down'){
            if(x == 0){
                if(callback){
                    callback()
                }
                return true
            }else{
                //move to 0
                if(this.data[x-1][y]){
                    //判断和前一位是否相同
                    if(this.data[x][y] == this.data[x-1][y]){
                        //合并
                        this.data[x-1][y] = this.getPrev(this.data[x][y]).nextName
                        this.data[x][y] = 0;
                        let b2 = this.blocks[x-1][y];
                        let b1 = this.blocks[x][y];
                        let p = this.positions[x-1][y];
                        this.blocks[x][y] = null;
                        this.moveAction(b1, p, ()=> {
                            this.mergeAction(b1, b2, this.data[x-1][y], ()=>{
                                this.checkEmpty(moveDirection, x-1, y, callback)
                            });
                        });
                    }else{
                        //不相同
                        if(callback){
                            callback()
                        }
                        return true
                    }

                }else{
                    this.data[x-1][y] = this.data[x][y];
                    this.data[x][y] = 0;
                    let b = this.blocks[x][y];
                    let p = this.positions[x-1][y];
                    this.blocks[x-1][y] = b;
                    this.blocks[x][y] = null;

                    this.moveAction(b, p, ()=>{
                        this.checkEmpty(moveDirection, x-1, y, callback)
                        // move(x, y-1, callback);
                    });

                }
            }
        }
    },

    addDragon(pox, poy){

        let _id = this.getUuid()

        let x = 0
        let y = 0

        let _x = 0
        let _y = 0

        //崭新的出场方式
        for (let i = 0; i < 4; i++){
            for (let j = 0; j < 4; j++) {
                if (this.data[i][j] == 'Hero') {
                    _x = i
                    _y = j
                    break
                }
            }
        }

        if(this.isHasBlock(_x+2, _y+2)){
            x = _x + 2
            y = _y + 2
        }else if(this.isHasBlock(_x-2, _y-2)){
            x = _x - 2
            y = _y - 2
        }else if(this.isHasBlock(_x-2, _y+2)){
            x = _x - 2
            y = _y + 2
        }else if(this.isHasBlock(_x+2, _y-2)){
            x = _x + 2
            y = _y - 2
        }

        // //摧毁周围所有单位
        // //左
        // if(this.isHasBlock(x-1,y)){
        //     this.blocks[x-1][y].destroy()
        //     this.data[x-1][y] = 0
        // }
        // //右
        // if(this.isHasBlock(x+1,y)){
        //     this.blocks[x+1][y].destroy()
        //     this.data[x+1][y+1] = 0
        // }
        // //上
        // if(this.isHasBlock(x,y+1)){
        //     this.blocks[x][y+1].destroy()
        //     this.data[x][y+1] = 0
        // }
        // //下
        // if(this.isHasBlock(x,y-1)){
        //     this.blocks[x][y-1].destroy()
        //     this.data[x][y-1] = 0
        // }
        // //左上
        // if(this.isHasBlock(x+1,y-1)){
        //     this.blocks[x+1][y-1].destroy()
        //     this.data[x+1][y-1] = 0
        //     this.addBlock('none','Fire')
        // }
        // //左下
        // if(this.isHasBlock(x-1,y-1)){
        //     this.blocks[x-1][y-1].destroy()
        //     this.data[x-1][y-1] = 0
        //     this.addBlock('none','Fire')
        // }
        // //右上
        // if(this.isHasBlock(x+1,y+1)){
        //     this.blocks[x+1][y+1].destroy()
        //     this.data[x+1][y+1] = 0
        //     this.addBlock('none','Fire')
        // }
        // //右下
        // if(this.isHasBlock(x-1,y+1)){
        //     this.blocks[x-1][y+1].destroy()
        //     this.data[x-1][y+1] = 0
        //     this.addBlock('none','Fire')
        // }

        //销毁所有史莱姆 转为火焰

        for (let i = 0; i < 4; i++){
            for (let j = 0; j < 4; j++) {
                if(this.data[i][j]){
                    if (this.data[i][j].includes('Skull')) {
                        //将史莱姆转为火焰
                        this.blocks[i][j].destroy()
                        this.data[i][j] = 0
                        this.addBlock('none', 'Fire', i, j)
                    }
                }
            }
        }

        if(this.data[x][y]){
            this.blocks[x][y].destroy()
            this.data[x][y] = 0
        }

        //崭新的出场方式
        for (let i = 0; i < 4; i++){
            for (let j = 0; j < 4; j++) {
                if(i == _x && j == _y){
                    //hero
                }else if(i == x && j == y){
                    //dragon
                }else if(this.data[i][j] == 'Fire'){
                    //fire
                }else{
                    //烧毁其他单位
                    if(this.data[i][j]){
                        this.blocks[i][j].destroy()
                        this.data[i][j] = 0
                    }
                }
            }
        }

        if(pox) x = pox
        if(poy) y = poy

        if(pox == 0) x = 0
        if(poy == 0) y = 0

        let b = cc.instantiate(this.dragonPreFab);

        b.attr({
            id: _id,
            width: this.blockSize,
            height: this.blockSize,
        });
        b.setPosition(this.positions[x][y]);
        this.bg.node.addChild(b);
        this.blocks[x][y] = b;
        b.scaleX = 0;
        b.scaleY = 0;
        b.runAction(cc.scaleTo(0.3, 1, 1));
        this.data[x][y] = 'Dragon,' + _id

        this.dragons.push({
            id: _id,
            name: 'Dragon',
            x,
            y,
            node: b,
            hp: 99,             //生命值
            atk: 6,             //攻击力
            def: 6,             //护甲值
            maxHp: 999,           //最大生命值
            maxAtk: 16,          //最大攻击力
            maxDef: 16,          //最大防御力
        })

        //显示武器和护盾
        b.getChildByName("panel-atk").opacity = 255
        b.getChildByName("panel-def").opacity = 255

        //基础数值
        b.getChildByName("panel-hp").getChildByName("val").getComponent(cc.Label).string = 99
        b.getChildByName("panel-atk").getChildByName("val").getComponent(cc.Label).string = 6
        b.getChildByName("panel-def").getChildByName("val").getComponent(cc.Label).string = 6

    },

    addPrincess(pox, poy){

        let _id = this.getUuid()

        let x = 0
        let y = 0

        // 空闲的位置
        let emptyLocations = this.getEmptyLocations();
        if (emptyLocations.length == 0) {
            //销毁道具后出现
            for (let i = 0; i < 4; i++){
                if(x || y) break
                for (let j = 0; j < 4; j++) {
                    if(x || y) break
                    if(this.data[i][j].includes('Dragon')){
                        //dragon
                    }else if(this.data[i][j].includes('Skull')){
                        //Skull
                    }else if(this.data[i][j].includes('Princess')){
                        //Princess
                    }else if(this.data[i][j].includes('Hero')){
                        //Hero
                    }else if(this.data[i][j].includes('Fire')){
                        //Fire
                    }else{
                        //销毁一个道具
                        if(this.data[i][j]){
                            x = i
                            y = j
                            this.blocks[i][j].destroy()
                            this.data[i][j] = 0
                        }
                    }
                }
            }

        }else{
            let p1 = Math.floor(cc.random0To1() * emptyLocations.length);
            p1 = emptyLocations[p1];
            x = Math.floor(p1/4);
            y = Math.floor(p1%4);
        }


        if(pox) x = pox
        if(poy) y = poy

        if(pox == 0) x = 0
        if(poy == 0) y = 0

        let b = cc.instantiate(this.princessPreFab);

        b.attr({
            id: _id,
            width: this.blockSize,
            height: this.blockSize,
        });
        b.setPosition(this.positions[x][y]);
        this.bg.node.addChild(b);
        this.blocks[x][y] = b;
        b.scaleX = 0;
        b.scaleY = 0;
        b.runAction(cc.scaleTo(0.3, 1, 1));
        this.data[x][y] = 'Princess,' + _id

        this.princesss.push({
            id: _id,
            name: 'Princess',
            x,
            y,
            node: b,
            hp: 20,             //生命值
            atk: 0,             //攻击力
            def: 0,             //护甲值
            maxHp: 0,           //最大生命值
            maxAtk: 0,          //最大攻击力
            maxDef: 0,          //最大防御力
        })

        //判断白昼、黑夜
        if(this.gamePro.type == 'day') {
            b.getChildByName("img").getComponent(cc.Sprite).spriteFrame = this.gameSprites[this.getPrev('Princess').imgSource.spriteIndex]
            b.getChildByName("nightBg").opacity = 0
        }else{
            b.getChildByName("img").getComponent(cc.Sprite).spriteFrame = this.gameSprites[this.getPrev('Princess').imgSource.nightSpriteIndex]
            b.getChildByName("nightBg").opacity = 255
        }

        //隐藏武器和护盾
        b.getChildByName("panel-atk").opacity = 0
        b.getChildByName("panel-def").opacity = 0

        //基础数值
        b.getChildByName("panel-hp").getChildByName("val").getComponent(cc.Label).string = 20
        b.getChildByName("panel-atk").getChildByName("val").getComponent(cc.Label).string = 0
        b.getChildByName("panel-def").getChildByName("val").getComponent(cc.Label).string = 0

    },

    addSkull(lv, pox, poy){

        //启用教程
        if(this.gamePro.course){
            if(this.course == 6){
                this.showMsg('谜之声', '敌人也可以拾取道具，现在，击杀这个敌人')
                this.course = 7;
            }else if(this.course >= 8){
                return
            }
        }

        let _id = this.getUuid()

        let x = 0
        let y = 0

        // 空闲的位置
        let emptyLocations = this.getEmptyLocations();
        if (emptyLocations.length == 0) {
            //销毁道具后出现
            for (let i = 0; i < 4; i++){
                if(x || y) break
                for (let j = 0; j < 4; j++) {
                    if(x || y) break
                    if(this.data[i][j]){
                        if(this.data[i][j].includes('Dragon')){
                            //dragon
                        }else if(this.data[i][j].includes('Skull')){
                            //Skull
                        }else if(this.data[i][j].includes('Princess')){
                            //Princess
                        }else if(this.data[i][j].includes('Hero')){
                            //Hero
                        }else if(this.data[i][j].includes('Fire')){
                            //Fire
                        }else{
                            //销毁一个道具
                            if(this.data[i][j]){
                                x = i
                                y = j
                                this.blocks[i][j].destroy()
                                this.data[i][j] = 0
                            }
                        }
                    }
                }
            }

        }else{
            let p1 = Math.floor(cc.random0To1() * emptyLocations.length);
            p1 = emptyLocations[p1];
            x = Math.floor(p1/4);
            y = Math.floor(p1%4);
        }

        if(pox) x = pox
        if(poy) y = poy

        if(pox == 0) x = 0
        if(poy == 0) y = 0

        let skullInfo = {  }

        if(lv){
            if(lv == 1){
                skullInfo = {
                    name: 'Skull2',
                    id: _id,
                    lv: 1,  //1-4
                    hp: 10,
                    atk: 1,
                    def: 0,
                    maxHp: 10,
                    maxAtk: 16,
                    maxDef: 16,
                }
            }else if(lv == 2){
                skullInfo = {
                    name: 'Skull4',
                    id: _id,
                    lv: 2,  //1-4
                    hp: 15,
                    atk: 2, //自带短剑
                    def: 0, //
                    maxHp: 15,
                    maxAtk: 16,
                    maxDef: 16,
                }
            }else if(lv == 3){
                skullInfo = {
                    name: 'Skull8',
                    id: _id,
                    lv: 3,  //1-4
                    hp: 30,
                    atk: 4, //自带长剑
                    def: 2, //自带圆盾
                    maxHp: 30,
                    maxAtk: 16,
                    maxDef: 16,
                }
            }else if(lv == 4){
                skullInfo = {
                    name: 'Skull16',
                    id: _id,
                    lv: 4,  //1-4
                    hp: 99,
                    atk: 4, //自带长剑
                    def: 4, //自带大盾
                    maxHp: 99,
                    maxAtk: 16,
                    maxDef: 16,
                }
            }
        }


        let b = cc.instantiate(this.skullPrefabs[lv - 1]);

        b.attr({
            id: _id,
            width: this.blockSize,
            height: this.blockSize,
            info: skullInfo,
        });
        b.setPosition(this.positions[x][y]);
        this.bg.node.addChild(b);
        this.blocks[x][y] = b;
        b.scaleX = 0;
        b.scaleY = 0;
        b.runAction(cc.scaleTo(0.3, 1, 1));
        this.data[x][y] = skullInfo.name + ',' + _id

        this.skulls.push({
            id: _id,
            name: skullInfo.name,
            x,
            y,
            node: b,
            hp: skullInfo.hp,               //生命值
            atk: skullInfo.atk,             //攻击力
            def: skullInfo.def,             //护甲值
            maxHp: skullInfo.maxHp,         //最大生命值
            maxAtk: skullInfo.maxAtk,       //最大攻击力
            maxDef: skullInfo.maxDef,       //最大防御力
        })

        //判断白昼、黑夜
        if(this.gamePro.type == 'day') {
            b.getChildByName("img").getComponent(cc.Sprite).spriteFrame = this.gameSprites[this.getPrev(skullInfo.name).imgSource.spriteIndex]
            b.getChildByName("nightBg").opacity = 0
        }else{
            b.getChildByName("img").getComponent(cc.Sprite).spriteFrame = this.gameSprites[this.getPrev(skullInfo.name).imgSource.nightSpriteIndex]
            b.getChildByName("nightBg").opacity = 255
        }

        //显示武器和护盾
        b.getChildByName("panel-atk").opacity = 255
        b.getChildByName("panel-def").opacity = 255

        //基础数值
        b.getChildByName("panel-hp").getChildByName("val").getComponent(cc.Label).string = '' + skullInfo.hp
        b.getChildByName("panel-atk").getChildByName("val").getComponent(cc.Label).string = '' + skullInfo.atk
        b.getChildByName("panel-def").getChildByName("val").getComponent(cc.Label).string = '' + skullInfo.def



    },

    /**
     * 完成移动后的操作
     */
    afterMove(moved, moveBlocks, moveDirection) {
        // cc.log('afterMove');
        if (moved) {
            //- 2018年5月9日16:58:03
            //暂时去掉回弹事件
            moveBlocks  = false

            if(moveBlocks){
                //带有回弹事件

                let blocks = this.getBlocks();

                for(let i=0; i<blocks.length; i++){
                    for(let j=0; j<moveBlocks.length; j++){
                        if(blocks[i].uuid == moveBlocks[j].id && (blocks[i].x != moveBlocks[j].x || blocks[i].y != moveBlocks[j].y)){

                            let _x = blocks[i].x
                            let _y = blocks[i].y

                            if(moveDirection == 'Left'){
                                blocks[i].runAction(cc.sequence(
                                    cc.moveTo(0.08, _x - 50, _y),
                                    cc.moveTo(0.08, _x + 20, _y),
                                    cc.moveTo(0.08, _x,_y)));
                            }else if(moveDirection == 'Right'){
                                blocks[i].runAction(cc.sequence(
                                    cc.moveTo(0.08, _x + 50, _y),
                                    cc.moveTo(0.08, _x - 20, _y),
                                    cc.moveTo(0.08, _x,_y)));
                            }else if(moveDirection == 'Up'){
                                blocks[i].runAction(cc.sequence(
                                    cc.moveTo(0.08, _x, _y - 50),
                                    cc.moveTo(0.08, _x, _y + 20),
                                    cc.moveTo(0.08, _x,_y)));
                            }else if(moveDirection == 'Down'){
                                blocks[i].runAction(cc.sequence(
                                    cc.moveTo(0.08, _x, _y + 50),
                                    cc.moveTo(0.08, _x, _y - 20),
                                    cc.moveTo(0.08, _x,_y)));
                            }
                        }
                    }
                }

            }

            //-- 2018年8月13日17:49:30
            //-- 测试this.datas

            if(this.gamePro.course){
                if(this.course >= 6){
                    this.addBlock(moveDirection);
                }
            }else{
                this.addBlock(moveDirection);
            }

            //天数计时
            this.dayState.height += 128 / 20
            //敌人出现计时
            if(this.gamePro.course){
                if(this.course<=7 || this.course>=11 )
                    this.scoreState.height += 128 / this.gamePro.next
            }else{

                if(this.gamePro.type == 'day'){
                    this.scoreState.height += 128 / this.gamePro.next
                }else{
                    this.scoreState.height += 128 / this.gamePro.next / 2
                }
            }

            if(this.dayState.height >= 128){
                //切换白昼/黑夜
                this.dayState.height = 0;
                if(this.gamePro.type == 'day'){
                    this.gamePro.type = 'night'
                    this.changeType('night')

                    if(this.gamePro.course){
                        this.showMsg('谜之声', '夜晚敌人无法攻击，利用这个机会，制作最好的物品为白天的战斗做好准备，当网格充满时太阳将会升起')
                        this.course = 11;
                    }

                }else{
                    this.gamePro.type = 'day'
                    this.changeType('day')

                    if(this.gamePro.course){
                        this.course = 13;
                    }

                }

            }

            if(this.gamePro.line == 0){
                //常规模式
                if(this.scoreState.height >= 128){
                    this.scoreState.height = 0;
                    //
                    //判断Score
                    if(this.gamePro.count <=3){
                        //最开始出现3个辣鸡史莱姆
                        this.addSkull(1);
                    }else if(this.gamePro.count > 4 && this.gamePro.count <= 10){
                        // 4-10交替出现辣鸡史莱姆和普通史莱姆
                        if(this.gamePro.count %2 == 0)  this.addSkull(2);
                        else    this.addSkull(1);
                    }else if(this.gamePro.count > 11 && this.gamePro.count <= 19){
                        // 11-19交替出现辣鸡史莱姆和普通史莱姆和高级史莱姆
                        if(this.gamePro.count %3 == 0)  this.addSkull(1);
                        else if(this.gamePro.count %3 == 1)  this.addSkull(2);
                        else    this.addSkull(3);
                    }else if( this.gamePro.count > 20){
                        // 20后每10个史莱姆会出现一个史莱姆长老
                        if(this.gamePro.count % 10 == 0){
                            this.addSkull(4);
                        }else{
                            //随机出现1-3的史莱姆
                            this.addSkull(this.random_num(1,3))
                        }
                    }

                    //改变next和count
                    this.gamePro.next = this.random_num(8,15)
                    this.gamePro.count ++

                }


            }else if(this.gamePro.line == 1){
                //恶龙之怒
                if(this.gamePro.dragonLine){
                    if(this.scoreState.height >= 128){
                        this.scoreState.height = 0;

                        //火焰特殊计时器启动
                        this.addBlock('none', 'Fire')

                        //改变next和count
                        this.gamePro.next = this.random_num(5,10)
                        this.gamePro.count ++

                    }
                }
            }else if(this.gamePro.line == 2){
                //公主回归
                if(this.scoreState.height >= 128){
                    this.scoreState.height = 0;
                    //
                    //判断Score
                    if(this.gamePro.count <=3){
                        //最开始出现3个辣鸡史莱姆
                        this.addSkull(1);
                    }else if(this.gamePro.count > 4 && this.gamePro.count <= 10){
                        // 4-10交替出现辣鸡史莱姆和普通史莱姆
                        if(this.gamePro.count %2 == 0)  this.addSkull(2);
                        else    this.addSkull(1);
                    }else if(this.gamePro.count > 11 && this.gamePro.count <= 19){
                        // 11-19交替出现辣鸡史莱姆和普通史莱姆和高级史莱姆
                        if(this.gamePro.count %3 == 0)  this.addSkull(1);
                        else if(this.gamePro.count %3 == 1)  this.addSkull(2);
                        else    this.addSkull(3);
                    }else if( this.gamePro.count > 20){
                        // 20后每10个史莱姆会出现一个史莱姆长老
                        if(this.gamePro.count % 10 == 0){
                            this.addSkull(4);
                        }else{
                            //随机出现1-3的史莱姆
                            this.addSkull(this.random_num(1,3))
                        }
                    }

                    //改变next和count
                    this.gamePro.next = this.random_num(8,15)
                    this.gamePro.count ++

                }
            }

            // console.log(this.dayState)

        }

        if (this.isFull()) {
            //判断没有可以移动的位置

            if(this.gamePro.type == 'night'){
                //切换至白昼
                this.gamePro.type = 'day'
                this.changeType('day')
                this.dayState.height = 0
            }
            // console.log('已满')
        }else{
            // console.log(false)
            //播放move音效
            cc.audioEngine.playEffect(this.gameAudios[0], false);
        }

        this.moving = false;

        if(this.gamePro.course){

            if(this.course == -10){
                this.showMsg('谜之声', '这是勇者，左上角为角色生命值，左下角为角色攻击力，右下角为角色防御力')
                this.course = -9;
            }
            else if(this.course == -9){
                this.showMsg('谜之声', '左上角的图标是时间，充能满后会切换白天和黑夜')
                this.course = -8;
            }
            else if(this.course == -8){
                this.showMsg('谜之声', '右上角的图标是计分板，充能满后会出现一个敌人')
                this.course = -7;
            }
            else if(this.course == -7){
                this.showMsg('谜之声', '每次滑动时间加1，并随机产生一个道具，移动到道具处即可拾取，现在，请拾取生命调剂')
                this.addBlock(moveDirection, 'Phea2');
                this.course = 1;
            }else if(this.course == 4){
                this.course = 5;
            }
            else if(this.course == 5){
                this.showMsg('谜之声', '左上角计分板充满后将会召唤一个敌人，请注意时间')
                this.course = 6;
            }else if(this.course == 13 ){
                this.course = 14;
            }else if(this.course == 14 ){
                this.course = 15;
            }else if(this.course == 15 ){
                this.showMsg('谜之声', '恭喜您已经完成了所有教程，请在游戏中探索更多内容吧')
                this.course = 16;
            }else if(this.course == 16 ){
                this.course = 17;
            }else if(this.course == 17 ){
                this.course = 18;
            }else if(this.course == 18 ){
                this.gamePro.course = false
                this.hideMsg()
            }
        }



    },

    changeType(type){

        if(type == 'day'){
            this.gameBg.spriteFrame = this.equipments[0]
            this.dayBg.spriteFrame = this.equipments[2]
        }else{
            this.gameBg.spriteFrame = this.equipments[1]
            this.dayBg.spriteFrame = this.equipments[3]
        }

        for(let i=0; i<4; i++){
            for(let j=0; j<4; j++){
                let _block = this.blocks[i][j]

                if(_block){
                    if(_block.name == 'Hero' || _block.name.includes('Princess') || _block.name.includes('Skull') || _block.name.includes('Dragon')) {
                        if(type == 'day') {
                            _block.getChildByName("img").getComponent(cc.Sprite).spriteFrame = this.gameSprites[this.getPrev(_block.name).imgSource.spriteIndex]
                            _block.getChildByName("nightBg").opacity = 0
                        }else{

                            // console.log(this.getPrev(_block.name));
                            _block.getChildByName("img").getComponent(cc.Sprite).spriteFrame = this.gameSprites[this.getPrev(_block.name).imgSource.nightSpriteIndex]
                            _block.getChildByName("nightBg").opacity = 255
                        }
                    }
                }
            }
        }

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

            if(this.lockMove){
                return
            }

            if (duration < 400) {
                if (this.moving) {
                    this.moveMissCount ++
                    //判断连续超过3次恢复
                    if(this.moveMissCount < 3)  return;
                }
                // x比y大，左右滑动
                let startMoveDis = 50;
                if (Math.abs(vec.x) > Math.abs(vec.y)) {
                    if (vec.x > startMoveDis){
                        // cc.log("右滑");
                        this.moveMissCount = 0
                        this.moving = true;
                        this.moveRight();
                    } else if (vec.x < -startMoveDis){
                        // cc.log("左滑");
                        this.moveMissCount = 0
                        this.moving = true;
                        this.moveLeft();
                    }
                } else { // 上下滑动
                    if(vec.y > startMoveDis){
                        // cc.log("上滑");
                        this.moveMissCount = 0
                        this.moving = true;
                        this.moveUp();
                    } else if (vec.y < -startMoveDis){
                        // cc.log("下滑");
                        this.moveMissCount = 0
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
        block.runAction(cc.sequence(cc.moveTo(0.08, pos), cc.callFunc(()=> {
                callback();
            })
        ));
    },

    /**
     * 合并操作
     */
    mergeAction(b1, b2, name, callback) {

        if(this.gamePro.course){
            if(this.course == 11 ){
                this.showMsg('谜之声', '将两种相同类型的物品组合在一起，就可以制作出更强大的物品，物品最高可以合成为16')
                this.course = 12;
            }
        }

        b1.destroy(); // 合并后销毁
        let scale1 = cc.scaleTo(0.1,1.1);
        let scale2 = cc.scaleTo(0.1, 1);

        // console.log(b1)
        // //
        // console.log(b2)
        //
        // console.log(name)

        // console.log(this.getPrev(name))

        //
        // console.log(b1.getChildByName("img"))
        // console.log(b1.getChildByName("img"))
        // console.log(b1.getChildByName("img").getComponent(cc.Sprite))
        //
        // console.log(this.gameSprites[this.getPrev(name).spriteIndex])
        //
        // b1.getChildByName("img").getComponent(cc.Sprite).spriteFrame = this.gameSprites[this.getPrev(name).spriteIndex]

        // return false;

        let mid = cc.callFunc(()=> {
            if(name != 0){

                //节省性能，只销毁1个block，改变另一个block的属性
                let _props = this.getPrev(name)
                //改变贴图
                b2.getChildByName("img").getComponent(cc.Sprite).spriteFrame = this.gameSprites[_props.imgSource.spriteIndex]
                //改变贴图size
                b2.getChildByName("img").width = _props.imgSource.width
                b2.getChildByName("img").height = _props.imgSource.height
                //改变数值
                b2.getChildByName("panel-hp").getChildByName("val").getComponent(cc.Label).string = '' + _props.initData.val
                //改变name
                b2.name = _props.curName
                // console.log(b2)
            }
        });
        let finished = cc.callFunc(()=> {
            callback();
        });
        b2.runAction(cc.sequence(scale1, mid, scale2, finished));
    },

    /**
     * 史莱姆合并升级
     * @param b1
     * @param b2
     * @param name
     * @param callback
     */
    mergeSkull(b1, b2, name, pos, skull1, skull2, callback){

        //判断b2的LV
        let lv = 1

        if(skull1.includes('Skull2')){
            lv = 1
        }else if(skull1.includes('Skull4')){
            lv = 2
        }if(skull1.includes('Skull8')){
            lv = 3
        }if(skull1.includes('Skull16')){
            lv = 4
        }
        lv ++

        if(lv >= 4)
            lv = 4

        //合并属性
        let skullInfo = {}

        let s1 = this.getSkullByID(skull1.split(",")[1])
        let s2 = this.getSkullByID(skull2.split(",")[1])

        if(lv == 1){
            skullInfo = {
                name: 'Skull2,' + s2.id,
                id: s2.id,
                lv: 1,  //1-4
                hp: 10,
                atk: 1,
                def: 0,
                maxHp: 10,
                maxAtk: 16,
                maxDef: 16,
            }
        }else if(lv == 2){
            skullInfo = {
                name: 'Skull4,' + s2.id,
                id: s2.id,
                lv: 2,  //1-4
                hp: 20,
                atk: 0, //
                def: 2, //自带圆盾
                maxHp: 20,
                maxAtk: 16,
                maxDef: 16,
            }
        }else if(lv == 3){
            skullInfo = {
                name: 'Skull8,' + s2.id,
                id: s2.id,
                lv: 3,  //1-4
                hp: 40,
                atk: 4, //自带长剑
                def: 0,
                maxHp: 40,
                maxAtk: 16,
                maxDef: 16,
            }
        }else if(lv == 4){
            skullInfo = {
                name: 'Skull16,' + s2.id,
                id: s2.id,
                lv: 4,  //1-4
                hp: 99,
                atk: 4, //自带长剑
                def: 2, //自带圆盾
                maxHp: 99,
                maxAtk: 16,
                maxDef: 16,
            }
        }

        //合并武器防具
        if(s1.atk > s2.atk){
            skullInfo.atk = s1.atk
        }if(s1.def > s2.def){
            skullInfo.def = s1.def
        }

        //覆盖b2
        for(let i=0; i< this.skulls.length; i++){
            //销毁b1
            if(this.skulls[i].id == s1.id){
                this.skulls.splice(i, 1)
            }
        }

        for(let i=0; i< this.skulls.length; i++){
            //覆盖b2
            if(this.skulls[i].id == s2.id){
                this.skulls[i].name = skullInfo.name;
                this.skulls[i].hp = skullInfo.hp;
                this.skulls[i].atk = skullInfo.atk;
                this.skulls[i].def = skullInfo.def;
                this.skulls[i].maxHp = skullInfo.maxHp;
                this.skulls[i].maxAtk = skullInfo.maxAtk;
                this.skulls[i].maxDef = skullInfo.maxDef;
            }
        }

        b1.destroy(); // 合并后销毁

        let scale1 = cc.scaleTo(0.1,1.1);
        let scale2 = cc.scaleTo(0.1, 1);
        let mid = cc.callFunc(()=> {

            if(name != 0){

                //节省性能，只销毁1个block，改变另一个block的属性
                let _props = this.getPrev(skullInfo.name)
                //改变贴图
                b2.getChildByName("img").getComponent(cc.Sprite).spriteFrame = this.gameSprites[_props.imgSource.spriteIndex]
                //改变贴图size
                b2.getChildByName("img").width = _props.imgSource.width
                b2.getChildByName("img").height = _props.imgSource.height
                //改变数值
                b2.getChildByName("panel-hp").getChildByName("val").getComponent(cc.Label).string = '' + skullInfo.hp
                b2.getChildByName("panel-atk").getChildByName("val").getComponent(cc.Label).string = '' + skullInfo.atk
                b2.getChildByName("panel-def").getChildByName("val").getComponent(cc.Label).string = '' + skullInfo.def
                //改变name
                b2.name = skullInfo.name

            }

            // b2.getComponent(cc.Sprite).spriteFrame = this.gameSprites[this.getPrev(name).spriteIndex]
            //
            // //更新b2属性
            // b2.getChildByName("hp_label").getComponent(cc.Label).string = '' + skullInfo.hp
            // b2.getChildByName("atk_label").getComponent(cc.Label).string = '' + skullInfo.atk
            // b2.getChildByName("def_label").getComponent(cc.Label).string = '' + skullInfo.def

        });
        let finished = cc.callFunc(()=> {
            callback();
        });
        b2.runAction(cc.sequence(scale1, mid, scale2, finished));
    },

    fight(role1, role2, moveDirection, callback){

        //启用教程
        if(this.gamePro.course){

            if(this.course == 7){
                this.showMsg('谜之声', '先攻者会先进行伤害，如果目标死亡则不会反击')
                this.course = 8;
            }else if(this.course == 8){
                this.showMsg('谜之声', '当你攻击你的对手时，首先会被盾牌抵挡，然后才会受到伤害。请注意，你的武器每次攻击也会磨损，攻击-1')
                this.course = 9;
            }
        }

        let _x = role1.node.x
        let _y = role1.node.y
        let _x2 = role2.node.x
        let _y2 = role2.node.y
        let role1Fall = false
        let role2Fall = false

        this.hpLable2.x = _x2 - 20
        this.hpLable2.y = _y2 + 20
        this.hpLable2.zIndex = 10
        this.hpLable2.active = true
        this.hpLable2.getChildByName("label_hp").getComponent(cc.Label).string = '-'+ role1.obj.atk
        this.hpLable2.runAction(cc.sequence(cc.moveTo(1, _x2-20, _y2 + 80), cc.callFunc(()=> {
                this.hpLable2.active = false
            })
        ));

        role2.obj.def -= role1.obj.atk

        if(role2.obj.def <= 0 ){
            role2.obj.hp += role2.obj.def
            role2.obj.def = 0
            //播放攻击音效
            // cc.audioEngine.playEffect(this.gameAudios[5], false);
        }else{
            //播放攻击音效
            // cc.audioEngine.playEffect(this.gameAudios[3], false);
        }
        //武器耐久-1
        if(role1.obj.atk > 1){
            role1.obj.atk --
        }

        if(role2.obj.hp <= 0){
            //击杀目标
            if(this.gamePro.course) {
                if (this.course == 9) {
                    this.showMsg('谜之声', '摧毁尽可能多的史莱姆，并使你的得分达到一个记录')
                    this.course = 10;
                }
            }

            if(role2.name == 'Hero'){
                // game over
                console.log('gameover')
            }else{
                //销毁敌方对象
                for(let i=0; i< this.skulls.length; i++){
                    if(this.skulls[i].id == role2.obj.id){
                        this.skulls.splice(i, 1)
                    }
                }
                this.gamePro.kill ++
                this.scoreBg.getChildByName("val").getComponent(cc.Label).string = '' + this.gamePro.kill
            }

            this.data[role2.pos.x][role2.pos.y] = 0
            this.blocks[role2.pos.x][role2.pos.y] = null;
            role2.node.destroy()
            role2Fall = true

            //更新role1数据
            if(!role1Fall){
                role1.node.getChildByName("panel-hp").getChildByName("val").getComponent(cc.Label).string = '' + role1.obj.hp
                role1.node.getChildByName("panel-atk").getChildByName("val").getComponent(cc.Label).string = '' + role1.obj.atk
                role1.node.getChildByName("panel-def").getChildByName("val").getComponent(cc.Label).string = '' + role1.obj.def
            }

            // callback()
            // return
        }

        //显示伤害值
        let mid = cc.callFunc(()=> {

            if(role2Fall){
                callback()
                return
            }

            this.hpLable1.x = _x - 20
            this.hpLable1.y = _y + 20
            this.hpLable1.zIndex = 10
            this.hpLable1.active = true
            this.hpLable1.getChildByName("label_hp").getComponent(cc.Label).string = '-'+ role2.obj.atk
            this.hpLable1.runAction(cc.sequence(cc.moveTo(1, _x-20, _y + 80), cc.callFunc(()=> {
                    this.hpLable1.active = false
                })
            ));

            role1.obj.def -= role2.obj.atk
            if(role1.obj.def <= 0 ){
                role1.obj.hp += role1.obj.def
                role1.obj.def = 0
                // cc.audioEngine.playEffect(this.gameAudios[1], false);
            }else{
                //播放攻击音效
                // cc.audioEngine.playEffect(this.gameAudios[3], false);
            }
            //武器耐久-1
            if(role2.obj.atk > 1){
                role2.obj.atk --
            }

            //更新数据
            if(role1.obj.hp <= 0){
                //击杀目标

                if(role1.name == 'Hero'){
                    // game over
                    console.log('gameover')
                }else{
                    //销毁敌方对象
                    for(let i=0; i< this.skulls.length; i++){
                        if(this.skulls[i].id == role1.obj.id){
                            this.skulls.splice(i, 1)
                        }
                    }
                    this.gamePro.kill ++
                    this.scoreBg.getChildByName("val").getComponent(cc.Label).string = '' + this.gamePro.kill
                }

                this.data[role1.pos.x][role1.pos.y] = 0
                this.blocks[role1.pos.x][role1.pos.y] = null;
                role1.node.destroy()
                role1Fall = true

                //更新role2数据
                if(!role2Fall){
                    role2.node.getChildByName("panel-hp").getChildByName("val").getComponent(cc.Label).string = '' + role2.obj.hp
                    role2.node.getChildByName("panel-atk").getChildByName("val").getComponent(cc.Label).string = '' + role2.obj.atk
                    role2.node.getChildByName("panel-def").getChildByName("val").getComponent(cc.Label).string = '' + role2.obj.def
                }

                // callback()

                // return

            }else{

                //更新数据
                if(!role1Fall){
                    role1.node.getChildByName("panel-hp").getChildByName("val").getComponent(cc.Label).string = '' + role1.obj.hp
                    role1.node.getChildByName("panel-atk").getChildByName("val").getComponent(cc.Label).string = '' + role1.obj.atk
                    role1.node.getChildByName("panel-def").getChildByName("val").getComponent(cc.Label).string = '' + role1.obj.def
                }
                if(!role2Fall){
                    role2.node.getChildByName("panel-hp").getChildByName("val").getComponent(cc.Label).string = '' + role2.obj.hp
                    role2.node.getChildByName("panel-atk").getChildByName("val").getComponent(cc.Label).string = '' + role2.obj.atk
                    role2.node.getChildByName("panel-def").getChildByName("val").getComponent(cc.Label).string = '' + role2.obj.def
                }

                // callback()
            }

            //更新role1、role2原始数据

            if(!role2Fall){

                if(moveDirection == 'Left'){
                    role2.node.runAction(cc.sequence(
                        cc.moveTo(0.08, _x2 - 25, _y2),
                        cc.moveTo(0.08, _x2 + 100, _y2),
                        cc.moveTo(0.08, _x2 - 50, _y2),
                        cc.moveTo(0.08, _x2, _y2),
                        cc.callFunc(()=> {
                            if(callback){
                                callback()
                            }
                        })
                    ))
                }else if(moveDirection == 'Right'){
                    role2.node.runAction(cc.sequence(
                        cc.moveTo(0.08, _x2 + 25, _y2),
                        cc.moveTo(0.08, _x2 - 100, _y2),
                        cc.moveTo(0.08, _x2 + 50, _y2),
                        cc.moveTo(0.08, _x2, _y2),
                        cc.callFunc(()=> {
                            if(callback){
                                callback()
                            }
                        })
                    ))
                }else if(moveDirection == 'Up'){
                    role2.node.runAction(cc.sequence(
                        cc.moveTo(0.08, _x2, _y2 - 25),
                        cc.moveTo(0.08, _x2, _y2 + 100),
                        cc.moveTo(0.08, _x2, _y2 - 50),
                        cc.moveTo(0.08, _x2, _y2),
                        cc.callFunc(()=> {
                            if(callback){
                                callback()
                            }
                        })
                    ))
                }else if(moveDirection == 'Down'){
                    role2.node.runAction(cc.sequence(
                        cc.moveTo(0.08, _x2, _y2 + 25),
                        cc.moveTo(0.08, _x2, _y2 - 100),
                        cc.moveTo(0.08, _x2, _y2 + 50),
                        cc.moveTo(0.08, _x2, _y2),
                        cc.callFunc(()=> {
                            if(callback){
                                callback()
                            }
                        })
                    ))
                }
            }
        });

        if(!role1Fall){
            if (moveDirection == 'Left') {
                role1.node.runAction(cc.sequence(
                    cc.moveTo(0.08, _x - 100, _y),
                    cc.moveTo(0.08, _x + 50, _y),
                    cc.moveTo(0.08, _x, _y),
                    mid));
            } else if (moveDirection == 'Right') {
                role1.node.runAction(cc.sequence(
                    cc.moveTo(0.08, _x + 100, _y),
                    cc.moveTo(0.08, _x - 50, _y),
                    cc.moveTo(0.08, _x, _y),
                    mid));
            } else if (moveDirection == 'Up') {
                role1.node.runAction(cc.sequence(
                    cc.moveTo(0.08, _x, _y - 100),
                    cc.moveTo(0.08, _x, _y + 50),
                    cc.moveTo(0.08, _x, _y),
                    mid));
            } else if (moveDirection == 'Down') {
                role1.node.runAction(cc.sequence(
                    cc.moveTo(0.08, _x, _y + 100),
                    cc.moveTo(0.08, _x, _y - 50),
                    cc.moveTo(0.08, _x, _y),
                    mid));
            }
        }
    },

    rescuePrincess(name, pos){
        let _item = this.blocks[pos.x][pos.y]

        let val = this.data[pos.x][pos.y]

        //显示武器和护盾
        _item.getChildByName("panel-atk").opacity = 255
        _item.getChildByName("panel-def").opacity = 255

        //基础数值
        _item.getChildByName("panel-hp").getChildByName("val").getComponent(cc.Label).string = '' + this.heroPro.hp
        _item.getChildByName("panel-atk").getChildByName("val").getComponent(cc.Label).string = '' + this.heroPro.atk
        _item.getChildByName("panel-def").getChildByName("val").getComponent(cc.Label).string = '' + this.heroPro.def

        //销毁公主
        for(let i=0; i< this.princesss.length; i++){
            if(this.princesss[i].id == name.split(',')[1]){
                this.princesss.splice(i, 1)
            }
        }

        console.log('公主营救成功')

    },

    pickUp(name, pos, moveDirection){

        let _item = this.blocks[pos.x][pos.y]

        let val = this.data[pos.x][pos.y]

        let _atk = 0
        let _def = 0
        let _hp = 0

        if (name == 'Shield2') _def = 2
        if (name == 'Shield4') _def = 4
        if (name == 'Shield8') _def = 8
        if (name == 'Shield16') _def = 16

        if (name == 'Sword2') _atk = 2
        if (name == 'Sword4') _atk = 4
        if (name == 'Sword8') _atk = 8
        if (name == 'Sword16') _atk = 16

        if (name == 'Phea2') _hp = 2
        if (name == 'Phea4') _hp = 4
        if (name == 'Phea8') _hp = 8
        if (name == 'Phea16') _hp = 999


        if(val.includes('Skull')){
            //Skull拾取道具

            let _skull = this.getSkullByID(val.split(",")[1])

            //Hero拾取道具
            if(_atk!= 0 && _skull.atk < _atk){
                _skull.atk = _atk
                if(_atk > _skull.maxAtk)
                    _skull.atk = _skull.maxAtk
            } if(_def!= 0 && _skull.def < _def){
                _skull.def = _def
                if(_def > _skull.maxDef)
                    _skull.def = _skull.maxDef
            } if(_hp!= 0){
                _skull.hp += _hp
                if(_skull.hp > _skull.maxHp)
                    _skull.hp = _skull.maxHp
            }

            //显示武器和护盾
            _item.getChildByName("panel-atk").opacity = 255
            _item.getChildByName("panel-def").opacity = 255

            //基础数值
            _item.getChildByName("panel-hp").getChildByName("val").getComponent(cc.Label).string = '' + _skull.hp
            _item.getChildByName("panel-atk").getChildByName("val").getComponent(cc.Label).string = '' + _skull.atk
            _item.getChildByName("panel-def").getChildByName("val").getComponent(cc.Label).string = '' + _skull.def

            if(this.gamePro.course){
                this.showMsg('谜之声', '敌人也可以拾取道具，拾取道具后会使你的战斗更加艰难')
            }

        }else if(val.includes('Dragon')){
            //Dragon拾取道具

            let _dragon = this.getDragonByID(val.split(",")[1])

            //拾取道具
            if(_atk!= 0 && _dragon.atk < _atk){
                _dragon.atk = _atk
                if(_atk > _dragon.maxAtk)
                    _dragon.atk = _dragon.maxAtk
            } if(_def!= 0 && _dragon.def < _def){
                _dragon.def = _def
                if(_def > _dragon.maxDef)
                    _dragon.def = _dragon.maxDef
            } if(_hp!= 0){
                _dragon.hp += _hp
                if(_dragon.hp > _dragon.maxHp)
                    _dragon.hp = _dragon.maxHp
            }

            //显示武器和护盾
            _item.getChildByName("panel-atk").opacity = 255
            _item.getChildByName("panel-def").opacity = 255

            _item.getChildByName("panel-hp").width = 50
            _item.getChildByName("panel-hp").height = 50
            _item.getChildByName("panel-hp").getChildByName("val").width = 50
            _item.getChildByName("panel-hp").getChildByName("val").height = 50

            //基础数值
            _item.getChildByName("panel-hp").getChildByName("val").getComponent(cc.Label).string = '' + _dragon.hp
            _item.getChildByName("panel-atk").getChildByName("val").getComponent(cc.Label).string = '' + _dragon.atk
            _item.getChildByName("panel-def").getChildByName("val").getComponent(cc.Label).string = '' + _dragon.def

        }else if(val.includes('Fire')){
            //Fire烧毁道具

        }else{

            if(name == 'Fire'){
                //火焰陷阱

                //获取hero的坐标

                let _x2 = _item.x
                let _y2 = _item.y

                this.hpLable2.x = _x2 - 20
                this.hpLable2.y = _y2 + 20
                this.hpLable2.zIndex = 10
                this.hpLable2.active = true
                this.hpLable2.getChildByName("label_hp").getComponent(cc.Label).string = '-4'
                this.hpLable2.runAction(cc.sequence(cc.moveTo(1, _x2-20, _y2 + 80), cc.callFunc(()=> {
                        this.hpLable2.active = false

                    })
                ));

                this.heroPro.hp -= 4

                //显示武器和护盾
                _item.getChildByName("panel-atk").opacity = 255
                _item.getChildByName("panel-def").opacity = 255

                //基础数值
                _item.getChildByName("panel-hp").getChildByName("val").getComponent(cc.Label).string = '' + this.heroPro.hp
                _item.getChildByName("panel-atk").getChildByName("val").getComponent(cc.Label).string = '' + this.heroPro.atk
                _item.getChildByName("panel-def").getChildByName("val").getComponent(cc.Label).string = '' + this.heroPro.def

                if(this.heroPro.hp <=0){
                    console.log('gameover')
                }

                return
            }

            // console.log( '拾取'+ name)

            if (name == 'Shield16' && this.gamePro.line == 0){

                this.heroPro.minDef ++

                if(this.heroPro.minDef == 1){
                    this.showMsg('谜之声', '盾徽上端有一只红舌金爪的白隼和一只白齿红舌金爪的龙',()=>{
                        setTimeout(()=>{
                            this.hideMsg()
                        },5000)
                    })
                }else if(this.heroPro.minDef == 2){
                    this.showMsg('谜之声', '左侧是一头黑牛,右侧站着一位身披斗篷的白衣老人',()=>{
                        setTimeout(()=>{
                            this.hideMsg()
                        },5000)
                    })
                }else if(this.heroPro.minDef == 3){
                    this.showMsg('谜之声', '隼、龙、牛和老人都是传说中的守护神，盾徽下端的石块代表冰岛多岩石的漫长海岸。',()=>{
                        setTimeout(()=>{
                            this.hideMsg()
                        },5000)
                    })
                }else if(this.heroPro.minDef == 4){
                    this.showMsg('谜之声', '远处看见了一个史莱姆的营地，公主应该就在那里',()=>{
                        setTimeout(()=>{
                            this.hideMsg()
                        },5000)
                    })
                }

                // 5次圣盾后开启公主支线
                //- 2018年8月24日13:30:23
                //- 支线剧情待补充
                if(this.heroPro.minDef == 5){
                    this.gamePro.line = 2;
                    this.gamePro.princessLine = true
                    this.addPrincess()

                    //公主回归
                    //台词待补充
                    this.showMsg('Princess', '...', ()=>{
                        setTimeout(()=>{
                            this.hideMsg()
                        }, 6000)
                    })

                }

            }else if (name == 'Sword16' && this.gamePro.line == 0){

                this.heroPro.minAtk ++

                if(this.heroPro.minAtk == 1){
                    this.showMsg('谜之声', '剑柄装饰得很漂亮，乌黑发亮的剑鞘上布满一排排卢恩字母和符号',()=>{
                        setTimeout(()=>{
                            this.hideMsg()
                        },5000)
                    })
                }else if(this.heroPro.minAtk == 2){
                    this.showMsg('谜之声', '剑身闪着镜子般的光芒，是用纯银打造的',()=>{
                        setTimeout(()=>{
                            this.hideMsg()
                        },5000)
                    })
                }else if(this.heroPro.minAtk == 3){
                    this.showMsg('谜之声', '剑上刻着：Narsil essenya, macil meletya.Telchar carnéron Návarotesse.',()=>{
                        setTimeout(()=>{
                            this.hideMsg()
                        },5000)
                    })
                }else if(this.heroPro.minAtk == 4){
                    this.showMsg('谜之声', '远处传来了龙的怒吼，魔法探测器震动得厉害',()=>{
                        setTimeout(()=>{
                            this.hideMsg()
                        },5000)
                    })
                }
                // 5次圣剑后开启恶龙支线
                else if(this.heroPro.minAtk == 5){
                    this.gamePro.line = 1;
                    this.gamePro.dragonLine = true;
                    this.addDragon()
                    //巨龙之怒
                    //台词待补充
                    this.showMsg('Dragon', '将一切化为灰烬...', ()=>{
                        setTimeout(()=>{
                            this.hideMsg()
                        }, 6000)
                    })
                }

            }else if (name == 'Phea16'){
                this.showMsg('谜之声', '喝下药剂，感觉迎来了第二次生命，你的最大生命值提高了',()=>{
                    setTimeout(()=>{
                        this.hideMsg()
                    },4000)
                })
                this.heroPro.maxHp += 2
            }

            //分支

            //Hero拾取道具
            if(_atk!= 0 && this.heroPro.atk < _atk){
                this.heroPro.atk = _atk
                if(_atk > this.heroPro.maxAtk)
                    this.heroPro.atk = this.heroPro.maxAtk
            } if(_def!= 0 && this.heroPro.def < _def){
                this.heroPro.def = _def
                if(_atk > this.heroPro.maxDef)
                    this.heroPro.def = this.heroPro.maxDef
            } if(_hp!= 0){
                this.heroPro.hp += _hp
                if(this.heroPro.hp > this.heroPro.maxHp)
                    this.heroPro.hp = this.heroPro.maxHp
            }

            //显示武器和护盾
             _item.getChildByName("panel-atk").opacity = 255
             _item.getChildByName("panel-def").opacity = 255

            //数值变为绿色
            // if(this.heroPro.minHp >= 0)

                // b.getChildByName("panel-hp").getChildByName("val").setColor(cc.color(0,205,0,255));
            // b.getChildByName("panel-atk").getChildByName("val").setColor(cc.color(0,205,0,255));
            //     b.getChildByName("panel-def").getChildByName("val").setColor(cc.color(0,205,0,255));

            //基础数值
            _item.getChildByName("panel-hp").getChildByName("val").getComponent(cc.Label).string = '' + this.heroPro.hp
            _item.getChildByName("panel-atk").getChildByName("val").getComponent(cc.Label).string = '' + this.heroPro.atk
            _item.getChildByName("panel-def").getChildByName("val").getComponent(cc.Label).string = '' + this.heroPro.def

            if(this.gamePro.course){
                if(this.course == 1){
                    this.showMsg('谜之声', '生命药剂可以回复你的生命，现在，请拾取武器')
                    this.addBlock(moveDirection, 'Sword2')
                    this.course = 2;
                }else if(this.course == 2){
                    this.showMsg('谜之声', '装备武器可以提高你的攻击力，装备更强大的武器可以造成更多伤害')
                    this.addBlock(moveDirection, 'Shield2')
                    this.course = 3;
                }else if(this.course == 3){
                    this.showMsg('谜之声', '装备防具可以提高你的防御力，装备更强力的防具敌人将无法伤害你')
                    this.course = 4;
                }
            }

        }

        //播放pickUp音效
        // cc.audioEngine.playEffect(this.gameAudios[4], false);


    },

    getEquipment(name){
        if(name == 'atk2')  return this.equipments[0]
        if(name == 'atk4')  return this.equipments[1]
        if(name == 'atk8')  return this.equipments[2]
        if(name == 'atk16')  return this.equipments[3]
        if(name == 'def2')  return this.equipments[5]
        if(name == 'def4')  return this.equipments[6]
        if(name == 'def8')  return this.equipments[7]
        if(name == 'def16')  return this.equipments[8]
        if(name == 'none')  return this.equipments[10]
        return null
    },

    getPrev(val){

        let _id = ''
        let name = ''

        let _tmp = null

        if(val.includes('Skull') || val.includes('Dragon') || val.includes('Princess')){
            _id = val.split(",")[1]
            name = val.split(",")[0]
        }else{
            name = val
        }

        // 主角
        if(name == 'Hero' || name == 'knight'){
            _tmp = {
                cur: this.heroPrefab,
                next: this.heroPrefab,
                curName: 'Hero',
                nextName: 'Hero',
                imgSource: {
                    spriteIndex: 0,
                    nightSpriteIndex: 1,
                    width: 75,
                    height: 120,
                },
                initData: {
                    hp: 15,             //生命值
                    atk: 1,             //攻击力
                    def: 0,             //护甲值
                    maxHp: 15,          //生命值上限
                    maxAtk: 16,         //攻击力上限
                    maxDef: 16,         //防御力上限
                }
            }
        }
        //公主
        else if(name == 'Princess'){
            _tmp = {
                cur: this.princessPrefab,
                next: this.princessPrefab,
                curName: 'Princess' + ',' +  _id,
                nextName: 'Princess' + ',' +  _id,
                imgSource: {
                    spriteIndex: 2,
                    nightSpriteIndex: 3,
                    width: 109,
                    height: 130,
                },
                initData: {
                    hp: 30,             //生命值
                    atk: 0,             //攻击力
                    def: 0,             //护甲值
                    maxHp: 0,          //生命值上限
                    maxAtk: 0,         //攻击力上限
                    maxDef: 0,         //防御力上限
                }
            }
        }
        // 幼年史莱姆
        else if(name == 'Skull2'){
            _tmp = {
                cur: this.skullPrefabs[0],
                next: this.skullPrefabs[1],
                curName: 'Skull2' + ',' +  _id,
                nextName: 'Skull4' + ',' +  _id,
                imgSource: {
                    spriteIndex: 4,
                    nightSpriteIndex: 5,
                    width: 100,
                    height: 84,
                },
                initData: {
                    hp: 10,             //生命值
                    atk: 1,             //攻击力
                    def: 0,             //护甲值
                    maxHp: 10,          //生命值上限
                    maxAtk: 16,         //攻击力上限
                    maxDef: 16,         //防御力上限
                }
            }
        }
        // 普通史莱姆
        else if(name == 'Skull4'){
            _tmp = {
                cur: this.skullPrefabs[1],
                next: this.skullPrefabs[2],
                curName: 'Skull4' + ',' +  _id,
                nextName: 'Skull8' + ',' +  _id,
                imgSource: {
                    spriteIndex: 6,
                    nightSpriteIndex: 7,
                    width: 100,
                    height: 89,
                },
                initData: {
                    hp: 15,             //生命值
                    atk: 2,             //攻击力
                    def: 0,             //护甲值
                    maxHp: 15,          //生命值上限
                    maxAtk: 16,         //攻击力上限
                    maxDef: 16,         //防御力上限
                }
            }
        }
        // 史莱姆战士
        else if(name == 'Skull8'){
            _tmp = {
                cur: this.skullPrefabs[2],
                next: this.skullPrefabs[3],
                curName: 'Skull8' + ',' +  _id,
                nextName: 'Skull16' + ',' +  _id,
                imgSource: {
                    spriteIndex: 8,
                    nightSpriteIndex: 9,
                    width: 130,
                    height: 90,
                },
                initData: {
                    hp: 30,             //生命值
                    atk: 4,             //攻击力
                    def: 2,             //护甲值
                    maxHp: 30,          //生命值上限
                    maxAtk: 16,         //攻击力上限
                    maxDef: 16,         //防御力上限
                }
            }
        }

        // 史莱姆长老
        else if(name == 'Skull16'){
            _tmp = {
                cur: this.skullPrefabs[3],
                next: this.skullPrefabs[3],
                curName: 'Skull16' + ',' +  _id,
                nextName: 'Skull16' + ',' +  _id,
                imgSource: {
                    spriteIndex: 10,
                    nightSpriteIndex: 11,
                    width: 120,
                    height: 88,
                },
                initData: {
                    hp: 99,             //生命值
                    atk: 4,             //攻击力
                    def: 4,             //护甲值
                    maxHp: 99,          //生命值上限
                    maxAtk: 16,         //攻击力上限
                    maxDef: 16,         //防御力上限
                }
            }
        }


        // 恶龙
        else if(name == 'Dragon'){
            _tmp = {
                cur: this.dragonPrefab,
                next: this.dragonPrefab,
                curName: 'Dragon' + ',' +  _id,
                nextName: 'Dragon' + ',' +  _id,
                imgSource: {
                    spriteIndex: 12,
                    nightSpriteIndex: 12,
                    width: 112,
                    height: 130,
                },
                initData: {
                    hp: 500,            //生命值
                    atk: 8,             //攻击力
                    def: 8,             //护甲值
                    maxHp: 500,         //生命值上限
                    maxAtk: 16,         //攻击力上限
                    maxDef: 16,         //防御力上限
                }
            }
        }

        //火焰陷阱 恶龙衍生物
        else if(name == 'Fire'){
            _tmp = {
                cur: this.propPrefabs[0],
                next: this.propPrefabs[1],
                curName: 'Fire',
                nextName: 'Fire',
                imgSource: {
                    spriteIndex: 35,
                    width: 128,
                    height: 128,
                },
                initData: {
                    val: 4,             //当前属性值
                    nextVal: 16,         //下一级属性值
                }
            }
        }

        // 武器2
        else if(name == 'Sword2'){
            _tmp = {
                cur: this.swordPrefabs[0],
                next: this.swordPrefabs[1],
                curName: 'Sword2',
                nextName: 'Sword4',
                imgSource: {
                    spriteIndex: 13,
                    width: 100,
                    height: 99,
                },
                initData: {
                    val: 2,             //当前属性值
                    nextVal: 4,         //下一级属性值
                }
            }
        }
        // 武器4
        else if(name == 'Sword4'){
            _tmp = {
                cur: this.swordPrefabs[1],
                next: this.swordPrefabs[2],
                curName: 'Sword4',
                nextName: 'Sword8',
                imgSource: {
                    spriteIndex: 14,
                    width: 100,
                    height: 98,
                },
                initData: {
                    val: 4,             //当前属性值
                    nextVal: 8,         //下一级属性值
                }
            }
        }
        // 武器8
        else if(name == 'Sword8'){
            _tmp = {
                cur: this.swordPrefabs[2],
                next: this.swordPrefabs[3],
                curName: 'Sword8',
                nextName: 'Sword16',
                imgSource: {
                    spriteIndex: 15,
                    width: 100,
                    height: 97,
                },
                initData: {
                    val: 8,             //当前属性值
                    nextVal: 16,         //下一级属性值
                }
            }
        }
        // 武器16
        else if(name == 'Sword16'){
            _tmp = {
                cur: this.swordPrefabs[3],
                next: this.swordPrefabs[3],
                curName: 'Sword16',
                nextName: 'Sword16',
                imgSource: {
                    spriteIndex: 16,
                    width: 98,
                    height: 100,
                },
                initData: {
                    val: 16,             //当前属性值
                    nextVal: 16,         //下一级属性值
                }
            }
        }
        // 防具2
        else if(name == 'Shield2'){
            _tmp = {
                cur: this.shieldPrefabs[0],
                next: this.shieldPrefabs[1],
                curName: 'Shield2',
                nextName: 'Shield4',
                imgSource: {
                    spriteIndex: 17,
                    width: 71,
                    height: 100,
                },
                initData: {
                    val: 2,             //当前属性值
                    nextVal: 4,         //下一级属性值
                }
            }
        }
        // 防具4
        else if(name == 'Shield4'){
            _tmp = {
                cur: this.shieldPrefabs[1],
                next: this.shieldPrefabs[2],
                curName: 'Shield4',
                nextName: 'Shield8',
                imgSource: {
                    spriteIndex: 18,
                    width: 58,
                    height: 100,
                },
                initData: {
                    val: 4,             //当前属性值
                    nextVal: 8,         //下一级属性值
                }
            }
        }
        // 防具8
        else if(name == 'Shield8'){
            _tmp = {
                cur: this.shieldPrefabs[2],
                next: this.shieldPrefabs[3],
                curName: 'Shield8',
                nextName: 'Shield16',
                imgSource: {
                    spriteIndex: 19,
                    width: 72,
                    height: 100,
                },
                initData: {
                    val: 8,             //当前属性值
                    nextVal: 16,         //下一级属性值
                }
            }
        }
        // 防具16
        else if(name == 'Shield16'){
            _tmp = {
                cur: this.shieldPrefabs[3],
                next: this.shieldPrefabs[3],
                curName: 'Shield16',
                nextName: 'Shield16',
                imgSource: {
                    spriteIndex: 20,
                    width: 66,
                    height: 100,
                },
                initData: {
                    val: 16,             //当前属性值
                    nextVal: 16,         //下一级属性值
                }
            }
        }
        // 药剂2
        else if(name == 'Phea2'){
            _tmp = {
                cur: this.pheaPrefabs[0],
                next: this.pheaPrefabs[1],
                curName: 'Phea2',
                nextName: 'Phea4',
                imgSource: {
                    spriteIndex: 21,
                    width: 28,
                    height: 100,
                },
                initData: {
                    val: 2,             //当前属性值
                    nextVal: 4,         //下一级属性值
                }
            }
        }
        // 药剂4
        else if(name == 'Phea4'){
            _tmp = {
                cur: this.pheaPrefabs[1],
                next: this.pheaPrefabs[2],
                curName: 'Phea4',
                nextName: 'Phea8',
                imgSource: {
                    spriteIndex: 22,
                    width: 70,
                    height: 100,
                },
                initData: {
                    val: 4,             //当前属性值
                    nextVal: 8,         //下一级属性值
                }
            }
        }
        // 药剂8
        else if(name == 'Phea8'){
            _tmp = {
                cur: this.pheaPrefabs[2],
                next: this.pheaPrefabs[3],
                curName: 'Phea8',
                nextName: 'Phea16',
                imgSource: {
                    spriteIndex: 23,
                    width: 52,
                    height: 100,
                },
                initData: {
                    val: 8,             //当前属性值
                    nextVal: 16,         //下一级属性值
                }
            }
        }
        // 药剂16
        else if(name == 'Phea16'){
            _tmp = {
                cur: this.pheaPrefabs[3],
                next: this.pheaPrefabs[3],
                curName: 'Phea16',
                nextName: 'Phea16',
                imgSource: {
                    spriteIndex: 24,
                    width: 100,
                    height: 88,
                },
                initData: {
                    val: 16,             //当前属性值
                    nextVal: 16,         //下一级属性值
                }
            }
        }

        return _tmp

    },

    moveLeft() {
        // 递归移动操作
        let isMoved = false;
        let merged = [];            //记录合并状态
        let moved = [];             //记录移动状态

        for (let i = 0; i < 4; i++) {
            merged.push([0,0,0,0]);
        }
        let move = (x, y, callback)=> {
            if (y == 0) {
                if (callback) {
                    isMoved = true;
                    callback();
                }
                return;
            }
            else if (this.data[x][y-1] != 0 && this.data[x][y-1] != this.data[x][y]) {
                let _r1 = this.isRole(x, y)
                let _r2 = this.isRole(x, y-1)
                if(_r1 != 'prop'){
                    if(this.gamePro.type == 'night') {
                        if(_r1 == 'Fire'){

                            if(_r2 == 'prop'){
                                if(merged[x][y-1]!=2){
                                    merged[x][y-1] = 2;
                                    let __name = this.data[x][y-1]
                                    //拾取道具
                                    this.data[x][y-1] = this.getPrev(this.data[x][y]).curName
                                    this.data[x][y] = 0;
                                    let b2 = this.blocks[x][y-1];
                                    let b1 = this.blocks[x][y];
                                    let p = this.positions[x][y-1];
                                    this.blocks[x][y] = null;
                                    this.moveAction(b1, p, ()=> {
                                        this.mergeAction(b1, b2, this.data[x][y-1], ()=>{
                                            this.pickUp(__name, { x, y: y-1 }, 'Left')
                                            isMoved = true;
                                            callback();
                                        });
                                    });
                                }else{
                                    if (callback) {
                                        isMoved = true;
                                        callback();
                                    }
                                    return;
                                }
                            }else{
                                if (callback) {
                                    isMoved = true;
                                    callback();
                                }
                                return;
                            }

                        }else{
                            if (callback) {
                                isMoved = true;
                                callback();
                            }
                            return;
                        }
                    }
                    //角色
                    if(_r2 == 'prop'){
                        //拾取道具
                        if(_r1 == 'Princess'){
                            //公主无法拾取道具
                            if (callback) {
                                isMoved = true;
                                callback();
                            }
                        }else{
                            //拾取
                            if(merged[x][y-1]!=2){
                                merged[x][y-1] = 2;
                                let __name = this.data[x][y-1]
                                //拾取道具
                                this.data[x][y-1] = this.getPrev(this.data[x][y]).curName
                                this.data[x][y] = 0;
                                let b2 = this.blocks[x][y-1];
                                let b1 = this.blocks[x][y];
                                let p = this.positions[x][y-1];
                                this.blocks[x][y] = null;
                                this.moveAction(b1, p, ()=> {
                                    this.mergeAction(b1, b2, this.data[x][y-1], ()=>{
                                        this.pickUp(__name, { x, y: y-1 }, 'Left')
                                        isMoved = true;
                                        callback();
                                    });
                                });
                            }else{
                                if (callback) {
                                    isMoved = true;
                                    callback();
                                }
                                return;
                            }
                        }
                    }else{
                        //其他角色
                        if(_r1 == 'Hero'){
                            //Hero先行动
                            if(_r2 == 'Princess'){
                                //营救公主
                                if(merged[x][y-1]!=2){
                                    merged[x][y-1] = 2;
                                    let __name = this.data[x][y-1]
                                    //拾取道具
                                    this.data[x][y-1] = this.getPrev(this.data[x][y]).curName
                                    this.data[x][y] = 0;
                                    let b2 = this.blocks[x][y-1];
                                    let b1 = this.blocks[x][y];
                                    let p = this.positions[x][y-1];
                                    this.blocks[x][y] = null;
                                    this.moveAction(b1, p, ()=> {
                                        this.mergeAction(b1, b2, this.data[x][y-1], ()=>{
                                            this.rescuePrincess(__name, { x, y: y-1 })
                                            isMoved = true;
                                            callback();
                                        });
                                    });
                                }else{
                                    if (callback) {
                                        isMoved = true;
                                        callback();
                                    }
                                    return;
                                }
                            }else if(_r2 == 'Fire'){
                                //火焰陷阱
                                if(merged[x][y-1]!=2){
                                    merged[x][y-1] = 2;
                                    let __name = this.data[x][y-1]
                                    //拾取道具
                                    this.data[x][y-1] = this.getPrev(this.data[x][y]).curName
                                    this.data[x][y] = 0;
                                    let b2 = this.blocks[x][y-1];
                                    let b1 = this.blocks[x][y];
                                    let p = this.positions[x][y-1];
                                    this.blocks[x][y] = null;
                                    this.moveAction(b1, p, ()=> {
                                        this.mergeAction(b1, b2, this.data[x][y-1], ()=>{
                                            this.pickUp(__name, { x, y: y-1 }, 'Left')
                                            isMoved = true;
                                            callback();
                                        });
                                    });
                                }else{
                                    if (callback) {
                                        isMoved = true;
                                        callback();
                                    }
                                    return;
                                }
                            }else{
                                //Hero 先攻模式
                                let enemy = {}
                                if(_r2 == 'Skull')
                                    enemy = this.getSkullByID(this.data[x][y-1].split(',')[1])
                                if(_r2 == 'Dragon')
                                    enemy = this.getDragonByID(this.data[x][y-1].split(',')[1])
                                this.fight({
                                    node: this.blocks[x][y],
                                    pos: {x, y},
                                    obj: this.heroPro
                                }, {
                                    node: this.blocks[x][y-1],
                                    pos: {x, y: y-1},
                                    obj: enemy
                                }, 'Left', ()=>{
                                    isMoved = true;
                                    callback();
                                })
                            }
                        }else if(_r1 == 'Princess'){
                            if(_r2 == 'Dragon' || _r2 == 'Skull'){
                                //公主先攻
                                let enemy = {}
                                if(_r2 == 'Skull')
                                    enemy = this.getSkullByID(this.data[x][y-1].split(',')[1])
                                if(_r2 == 'Dragon')
                                    enemy = this.getDragonByID(this.data[x][y-1].split(',')[1])
                                let _princess = this.getPrincessByID(this.data[x][y].split(',')[1])
                                this.fight({
                                    node: this.blocks[x][y],
                                    pos: {x, y},
                                    obj: _princess
                                }, {
                                    node: this.blocks[x][y-1],
                                    pos: {x, y: y-1},
                                    obj: enemy
                                }, 'Left', ()=>{
                                    isMoved = true;
                                    callback();
                                })
                            }else if(_r2 == 'Hero'){
                                //营救公主
                                if(merged[x][y-1]!=2){
                                    merged[x][y-1] = 2;
                                    let __name = this.data[x][y]
                                    //拾取道具
                                    this.data[x][y-1] = 'Hero'
                                    this.data[x][y] = 0;
                                    let b2 = this.blocks[x][y-1];
                                    let b1 = this.blocks[x][y];
                                    let p = this.positions[x][y-1];
                                    this.blocks[x][y] = null;
                                    this.moveAction(b1, p, ()=> {
                                        this.mergeAction(b1, b2, this.data[x][y-1], ()=>{
                                            this.rescuePrincess(__name, { x, y: y-1 })
                                            isMoved = true;
                                            callback();
                                        });
                                    });
                                }else{
                                    if (callback) {
                                        isMoved = true;
                                        callback();
                                    }
                                    return;
                                }
                            }else{
                                if (callback) {
                                    isMoved = true;
                                    callback();
                                }
                            }
                        }else if(_r1 == 'Fire'){
                            //火焰陷阱不会主动触发
                            if (callback) {
                                isMoved = true;
                                callback();
                            }
                        }else if(_r1 == 'Dragon'){
                            if(_r2 == 'Princess' || _r2 == 'Hero'){
                                //恶龙先攻
                                let enemy = {}
                                if(_r2 == 'Hero')
                                    enemy = this.heroPro
                                if(_r2 == 'Princess')
                                    enemy = this.getPrincessByID(this.data[x][y-1].split(',')[1])
                                let _dragon = this.getDragonByID(this.data[x][y].split(',')[1])

                                this.fight({
                                    node: this.blocks[x][y],
                                    pos: {x, y},
                                    obj: _dragon
                                }, {
                                    node: this.blocks[x][y-1],
                                    pos: {x, y: y-1},
                                    obj: enemy
                                }, 'Left', ()=>{
                                    isMoved = true;
                                    callback();
                                })
                            }else{
                                if (callback) {
                                    isMoved = true;
                                    callback();
                                }
                            }
                        }else if(_r1 == 'Skull'){
                            if(_r2 == 'Princess' || _r2 == 'Hero'){
                                //史莱姆先攻
                                let enemy = {}
                                if(_r2 == 'Hero')
                                    enemy = this.heroPro
                                if(_r2 == 'Princess')
                                    enemy = this.getPrincessByID(this.data[x][y-1].split(',')[1])
                                let _skull = this.getSkullByID(this.data[x][y].split(',')[1])
                                this.fight({
                                    node: this.blocks[x][y],
                                    pos: {x, y},
                                    obj: _skull
                                }, {
                                    node: this.blocks[x][y-1],
                                    pos: {x, y: y-1},
                                    obj: enemy
                                }, 'Left', ()=>{
                                    isMoved = true;
                                    callback();
                                })
                            }else if(_r2 == 'Skull'){
                                //合并史莱姆升级
                                let skull1 = this.data[x][y]
                                let skull2 = this.data[x][y-1]
                                let name1 = skull1.split(',')[0]
                                let name2 = skull2.split(',')[0]
                                if(name1 == name2){
                                    //相同属性
                                    if(name1 == 'Skull6' || name2 == 'Skul16'){
                                        //已达到最高等级
                                        isMoved = true;
                                        callback();
                                    }else{
                                        //合并升级
                                        let _next = ''
                                        if(name1 == 'Skull2')  _next = 'Skull4'
                                        if(name1 == 'Skull4')  _next = 'Skull8'
                                        if(name1 == 'Skull8')  _next = 'Skull16'
                                        merged[x][y-1] = 2;
                                        this.data[x][y-1] = _next + ',' + skull2.split(',')[1]
                                        this.data[x][y] = 0;
                                        let b2 = this.blocks[x][y-1];
                                        let b1 = this.blocks[x][y];
                                        let p = this.positions[x][y-1];
                                        this.blocks[x][y] = null;
                                        this.moveAction(b1, p, ()=> {
                                            this.mergeSkull(b1, b2, this.data[x][y-1], {x, y: y-1}, skull1, skull2, ()=>{
                                                isMoved = true;
                                                callback();
                                            });
                                        });
                                    }
                                }else{
                                    //不同属性
                                    if (callback) {
                                        isMoved = true;
                                        callback();
                                    }
                                }
                            }else{
                                //不会攻击恶龙
                                if (callback) {
                                    isMoved = true;
                                    callback();
                                }
                            }
                        }
                    }
                }else{
                    if (callback) {
                        isMoved = true;
                        callback();
                    }
                    return;
                }
            }
            else if (this.data[x][y-1] == this.data[x][y] && !merged[x][y-1]) {

                //判断最高等级
                if(this.data[x][y]){
                    if(this.data[x][y].includes('Skull16') || this.data[x][y].includes('Princess') || this.data[x][y].includes('Dragon') || this.data[x][y].includes('Phea16') || this.data[x][y].includes('Shield16') || this.data[x][y].includes('Sword16')){
                        isMoved = true;
                        callback();
                        return
                    }
                }

                merged[x][y-1] = 1;
                this.data[x][y-1] = this.getPrev(this.data[x][y]).nextName
                this.data[x][y] = 0;
                let b2 = this.blocks[x][y-1];
                let b1 = this.blocks[x][y];
                let p = this.positions[x][y-1];
                this.blocks[x][y] = null;
                this.moveAction(b1, p, ()=> {
                    this.mergeAction(b1, b2, this.data[x][y-1], ()=>{
                        isMoved = true;
                        callback()
                    });
                });
            }
            else if (this.data[x][y-1] == 0) {

                this.data[x][y-1] = this.data[x][y];
                this.data[x][y] = 0;
                let b = this.blocks[x][y];
                let p = this.positions[x][y-1];
                this.blocks[x][y-1] = b;
                this.blocks[x][y] = null;

                this.moveAction(b, p, ()=>{
                    isMoved = true;
                    move(x, y-1, callback);
                });
            } else {
                isMoved = true;
                callback();
            }

        };

        let total = 0;
        let counter = 0;
        let willMove = [];
        let willMoveNodes = []
        for (let y = 1; y < 4; y++) {
            for (let x = 0; x < 4; x++){
                let n = this.data[x][y];
                if (n != 0){
                    total += 1;
                    willMove.push({x: x, y: y});
                    let _tmp = this.copy(this.blocks[x][y])
                    willMoveNodes.push({
                        id: _tmp.uuid,
                        x: _tmp.x,
                        y: _tmp.y,
                    })
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
                    //处理回弹事件
                    this.afterMove(isMoved, willMoveNodes, 'Left');
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
                    isMoved = true;
                    callback();
                }
                return;
            }
            else if (this.data[x][y+1] != 0 && this.data[x][y+1] != this.data[x][y]) {

                let _r1 = this.isRole(x, y)
                let _r2 = this.isRole(x, y+1)
                if(_r1 != 'prop'){
                    if(this.gamePro.type == 'night') {

                        if(_r1 == 'Fire'){

                            if(_r2 == 'prop'){
                                if(merged[x][y+1]!=2){
                                    merged[x][y+1] = 2;
                                    let __name = this.data[x][y+1]
                                    //拾取道具
                                    this.data[x][y+1] = this.getPrev(this.data[x][y]).curName
                                    this.data[x][y] = 0;
                                    let b2 = this.blocks[x][y+1];
                                    let b1 = this.blocks[x][y];
                                    let p = this.positions[x][y+1];
                                    this.blocks[x][y] = null;
                                    this.moveAction(b1, p, ()=> {
                                        this.mergeAction(b1, b2, this.data[x][y+1], ()=>{
                                            this.pickUp(__name, { x, y: y+1 }, 'Left')
                                            isMoved = true;
                                            callback();
                                        });
                                    });
                                }else{
                                    if (callback) {
                                        isMoved = true;
                                        callback();
                                    }
                                    return;
                                }
                            }else{
                                if (callback) {
                                    isMoved = true;
                                    callback();
                                }
                                return;
                            }

                        }else{
                            if (callback) {
                                isMoved = true;
                                callback();
                            }
                            return;
                        }

                    }
                    //角色
                    if(_r2 == 'prop'){
                        //拾取道具
                        if(_r1 == 'Princess'){
                            //公主无法拾取道具
                            if (callback) {
                                isMoved = true;
                                callback();
                            }
                        }else{
                            //拾取
                            if(merged[x][y+1]!=2){
                                merged[x][y+1] = 2;
                                let __name = this.data[x][y+1]
                                //拾取道具
                                this.data[x][y+1] = this.getPrev(this.data[x][y]).curName
                                this.data[x][y] = 0;
                                let b2 = this.blocks[x][y+1];
                                let b1 = this.blocks[x][y];
                                let p = this.positions[x][y+1];
                                this.blocks[x][y] = null;
                                this.moveAction(b1, p, ()=> {
                                    this.mergeAction(b1, b2, this.data[x][y+1], ()=>{
                                        this.pickUp(__name, { x, y: y+1 }, 'Right')
                                        isMoved = true;
                                        callback();
                                    });
                                });
                            }else{
                                if (callback) {
                                    isMoved = true;
                                    callback();
                                }
                                return;
                            }
                        }
                    }else{
                        //角色
                        if(_r1 == 'Hero'){
                            //Hero先行动
                            if(_r2 == 'Princess'){
                                //营救公主
                                if(merged[x][y+1]!=2){
                                    merged[x][y+1] = 2;
                                    let __name = this.data[x][y+1]
                                    //拾取道具
                                    this.data[x][y+1] = this.getPrev(this.data[x][y]).curName
                                    this.data[x][y] = 0;
                                    let b2 = this.blocks[x][y+1];
                                    let b1 = this.blocks[x][y];
                                    let p = this.positions[x][y+1];
                                    this.blocks[x][y] = null;
                                    this.moveAction(b1, p, ()=> {
                                        this.mergeAction(b1, b2, this.data[x][y+1], ()=>{
                                            this.rescuePrincess(__name, { x, y: y+1 })
                                            isMoved = true;
                                            callback();
                                        });
                                    });
                                }else{
                                    if (callback) {
                                        isMoved = true;
                                        callback();
                                    }
                                    return;
                                }
                            }else if(_r2 == 'Fire'){
                                //火焰陷阱
                                if(merged[x][y+1]!=2){
                                    merged[x][y+1] = 2;
                                    let __name = this.data[x][y+1]
                                    //拾取道具
                                    this.data[x][y+1] = this.getPrev(this.data[x][y]).curName
                                    this.data[x][y] = 0;
                                    let b2 = this.blocks[x][y+1];
                                    let b1 = this.blocks[x][y];
                                    let p = this.positions[x][y+1];
                                    this.blocks[x][y] = null;
                                    this.moveAction(b1, p, ()=> {
                                        this.mergeAction(b1, b2, this.data[x][y+1], ()=>{
                                            this.pickUp(__name, { x, y: y+1 }, 'Right')
                                            isMoved = true;
                                            callback();
                                        });
                                    });
                                }else{
                                    if (callback) {
                                        isMoved = true;
                                        callback();
                                    }
                                    return;
                                }
                            }else{
                                //Hero 先攻模式
                                let enemy = {}
                                if(_r2 == 'Skull')
                                    enemy = this.getSkullByID(this.data[x][y+1].split(',')[1])
                                if(_r2 == 'Dragon')
                                    enemy = this.getDragonByID(this.data[x][y+1].split(',')[1])
                                this.fight({
                                    node: this.blocks[x][y],
                                    pos: {x, y},
                                    obj: this.heroPro
                                }, {
                                    node: this.blocks[x][y+1],
                                    pos: {x, y: y+1},
                                    obj: enemy
                                }, 'Right', ()=>{
                                    isMoved = true;
                                    callback();
                                })
                            }
                        }else if(_r1 == 'Princess'){
                            if(_r2 == 'Dragon' || _r2 == 'Skull'){
                                //公主先攻
                                let enemy = {}
                                if(_r2 == 'Skull')
                                    enemy = this.getSkullByID(this.data[x][y+1].split(',')[1])
                                if(_r2 == 'Dragon')
                                    enemy = this.getDragonByID(this.data[x][y+1].split(',')[1])
                                let _princess = this.getPrincessByID(this.data[x][y].split(',')[1])
                                this.fight({
                                    node: this.blocks[x][y],
                                    pos: {x, y},
                                    obj: _princess
                                }, {
                                    node: this.blocks[x][y+1],
                                    pos: {x, y: y+1},
                                    obj: enemy
                                }, 'Right', ()=>{
                                    isMoved = true;
                                    callback();
                                })
                            }else if(_r2 == 'Hero'){
                                //营救公主
                                if(merged[x][y+1]!=2){
                                    merged[x][y+1] = 2;
                                    let __name = this.data[x][y]
                                    //拾取道具
                                    this.data[x][y+1] = 'Hero'
                                    this.data[x][y] = 0;
                                    let b2 = this.blocks[x][y+1];
                                    let b1 = this.blocks[x][y];
                                    let p = this.positions[x][y+1];
                                    this.blocks[x][y] = null;
                                    this.moveAction(b1, p, ()=> {
                                        this.mergeAction(b1, b2, this.data[x][y+1], ()=>{
                                            this.rescuePrincess(__name, { x, y: y+1 })
                                            isMoved = true;
                                            callback();
                                        });
                                    });
                                }else{
                                    if (callback) {
                                        isMoved = true;
                                        callback();
                                    }
                                    return;
                                }
                            }else{
                                if (callback) {
                                    isMoved = true;
                                    callback();
                                }
                            }
                        }else if(_r1 == 'Fire'){
                            //火焰陷阱不会主动触发
                            if (callback) {
                                isMoved = true;
                                callback();
                            }
                        }else if(_r1 == 'Dragon'){
                            if(_r2 == 'Princess' || _r2 == 'Hero'){
                                //恶龙先攻
                                let enemy = {}
                                if(_r2 == 'Hero')
                                    enemy = this.heroPro
                                if(_r2 == 'Princess')
                                    enemy = this.getPrincessByID(this.data[x][y+1].split(',')[1])
                                let _dragon = this.getDragonByID(this.data[x][y].split(',')[1])

                                this.fight({
                                    node: this.blocks[x][y],
                                    pos: {x, y},
                                    obj: _dragon
                                }, {
                                    node: this.blocks[x][y+1],
                                    pos: {x, y: y+1},
                                    obj: enemy
                                }, 'Right', ()=>{
                                    isMoved = true;
                                    callback();
                                })
                            }else{
                                if (callback) {
                                    isMoved = true;
                                    callback();
                                }
                            }
                        }else if(_r1 == 'Skull'){
                            if(_r2 == 'Princess' || _r2 == 'Hero'){
                                //史莱姆先攻
                                let enemy = {}
                                if(_r2 == 'Hero')
                                    enemy = this.heroPro
                                if(_r2 == 'Princess')
                                    enemy = this.getPrincessByID(this.data[x][y+1].split(',')[1])
                                let _skull = this.getSkullByID(this.data[x][y].split(',')[1])
                                this.fight({
                                    node: this.blocks[x][y],
                                    pos: {x, y},
                                    obj: _skull
                                }, {
                                    node: this.blocks[x][y+1],
                                    pos: {x, y: y+1},
                                    obj: enemy
                                }, 'Right', ()=>{
                                    isMoved = true;
                                    callback();
                                })
                            }else if(_r2 == 'Skull'){
                                //合并史莱姆升级
                                let skull1 = this.data[x][y]
                                let skull2 = this.data[x][y+1]
                                let name1 = skull1.split(',')[0]
                                let name2 = skull2.split(',')[0]
                                if(name1 == name2){
                                    //相同属性
                                    if(name1 == 'Skull6' || name2 == 'Skul16'){
                                        //已达到最高等级
                                        isMoved = true;
                                        callback();
                                    }else{
                                        //合并升级
                                        let _next = ''
                                        if(name1 == 'Skull2')  _next = 'Skull4'
                                        if(name1 == 'Skull4')  _next = 'Skull8'
                                        if(name1 == 'Skull8')  _next = 'Skull16'
                                        merged[x][y+1] = 2;
                                        this.data[x][y+1] = _next + ',' + skull2.split(',')[1]
                                        this.data[x][y] = 0;
                                        let b2 = this.blocks[x][y+1];
                                        let b1 = this.blocks[x][y];
                                        let p = this.positions[x][y+1];
                                        this.blocks[x][y] = null;
                                        this.moveAction(b1, p, ()=> {
                                            this.mergeSkull(b1, b2, this.data[x][y+1], {x, y: y+1}, skull1, skull2, ()=>{
                                                isMoved = true;
                                                callback();
                                            })
                                        });
                                    }
                                }else{
                                    //不同属性
                                    if (callback) {
                                        isMoved = true;
                                        callback();
                                    }
                                }
                            }else{
                                //不会攻击恶龙
                                if (callback) {
                                    isMoved = true;
                                    callback();
                                }
                            }
                        }
                    }
                }else{
                    if (callback) {
                        isMoved = true;
                        callback();
                    }
                    return;
                }
            }
            else if (this.data[x][y+1] == this.data[x][y] && !merged[x][y+1]) {

                //判断最高等级
                if(this.data[x][y]){
                    if(this.data[x][y].includes('Skull16') || this.data[x][y].includes('Princess') || this.data[x][y].includes('Dragon') || this.data[x][y].includes('Phea16') || this.data[x][y].includes('Shield16') || this.data[x][y].includes('Sword16')){
                        isMoved = true;
                        callback();
                        return
                    }
                }

                merged[x][y+1] = 1;
                this.data[x][y+1] = this.getPrev(this.data[x][y]).nextName;
                this.data[x][y] = 0;
                let b1 = this.blocks[x][y+1];
                let b = this.blocks[x][y];
                let p = this.positions[x][y+1];
                this.blocks[x][y] = null;

                this.moveAction(b, p, ()=> {
                    this.mergeAction(b, b1, this.data[x][y+1], ()=>{
                        isMoved = true;
                        callback();
                    })
                });
            }
            else if (this.data[x][y+1] == 0) {
                this.data[x][y+1] = this.data[x][y];
                this.data[x][y] = 0;
                let b = this.blocks[x][y];
                let p = this.positions[x][y+1];
                this.blocks[x][y+1] = b;
                this.blocks[x][y] = null;

                this.moveAction(b, p, ()=>{
                    move(x, y+1, ()=>{
                        isMoved = true;
                        callback();
                    });
                });
            } else {
                isMoved = true;
                callback();
            }

        };

        let total = 0;
        let counter = 0;
        let willMove = [];
        let willMoveNodes = []
        for (let y = 2; y >=0; y--) {
            for (let x = 0; x < 4; x++){
                let n = this.data[x][y];
                if (n != 0){
                    total += 1;
                    willMove.push({x: x, y: y});
                    let _tmp = this.copy(this.blocks[x][y])
                    willMoveNodes.push({
                        id: _tmp.uuid,
                        x: _tmp.x,
                        y: _tmp.y,
                    })
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
                    this.afterMove(isMoved, willMoveNodes, 'Right');
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
        let move = (x, y, callback)=> {
            if (x == 3) {
                if (callback) {
                    isMoved = true;
                    callback();
                }
                return;
            }
            else if (this.data[x+1][y] != 0 && this.data[x+1][y] != this.data[x][y]) {

                let _r1 = this.isRole(x, y)
                let _r2 = this.isRole(x+1, y)
                if(_r1 != 'prop'){
                    if(this.gamePro.type == 'night') {
                        if(_r1 == 'Fire'){

                            if(_r2 == 'prop'){
                                if(merged[x+1][y]!=2){
                                    merged[x+1][y] = 2;
                                    let __name = this.data[x+1][y]
                                    //拾取道具
                                    this.data[x+1][y] = this.getPrev(this.data[x][y]).curName
                                    this.data[x][y] = 0;
                                    let b2 = this.blocks[x+1][y];
                                    let b1 = this.blocks[x][y];
                                    let p = this.positions[x+1][y];
                                    this.blocks[x][y] = null;
                                    this.moveAction(b1, p, ()=> {
                                        this.mergeAction(b1, b2, this.data[x+1][y], ()=>{
                                            this.pickUp(__name, { x: x+1, y }, 'Left')
                                            isMoved = true;
                                            callback();
                                        });
                                    });
                                }else{
                                    if (callback) {
                                        isMoved = true;
                                        callback();
                                    }
                                    return;
                                }
                            }else{
                                if (callback) {
                                    isMoved = true;
                                    callback();
                                }
                                return;
                            }

                        }else{
                            if (callback) {
                                isMoved = true;
                                callback();
                            }
                            return;
                        }
                    }
                    //角色
                    if(_r2 == 'prop'){
                        //拾取道具
                        if(_r1 == 'Princess'){
                            //公主无法拾取道具
                            if (callback) {
                                isMoved = true;
                                callback();
                            }
                        }else{
                            //拾取
                            if(merged[x+1][y]!=2){
                                merged[x+1][y] = 2;
                                let __name = this.data[x+1][y]
                                //拾取道具
                                this.data[x+1][y] = this.getPrev(this.data[x][y]).curName
                                this.data[x][y] = 0;
                                let b2 = this.blocks[x+1][y];
                                let b1 = this.blocks[x][y];
                                let p = this.positions[x+1][y];
                                this.blocks[x][y] = null;
                                this.moveAction(b1, p, ()=> {
                                    this.mergeAction(b1, b2, this.data[x+1][y], ()=>{
                                        this.pickUp(__name, { x: x+1, y }, 'Up')
                                        isMoved = true;
                                        callback();
                                    });
                                });
                            }else{
                                if (callback) {
                                    isMoved = true;
                                    callback();
                                }
                                return;
                            }
                        }
                    }else{
                        //角色
                        if(_r1 == 'Hero'){
                            //Hero先行动
                            if(_r2 == 'Princess'){
                                //营救公主
                                if(merged[x+1][y]!=2){
                                    merged[x+1][y] = 2;
                                    let __name = this.data[x+1][y]
                                    //拾取道具
                                    this.data[x+1][y] = this.getPrev(this.data[x][y]).curName
                                    this.data[x][y] = 0;
                                    let b2 = this.blocks[x+1][y];
                                    let b1 = this.blocks[x][y];
                                    let p = this.positions[x+1][y];
                                    this.blocks[x][y] = null;
                                    this.moveAction(b1, p, ()=> {
                                        this.mergeAction(b1, b2, this.data[x+1][y], ()=>{
                                            this.rescuePrincess(__name, { x: x+1, y })
                                            isMoved = true;
                                            callback();
                                        });
                                    });
                                }else{
                                    if (callback) {
                                        callback();
                                    }
                                    return;
                                }
                            }else if(_r2 == 'Fire'){
                                //火焰陷阱
                                if(merged[x+1][y]!=2){
                                    merged[x+1][y] = 2;
                                    let __name = this.data[x+1][y]
                                    //拾取道具
                                    this.data[x+1][y] = this.getPrev(this.data[x][y]).curName
                                    this.data[x][y] = 0;
                                    let b2 = this.blocks[x+1][y];
                                    let b1 = this.blocks[x][y];
                                    let p = this.positions[x+1][y];
                                    this.blocks[x][y] = null;
                                    this.moveAction(b1, p, ()=> {
                                        this.mergeAction(b1, b2, this.data[x+1][y], ()=>{
                                            this.pickUp(__name, { x: x+1, y }, 'Up')
                                            isMoved = true;
                                            callback();
                                        });
                                    });
                                }else{
                                    if (callback) {
                                        isMoved = true;
                                        callback();
                                    }
                                    return;
                                }
                            }else{
                                //Hero 先攻模式
                                let enemy = {}
                                if(_r2 == 'Skull')
                                    enemy = this.getSkullByID(this.data[x+1][y].split(',')[1])
                                if(_r2 == 'Dragon')
                                    enemy = this.getDragonByID(this.data[x+1][y].split(',')[1])
                                this.fight({
                                    node: this.blocks[x][y],
                                    pos: {x, y},
                                    obj: this.heroPro
                                }, {
                                    node: this.blocks[x+1][y],
                                    pos: {x: x+1, y},
                                    obj: enemy
                                }, 'Up', ()=>{
                                    isMoved = true;
                                    callback();
                                })
                            }
                        }else if(_r1 == 'Princess'){
                            if(_r2 == 'Dragon' || _r2 == 'Skull'){
                                //公主先攻
                                let enemy = {}
                                if(_r2 == 'Skull')
                                    enemy = this.getSkullByID(this.data[x+1][y].split(',')[1])
                                if(_r2 == 'Dragon')
                                    enemy = this.getDragonByID(this.data[x+1][y].split(',')[1])
                                let _princess = this.getPrincessByID(this.data[x][y].split(',')[1])
                                this.fight({
                                    node: this.blocks[x][y],
                                    pos: {x, y},
                                    obj: _princess
                                }, {
                                    node: this.blocks[x+1][y],
                                    pos: {x: x+1, y},
                                    obj: enemy
                                }, 'Up', ()=>{
                                    isMoved = true;
                                    callback();
                                })
                            }else if(_r2 == 'Hero'){
                                //营救公主
                                if(merged[x+1][y]!=2){
                                    merged[x+1][y] = 2;
                                    let __name = this.data[x][y]
                                    //拾取道具
                                    this.data[x+1][y] = 'Hero'
                                    this.data[x][y] = 0;
                                    let b2 = this.blocks[x+1][y];
                                    let b1 = this.blocks[x][y];
                                    let p = this.positions[x+1][y];
                                    this.blocks[x][y] = null;
                                    this.moveAction(b1, p, ()=> {
                                        this.mergeAction(b1, b2, this.data[x+1][y], ()=>{
                                            this.rescuePrincess(__name, { x: x+1, y })
                                            isMoved = true;
                                            callback();
                                        });
                                    });
                                }else{
                                    if (callback) {
                                        isMoved = true;
                                        callback();
                                    }
                                    return;
                                }
                            }else{
                                if (callback) {
                                    isMoved = true;
                                    callback();
                                }
                            }
                        }else if(_r1 == 'Fire'){
                            //火焰陷阱不会主动触发
                            if (callback) {
                                isMoved = true;
                                callback();
                            }
                        }else if(_r1 == 'Dragon'){
                            if(_r2 == 'Princess' || _r2 == 'Hero'){
                                //恶龙先攻
                                let enemy = {}
                                if(_r2 == 'Hero')
                                    enemy = this.heroPro
                                if(_r2 == 'Princess')
                                    enemy = this.getPrincessByID(this.data[x+1][y].split(',')[1])
                                let _dragon = this.getDragonByID(this.data[x][y].split(',')[1])

                                this.fight({
                                    node: this.blocks[x][y],
                                    pos: {x, y},
                                    obj: _dragon
                                }, {
                                    node: this.blocks[x+1][y],
                                    pos: {x: x+1, y},
                                    obj: enemy
                                }, 'Up', ()=>{
                                    isMoved = true;
                                    callback();
                                })
                            }else{
                                if (callback) {
                                    isMoved = true;
                                    callback();
                                }
                            }
                        }else if(_r1 == 'Skull'){
                            if(_r2 == 'Princess' || _r2 == 'Hero'){
                                //史莱姆先攻
                                let enemy = {}
                                if(_r2 == 'Hero')
                                    enemy = this.heroPro
                                if(_r2 == 'Princess')
                                    enemy = this.getPrincessByID(this.data[x+1][y].split(',')[1])
                                let _skull = this.getSkullByID(this.data[x][y].split(',')[1])
                                this.fight({
                                    node: this.blocks[x][y],
                                    pos: {x, y},
                                    obj: _skull
                                }, {
                                    node: this.blocks[x+1][y],
                                    pos: {x: x+1, y},
                                    obj: enemy
                                }, 'Up', ()=>{
                                    isMoved = true;
                                    callback();
                                })
                            }else if(_r2 == 'Skull'){
                                //合并史莱姆升级
                                let skull1 = this.data[x][y]
                                let skull2 = this.data[x+1][y]
                                let name1 = skull1.split(',')[0]
                                let name2 = skull2.split(',')[0]
                                if(name1 == name2){
                                    //相同属性
                                    if(name1 == 'Skull6' || name2 == 'Skul16'){
                                        //已达到最高等级
                                        isMoved = true;
                                        callback();
                                    }else{
                                        //合并升级
                                        let _next = ''
                                        if(name1 == 'Skull2')  _next = 'Skull4'
                                        if(name1 == 'Skull4')  _next = 'Skull8'
                                        if(name1 == 'Skull8')  _next = 'Skull16'
                                        merged[x+1][y] = 2;
                                        this.data[x+1][y] = _next + ',' + skull2.split(',')[1]
                                        this.data[x][y] = 0;
                                        let b2 = this.blocks[x+1][y];
                                        let b1 = this.blocks[x][y];
                                        let p = this.positions[x+1][y];
                                        this.blocks[x][y] = null;
                                        this.moveAction(b1, p, ()=> {
                                            this.mergeSkull(b1, b2, this.data[x+1][y], {x: x+1, y}, skull1, skull2, ()=>{
                                                isMoved = true;
                                                callback();
                                            })
                                        });
                                    }
                                }else{
                                    //不同属性
                                    if (callback) {
                                        isMoved = true;
                                        callback();
                                    }
                                }
                            }else{
                                //不会攻击恶龙
                                if (callback) {
                                    isMoved = true;
                                    callback();
                                }
                            }
                        }
                    }
                }else{
                    if (callback) {
                        isMoved = true;
                        callback();
                    }
                    return;
                }

            }
            else if (this.data[x+1][y] == this.data[x][y] && !merged[x+1][y]) {

                //判断最高等级
                if(this.data[x][y]){
                    if(this.data[x][y].includes('Skull16') || this.data[x][y].includes('Princess') || this.data[x][y].includes('Dragon') || this.data[x][y].includes('Phea16') || this.data[x][y].includes('Shield16') || this.data[x][y].includes('Sword16')){
                        isMoved = true;
                        callback();
                        return
                    }
                }

                merged[x+1][y] = 1;
                this.data[x+1][y] = this.getPrev(this.data[x][y]).nextName;
                this.data[x][y] = 0;
                let b1 = this.blocks[x+1][y];
                let b = this.blocks[x][y];
                let p = this.positions[x+1][y];
                this.blocks[x][y] = null;
                this.moveAction(b, p, ()=> {
                    this.mergeAction(b, b1, this.data[x+1][y], ()=>{
                        isMoved = true;
                        callback();
                    })
                });
            }
            else if (this.data[x+1][y] == 0) {
                this.data[x+1][y] = this.data[x][y];
                this.data[x][y] = 0;
                let b = this.blocks[x][y];
                let p = this.positions[x+1][y];
                this.blocks[x+1][y] = b;
                this.blocks[x][y] = null;

                this.moveAction(b, p, ()=>{
                    isMoved = true;
                    move(x+1, y, callback);
                });
            } else {
                isMoved = true;
                callback();
            }

        };

        let total = 0;
        let counter = 0;
        let willMove = [];
        let willMoveNodes = []
        for (let x = 2; x >= 0; x--) {
            for (let y = 0; y < 4; y++){
                let n = this.data[x][y];
                if (n != 0){
                    total += 1;
                    willMove.push({x: x, y: y});
                    let _tmp = this.copy(this.blocks[x][y])
                    willMoveNodes.push({
                        id: _tmp.uuid,
                        x: _tmp.x,
                        y: _tmp.y,
                    })
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
                    this.afterMove(isMoved, willMoveNodes, 'Up');
                }
            });
        }
    },

    moveDown() {
        // 递归移动操作
        let isMoved = true;
        let merged = [];
        for (let i = 0; i < 4; i++) {
            merged.push([0,0,0,0]);
        }
        let move = (x, y, callback)=> {
            if (x == 0) {
                if (callback) {
                    isMoved = true;
                    callback();
                }
                return;
            }
            else if (this.data[x-1][y] != 0 && this.data[x-1][y] != this.data[x][y]) {

                let _r1 = this.isRole(x, y)
                let _r2 = this.isRole(x-1, y)
                if(_r1 != 'prop'){
                    if(this.gamePro.type == 'night') {
                        if(_r1 == 'Fire'){

                            if(_r2 == 'prop'){
                                if(merged[x-1][y]!=2){
                                    merged[x-1][y] = 2;
                                    let __name = this.data[x+1][y]
                                    //拾取道具
                                    this.data[x-1][y] = this.getPrev(this.data[x][y]).curName
                                    this.data[x][y] = 0;
                                    let b2 = this.blocks[x-1][y];
                                    let b1 = this.blocks[x][y];
                                    let p = this.positions[x-1][y];
                                    this.blocks[x][y] = null;
                                    this.moveAction(b1, p, ()=> {
                                        this.mergeAction(b1, b2, this.data[x-1][y], ()=>{
                                            this.pickUp(__name, { x: x-1, y }, 'Left')
                                            isMoved = true;
                                            callback();
                                        });
                                    });
                                }else{
                                    if (callback) {
                                        isMoved = true;
                                        callback();
                                    }
                                    return;
                                }
                            }else{
                                if (callback) {
                                    isMoved = true;
                                    callback();
                                }
                                return;
                            }

                        }else{
                            if (callback) {
                                isMoved = true;
                                callback();
                            }
                            return;
                        }
                    }
                    //角色
                    if(_r2 == 'prop'){
                        //拾取道具
                        if(_r1 == 'Princess'){
                            //公主无法拾取道具
                            if (callback) {
                                isMoved = true;
                                callback();
                            }
                        }else{
                            //拾取
                            if(merged[x-1][y]!=2){
                                merged[x-1][y] = 2;
                                let __name = this.data[x-1][y]
                                //拾取道具
                                this.data[x-1][y] = this.getPrev(this.data[x][y]).curName
                                this.data[x][y] = 0;
                                let b2 = this.blocks[x-1][y];
                                let b1 = this.blocks[x][y];
                                let p = this.positions[x-1][y];
                                this.blocks[x][y] = null;
                                this.moveAction(b1, p, ()=> {
                                    this.mergeAction(b1, b2, this.data[x-1][y], ()=>{
                                        this.pickUp(__name, { x: x-1, y }, 'Down')
                                        isMoved = true;
                                        callback();
                                    });
                                });
                            }else{
                                if (callback) {
                                    isMoved = true;
                                    callback();
                                }
                                return;
                            }
                        }
                    }else{
                        //角色
                        if(_r1 == 'Hero'){
                            //Hero先行动
                            if(_r2 == 'Princess'){
                                //营救公主
                                if(merged[x-1][y]!=2){
                                    merged[x-1][y] = 2;
                                    let __name = this.data[x-1][y]
                                    //拾取道具
                                    this.data[x-1][y] = this.getPrev(this.data[x][y]).curName
                                    this.data[x][y] = 0;
                                    let b2 = this.blocks[x-1][y];
                                    let b1 = this.blocks[x][y];
                                    let p = this.positions[x-1][y];
                                    this.blocks[x][y] = null;
                                    this.moveAction(b1, p, ()=> {
                                        this.mergeAction(b1, b2, this.data[x-1][y], ()=>{
                                            this.rescuePrincess(__name, { x: x-1, y })
                                            isMoved = true;
                                            callback();
                                        });
                                    });
                                }else{
                                    if (callback) {
                                        isMoved = true;
                                        callback();
                                    }
                                    return;
                                }
                            }else if(_r2 == 'Fire'){
                                //火焰陷阱
                                if(merged[x-1][y]!=2){
                                    merged[x-1][y] = 2;
                                    let __name = this.data[x-1][y]
                                    //拾取道具
                                    this.data[x-1][y] = this.getPrev(this.data[x][y]).curName
                                    this.data[x][y] = 0;
                                    let b2 = this.blocks[x-1][y];
                                    let b1 = this.blocks[x][y];
                                    let p = this.positions[x-1][y];
                                    this.blocks[x][y] = null;
                                    this.moveAction(b1, p, ()=> {
                                        this.mergeAction(b1, b2, this.data[x-1][y], ()=>{
                                            this.pickUp(__name, { x: x-1, y}, 'Down')
                                            isMoved = true;
                                            callback();
                                        });
                                    });
                                }else{
                                    if (callback) {
                                        isMoved = true;
                                        callback();
                                    }
                                    return;
                                }
                            }else{
                                //Hero 先攻模式
                                let enemy = {}
                                if(_r2 == 'Skull')
                                    enemy = this.getSkullByID(this.data[x-1][y].split(',')[1])
                                if(_r2 == 'Dragon')
                                    enemy = this.getDragonByID(this.data[x-1][y].split(',')[1])
                                this.fight({
                                    node: this.blocks[x][y],
                                    pos: {x, y},
                                    obj: this.heroPro
                                }, {
                                    node: this.blocks[x-1][y],
                                    pos: {x: x-1, y},
                                    obj: enemy
                                }, 'Down', ()=>{
                                    isMoved = true;
                                    callback();
                                })
                            }
                        }else if(_r1 == 'Princess'){
                            if(_r2 == 'Dragon' || _r2 == 'Skull'){
                                //公主先攻
                                let enemy = {}
                                if(_r2 == 'Skull')
                                    enemy = this.getSkullByID(this.data[x-1][y].split(',')[1])
                                if(_r2 == 'Dragon')
                                    enemy = this.getDragonByID(this.data[x-1][y].split(',')[1])
                                let _princess = this.getPrincessByID(this.data[x][y].split(',')[1])
                                this.fight({
                                    node: this.blocks[x][y],
                                    pos: {x, y},
                                    obj: _princess
                                }, {
                                    node: this.blocks[x-1][y],
                                    pos: {x: x-1, y},
                                    obj: enemy
                                }, 'Down', ()=>{
                                    isMoved = true;
                                    callback();
                                })
                            }else if(_r2 == 'Hero'){
                                //营救公主
                                if(merged[x-1][y]!=2){
                                    merged[x-1][y] = 2;
                                    let __name = this.data[x][y]
                                    //拾取道具
                                    this.data[x-1][y] = 'Hero'
                                    this.data[x][y] = 0;
                                    let b2 = this.blocks[x-1][y];
                                    let b1 = this.blocks[x][y];
                                    let p = this.positions[x-1][y];
                                    this.blocks[x][y] = null;
                                    this.moveAction(b1, p, ()=> {
                                        this.mergeAction(b1, b2, this.data[x-1][y], ()=>{
                                            this.rescuePrincess(__name, { x: x-1, y })
                                            isMoved = true;
                                            callback();
                                        });
                                    });
                                }else{
                                    if (callback) {
                                        isMoved = true;
                                        callback();
                                    }
                                    return;
                                }
                            }else{
                                if (callback) {
                                    isMoved = true;
                                    callback();
                                }
                            }
                        }else if(_r1 == 'Fire'){
                            //火焰陷阱不会主动触发
                            if (callback) {
                                isMoved = true;
                                callback();
                            }
                        }else if(_r1 == 'Dragon'){
                            if(_r2 == 'Princess' || _r2 == 'Hero'){
                                //恶龙先攻
                                let enemy = {}
                                if(_r2 == 'Hero')
                                    enemy = this.heroPro
                                if(_r2 == 'Princess')
                                    enemy = this.getPrincessByID(this.data[x-1][y].split(',')[1])
                                let _dragon = this.getDragonByID(this.data[x][y].split(',')[1])

                                this.fight({
                                    node: this.blocks[x][y],
                                    pos: {x, y},
                                    obj: _dragon
                                }, {
                                    node: this.blocks[x-1][y],
                                    pos: {x: x-1, y},
                                    obj: enemy
                                }, 'Down', ()=>{
                                    isMoved = true;
                                    callback();
                                })
                            }else{
                                if (callback) {
                                    isMoved = true;
                                    callback();
                                }
                            }
                        }else if(_r1 == 'Skull'){
                            if(_r2 == 'Princess' || _r2 == 'Hero'){
                                //史莱姆先攻
                                let enemy = {}
                                if(_r2 == 'Hero')
                                    enemy = this.heroPro
                                if(_r2 == 'Princess')
                                    enemy = this.getPrincessByID(this.data[x-1][y].split(',')[1])
                                let _skull = this.getSkullByID(this.data[x][y].split(',')[1])
                                this.fight({
                                    node: this.blocks[x][y],
                                    pos: {x, y},
                                    obj: _skull
                                }, {
                                    node: this.blocks[x-1][y],
                                    pos: {x: x-1, y},
                                    obj: enemy
                                }, 'Down', ()=>{
                                    isMoved = true;
                                    callback();
                                })
                            }else if(_r2 == 'Skull'){
                                //合并史莱姆升级
                                let skull1 = this.data[x][y]
                                let skull2 = this.data[x-1][y]
                                let name1 = skull1.split(',')[0]
                                let name2 = skull2.split(',')[0]
                                if(name1 == name2){
                                    //相同属性
                                    if(name1 == 'Skull6' || name2 == 'Skul16'){
                                        //已达到最高等级
                                        isMoved = true;
                                        callback();
                                    }else{
                                        //合并升级
                                        let _next = ''
                                        if(name1 == 'Skull2')  _next = 'Skull4'
                                        if(name1 == 'Skull4')  _next = 'Skull8'
                                        if(name1 == 'Skull8')  _next = 'Skull16'
                                        merged[x-1][y] = 2;
                                        this.data[x-1][y] = _next + ',' + skull2.split(',')[1]
                                        this.data[x][y] = 0;
                                        let b2 = this.blocks[x-1][y];
                                        let b1 = this.blocks[x][y];
                                        let p = this.positions[x-1][y];
                                        this.blocks[x][y] = null;
                                        this.moveAction(b1, p, ()=> {
                                            this.mergeSkull(b1, b2, this.data[x-1][y], {x: x-1, y}, skull1, skull2, ()=>{
                                                isMoved = true;
                                                callback();
                                            })
                                        });
                                    }
                                }else{
                                    //不同属性
                                    if (callback) {
                                        isMoved = true;
                                        callback();
                                    }
                                }
                            }else{
                                //不会攻击恶龙
                                if (callback) {
                                    isMoved = true;
                                    callback();
                                }
                            }
                        }
                    }
                }else{
                    if (callback) {
                        isMoved = true;
                        callback();
                    }
                    return;
                }

            }
            else if (this.data[x-1][y] == this.data[x][y] && !merged[x-1][y]) {

                //判断最高等级
                if(this.data[x][y]){
                    if(this.data[x][y].includes('Skull16') || this.data[x][y].includes('Princess') || this.data[x][y].includes('Dragon') || this.data[x][y].includes('Phea16') || this.data[x][y].includes('Shield16') || this.data[x][y].includes('Sword16')){
                        isMoved = true;
                        callback();
                        return
                    }
                }

                merged[x-1][y] = 1;
                this.data[x-1][y] = this.getPrev(this.data[x][y]).nextName;
                this.data[x][y] = 0;
                let b1 = this.blocks[x-1][y];
                let b = this.blocks[x][y];
                let p = this.positions[x-1][y];
                this.blocks[x][y] = null;
                this.moveAction(b, p, ()=> {
                    this.mergeAction(b, b1, this.data[x-1][y], ()=>{
                        isMoved = true;
                        callback();
                    })
                });
            }
            else if (this.data[x-1][y] == 0) {
                this.data[x-1][y] = this.data[x][y];
                this.data[x][y] = 0;
                let b = this.blocks[x][y];
                let p = this.positions[x-1][y];
                this.blocks[x-1][y] = b;
                this.blocks[x][y] = null;

                this.moveAction(b, p, ()=>{
                    isMoved = true;
                    move(x-1, y, callback);
                });
            } else {
                isMoved = true;
                callback();
            }

        };

        let total = 0;
        let counter = 0;
        let willMove = [];
        let willMoveNodes = []
        for (let x = 1; x < 4; x++) {
            for (let y = 0; y < 4; y++){
                let n = this.data[x][y];
                if (n != 0){
                    total += 1;
                    willMove.push({x: x, y: y});
                    let _tmp = this.copy(this.blocks[x][y])
                    willMoveNodes.push({
                        id: _tmp.uuid,
                        x: _tmp.x,
                        y: _tmp.y,
                    })
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
                    this.afterMove(isMoved, willMoveNodes, 'Down');
                }
            });
        }
    },

});
