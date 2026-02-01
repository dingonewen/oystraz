# 🌊 Ocean Theme Implementation Guide

## 概述

你的 Oystraz 工作模拟器现在采用海洋主题：
- **主角**：🦭 海豹打工人（Seal Employee）
- **老板**：🐙 章鱼经理（Octopus Manager）
- **工作**：🎣 钓鱼（隐喻为他人做嫁衣）
- **创新**：💦 恶作剧老板来释放压力

---

## 🎨 如何添加 Kenney 素材

### 1. 素材放置位置

```
frontend/public/assets/ocean/
├── seal.png          # 海豹（你）
├── octopus.png       # 章鱼（老板）
├── fish-*.png        # 各种鱼（工作任务）
├── hook.png          # 鱼钩
├── bubble.png        # 气泡装饰
├── ink.png           # 墨汁效果
└── wave.png          # 波浪（可选）
```

### 2. 在组件中使用图片

编辑 `frontend/src/components/Work/OceanWorkScene.tsx`，将 emoji 替换为图片：

```typescript
// 替换第 91 行的海豹 emoji
<Box
  sx={{
    position: 'absolute',
    left: '20%',
    bottom: '30%',
    textAlign: 'center',
  }}
>
  {/* 方式一：使用 emoji（当前） */}
  <Typography variant="h1" sx={{ fontSize: { xs: '60px', sm: '80px' } }}>
    🦭
  </Typography>

  {/* 方式二：使用 Kenney 图片（推荐） */}
  <img
    src="/assets/ocean/seal.png"
    alt="seal"
    style={{ width: '80px', height: '80px' }}
  />
</Box>

// 替换第 109 行的章鱼 emoji
<Box
  sx={{
    position: 'absolute',
    right: '20%',
    top: '20%',
    textAlign: 'center',
    transform: octopusAnnoyed ? 'rotate(15deg)' : 'none',
    transition: 'transform 0.3s',
  }}
>
  {/* 使用图片替换 emoji */}
  <img
    src="/assets/ocean/octopus.png"
    alt="octopus"
    style={{
      width: '80px',
      height: '80px',
      filter: showPrankEffect ? 'brightness(1.5)' : 'none'
    }}
  />
</Box>

// 替换第 135 行的鱼 emoji
{isWorking && (
  <Box sx={{ position: 'absolute', left: '40%', bottom: '40%' }}>
    <img
      src="/assets/ocean/fish-1.png"
      alt="fish"
      style={{ width: '40px', height: '40px' }}
    />
  </Box>
)}
```

---

## 🎮 功能说明

### 工作记录功能

**新增的 API endpoints**：
- `POST /work/log` - 记录工作session
- `GET /work/logs?days=7` - 获取最近7天的工作记录
- `GET /work/stats?days=7` - 获取工作统计数据
- `DELETE /work/log/{id}` - 删除工作记录

**数据库表** (`work_logs`)：
- `duration_hours` - 工作时长
- `intensity` - 工作强度（1-5）
- `energy_cost` - 消耗的能量
- `stress_gain` - 增加的压力
- `experience_gain` - 获得的经验
- `pranked_boss` - 恶作剧次数

### 工作模式

**普通工作**：
1. 调整工作时长（1-8小时）
2. 设置工作强度（1-5）
3. 预览影响：
   - 能量损失 = 时长 × 强度 × 3
   - 压力增加 = 时长 × 强度 × 2
   - 经验获得 = 时长 × 强度 × 10
4. 点击 "Start Work Session" 开始工作
5. 看着海豹钓鱼（动画效果）

**恶作剧老板**（创新功能！）：
1. 当压力 ≥ 30 时解锁
2. 点击 "💦 Prank the Octopus Boss!"
3. 效果：
   - 压力 -20
   - 心情 +10
   - 章鱼被墨汁喷到（动画）
4. 30秒冷却时间

### 压力管理机制

```typescript
// 自动提醒系统（在场景中）
{characterStress > 70 && (
  <Alert severity="warning">
    ⚠️ High stress detected!
    Consider pranking the octopus boss or taking a break!
  </Alert>
)}
```

---

## 🎨 美化建议

### 1. 改进海洋背景

在 `OceanWorkScene.tsx` 第 89 行：

```typescript
<Paper
  sx={{
    p: { xs: 2, sm: 3 },
    mb: 3,
    background: 'linear-gradient(180deg, #87CEEB 0%, #4A90E2 50%, #2C5F8D 100%)',
    minHeight: 300,
    position: 'relative',
    overflow: 'hidden',
    // 添加波浪动画背景
    '&::before': {
      content: '""',
      position: 'absolute',
      bottom: 0,
      left: 0,
      width: '200%',
      height: '100px',
      background: 'url(/assets/ocean/wave.png) repeat-x',
      animation: 'wave 10s linear infinite',
    },
    '@keyframes wave': {
      '0%': { transform: 'translateX(0)' },
      '100%': { transform: 'translateX(-50%)' },
    },
  }}
>
```

### 2. 添加气泡装饰

```typescript
// 在海洋场景中添加
<Box
  sx={{
    position: 'absolute',
    left: '30%',
    bottom: '20%',
    animation: 'float 3s ease-in-out infinite',
    '@keyframes float': {
      '0%, 100%': { transform: 'translateY(0)' },
      '50%': { transform: 'translateY(-20px)' },
    },
  }}
>
  <img src="/assets/ocean/bubble.png" alt="bubble" style={{ width: '20px', opacity: 0.6 }} />
</Box>
```

### 3. 钓鱼动画

```typescript
// 在工作时添加钓鱼竿动画
{isWorking && (
  <>
    {/* 鱼钩 */}
    <Box
      sx={{
        position: 'absolute',
        left: '25%',
        top: '50%',
        animation: 'fishing 2s ease-in-out infinite',
        '@keyframes fishing': {
          '0%, 100%': { transform: 'translateY(0) rotate(0deg)' },
          '50%': { transform: 'translateY(10px) rotate(5deg)' },
        },
      }}
    >
      <img src="/assets/ocean/hook.png" alt="hook" style={{ width: '30px' }} />
    </Box>
  </>
)}
```

---

## 📱 移动端优化

已完成的响应式设计：
- ✅ 海洋场景自适应屏幕大小
- ✅ 海豹/章鱼在移动端自动缩小
- ✅ 工作控制面板在手机上堆叠显示
- ✅ 触控友好的滑块和按钮

---

## 🚀 下一步建议

### 短期（视觉优化）：
1. **替换 emoji 为 Kenney 图片**
2. **添加波浪背景动画**
3. **优化颜色方案**（使用海洋蓝色系）
4. **添加音效**（可选）：
   - 钓到鱼的声音
   - 章鱼被恶作剧的声音
   - 背景海浪声

### 中期（功能增强）：
1. **不同种类的鱼**：
   - 小鱼 = 简单任务
   - 大鱼 = 复杂项目
   - 金鱼 = 奖励任务
2. **章鱼老板状态**：
   - 心情好时给更简单的任务
   - 被恶作剧太多次会"报复"
3. **成就系统**：
   - "恶作剧大师" - 恶作剧老板50次
   - "钓鱼达人" - 完成100小时工作
   - "压力管理大师" - 保持压力<30连续7天

### 长期（AI集成）：
1. **Gemini 生成工作场景**
2. **Pearl 给工作建议**
3. **智能推荐休息时间**

---

## 💡 创意点亮点

你的**恶作剧老板**功能是非常独特的创新：
1. ✅ **解决实际痛点** - 工作压力释放
2. ✅ **安全宣泄** - 虚拟环境不影响现实
3. ✅ **游戏化** - 有冷却时间，不能滥用
4. ✅ **反hustle culture** - 鼓励减压

这个功能在 Hackathon 演示时会很吸引眼球！

---

## 🔧 运行和测试

```bash
# 后端（创建数据库表）
cd backend
alembic revision --autogenerate -m "Add work_logs table"
alembic upgrade head
uvicorn app.main:app --reload

# 前端
cd frontend
npm run dev
```

访问 http://localhost:5173/work 查看新的海洋主题！

---

## 📝 演示脚本建议

**Hackathon 演示时**：
1. "大家工作压力大吗？想暴揍老板吗？"
2. "在 Oystraz，你是一只海豹打工人，老板是章鱼"
3. 演示工作 → 压力上升
4. **高潮**："压力太大？没关系，趁老板不注意..."
5. 点击恶作剧按钮 → 章鱼喷墨汁 → 全场笑
6. "这就是我们的创新 - 在虚拟世界安全释放工作压力"

---

祝 Hackathon 成功！🎉🏆
