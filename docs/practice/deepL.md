# 深度学习与实践

## numpy常用API

## torch常用API

torch CPU版本安装使用`pip install torch`即可.

## Hugging Face实战

### transformers依赖安装

建议使用3.10版本的64位python，主要的依赖有：torch，transformers，numpy，datasets,使用下面的命令一键安装，

其中`datasets`是`Hugging Face`生态系统中一个重要的数据集库，可用于轻松地访问和共享数据集，这些数据集是关于音频、计算机视觉、以及自然语言处理等领域。`Datasets`库可以通过一行来加载一个数据集，并且可以使用 `Hugging Face` 强大的数据处理方法来快速准备好你的数据集。

```python
pip install torch transformers numpy datesets
```

如果使用GPU版本的torch，则需要安装CUDA，然后对应不同的CUDA版本，例如CUDA为12.1，则使用下面的安装命令：
```python
pip3 install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cu121
```

### 下载模型和数据集

需要使用hugging face的镜像站[hf-mirror](https://hf-mirror.com/)下载模型和数据集。

①创建环境变量`HF_ENDPOINT`，值为`https://hf-mirror.com`；

②安装或者升级依赖`pip install -U huggingface_hub`

③下载模型使用命令如下：

```shell
huggingface-cli download --resume-download [模型名称] --local-dir [本地文件夹] --local-dir-use-symlinks False
```

其中，模型名称可以在网站中查看，下图的模型名即为`google-bert/bert-base-chinese`。命令中的参数`--local-dir-use-symlinks False`表示禁用文件软链接，这样下载路径中的文件所见即所得。

![模型名称](https://pic.imgdb.cn/item/65f3b6419f345e8d032c9523.png)

④下载数据集

下载数据集的命令为

```shell
huggingface-cli download --repo-type dataset --resume-download [数据集名称] --local-dir [本地文件夹] --local-dir-use-symlinks False
```

其中，数据集名称可以在网站中查看，下图的数据集名称即为`lansinuote/ChnSentiCorp`。命令中的参数`--local-dir-use-symlinks False`表示禁用文件软链接，这样下载路径中的文件所见即所得。

![数据集名称](https://pic.imgdb.cn/item/65f3b6f39f345e8d032f382a.png)

⑤数据集本地化

首先加载数据集，然后存储在本地，将存储的文件夹转移到其他电脑，然后再加载即可，不过需要注意的是，尽量确保两台电脑的`datasets`版本一致，否则可能导致加载不成功。

```python
# 首先下载并存储数据
import datasets
my_dataset = datasets.load_dataset("dataset_name")
my_dataset.save_to_disk('your_path')

# 然后把数据集拷贝到指定服务器，然后进行本地加载
from datasets import load_from_disk
my_dataset = load_from_disk("your_path")
```



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

#### 使用现有的模型生成文本

在[抱抱脸（huggingface）](https://huggingface.co/)上开源的small或者tiny版本的中文NLG(nature language generate, 自然语言生成)模型主要有下列几个。

- [bigscience/bloom-560m](https://huggingface.co/bigscience/bloom-560m)，2022年5月26日由BigScience公司推出，模型大小1.12GB，支持48种语言。
- [IDEA-CCNL/Wenzhong-GPT2-110M](https://huggingface.co/IDEA-CCNL/Wenzhong-GPT2-110M), "闻仲"1.0版本, 属于IDEA 研究院"封神榜"开源模型系列, 2022年5月上传至huggingface, 模型大小274MB。
- [IDEA-CCNL/Wenzhong2.0-GPT2-110M-BertTokenizer-chinese](https://huggingface.co/IDEA-CCNL/Wenzhong2.0-GPT2-110M-BertTokenizer-chinese), "闻仲"2.0版本, 属于IDEA 研究院"封神榜"开源模型系列2.0版本, 基于BertTokenizer，实现字级别token，2022年12月上传至huggingface, 模型大小为421MB。
- [uer/gpt2-chinese-cluecorpussmall](https://huggingface.co/uer/gpt2-distil-chinese-cluecorpussmall)，通用GPT2中文小模型, 2021年上传至huggingface, 模型大小为421MB。
- [uer/gpt2-distil-chinese-cluecorpussmall](https://huggingface.co/uer/gpt2-distil-chinese-cluecorpussmall)，蒸馏后的GPT2中文小模型，2021年上传至huggingface，模型大小为244MB。

运行上述模型主要采用huggingface上的transformer模块进行，[官方中文文档](https://huggingface.co/docs/transformers/main/zh/index)很详细。

使用`pip install torch transformers numpy`安装必要模块

```python
from transformers import BertTokenizer,GPT2LMHeadModel
import warnings

# 不显示警告信息
warnings.filterwarnings("ignore")

# 模型名称, 这里采用开源的闻仲GPT2 110M参数版本, 文件大小为421MB
model_path = 'IDEA-CCNL/Wenzhong2.0-GPT2-110M-BertTokenizer-chinese'

# 创建分词器, 本地不存在则会从远程下载,这个文件不大,一般包括vocab.txt, tokenizer_config.json, 默认存储位置在C:\Users\用户名\.cache\huggingface\hub下
tokenizer = BertTokenizer.from_pretrained(model_path)

# 创建模型, 比较大, 有421MB
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
print(outputs)
```

#### huggingface模型转为onnx格式

huggingface提供了三种方式进行转换, 不过我测试之后只在一个代码上运行成功了.

```python

from optimum.onnxruntime import ORTModelForSequenceClassification

model_id = 'IDEA-CCNL/Wenzhong2.0-GPT2-110M-BertTokenizer-chinese'

# 相当于使用ORTModel的方式进行模型加载, 来源transformer, 其中参数设置为from_transformers=True
# 运行代码成功之后, 用everything在全盘搜索"*.onnx", 最新生成的就是转换后的onnx模型
model = ORTModelForSequenceClassification.from_pretrained(model_id, from_transformers=True)
```

#### huggingface模型微调

## 深度学习本地实战

### 本地部署一键抠图

一键抠图使用的是python库[Transparent Background](https://github.com/plemeri/transparent-background)，不支持3.7及以下版本，建议使用3.10版本的python

1.安装v3.10.10的64位python[下载地址](https://www.python.org/ftp/python/3.10.10/python-3.10.10-amd64.exe)

2.安装必须的依赖库

```py
# CPU 版本：
pip3 install torch torchvision torchaudio -i https://mirrors.aliyun.com/pypi/simple
# GPU 版本：
pip3 install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cu118
```

3.安装 Transparent BG，使用命令`pip3 install transparent-background -i https://mirrors.aliyun.com/pypi/simple`

4.下载模型和一键发送的批处理文件，[百度网盘地址](https://pan.baidu.com/s/10yZfxegIqgl9V3QvH4k0EA?pwd=n49d)，下载后解压`TransparentBG_Win.7z`文件，然后双击`开始.bat`文件安装快捷方式。

5.使用方法，支持png和jpg格式的图片，对着图片文件点击右键，选择“发送到-一键抠图”，如下图所示，抠图完成后会自动在原目录生成抠图后的图片。

![一键抠图](https://pic.imgdb.cn/item/65f053b39f345e8d032a1fd6.png)