/**
 * 菜谱种子数据
 * 包含 20+ 道菜谱，覆盖温补、清润、快手菜等分类
 */

const recipeSeeds = [
    // ==================== 温补类 ====================
    {
        name: '山药排骨汤',
        description: '补脾养胃，益肺止咳，补肾固精',
        emoji: '🍲',
        nature: '温',
        flavors: ['甘'],
        meridians: ['脾', '肺', '肾'],
        suitableConstitutions: ['qi_deficiency', 'yang_deficiency', 'balanced'],
        avoidConstitutions: ['damp_heat', 'phlegm_dampness'],
        category: 'warming',
        tags: ['温补', '易消化', '家常'],
        cookingTime: 60,
        difficulty: '简单',
        baseScore: 95,
        ingredients: [
            { name: '排骨', amount: '500g', icon: '🦴' },
            { name: '山药', amount: '300g', icon: '🥔' },
            { name: '枸杞', amount: '10g', icon: '🔴' },
            { name: '生姜', amount: '3片', icon: '🫚' },
            { name: '料酒', amount: '适量', icon: '🍶' }
        ],
        steps: [
            { order: 1, content: '排骨洗净，冷水下锅，加料酒焯水去腥' },
            { order: 2, content: '山药去皮切滚刀块，泡入清水防止氧化' },
            { order: 3, content: '砂锅加水，放入排骨和姜片，大火煮沸' },
            { order: 4, content: '转小火炖煮40分钟' },
            { order: 5, content: '加入山药，继续炖煮15分钟' },
            { order: 6, content: '出锅前加入枸杞，调盐即可' }
        ],
        analysis: '山药性平味甘，入脾、肺、肾三经，具有补脾养胃、生津益肺、补肾涩精的功效。配合排骨的温补之力，特别适合阳虚体质者在霜降时节食用，可温煦脾胃、固护阳气。'
    },
    {
        name: '当归生姜羊肉汤',
        description: '温中补虚，祛寒止痛，养血活血',
        emoji: '🐑',
        nature: '热',
        flavors: ['甘', '辛'],
        meridians: ['脾', '肾'],
        suitableConstitutions: ['yang_deficiency', 'blood_stasis', 'qi_deficiency'],
        avoidConstitutions: ['yin_deficiency', 'damp_heat'],
        category: 'warming',
        tags: ['温补', '经典', '冬季'],
        cookingTime: 90,
        difficulty: '中等',
        baseScore: 92,
        ingredients: [
            { name: '羊肉', amount: '500g', icon: '🥩' },
            { name: '当归', amount: '15g', icon: '🌿' },
            { name: '生姜', amount: '30g', icon: '🫚' },
            { name: '料酒', amount: '适量', icon: '🍶' },
            { name: '盐', amount: '适量', icon: '🧂' }
        ],
        steps: [
            { order: 1, content: '羊肉洗净切块，冷水下锅焯水' },
            { order: 2, content: '当归洗净，生姜切厚片' },
            { order: 3, content: '砂锅加水，放入所有材料' },
            { order: 4, content: '大火煮沸，撇去浮沫' },
            { order: 5, content: '转小火炖煮1.5小时' },
            { order: 6, content: '加盐调味即可' }
        ],
        analysis: '此方出自《金匮要略》，当归补血活血，生姜温中散寒，羊肉温补脾肾。三者同用，温而不燥，补而不滞，是阳虚体质者冬季进补的经典良方。'
    },
    {
        name: '黄芪党参鸡汤',
        description: '补气健脾，益肺固表，增强免疫',
        emoji: '🐔',
        nature: '温',
        flavors: ['甘'],
        meridians: ['脾', '肺'],
        suitableConstitutions: ['qi_deficiency', 'yang_deficiency', 'balanced'],
        avoidConstitutions: ['yin_deficiency', 'damp_heat'],
        category: 'warming',
        tags: ['补气', '增强免疫', '滋补'],
        cookingTime: 90,
        difficulty: '中等',
        baseScore: 90,
        ingredients: [
            { name: '土鸡', amount: '半只', icon: '🐔' },
            { name: '黄芪', amount: '20g', icon: '🌿' },
            { name: '党参', amount: '15g', icon: '🌿' },
            { name: '红枣', amount: '6颗', icon: '🔴' },
            { name: '枸杞', amount: '10g', icon: '🔴' }
        ],
        steps: [
            { order: 1, content: '鸡肉洗净斩块，焯水去血沫' },
            { order: 2, content: '黄芪、党参洗净' },
            { order: 3, content: '所有材料放入炖盅' },
            { order: 4, content: '加入适量清水' },
            { order: 5, content: '隔水炖煮2小时' },
            { order: 6, content: '出锅前加盐调味' }
        ],
        analysis: '黄芪补气固表、利水消肿；党参补中益气、健脾益肺。配合鸡肉的温补之力，可大补元气，特别适合气虚体质者和体弱多病者食用。'
    },
    {
        name: '红枣桂圆粥',
        description: '补血养心，健脾益气，安神定志',
        emoji: '🥘',
        nature: '温',
        flavors: ['甘'],
        meridians: ['心', '脾'],
        suitableConstitutions: ['qi_deficiency', 'blood_stasis', 'balanced'],
        avoidConstitutions: ['damp_heat', 'phlegm_dampness'],
        category: 'warming',
        tags: ['早餐', '补血', '安神'],
        cookingTime: 40,
        difficulty: '简单',
        baseScore: 85,
        ingredients: [
            { name: '大米', amount: '100g', icon: '🍚' },
            { name: '红枣', amount: '8颗', icon: '🔴' },
            { name: '桂圆肉', amount: '20g', icon: '🟤' },
            { name: '红糖', amount: '适量', icon: '🟫' }
        ],
        steps: [
            { order: 1, content: '大米淘洗干净，浸泡30分钟' },
            { order: 2, content: '红枣去核，桂圆肉洗净' },
            { order: 3, content: '锅中加水，放入大米' },
            { order: 4, content: '大火煮沸后转小火' },
            { order: 5, content: '加入红枣和桂圆' },
            { order: 6, content: '熬至粥稠，加红糖调味' }
        ],
        analysis: '红枣补中益气、养血安神；桂圆肉补心脾、益气血。此粥特别适合气血不足、心脾两虚者，可改善面色萎黄、心悸失眠等症状。'
    },
    {
        name: '姜母鸭',
        description: '温中散寒，补虚养血，益气健脾',
        emoji: '🦆',
        nature: '温',
        flavors: ['甘', '辛'],
        meridians: ['脾', '胃', '肾'],
        suitableConstitutions: ['yang_deficiency', 'qi_deficiency'],
        avoidConstitutions: ['yin_deficiency', 'damp_heat'],
        category: 'warming',
        tags: ['温补', '冬季', '闽南'],
        cookingTime: 120,
        difficulty: '中等',
        baseScore: 88,
        ingredients: [
            { name: '鸭肉', amount: '半只', icon: '🦆' },
            { name: '老姜', amount: '200g', icon: '🫚' },
            { name: '米酒', amount: '500ml', icon: '🍶' },
            { name: '麻油', amount: '100ml', icon: '🫒' },
            { name: '枸杞', amount: '15g', icon: '🔴' }
        ],
        steps: [
            { order: 1, content: '鸭肉洗净切块，焯水备用' },
            { order: 2, content: '老姜切片，用麻油煸炒至金黄' },
            { order: 3, content: '放入鸭肉翻炒至表面微焦' },
            { order: 4, content: '倒入米酒，大火煮沸' },
            { order: 5, content: '转小火焖煮1.5小时' },
            { order: 6, content: '加入枸杞，调味即可' }
        ],
        analysis: '姜母鸭是闽南传统药膳，老姜温中散寒，鸭肉滋阴补虚，米酒活血通络。冬季食用可温暖全身，特别适合阳虚体质和手脚冰凉者。'
    },
    {
        name: '四神汤',
        description: '健脾利湿，养心安神，补肾益精',
        emoji: '🍵',
        nature: '平',
        flavors: ['甘'],
        meridians: ['脾', '胃', '心', '肾'],
        suitableConstitutions: ['qi_deficiency', 'phlegm_dampness', 'balanced'],
        avoidConstitutions: [],
        category: 'warming',
        tags: ['健脾', '祛湿', '台式'],
        cookingTime: 90,
        difficulty: '简单',
        baseScore: 86,
        ingredients: [
            { name: '猪小肠', amount: '300g', icon: '🥓' },
            { name: '山药', amount: '30g', icon: '🥔' },
            { name: '莲子', amount: '30g', icon: '⚪' },
            { name: '茯苓', amount: '20g', icon: '🤍' },
            { name: '芡实', amount: '20g', icon: '⚪' }
        ],
        steps: [
            { order: 1, content: '猪小肠清洗干净，切段焯水' },
            { order: 2, content: '四神药材用清水浸泡30分钟' },
            { order: 3, content: '所有材料放入锅中' },
            { order: 4, content: '加足量清水，大火煮沸' },
            { order: 5, content: '转小火炖煮1.5小时' },
            { order: 6, content: '加盐调味即可' }
        ],
        analysis: '四神汤由山药、莲子、茯苓、芡实四味药材组成，是健脾祛湿的经典方剂。性味平和，老少皆宜，特别适合脾胃虚弱、湿气重者。'
    },
    {
        name: '核桃芝麻糊',
        description: '补肾益脑，乌发润肠，滋阴养血',
        emoji: '🥜',
        nature: '温',
        flavors: ['甘'],
        meridians: ['肝', '肾', '大肠'],
        suitableConstitutions: ['yang_deficiency', 'blood_stasis', 'yin_deficiency'],
        avoidConstitutions: ['phlegm_dampness'],
        category: 'warming',
        tags: ['早餐', '补肾', '乌发'],
        cookingTime: 20,
        difficulty: '简单',
        baseScore: 82,
        ingredients: [
            { name: '核桃仁', amount: '50g', icon: '🥜' },
            { name: '黑芝麻', amount: '30g', icon: '⚫' },
            { name: '糯米粉', amount: '20g', icon: '🍚' },
            { name: '冰糖', amount: '适量', icon: '🧊' }
        ],
        steps: [
            { order: 1, content: '核桃仁、黑芝麻分别炒香' },
            { order: 2, content: '放入料理机打成细粉' },
            { order: 3, content: '糯米粉用少量水调成糊' },
            { order: 4, content: '锅中加水煮沸，倒入核桃芝麻粉' },
            { order: 5, content: '边煮边搅拌，加入糯米糊' },
            { order: 6, content: '煮至浓稠，加冰糖调味' }
        ],
        analysis: '核桃补肾固精、温肺定喘；黑芝麻补肝肾、润五脏。两者配伍，对肾虚腰痛、须发早白有良好的食疗效果。'
    },

    // ==================== 清润类 ====================
    {
        name: '银耳莲子羹',
        description: '滋阴润肺，养心安神，健脾益肾',
        emoji: '🥣',
        nature: '平',
        flavors: ['甘'],
        meridians: ['心', '脾', '肾'],
        suitableConstitutions: ['yin_deficiency', 'balanced', 'qi_deficiency'],
        avoidConstitutions: ['yang_deficiency', 'phlegm_dampness'],
        category: 'cooling',
        tags: ['滋阴', '润燥', '甜品'],
        cookingTime: 45,
        difficulty: '简单',
        baseScore: 88,
        ingredients: [
            { name: '银耳', amount: '1朵', icon: '🍄' },
            { name: '莲子', amount: '30g', icon: '⚪' },
            { name: '红枣', amount: '6颗', icon: '🔴' },
            { name: '枸杞', amount: '10g', icon: '🔴' },
            { name: '冰糖', amount: '适量', icon: '🧊' }
        ],
        steps: [
            { order: 1, content: '银耳提前泡发2小时，去蒂撕成小朵' },
            { order: 2, content: '莲子去芯，红枣洗净' },
            { order: 3, content: '银耳放入锅中，加足量清水' },
            { order: 4, content: '大火煮沸后转小火慢炖1小时' },
            { order: 5, content: '加入莲子、红枣继续炖30分钟' },
            { order: 6, content: '最后加入枸杞和冰糖，搅匀即可' }
        ],
        analysis: '银耳性平味甘，滋阴润肺、养胃生津；莲子养心安神、益肾固精；红枣补中益气、养血安神。三者配伍，是秋冬季节滋阴润燥的上佳选择。'
    },
    {
        name: '百合雪梨汤',
        description: '润肺止咳，清心安神，生津润燥',
        emoji: '🍐',
        nature: '凉',
        flavors: ['甘'],
        meridians: ['肺', '心'],
        suitableConstitutions: ['yin_deficiency', 'damp_heat'],
        avoidConstitutions: ['yang_deficiency', 'qi_deficiency'],
        category: 'cooling',
        tags: ['润肺', '止咳', '秋季'],
        cookingTime: 30,
        difficulty: '简单',
        baseScore: 78,
        ingredients: [
            { name: '雪梨', amount: '2个', icon: '🍐' },
            { name: '百合', amount: '30g', icon: '🤍' },
            { name: '冰糖', amount: '适量', icon: '🧊' },
            { name: '枸杞', amount: '5g', icon: '🔴' }
        ],
        steps: [
            { order: 1, content: '雪梨去皮去核，切块' },
            { order: 2, content: '百合洗净，泡发' },
            { order: 3, content: '锅中加水，放入雪梨' },
            { order: 4, content: '大火煮沸后加入百合' },
            { order: 5, content: '转小火煮20分钟' },
            { order: 6, content: '加入冰糖和枸杞即可' }
        ],
        analysis: '雪梨清热润肺、生津止渴；百合润肺止咳、清心安神。此汤适合阴虚内热、肺燥咳嗽者，但阳虚体质者不宜多食。'
    },
    {
        name: '绿豆百合粥',
        description: '清热解暑，润肺安神，解毒消肿',
        emoji: '🥣',
        nature: '凉',
        flavors: ['甘'],
        meridians: ['心', '胃'],
        suitableConstitutions: ['damp_heat', 'yin_deficiency'],
        avoidConstitutions: ['yang_deficiency', 'qi_deficiency'],
        category: 'cooling',
        tags: ['清热', '夏季', '解暑'],
        cookingTime: 50,
        difficulty: '简单',
        baseScore: 75,
        ingredients: [
            { name: '绿豆', amount: '50g', icon: '🟢' },
            { name: '百合', amount: '20g', icon: '🤍' },
            { name: '大米', amount: '80g', icon: '🍚' },
            { name: '冰糖', amount: '适量', icon: '🧊' }
        ],
        steps: [
            { order: 1, content: '绿豆提前浸泡2小时' },
            { order: 2, content: '大米淘洗干净' },
            { order: 3, content: '锅中加水，放入绿豆先煮20分钟' },
            { order: 4, content: '加入大米继续煮' },
            { order: 5, content: '粥将成时加入百合' },
            { order: 6, content: '煮至软烂，加冰糖调味' }
        ],
        analysis: '绿豆清热解毒、消暑利水；百合润肺安神。此粥适合夏季食用，可清热解暑，但脾胃虚寒者不宜多食。'
    },
    {
        name: '冰糖炖雪燕',
        description: '滋阴润燥，美容养颜，补充胶原',
        emoji: '🍮',
        nature: '平',
        flavors: ['甘'],
        meridians: ['肺', '胃'],
        suitableConstitutions: ['yin_deficiency', 'balanced'],
        avoidConstitutions: ['phlegm_dampness'],
        category: 'cooling',
        tags: ['美容', '滋阴', '甜品'],
        cookingTime: 40,
        difficulty: '简单',
        baseScore: 80,
        ingredients: [
            { name: '雪燕', amount: '5g', icon: '🤍' },
            { name: '冰糖', amount: '适量', icon: '🧊' },
            { name: '枸杞', amount: '5g', icon: '🔴' },
            { name: '红枣', amount: '3颗', icon: '🔴' }
        ],
        steps: [
            { order: 1, content: '雪燕提前泡发8-10小时' },
            { order: 2, content: '挑去杂质，清洗干净' },
            { order: 3, content: '放入炖盅，加适量清水' },
            { order: 4, content: '加入冰糖和红枣' },
            { order: 5, content: '隔水炖煮30分钟' },
            { order: 6, content: '出锅前加入枸杞即可' }
        ],
        analysis: '雪燕富含植物性胶原蛋白，能滋阴润燥、补充营养。适合阴虚体质者和注重美容养颜的人群食用。'
    },
    {
        name: '菊花枸杞茶',
        description: '清肝明目，清热解毒，滋补肝肾',
        emoji: '🍵',
        nature: '凉',
        flavors: ['甘', '苦'],
        meridians: ['肝', '肺'],
        suitableConstitutions: ['yin_deficiency', 'damp_heat', 'balanced'],
        avoidConstitutions: ['yang_deficiency'],
        category: 'cooling',
        tags: ['茶饮', '明目', '办公'],
        cookingTime: 5,
        difficulty: '简单',
        baseScore: 72,
        ingredients: [
            { name: '菊花', amount: '5朵', icon: '🌼' },
            { name: '枸杞', amount: '10粒', icon: '🔴' },
            { name: '冰糖', amount: '适量', icon: '🧊' }
        ],
        steps: [
            { order: 1, content: '菊花和枸杞用清水冲洗' },
            { order: 2, content: '放入茶杯中' },
            { order: 3, content: '加入沸水冲泡' },
            { order: 4, content: '加入冰糖' },
            { order: 5, content: '盖上杯盖焖3-5分钟' },
            { order: 6, content: '待温度适宜后饮用' }
        ],
        analysis: '菊花清热解毒、平肝明目；枸杞滋补肝肾、益精明目。此茶适合长时间用眼的上班族，可缓解眼睛疲劳。'
    },
    {
        name: '薏米红豆粥',
        description: '清热利湿，健脾消肿，美白祛斑',
        emoji: '🥣',
        nature: '凉',
        flavors: ['甘'],
        meridians: ['脾', '胃', '肺'],
        suitableConstitutions: ['phlegm_dampness', 'damp_heat'],
        avoidConstitutions: ['yang_deficiency', 'qi_deficiency'],
        category: 'cooling',
        tags: ['祛湿', '美白', '减肥'],
        cookingTime: 60,
        difficulty: '简单',
        baseScore: 83,
        ingredients: [
            { name: '薏米', amount: '50g', icon: '⚪' },
            { name: '红豆', amount: '50g', icon: '🔴' },
            { name: '冰糖', amount: '适量', icon: '🧊' }
        ],
        steps: [
            { order: 1, content: '薏米、红豆提前浸泡4小时' },
            { order: 2, content: '锅中加足量清水' },
            { order: 3, content: '大火煮沸后转小火' },
            { order: 4, content: '煮至红豆开花软烂' },
            { order: 5, content: '加入冰糖调味' },
            { order: 6, content: '可根据喜好调整浓稠度' }
        ],
        analysis: '薏米利水渗湿、健脾；红豆利水消肿、清热解毒。此粥是祛湿的经典组合，适合湿气重、身体浮肿者食用。'
    },

    // ==================== 快手菜类 ====================
    {
        name: '番茄鸡蛋面',
        description: '开胃消食，营养均衡，简单美味',
        emoji: '🍝',
        nature: '平',
        flavors: ['酸', '甘'],
        meridians: ['脾', '胃'],
        suitableConstitutions: ['balanced', 'qi_deficiency', 'yin_deficiency'],
        avoidConstitutions: [],
        category: 'quick',
        tags: ['快手', '早餐', '面食'],
        cookingTime: 15,
        difficulty: '简单',
        baseScore: 80,
        ingredients: [
            { name: '面条', amount: '150g', icon: '🍜' },
            { name: '番茄', amount: '2个', icon: '🍅' },
            { name: '鸡蛋', amount: '2个', icon: '🥚' },
            { name: '葱花', amount: '适量', icon: '🧅' },
            { name: '盐', amount: '适量', icon: '🧂' }
        ],
        steps: [
            { order: 1, content: '番茄切块，鸡蛋打散' },
            { order: 2, content: '热锅凉油，炒散鸡蛋盛出' },
            { order: 3, content: '锅中加油，炒香番茄' },
            { order: 4, content: '加入清水煮沸' },
            { order: 5, content: '下入面条煮至断生' },
            { order: 6, content: '加入鸡蛋，调味出锅撒葱花' }
        ],
        analysis: '番茄富含维生素C和番茄红素，鸡蛋提供优质蛋白。此面营养均衡，口味清爽，老少皆宜，是快手早餐的上佳选择。'
    },
    {
        name: '蒜蓉西兰花',
        description: '清热解毒，补充维生素，增强免疫',
        emoji: '🥦',
        nature: '平',
        flavors: ['甘'],
        meridians: ['脾', '胃'],
        suitableConstitutions: ['balanced', 'damp_heat', 'yin_deficiency'],
        avoidConstitutions: [],
        category: 'quick',
        tags: ['快手', '素菜', '减脂'],
        cookingTime: 10,
        difficulty: '简单',
        baseScore: 76,
        ingredients: [
            { name: '西兰花', amount: '300g', icon: '🥦' },
            { name: '大蒜', amount: '5瓣', icon: '🧄' },
            { name: '盐', amount: '适量', icon: '🧂' },
            { name: '生抽', amount: '少许', icon: '🫗' }
        ],
        steps: [
            { order: 1, content: '西兰花切小朵，清水浸泡' },
            { order: 2, content: '大蒜切末' },
            { order: 3, content: '锅中水烧开，焯烫西兰花1分钟' },
            { order: 4, content: '捞出沥干水分' },
            { order: 5, content: '热锅凉油，爆香蒜末' },
            { order: 6, content: '加入西兰花快速翻炒，调味出锅' }
        ],
        analysis: '西兰花富含维生素C、膳食纤维和多种抗氧化物质，大蒜可以杀菌增香。此菜低脂高纤，是减脂期的理想选择。'
    },
    {
        name: '葱花蛋炒饭',
        description: '快手饱腹，营养美味，经典家常',
        emoji: '🍚',
        nature: '平',
        flavors: ['甘'],
        meridians: ['脾', '胃'],
        suitableConstitutions: ['balanced', 'qi_deficiency'],
        avoidConstitutions: [],
        category: 'quick',
        tags: ['快手', '午餐', '主食'],
        cookingTime: 10,
        difficulty: '简单',
        baseScore: 78,
        ingredients: [
            { name: '米饭', amount: '1碗', icon: '🍚' },
            { name: '鸡蛋', amount: '2个', icon: '🥚' },
            { name: '小葱', amount: '2根', icon: '🧅' },
            { name: '盐', amount: '适量', icon: '🧂' }
        ],
        steps: [
            { order: 1, content: '鸡蛋打散，小葱切葱花' },
            { order: 2, content: '米饭提前打散' },
            { order: 3, content: '热锅多油，倒入蛋液快速翻炒' },
            { order: 4, content: '蛋液半凝固时加入米饭' },
            { order: 5, content: '大火翻炒至米饭粒粒分明' },
            { order: 6, content: '加盐调味，撒葱花出锅' }
        ],
        analysis: '蛋炒饭是最经典的快手主食，鸡蛋提供蛋白质，米饭提供碳水化合物，简单快捷，适合忙碌的工作日。'
    },
    {
        name: '酸辣土豆丝',
        description: '开胃下饭，清爽可口，家常必备',
        emoji: '🥔',
        nature: '平',
        flavors: ['酸', '辛'],
        meridians: ['脾', '胃'],
        suitableConstitutions: ['balanced', 'qi_stagnation'],
        avoidConstitutions: ['yin_deficiency'],
        category: 'quick',
        tags: ['快手', '下饭', '家常'],
        cookingTime: 15,
        difficulty: '简单',
        baseScore: 79,
        ingredients: [
            { name: '土豆', amount: '2个', icon: '🥔' },
            { name: '干辣椒', amount: '3个', icon: '🌶️' },
            { name: '醋', amount: '2勺', icon: '🫗' },
            { name: '蒜末', amount: '适量', icon: '🧄' }
        ],
        steps: [
            { order: 1, content: '土豆去皮切细丝，泡水洗去淀粉' },
            { order: 2, content: '干辣椒切段，准备蒜末' },
            { order: 3, content: '热锅凉油，爆香辣椒和蒜末' },
            { order: 4, content: '倒入土豆丝大火翻炒' },
            { order: 5, content: '加盐和醋调味' },
            { order: 6, content: '翻炒均匀即可出锅' }
        ],
        analysis: '土豆含丰富淀粉和维生素C，醋可以开胃消食，辣椒可以增进食欲。此菜酸辣可口，是下饭神器。'
    },
    {
        name: '清炒时蔬',
        description: '清淡爽口，补充维生素，健康首选',
        emoji: '🥬',
        nature: '凉',
        flavors: ['甘'],
        meridians: ['肺', '胃'],
        suitableConstitutions: ['balanced', 'damp_heat', 'yin_deficiency'],
        avoidConstitutions: ['yang_deficiency'],
        category: 'quick',
        tags: ['快手', '素菜', '清淡'],
        cookingTime: 8,
        difficulty: '简单',
        baseScore: 74,
        ingredients: [
            { name: '小白菜', amount: '300g', icon: '🥬' },
            { name: '大蒜', amount: '3瓣', icon: '🧄' },
            { name: '盐', amount: '适量', icon: '🧂' },
            { name: '油', amount: '适量', icon: '🫒' }
        ],
        steps: [
            { order: 1, content: '小白菜洗净切段' },
            { order: 2, content: '大蒜切片' },
            { order: 3, content: '热锅凉油，爆香蒜片' },
            { order: 4, content: '加入小白菜大火翻炒' },
            { order: 5, content: '加盐调味' },
            { order: 6, content: '炒至断生即可出锅' }
        ],
        analysis: '绿叶蔬菜富含维生素、矿物质和膳食纤维，清炒保留营养。适合日常补充蔬菜，清淡健康。'
    },
    {
        name: '紫菜蛋花汤',
        description: '补碘润肺，简单快手，营养美味',
        emoji: '🍜',
        nature: '凉',
        flavors: ['甘', '咸'],
        meridians: ['肺', '肾'],
        suitableConstitutions: ['balanced', 'yin_deficiency'],
        avoidConstitutions: ['yang_deficiency'],
        category: 'quick',
        tags: ['快手', '汤品', '清淡'],
        cookingTime: 5,
        difficulty: '简单',
        baseScore: 73,
        ingredients: [
            { name: '紫菜', amount: '10g', icon: '🟣' },
            { name: '鸡蛋', amount: '1个', icon: '🥚' },
            { name: '香油', amount: '少许', icon: '🫒' },
            { name: '盐', amount: '适量', icon: '🧂' }
        ],
        steps: [
            { order: 1, content: '紫菜撕成小片' },
            { order: 2, content: '鸡蛋打散' },
            { order: 3, content: '锅中水烧开' },
            { order: 4, content: '放入紫菜煮1分钟' },
            { order: 5, content: '淋入蛋液，轻轻搅动' },
            { order: 6, content: '加盐和香油调味即可' }
        ],
        analysis: '紫菜富含碘和多种微量元素，鸡蛋提供优质蛋白。此汤制作简单，营养丰富，是快手汤品的首选。'
    },
    {
        name: '小米南瓜粥',
        description: '养胃健脾，补中益气，老少皆宜',
        emoji: '🎃',
        nature: '温',
        flavors: ['甘'],
        meridians: ['脾', '胃'],
        suitableConstitutions: ['qi_deficiency', 'balanced', 'yang_deficiency'],
        avoidConstitutions: [],
        category: 'quick',
        tags: ['早餐', '养胃', '粥品'],
        cookingTime: 30,
        difficulty: '简单',
        baseScore: 84,
        ingredients: [
            { name: '小米', amount: '100g', icon: '🌾' },
            { name: '南瓜', amount: '200g', icon: '🎃' },
            { name: '清水', amount: '适量', icon: '💧' }
        ],
        steps: [
            { order: 1, content: '小米淘洗干净' },
            { order: 2, content: '南瓜去皮切小块' },
            { order: 3, content: '锅中加水烧开' },
            { order: 4, content: '放入小米和南瓜' },
            { order: 5, content: '大火煮沸后转小火' },
            { order: 6, content: '熬煮至粥稠南瓜软烂即可' }
        ],
        analysis: '小米健脾养胃、补虚损；南瓜补中益气、消炎止痛。此粥特别适合脾胃虚弱者，是养胃的佳品。'
    }
];

export default recipeSeeds;
