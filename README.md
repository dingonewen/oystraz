# HealthSim - 虚拟人生健康模拟器

> **"Work hard, play hard, but don't forget to live hard."**
> 一个结合健康追踪与办公室生活模拟的游戏化应用，让你的虚拟小人和现实生活同步成长。

---

## 🎮 项目愿景

HealthSim 不只是一个健康追踪应用，而是一个**情绪宣泄与生活模拟的结合体**。在这里，你的真实生活选择（饮食、睡眠、运动）会直接影响虚拟角色的状态，而虚拟角色在工作场景中的表现则反映了你的身心健康水平。

### 核心理念
- 🍎 **真实数据驱动** - 基于USDA数据库的营养分析
- 🏃 **科学运动追踪** - 准确的卡路里消耗计算
- 😊 **情绪化交互** - 根据健康状态触发不同的工作场景
- 💼 **压力释放** - 在虚拟世界安全地"怼领导"、"摸鱼"、"睡觉"
- 🤖 **AI助手** - Gemini AI 提供个性化建议和情感共鸣

---

## 🌟 核心功能

### 1. 健康数据追踪
```
📊 三大维度：
├─ 🍽️ 饮食记录
│   ├─ 快速搜索食物（USDA数据库）
│   ├─ 拍照识别（Gemini Vision）
│   └─ 营养成分自动分析
│
├─ 😴 睡眠追踪
│   ├─ 睡眠时长
│   ├─ 就寝/起床时间
│   └─ 睡眠质量评分
│
└─ 🏃 运动记录
    ├─ 运动类型和时长
    ├─ 卡路里消耗计算
    └─ 强度分级
```

### 2. 虚拟角色系统
```
👤 角色属性（0-100）：
├─ 💪 体力值 - 基于运动量和睡眠质量
├─ ⚡ 能量值 - 基于热量摄入vs消耗
├─ 🍎 营养值 - 基于饮食均衡度
├─ 😊 心情值 - 基于整体健康趋势
└─ 😰 压力值 - 基于工作时长和休息情况

🎭 角色状态：
├─ 体型变化（BMI影响）
├─ 精神状态（疲惫 ↔ 活力）
├─ 表情动作（开心、沮丧、愤怒、疲倦）
└─ 等级系统（通过健康行为升级）
```

### 3. 办公室生活模拟器 ⭐核心创新⭐
```
💼 工作场景系统：
当用户点击"开始工作"时，虚拟小人进入办公室场景，
根据当前健康属性触发不同的互动事件和选择。

场景示例：
┌─────────────────────────────────────┐
│  [小人坐在办公桌前]                    │
│                                     │
│  当前状态：                          │
│  💪 体力: 85  ⚡ 能量: 90           │
│  😊 心情: 75  😰 压力: 30           │
│                                     │
│  事件触发：                          │
│  "领导突然叫你去开会..."             │
│                                     │
│  可选行动：                          │
│  [💥 直接怼回去] (心情>80)           │
│  [😴 假装没听到] (体力<40)           │
│  [📝 乖乖去开会] (默认)              │
│  [🏃 装上厕所摸鱼] (压力>70)         │
└─────────────────────────────────────┘
```

#### 工作事件类型（基于健康参数）
```
高体力值 (>80):
├─ ✨ "加班也精神抖擞，获得老板赏识" (+心情)
├─ 💪 "完成高难度项目" (+经验值)
└─ 🏆 "主动承担额外工作" (+成就感)

低体力值 (<40):
├─ 😴 "工作时打瞌睡被同事发现" (-心情)
├─ 💤 "趴桌上睡着了" (恢复体力但-职场声誉)
└─ 🥱 "效率低下，任务延期" (-压力上升)

高心情值 (>80):
├─ 💥 "怼领导不合理要求" (爽！+压力释放)
├─ 💰 "主动提加薪要求" (有概率成功)
└─ 🎉 "工作效率爆棚" (+生产力)

低心情值 (<30):
├─ 😢 "在厕所偷偷哭" (情绪宣泄)
├─ 💼 "递交辞职信" (重启人生)
└─ 🏃 "下午直接溜了" (-工作进度)

高压力值 (>80):
├─ 🤯 "当场爆发情绪" (减压但影响关系)
├─ 🏖️ "强制休假" (恢复心情)
└─ 🧘 "需要进行冥想/运动" (触发任务)

均衡状态 (各项60-80):
├─ 📊 "稳定发挥，正常工作"
├─ 🤝 "团队协作顺畅"
└─ ⬆️ "职场等级提升"
```

### 4. AI 健康教练 (Gemini)
```
🤖 智能助手功能：
├─ 💬 情感共鸣
│   "看来你昨晚没睡好，今天体力值只有45...
│    要不要听听我的建议？"
│
├─ 🎯 个性化建议
│   "你已经连续3天没运动了，营养值下降到60，
│    推荐你今天做30分钟快走，配合高蛋白早餐！"
│
├─ 🎉 鼓励和庆祝
│   "太棒了！连续7天健康饮食，你的小人升到3级了！
│    解锁成就：健康战士 🏆"
│
├─ 📈 趋势分析
│   "最近两周你的睡眠质量在下降，
│    这可能是工作压力导致的，建议调整作息..."
│
└─ 🎭 工作场景解说
   "哈哈，你的小人刚刚怼了领导！
    压力值-30，心情值+20，不过要小心职场关系哦😄"
```

### 5. 数据可视化与报告
```
📊 健康仪表盘：
├─ 四维雷达图（体力/能量/营养/心情）
├─ 历史趋势曲线
├─ 每周/每月健康报告
└─ 工作场景回放日志

📅 每日总结：
"2026年1月13日 - 你的一天"
├─ 早餐: 燕麦+香蕉 (350卡路里, 营养+15)
├─ 运动: 慢跑30分钟 (体力+20, 能量-250)
├─ 工作: 怼了领导一次 (心情+25, 压力-30)
└─ 综合: 健康等级 5 → 6 ⬆️
```

---

## 🏗️ 技术架构

### 技术栈选型
```
前端:
├─ React 18 + TypeScript
├─ UI库: Material-UI (移动端友好)
├─ 状态管理: Zustand
├─ 路由: React Router v6
├─ 图表: Recharts
├─ 动画: Framer Motion
└─ PWA: 支持安装到手机

后端:
├─ FastAPI (Python 3.11+)
├─ 数据库: PostgreSQL
├─ ORM: SQLAlchemy
├─ 认证: JWT
└─ API文档: 自动生成 (FastAPI)

AI & 数据:
├─ Google Gemini API (对话+图像识别)
├─ USDA FoodData Central API (营养数据)
├─ Exercise DB / MET Database (运动数据)
└─ Redis (缓存层)

部署:
├─ 前端: Vercel / Netlify
├─ 后端: Railway / Render
├─ 数据库: Supabase (PostgreSQL托管)
└─ 容器化: Docker + Docker Compose
```

### 系统架构图
```
┌─────────────────────────────────────────────────┐
│                  用户界面层                       │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐      │
│  │ 数据输入  │  │ 角色展示  │  │ 工作模拟  │      │
│  └──────────┘  └──────────┘  └──────────┘      │
│         │              │              │         │
└─────────┼──────────────┼──────────────┼─────────┘
          │              │              │
          ▼              ▼              ▼
┌─────────────────────────────────────────────────┐
│                  API 网关层                       │
│              FastAPI REST API                    │
└─────────────────────────────────────────────────┘
          │              │              │
    ┌─────┴─────┐  ┌────┴────┐  ┌─────┴─────┐
    ▼           ▼  ▼         ▼  ▼           ▼
┌────────┐ ┌────────┐ ┌─────────┐ ┌──────────┐
│健康计算│ │场景引擎│ │AI服务   │ │外部API   │
│Engine  │ │Engine  │ │(Gemini) │ │(USDA等)  │
└────────┘ └────────┘ └─────────┘ └──────────┘
    │           │          │           │
    └───────────┴──────────┴───────────┘
                    ▼
          ┌──────────────────┐
          │   数据持久化层     │
          │  PostgreSQL DB   │
          └──────────────────┘
```

### 核心算法

#### 1. 健康评分计算引擎
```python
def calculate_health_metrics(user_data):
    """
    基于多维度计算健康参数

    输入:
    - 饮食记录 (calories, protein, carbs, fat, vitamins)
    - 睡眠记录 (duration, quality, bedtime)
    - 运动记录 (type, duration, intensity)
    - 用户基础数据 (height, weight, age, gender)

    输出:
    - 体力值 (0-100)
    - 能量值 (0-100)
    - 营养值 (0-100)
    - 心情值 (0-100)
    - 压力值 (0-100)
    """

    # 1. 体力值 = f(运动量, 睡眠质量)
    fitness = (
        exercise_score * 0.6 +
        sleep_quality * 0.4
    )

    # 2. 能量值 = f(热量平衡, 睡眠时长)
    energy = (
        calorie_balance_score * 0.7 +
        sleep_duration_score * 0.3
    )

    # 3. 营养值 = f(饮食均衡度, 微量元素)
    nutrition = (
        macro_balance * 0.6 +
        vitamin_minerals * 0.4
    )

    # 4. 心情值 = f(整体健康趋势, 压力水平)
    mood = (
        overall_health_trend * 0.6 +
        (100 - stress) * 0.4
    )

    # 5. 压力值 = f(工作时长, 休息质量, 心情波动)
    stress = calculate_stress_level(
        work_hours, rest_quality, mood_variance
    )

    return {
        'fitness': fitness,
        'energy': energy,
        'nutrition': nutrition,
        'mood': mood,
        'stress': stress
    }
```

#### 2. 工作场景触发引擎
```python
def trigger_work_event(character_state):
    """
    根据角色健康状态触发工作场景

    优先级:
    1. 极端状态 (任意属性 < 20 或 > 90)
    2. 组合状态 (高压力+低心情)
    3. 随机事件 (基于概率)
    """

    # 极端状态检查
    if character_state['fitness'] < 20:
        return random.choice([
            Event('SLEEP_AT_DESK', consequence={'fitness': +10, 'reputation': -5}),
            Event('CALL_IN_SICK', consequence={'fitness': +30, 'work_progress': -10})
        ])

    if character_state['mood'] > 90:
        return random.choice([
            Event('CONFRONT_BOSS', consequence={'stress': -30, 'mood': +10}),
            Event('ASK_FOR_RAISE', consequence={'money': +100, 'confidence': +15})
        ])

    # 组合状态
    if character_state['stress'] > 80 and character_state['mood'] < 30:
        return Event('MELTDOWN', consequence={'stress': -50, 'relationships': -20})

    # 正常随机事件
    return get_random_event(character_state)
```

#### 3. AI 对话生成
```python
def generate_ai_response(user_data, context, conversation_history):
    """
    使用Gemini生成个性化AI助手回复
    """

    prompt = f"""
    你是HealthSim的AI健康教练，用轻松、幽默、共鸣的语气和用户交流。
    你可以看到用户的虚拟角色状态，并像朋友一样给出建议。

    用户角色当前状态：
    - 等级: {user_data['level']}
    - 💪 体力: {user_data['fitness']}/100
    - ⚡ 能量: {user_data['energy']}/100
    - 🍎 营养: {user_data['nutrition']}/100
    - 😊 心情: {user_data['mood']}/100
    - 😰 压力: {user_data['stress']}/100

    最近活动:
    - 昨日饮食: {user_data['yesterday_meals']}
    - 昨日运动: {user_data['yesterday_exercise']}
    - 最近工作场景: {user_data['recent_work_events']}

    当前情况: {context}

    请用鼓励、有趣、游戏化的语气回复，可以使用emoji。
    如果用户状态不好，给予共鸣和实用建议。
    如果用户表现好，热情庆祝并鼓励继续。
    """

    response = gemini_client.generate_content(
        prompt,
        history=conversation_history
    )

    return response.text
```

---

## 📂 项目结构

```
HealthSim/
├── README.md
├── .gitignore
├── docker-compose.yml
│
├── frontend/                      # React 前端
│   ├── public/
│   │   ├── manifest.json          # PWA配置
│   │   ├── icons/                 # 应用图标
│   │   └── index.html
│   ├── src/
│   │   ├── components/            # UI组件
│   │   │   ├── Avatar/            # 虚拟角色显示
│   │   │   ├── HealthBars/        # 健康属性条
│   │   │   ├── FoodInput/         # 食物输入
│   │   │   ├── ExerciseLog/       # 运动记录
│   │   │   ├── WorkSimulator/     # 工作场景模拟器 ⭐
│   │   │   ├── AIChat/            # AI对话界面
│   │   │   └── Dashboard/         # 数据仪表盘
│   │   ├── pages/
│   │   │   ├── Home.tsx           # 主页（角色状态）
│   │   │   ├── Track.tsx          # 数据追踪
│   │   │   ├── Work.tsx           # 工作模拟 ⭐
│   │   │   ├── Stats.tsx          # 数据统计
│   │   │   └── Profile.tsx        # 用户设置
│   │   ├── hooks/                 # 自定义hooks
│   │   ├── services/              # API调用
│   │   │   ├── api.ts             # API客户端
│   │   │   ├── foodService.ts
│   │   │   ├── exerciseService.ts
│   │   │   └── geminiService.ts
│   │   ├── store/                 # Zustand状态管理
│   │   │   ├── userStore.ts
│   │   │   ├── characterStore.ts
│   │   │   └── workStore.ts
│   │   ├── utils/
│   │   │   ├── calculations.ts    # 前端计算工具
│   │   │   └── formatters.ts
│   │   ├── types/                 # TypeScript类型定义
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── package.json
│   ├── tsconfig.json
│   └── vite.config.ts
│
├── backend/                       # FastAPI 后端
│   ├── app/
│   │   ├── main.py                # 应用入口
│   │   ├── config.py              # 配置管理
│   │   ├── database.py            # 数据库连接
│   │   ├── models/                # SQLAlchemy模型
│   │   │   ├── user.py
│   │   │   ├── meal.py
│   │   │   ├── exercise.py
│   │   │   ├── sleep.py
│   │   │   ├── character.py
│   │   │   ├── work_event.py      # 工作事件记录
│   │   │   └── achievement.py
│   │   ├── schemas/               # Pydantic schemas
│   │   │   ├── user.py
│   │   │   ├── health.py
│   │   │   └── work.py
│   │   ├── api/                   # API路由
│   │   │   ├── auth.py            # 认证
│   │   │   ├── user.py            # 用户管理
│   │   │   ├── food.py            # 食物相关
│   │   │   ├── exercise.py        # 运动相关
│   │   │   ├── sleep.py           # 睡眠相关
│   │   │   ├── character.py       # 角色状态
│   │   │   ├── work.py            # 工作场景 ⭐
│   │   │   └── ai.py              # AI对话
│   │   ├── services/              # 业务逻辑
│   │   │   ├── health_calculator.py  # 健康计算引擎 ⭐
│   │   │   ├── work_engine.py        # 工作场景引擎 ⭐
│   │   │   ├── usda_client.py        # USDA API客户端
│   │   │   ├── exercise_client.py    # 运动数据API
│   │   │   ├── gemini_client.py      # Gemini API
│   │   │   └── character_service.py  # 角色状态管理
│   │   └── core/
│   │       ├── security.py        # JWT等
│   │       └── dependencies.py
│   ├── tests/
│   ├── requirements.txt
│   ├── Dockerfile
│   └── alembic/                   # 数据库迁移
│
├── data/                          # 数据文件
│   ├── raw/                       # USDA原始数据
│   ├── processed/                 # 处理后数据
│   └── work_events.json           # 工作场景事件库 ⭐
│
└── docs/                          # 文档
    ├── API.md                     # API文档
    ├── DATABASE.md                # 数据库设计
    ├── ALGORITHMS.md              # 算法说明
    └── DEPLOYMENT.md              # 部署指南
```

---

## 🗄️ 数据库设计

```sql
-- 用户表
users:
  id, username, email, password_hash,
  height, weight, age, gender, goal,
  created_at, updated_at

-- 角色状态表（每日快照）
character_states:
  id, user_id, date,
  fitness, energy, nutrition, mood, stress,
  level, experience,
  body_type, emotional_state

-- 饮食记录
meals:
  id, user_id, datetime, meal_type,
  food_items (JSON),
  total_calories, protein, carbs, fat,
  vitamins_minerals (JSON)

-- 运动记录
exercises:
  id, user_id, datetime,
  exercise_type, duration, intensity,
  calories_burned, met_value

-- 睡眠记录
sleep_logs:
  id, user_id, date,
  bedtime, wake_time, duration,
  quality_score

-- 工作事件记录 ⭐核心表
work_events:
  id, user_id, datetime,
  event_type, event_description,
  user_choice,
  consequences (JSON),
  character_state_before (JSON),
  character_state_after (JSON)

-- 成就系统
achievements:
  id, user_id, achievement_type,
  title, description, icon,
  unlocked_at

-- AI对话历史
ai_conversations:
  id, user_id,
  user_message, ai_response,
  context (JSON), timestamp
```

---

## 🎯 MVP 开发计划 (3周)

### Week 1: 基础架构 + 数据追踪
```
Day 1-2: 项目初始化
├─ 前后端项目搭建
├─ 数据库设计和迁移
├─ 基础认证系统
└─ 开发环境配置

Day 3-4: 数据输入功能
├─ 食物搜索和记录（USDA API）
├─ 运动记录表单
├─ 睡眠记录表单
└─ 基础API端点

Day 5-7: 健康计算引擎
├─ 实现健康评分算法
├─ 角色状态计算
├─ 数据持久化
└─ 单元测试
```

### Week 2: 虚拟角色 + 工作场景
```
Day 8-10: 角色系统
├─ 角色状态展示UI
├─ 健康属性可视化（进度条）
├─ 简单的角色形象（emoji/图标）
├─ 状态实时更新

Day 11-14: 工作场景引擎 ⭐
├─ 场景触发逻辑
├─ 事件库设计（10个核心场景）
├─ 用户选择和后果系统
├─ 工作场景UI界面
└─ 场景历史记录
```

### Week 3: AI集成 + 优化部署
```
Day 15-17: AI助手
├─ Gemini API集成
├─ 对话界面
├─ 上下文管理
└─ 个性化响应

Day 18-19: 数据可视化
├─ 健康仪表盘
├─ 图表展示（Recharts）
├─ 每日/周报告
└─ 趋势分析

Day 20-21: 部署和测试
├─ Docker配置
├─ PWA设置
├─ 部署到云平台
├─ 用户测试和bug修复
└─ 文档完善
```

---

## 🎨 设计风格指南

### 视觉风格
```
主题: 现代、清新、游戏化
色彩方案:
  ├─ 主色: #4CAF50 (健康绿)
  ├─ 副色: #2196F3 (活力蓝)
  ├─ 警告: #FF9800 (注意橙)
  ├─ 危险: #F44336 (压力红)
  └─ 背景: #FAFAFA (浅灰)

角色形象:
  ├─ MVP: Emoji组合 (😊💪🏃等)
  ├─ V2: 简化卡通形象
  └─ V3: 动态SVG角色
```

### 交互设计原则
```
1. 即时反馈 - 每个操作都有视觉/声音反馈
2. 游戏化 - 使用等级、成就、动画
3. 情感连接 - AI用共鸣语言，而非冰冷数据
4. 简化输入 - 最少步骤完成记录
5. 移动优先 - 响应式设计
```

---

## 🚀 部署方案

### 开发环境
```bash
# 克隆仓库
git clone https://github.com/yourusername/healthsim.git
cd healthsim

# 使用Docker Compose一键启动
docker-compose up -d

# 或分别启动前后端
cd backend && pip install -r requirements.txt && uvicorn app.main:app --reload
cd frontend && npm install && npm run dev
```

### 生产环境
```
前端: Vercel
  - 自动部署
  - 全球CDN
  - PWA支持

后端: Railway / Render
  - Docker部署
  - 自动扩展
  - 环境变量管理

数据库: Supabase
  - PostgreSQL托管
  - 自动备份
  - 免费层10GB
```

---

## 📊 成功指标

### 产品指标
```
用户参与度:
├─ DAU (日活跃用户)
├─ 平均每日记录次数
├─ 工作场景触发频率
└─ AI对话互动率

用户留存:
├─ 次日留存率 > 40%
├─ 7日留存率 > 25%
└─ 30日留存率 > 15%

功能使用:
├─ 最受欢迎的工作场景
├─ 平均角色等级
└─ 成就解锁率
```

### 技术指标
```
性能:
├─ API响应时间 < 200ms
├─ 首屏加载 < 2s
└─ PWA评分 > 90

可靠性:
├─ 系统可用性 > 99%
├─ 错误率 < 0.1%
└─ 数据准确性 100%
```

---

## 🤝 贡献指南

欢迎贡献新的工作场景、优化算法或改进UI！

### 添加新的工作场景
```json
// data/work_events.json
{
  "event_id": "boss_unreasonable_demand",
  "title": "领导提出不合理要求",
  "description": "领导突然要求你今晚加班完成明天的报告...",
  "triggers": {
    "stress": [60, 100],
    "time_of_day": "evening"
  },
  "choices": [
    {
      "text": "💥 直接拒绝并说明理由",
      "requires": {"mood": 70},
      "consequences": {"stress": -20, "mood": +10, "reputation": -5}
    },
    {
      "text": "😤 勉强答应但很不爽",
      "consequences": {"stress": +15, "mood": -10, "overtime": +3}
    },
    {
      "text": "📱 假装手机没电看不到消息",
      "consequences": {"stress": -10, "mood": +5, "reputation": -10}
    }
  ]
}
```

---

## 📝 许可证

MIT License - 自由使用和修改

---

## 🌈 未来规划

### V2.0 功能
```
├─ 多角色系统（不同职业：程序员、设计师、销售等）
├─ 社交功能（好友、挑战、排行榜）
├─ 更丰富的动画效果
├─ 语音输入
├─ 智能手环/手表数据同步
└─ 多语言支持
```

### V3.0 愿景
```
├─ 原生移动应用（React Native）
├─ AR虚拟角色（ARKit/ARCore）
├─ 社区场景库（用户自创场景）
├─ AI生成个性化故事线
└─ 企业健康管理版本
```

---

## 📞 联系方式

- 项目主页: [GitHub Repository]
- 问题反馈: [Issues]
- 讨论交流: [Discussions]

---

**让健康管理变得有趣，让工作压力有处宣泄！** 🎮💪😊
