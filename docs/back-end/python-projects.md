# 小python项目

> 本节内容来源于电子书[《The Big Book of Small Python Projects》](https://salttiger.com/the-big-book-of-small-python-projects/)，官网提供[源码](https://nostarch.com/big-book-small-python-projects)，不过注释都是英文的，代码自己敲了一遍，同时将注释改为中文，更适合阅读。

## 项目1： 猜数字游戏

```python
import random

NUM_DIGITS = 3
MAX_GUESSES = 10

def main():
    print('''
    猜数字游戏，程序会随机产生{}个不重复数字，试着猜出来它是什么，会返回相关的线索。
    返回值         意义
     数对    一个数字正确，但是在错误的位置上
     全对    一个数字正确，并且位置也正确
     啊哦    没有一个数字正确

    例如，如果秘密数字为248，但是你猜测的是843，那么返回值是“全对 数对”
    '''.format(NUM_DIGITS))
    while True:
        secretNum = getSecretNum()
        print("秘密数字已经产生")
        print("你有{}次机会猜它".format(MAX_GUESSES))

        numGuesses = 1  # 猜的次数
        while numGuesses <= MAX_GUESSES:
            guess = ''
            # 循环直到输入一个符合要求的数字
            # 字符串的isdecimal()方法用来判断是不是输入的都是数字
            while len(guess) != NUM_DIGITS or not guess.isdecimal():
                print("第{}次猜测: ".format(numGuesses))
                guess = input('> ')
            # 获得并打印线索
            clues = getClues(guess, secretNum)
            print(clues)
            numGuesses += 1

            if guess == secretNum:
                break  # 跳出循环
            if numGuesses > MAX_GUESSES:
                print("你已经尝试的次数已经用尽了")
                print("秘密数字为：{}".format(secretNum))
        
        # 询问用户要不要继续
        print("还想继续么？yes/no")
        if not input("> ").lower().startswith('y'):
            break
    print("谢谢游玩🌈")

def getSecretNum():
    """获得秘密数字

    Returns:
        str: 不相同数字组成的随机字符，长度有全局变量NUM_DIGITS决定
    """
    numbers = list('0123456789')  # 创建数字0-9的列表
    # 使用list(s)创建列表会从0开始遍历可迭代对象s，每个元素成为数组的一位
    # 因此使用list('abc')会创建数组['a', 'b', 'c']
    random.shuffle(numbers)  # 打乱数组的位置

    # 得到秘密数组
    secretNum = ""
    for i in range(NUM_DIGITS):
        secretNum += str(numbers[i])
    return secretNum

def getClues(guess, secretNum):
    """获得线索

    Args:
        guess (str): 猜测的数字
        secretNum (str): 秘密数字

    Returns:
        str: 猜测的线索情况
    """
    if guess == secretNum:
        return "你猜对啦，恭喜恭喜😂"
    
    clues = []  # 存储的线索
    for i in range(len(guess)):
        # 每个位置进行遍历，先比对位置，在比对在不在数字里
        if guess[i] == secretNum[i]:
            clues.append("全对")
        elif guess[i] in secretNum:
            clues.append("数对")
    if len(clues) == 0:
        return "啊哦"  # 遍历完发现一个都没有
    else:
        clues.sort()  # 重新排序，保证不泄漏位置比对信息
        return " ".join(clues)
    
if __name__ == "__main__":
    main()
```

## 项目2： 生日悖论

