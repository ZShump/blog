# Transformer 模型

Transformer 是一种基于自注意力机制的深度学习模型，被广泛应用于自然语言处理领域。

## 核心组件

### 1. Tokenizer（分词器）

**作用**：将文本切分成模型可处理的最小单位（tokens）

**词表机制**：
- 建立词与数字（索引）的映射关系
- 每个词对应唯一的 ID

**常用方法**：
- **Subword-based tokenizer**：子词分词
  - BPE (Byte Pair Encoding)
  - WordPiece
  - Unigram
- 优势：处理未登录词（OOV），减小词表大小

**示例**：
```
文本："I love machine learning"
分词：["I", "love", "machine", "learning"]
索引：[12, 456, 789, 234]
```

[大语言模型LLM基础之Tokenizer完全介绍_哔哩哔哩_bilibili](https://www.bilibili.com/video/BV1Fc411C7sz/?vd_source=5e2f46b78e444f4a8c0c0facf71c3cb1)

### 2. One-Hot Encoding（独热编码）

**定义**：以词表为维度，创建索引位置为 1、其他位置为 0 的词向量。

**示例**：
```
词表：["I", "love", "ML", "NLP"]

"I"     → [1, 0, 0, 0]
"love"  → [0, 1, 0, 0]
"ML"    → [0, 0, 1, 0]
"NLP"   → [0, 0, 0, 1]
```

**问题**：
- 词表过大时，向量维度极高（维度灾难）
- 无法捕捉词与词之间的语义关系
- 稀疏表示，存储和计算效率低

### 3. Embedding（词嵌入）

**问题**：one-hot 向量维度过大，需要降维

**解决方案**：
对 one-hot 向量进行矩阵变换降维，得到密集的低维向量。

**矩阵生成方式**：
- 通过神经网络学习得到
- 常见模型：**Word2Vec**、**GloVe**、**FastText**

**优势**：
- 降维：通常从几万维降到 256/512/1024 维
- 语义保留：相似词的向量在空间中距离更近
- 捕捉关系：可以通过向量运算反映词义关系

**经典例子**：
```
king - man + woman ≈ queen
```

### 4. Attention Mechanism（注意力机制）

**核心思想**：让模型在处理序列时，能够关注到不同位置的信息。

**Self-Attention（自注意力）**：
- 计算序列中每个词与其他所有词的关联程度
- 三个关键矩阵：
  - **Q (Query)**：查询向量
  - **K (Key)**：键向量
  - **V (Value)**：值向量

**计算公式**：
```
Attention(Q, K, V) = softmax(QK^T / √d_k) × V
```

**直观理解**：
- QK^T：计算词与词之间的相似度
- softmax：归一化为注意力权重
- 加权求和 V：根据权重聚合信息

**Multi-Head Attention（多头注意力）**：
- 使用多组 Q、K、V 矩阵
- 每个头学习不同的关注模式
- 最后拼接所有头的结果

### 5. Positional Encoding（位置编码）

**问题**：Transformer 并行处理所有位置，本身不包含位置信息。

**解决方案**：为每个位置添加位置编码。

**方法**：
- **绝对位置编码**：使用正弦/余弦函数
- **相对位置编码**：编码相对位置关系
- **可学习位置编码**：将位置编码作为可训练参数

### 6. Feed-Forward Network（前馈网络）

每个注意力层后跟随一个前馈网络：
```
FFN(x) = ReLU(xW1 + b1)W2 + b2
```

**作用**：
- 对每个位置独立进行非线性变换
- 增强模型的表达能力

## Transformer 架构

### Encoder-Decoder 结构

**Encoder（编码器）**：
- 输入序列编码
- 多层自注意力 + 前馈网络
- 输出：编码后的表示

**Decoder（解码器）**：
- 目标序列作为输入
- 三层子结构：
  1. Masked Self-Attention（屏蔽自注意力）
  2. Cross-Attention（交叉注意力）
  3. Feed-Forward Network
- 输出：预测下一个词的概率分布

### 仅 Encoder 架构
- 代表模型：BERT、RoBERTa
- 应用：文本分类、命名实体识别、问答系统

### 仅 Decoder 架构
- 代表模型：GPT 系列
- 应用：文本生成、对话系统

## 优势与影响

**优势**：
1. **并行计算**：相比 RNN，可以并行处理整个序列
2. **长距离依赖**：能更好地捕捉长距离的依赖关系
3. **可扩展性**：通过增加层数和注意力头数提升性能

**影响**：
- 开启了大语言模型时代
- 成为 NLP 领域的主流架构
- 影响扩展到计算机视觉（Vision Transformer）

## 学习路径

1. 理解 Seq2Seq 模型和注意力机制的动机
2. 掌握 Transformer 的基本架构
3. 深入理解自注意力的数学原理
4. 学习 BERT 和 GPT 的变体
5. 实践：使用 Hugging Face Transformers 库

## 推荐资源

- **论文**：[Attention Is All You Need](https://arxiv.org/abs/1706.03762)
- **博客**：[The Illustrated Transformer](https://jalammar.github.io/illustrated-transformer/)
- **可视化**：[Transformer Explained Visually](https://transformer-circuits.vercel.app/)