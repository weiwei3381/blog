# 使用pytorch进行深度学习

## numpy常用API

## torch常用API

torch CPU版本安装使用`pip install torch`即可.

## transformer模型使用

### 文本生成任务

比较小的中文NLG(nature language generate, 自然语言生成)模型: 

- [bigscience/bloom-560m](https://huggingface.co/bigscience/bloom-560m)，2022年5月26日由BigScience公司推出，模型大小1.12GB，支持48种语言。
- [IDEA-CCNL/Wenzhong-GPT2-110M](https://huggingface.co/IDEA-CCNL/Wenzhong-GPT2-110M), "闻仲"1.0版本, 属于IDEA 研究院"封神榜"开源模型系列, 2022年5月上传至huggingface, 模型大小274MB.
- [IDEA-CCNL/Wenzhong2.0-GPT2-110M-BertTokenizer-chinese](https://huggingface.co/IDEA-CCNL/Wenzhong2.0-GPT2-110M-BertTokenizer-chinese), "闻仲"2.0版本, 属于IDEA 研究院"封神榜"开源模型系列2.0版本, 基于BertTokenizer，实现字级别token，2022年12月上传至huggingface, 模型大小为421MB.
- [uer/gpt2-chinese-cluecorpussmall](https://huggingface.co/uer/gpt2-distil-chinese-cluecorpussmall), 通用GPT2中文小模型, 2021年上传至huggingface, 模型大小为421MB.
- [uer/gpt2-distil-chinese-cluecorpussmall](https://huggingface.co/uer/gpt2-distil-chinese-cluecorpussmall), 蒸馏后的GPT2中文小模型, 2021年上传至huggingface, 模型大小为244MB.

现在主流的是使用抱抱脸(hugging face)出的transformer模块进行，[官方中文文档](https://huggingface.co/docs/transformers/main/zh/index)

使用`pip install torch transformers npmpy`安装必要模块

```python
from transformers import BertTokenizer,GPT2LMHeadModel

# 不显示警告信息
import warnings
warnings.filterwarnings("ignore")

# 模型名称, 本地不存在则会从huggingface上直接下载
model_path = 'IDEA-CCNL/Wenzhong2.0-GPT2-110M-BertTokenizer-chinese'

# 创建分词器, 本地不存在则会从远程下载,这个文件不大,一般包括vocab.txt, tokenizer_config.json, 默认存储位置在C:\Users\用户名\.cache\huggingface\hub下
tokenizer = BertTokenizer.from_pretrained(model_path)

# 创建模型, 比较大, 有400多MB
model = GPT2LMHeadModel.from_pretrained(model_path)

# 获得文本填充的后续词
def generate_word_level(input_text,n_return=5,max_length=128,top_p=0.9):
    inputs = tokenizer(input_text,return_tensors='pt',add_special_tokens=False).to(model.device)
    gen = model.generate(
                            inputs=inputs['input_ids'],
                            max_length=max_length,
                            do_sample=True,
                            top_p=top_p,
                            eos_token_id=21133,
                            pad_token_id=0,
                            num_return_sequences=n_return)

    sentences = tokenizer.batch_decode(gen)
    for idx,sentence in enumerate(sentences):
        print(f'sentence {idx}: {sentence}')
        print('-----'*30)
    return gen

# 开始测试
outputs = generate_word_level('实践出真知，实践长才干。',n_return=5,max_length=64)
```
