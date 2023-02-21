# 使用pytorch进行深度学习

## numpy常用API

## torch常用API

torch CPU版本安装使用`pip install torch`即可.

## huggingface实战

### transformer各种任务介绍

### 常用API

### Pipeline

Pipeline可以很方便的使用huggingface提供的NLP任务, 示例代码如下:

```python
# 导入模块
from transformers import pipeline
# 指定pipeline的任务, 指定后, pipeline会自动从huggingface上下载相应的模型并加载, 并返回一个指定任务的Pipeline对象
summarizer = pipeline("summarization")
```

其中, pipeline的第一个参数为`task: str = None`, 可选的值有很多, 可参考[文档](https://huggingface.co/docs/transformers/main/en/main_classes/pipelines#transformers.pipeline.task), 其中常用值有:

- "summarization": 文本摘要
- "text2text-generation": 文本到文本生成
- "text-classification"或者"sentiment-analysis": 文本分类
- "text-generation": 文本生成
- "token-classification"或者"ner": 命名实体识别
- "translation": 翻译

pipeline的第二个参数为`model: str|PreTrainedModel | TFPreTrainedModel`, 该参数为可选值, 可传入指定模型, 如果是str类型, 则会加载本地或者自动从huggingface网站上下载对应名称的模型并加载, 因此本地代码可以写成:

`summarizer=pipeline('summarization','mypath/distilbart-cnn-12-6')`

由于model入参也可以直接以PreTrainedModel对象的形式传入，tokenizer也可以直接以PreTrainedTokenizer对象的形式传入。这种传入形式的写法示例：

```python
from transformers import AutoTokenizer, AutoModelForSeq2SeqLM

tokenizer = AutoTokenizer.from_pretrained("mypath/distilbart-cnn-12-6")
model = AutoModelForSeq2SeqLM.from_pretrained("mypath/distilbart-cnn-12-6")

summarizer=pipeline('summarization',model=model,tokenizer=tokenizer)

```

比较麻烦的是AutoClass类的选择, 在本文摘要里面使用的Auto类为`AutoModelForSeq2SeqLM`, 可以在huggingface上点击右上角的【</>Use in Transformers】按钮，如下图所示。

![查看transformers代码](https://pic.imgdb.cn/item/63f246b9f144a01007611cea.jpg)

代码返回的是一个`SummarizationPipeline`对象, 使用的话也很简单`summarizer(str_list: 需要摘要的文本列表, min_length=5, max_length=20)`即可.


### transformer模型使用——文本生成任务

比较小的中文NLG(nature language generate, 自然语言生成)模型: 

- [bigscience/bloom-560m](https://huggingface.co/bigscience/bloom-560m)，2022年5月26日由BigScience公司推出，模型大小1.12GB，支持48种语言。
- [IDEA-CCNL/Wenzhong-GPT2-110M](https://huggingface.co/IDEA-CCNL/Wenzhong-GPT2-110M), "闻仲"1.0版本, 属于IDEA 研究院"封神榜"开源模型系列, 2022年5月上传至huggingface, 模型大小274MB.
- [IDEA-CCNL/Wenzhong2.0-GPT2-110M-BertTokenizer-chinese](https://huggingface.co/IDEA-CCNL/Wenzhong2.0-GPT2-110M-BertTokenizer-chinese), "闻仲"2.0版本, 属于IDEA 研究院"封神榜"开源模型系列2.0版本, 基于BertTokenizer，实现字级别token，2022年12月上传至huggingface, 模型大小为421MB.
- [uer/gpt2-chinese-cluecorpussmall](https://huggingface.co/uer/gpt2-distil-chinese-cluecorpussmall), 通用GPT2中文小模型, 2021年上传至huggingface, 模型大小为421MB.
- [uer/gpt2-distil-chinese-cluecorpussmall](https://huggingface.co/uer/gpt2-distil-chinese-cluecorpussmall), 蒸馏后的GPT2中文小模型, 2021年上传至huggingface, 模型大小为244MB.

现在主流的是使用抱抱脸(hugging face)出的transformer模块进行，[官方中文文档](https://huggingface.co/docs/transformers/main/zh/index)

使用`pip install torch transformers numpy`安装必要模块

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
