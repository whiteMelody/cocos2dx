cc.Class({
    extends: cc.Component,

    properties: {
        eventBook: cc.Node,
        eventBtn: cc.Node,
        backBtn: cc.Node,
        events: cc.Node,
        eventBookData: {
            default: null,
        },
    },

    onLoad () {

        this.backBtn.on(cc.Node.EventType.TOUCH_END, function (event) {
            cc.director.loadScene("main");
        }, this);

        this.eventBtn.on(cc.Node.EventType.TOUCH_END, function (event) {
            this.showEventBook()
        }, this);

        this.backBtn.on(cc.Node.EventType.TOUCH_END, function (event) {
            this.hideEventBook()
        }, this);


        this.creatEventBook()

        for(let i=0; i<this.events.childrenCount; i++){
            this.events.children[i].on(cc.Node.EventType.TOUCH_END, function (event) {
                this.readEvent(i + 1)
            }, this);
        }

    },

    creatEventBook(){
        this.eventBookData = {
            events: [
                {
                    index: 1,
                    name: '父亲之死',
                    date: '1081年',
                    content: '战乱越来越激烈，卡尔的父亲倒在了前线，得知这个消息后卡尔回到了边境，被愤怒占据的卡尔参了军，开始了他的战乱生活。',
                    role: '卡尔·伽蓝',
                    tagName: '卡尔·伽蓝 第一卷'
                },
                {
                    index: 2,
                    name: '反叛',
                    date: '1086年春',
                    content: '当上骑士长后，卡尔发现这是一场毫无意义的战争，看着曾经交好的两国在自己的故乡交战，卡尔带领他的军队反叛，并成立了反叛军，很快，更多的人加入了反叛军，他们一起守卫这里的故乡，不再打这场毫无意义的战争。',
                    role: '卡尔·伽蓝',
                    tagName: '卡尔·伽蓝 第二卷'
                },
                {
                    index: 3,
                    name: '剿灭叛党',
                    date: '1081年',
                    content: '两国发布了停战通告，本以为迎来了和平，没想到却在背地以剿灭叛党的借口进行了更大规模的战争。反叛军大多由士兵和当地村民组成，开始和两国的军队交战。',
                    role: '卡尔·伽蓝',
                    tagName: '卡尔·伽蓝 第三卷'
                },
                {
                    index: 4,
                    name: '成立涅米尔',
                    date: '1088年春',
                    content: '加入反叛军的人越来越多，反叛军成立了“涅米尔”（意为世界、和平）宣布了自己的主权，和两国的战争陷入了僵局。',
                    role: '卡尔·伽蓝',
                    tagName: '卡尔·伽蓝 第四卷'
                },
                {
                    index: 5,
                    name: '恶龙来袭',
                    date: '1088年夏',
                    content: '涅米尔突然东部出现了恶龙！部分地区都变为了火海，好在没有烧毁村落，恶龙扬长而去，看来目标并不是涅米尔。',
                    role: '卡尔·伽蓝',
                    tagName: '卡尔·伽蓝 第五卷'
                },
                {
                    index: 6,
                    name: '恶龙的意图',
                    date: '1081年',
                    content: '恶龙到达了普威尔士首都，并威胁国王3天之内交出公主。至此，两国的战乱结束。据闻恶龙是大保加勒亚的人蛊惑所致。',
                    role: '卡尔·伽蓝',
                    tagName: '卡尔·伽蓝 第六卷'
                },
                {
                    index: 7,
                    name: '寻找公主',
                    date: '1090年春',
                    content: '国王征召勇者营救公主，众多冒险者有去无回，在国王心灰意冷的时候卡尔出现了，卡尔想以公主来换取永久的和平。',
                    role: '卡尔·伽蓝',
                    tagName: '卡尔·伽蓝 第七卷'
                },
                {
                    index: 8,
                    name: '小小冒险家',
                    date: '1074年',
                    content: '贝尔某天在草原上休息的时候，碰到了一个偷偷越境的“冒险家”卡尔，后来和卡尔交好，迷恋上了他所说的冒险生活，并且想一起冒险。',
                    role: '贝尔·佩恩尼斯',
                    tagName: '贝尔·佩恩尼斯 第一卷'
                },
                {
                    index: 9,
                    name: '战乱',
                    date: '1076年',
                    content: '战乱开始后两国封锁了国境，卡尔和贝尔再也没有见过面，贝尔随父母一起躲到了大保加勒亚过了一段平静的生活。',
                    role: '贝尔·佩恩尼斯',
                    tagName: '贝尔·佩恩尼斯 第二卷'
                },
                {
                    index: 10,
                    name: '卡尔的去向',
                    date: '1080年',
                    content: '贝尔决定去寻找卡尔，她还记得卡尔家乡的位置，据其父所闻，卡尔去到了普威尔士首都开始了冒险生涯。于是决定前去首都寻找卡尔。',
                    role: '贝尔·佩恩尼斯',
                    tagName: '贝尔·佩恩尼斯 第三卷'
                },
                {
                    index: 11,
                    name: '城市生活',
                    date: '1081年',
                    content: '贝尔决定在首都定居再慢慢寻找卡尔，她在冒险者公会找到了一些冒险者的职务，决定当一位冒险家。',
                    role: '贝尔·佩恩尼斯',
                    tagName: '贝尔·佩恩尼斯 第四卷'
                },
                {
                    index: 12,
                    name: '佣兵贝尔',
                    date: '1085年',
                    content: '两国交战越发激烈，冒险者公会也关闭了，贝尔参加了佣兵团。',
                    role: '贝尔·佩恩尼斯',
                    tagName: '贝尔·佩恩尼斯 第五卷'
                },
                {
                    index: 13,
                    name: '公主的宴会',
                    date: '1087年',
                    content: '某一次护卫任务中得知护卫的是公主，参加了公主的宴会，结识了公主。',
                    role: '贝尔·佩恩尼斯',
                    tagName: '贝尔·佩恩尼斯 第六卷'
                },
                {
                    index: 14,
                    name: '后续任务',
                    date: '1088年春',
                    content: '因与公主长得很像，扮演公主的替身，参与了很多宴会。',
                    role: '贝尔·佩恩尼斯',
                    tagName: '贝尔·佩恩尼斯 第七卷'
                },
                {
                    index: 15,
                    name: '狸猫换公主',
                    date: '1088年夏',
                    content: '恶龙威胁国王三天之内交出公主，国王舍不得自己的女儿，贝尔被当成了替身被恶龙掳走。',
                    role: '贝尔·佩恩尼斯',
                    tagName: '贝尔·佩恩尼斯 第八卷'
                },
                {
                    index: 16,
                    name: '邻国王子',
                    date: '1073年春',
                    content: '某次跟随父亲前往大保加勒亚参加会议，会议后认识了莱科，跟莱科很有共同语言，向往着自由的生活。',
                    role: '威尔士·莉莉'
                },
                {
                    index: 17,
                    name: '加勒亚·莱科',
                    date: '1074年夏',
                    content: '莱科来到了普威尔士的首都游玩，莉莉偷偷带他游遍全国。',
                    role: '威尔士·莉莉'
                },
                {
                    index: 18,
                    name: '战乱',
                    date: '1076年',
                    content: '两国交战后，莱科不得不回到自己的国家，莉莉也被关在了皇宫，国局动荡，莉莉哪也去不了。',
                    role: '威尔士·莉莉'
                },
                {
                    index: 19,
                    name: '笼中鸟',
                    date: '1081年',
                    content: '战争持续不断，莉莉发现自己逐渐变成了协商的工具，因为普威尔士公国是大陆最大的公国，经常会出席外交的会议。',
                    role: '威尔士·莉莉'
                },
                {
                    index: 20,
                    name: '贝尔·佩恩尼斯',
                    date: '1087年春',
                    content: '一次偶然的护卫任务认识了贝尔，发现贝尔和自己长得很像，羡慕着贝尔自由的生活，后来得知贝尔是来寻找某一个人。承诺找到卡尔后和自己互换身份获取自由。',
                    role: '威尔士·莉莉'
                },
                {
                    index: 21,
                    name: '卡尔·伽蓝',
                    date: '1087年夏',
                    content: '莉莉知道了卡尔的身份后并没有告诉贝尔，她谎称卡尔现在是某个军队的骑士长，并没有参加这次战乱。从此后单数日子里和危险的议会可以和贝尔交换身份。',
                    role: '威尔士·莉莉'
                },
                {
                    index: 22,
                    name: '恶龙来袭',
                    date: '1088年夏',
                    content: '恶龙出现在普威尔士，并扬言要带走公主，莉莉很害怕，祈求贝尔代替她，后来被国王发现，贝尔被迫代替公主被掳走。',
                    role: '威尔士·莉莉'
                },
                {
                    index: 23,
                    name: '追悔莫及',
                    date: '1090年春',
                    content: '莉莉又一次变成了笼中鸟，国王征召勇者营救公主，众多冒险者有去无回，莉莉懊悔不已，“如果当初被掳走的是我，而不是贝尔的话，说不定我可以看见真正的自由”。',
                    role: '威尔士·莉莉'
                },
                {
                    index: 24,
                    name: '年幼的公主莉莉',
                    date: '1073年春',
                    content: '某次大保加勒亚会议认识了年幼的莉莉，会议结束后在花园结交下了深厚的友谊。',
                    role: '加勒亚·莱科'
                },
                {
                    index: 25,
                    name: '莉莉的骑士',
                    date: '1073年夏',
                    content: '跟随其父普威尔士公国参加议会，后决定留在普威尔士游玩，和公主交好。喜欢跟随公主，看公主喜欢的风景，吃公主喜欢的食物。',
                    role: '加勒亚·莱科'
                },
                {
                    index: 26,
                    name: '战乱',
                    date: '1076年',
                    content: '两国交战后，莱科不得不回到自己的国家，从此后闭门不出，在一次偶然发现了黑魔法，并深深迷上了黑魔法。后来得知存在一起信仰恶龙的组织，并操控组织进行了恶龙计划。',
                    role: '加勒亚·莱科'
                },
                {
                    index: 27,
                    name: '叛乱',
                    date: '1086年春',
                    content: '长达10年的沉淀，莱科发现了恶龙的栖息地和习性，恶龙贪图财宝，说不定可以进行某种交易？',
                    role: '加勒亚·莱科'
                },
                {
                    index: 28,
                    name: '恶龙计划',
                    date: '1088年春',
                    content: '和描述的不同，恶龙不接受人类的任何交易。莱科表示愿意用自己最珍贵的东西来换取黑魔法“恶龙形态”。',
                    role: '加勒亚·莱科'
                },
                {
                    index: 29,
                    name: '掳走公主',
                    date: '1088年夏',
                    content: '1088年夏，多年的夙愿终于达成，未完待续...',
                    role: '加勒亚·莱科'
                },
            ]
        }

        console.log(this.eventBookData)

    },

    showEventBook(){
        this.eventBook.opacity = 255;
    },

    hideEventBook(){
        this.eventBook.opacity = 0;
    },

    readEvent(i){

        console.log(i)

    },

    start(){

    }

});
