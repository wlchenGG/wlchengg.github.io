# 基于Python批量提取PDF首页


最近因为汇总论文成果，需要提取论文的首页。虽然Acrobat提供了`页面组织`功能可以任意提取，但手动操作一次只能处理一个文件。当面对好几十篇论文时，尚未开始就已经放弃。

<!--more-->
工欲善其事必先利其器，决定造个工具，一劳永逸提高效率。

以下代码基于 [小白程序猿](https://cloud.tencent.com/developer/article/1584421) 的方案，面向我自己的需求作了一些调整适配。

#### 环境与原料
**Python**
**PyMuPDF模块**
```bash
pip install PyMuPDF
```
以下为完整代码：

```python
# coding:utf-8
import os
import fitz

# 解析
# 函数将file_path中所有文件（包括子目录中的文件），处理后，按照原目录保存到save_path下。
# 即save_path下的文件夹结构和file_path一致。
def analysis(file_path, save_path, num, toimg):
    # 资源列表
    file_array = []
    if os.path.isdir(file_path):
        # 目录循环压入
        file_count = get_path_file(file_path)
        for v in file_count:
            file_array.append(v)
    else:
        # 单文件，单次调用
        file_array.append(file_path)

    # 判断为空情况
    if not file_array:
        print("此目录下无文件")
    # 执行解析
    file_count_num = len(file_array)
    print("程序运行中，共计%s个文件" % file_count_num)
    for v in file_array:
        print("原文件路径：%s" % v)
        # 获取文件名称及类型
        file_name = os.path.basename(v)
        # print("文件信息：%s" % file_name)
        if '.pdf' not in file_name:
            print("此文件非PDF文件")
        #  打开PDF文件，生成一个对象
        doc = fitz.open(v)
        # 总页数
        count_page = doc.pageCount
        # print("文件共计：%s页" % count_page)
        if toimg == False:
            # 仅提取页面
            if count_page > 1:
                doc2 = fitz.open()      # 创建新的空PDF
                doc2.insert_pdf(doc, to_page = num)  # 提取doc的第1页到doc2
                # 创建子目录
                p_1 = v.replace(file_path, save_path)
                p_2 = p_1.replace(file_name, '')
                if not os.path.exists(p_2):
                    os.makedirs(p_2)
                print("提取到路径：" + p_2 + file_name)
                doc2.save(p_2 + file_name)    # 保存提取出的PDF文件
                print("提取完成")
            else:
                print("此文档无内容，跳过")
                continue
        else:
            # 将页面转换为图片
            if count_page > 1:
                page = doc[num]
                rotate = int(0)
                # 每个尺寸的缩放系数为2，这将为我们生成分辨率提高四倍的图像。
                zoom_x = 2.0
                zoom_y = 2.0
                trans = fitz.Matrix(zoom_x, zoom_y).preRotate(rotate)
                pm = page.getPixmap(matrix=trans, alpha=False)
                # 保存路径
                # 创建子目录
                p_1 = v.replace(file_path, save_path)
                p_2 = p_1.replace(file_name, '')
                if not os.path.exists(p_2):
                    os.makedirs(p_2)
                
                new_file_name = file_name.replace(".pdf", "")
                print("提取到路径：" + p_2 + '%s.png' % new_file_name)
                pm.writePNG(p_2 + '%s.png' % new_file_name)
                print("提取并转换为图片完成")
            else:
                print("此文档无内容，跳过")
                continue

# 返回目录下所有文件
def get_path_file(files_path):
    data = []
    for root, dirs, files in os.walk(files_path, topdown=False):
        for name in files:
            f_p = os.path.join(root, name).replace("\\", "/")
            data.append(f_p)
    return data

# 规范路径的斜杠格式
def uni_path(path: str) -> str:
    # return path.replace(r'\/'.replace(os.sep, ''), os.sep)  # 转换为当前系统的格式
    return path.replace("\\\\","/").replace("\\","/") # 统一转换为unix格式

if __name__ == '__main__':
    print("|---------------------------------|")
    print("|++++++++  PDF处理工具箱  ++++++++|")
    print("|---------------------------------|")
    print("|                                 |")
    print("| 1. PDF 批量提取首页             |")
    print("| 2. PDF 批量提取首页并转换为图片 |")
    print("|                                 |")
    print("|---------------------------------|")

    # 选择处理方式
    toimg = False
    choice = input("请输入要执行操作的编号：")
    if choice == '1':
        toimg = False
    elif choice == '2':
        toimg =True
    # 当前目录下的文件
    now_path = os.getcwd()
    print("当前位置：%s" % now_path)
    # 保存路径
    print("请输入参数，以 / 结尾")
    save_path = input("提取文件保存地址:")
    # 判断目录
    save_path_status = os.path.exists(save_path)
    if not save_path_status:
        os.mkdir(save_path)
    # 截取页数
    num = 0 # 截取第一页
    # 路径或文件名
    file_path = input("待处理PDF文件地址:")

    # 调用方法
    analysis(uni_path(file_path), uni_path(save_path), num, toimg)
```

### 参考

[Python 提取 PDF 第一页为封面图片【批量提取】](https://cloud.tencent.com/developer/article/1584421)
[Python 把任意系统的路径转换成当前系统的格式（关于 / \ 分隔符的）](https://blog.csdn.net/lnotime/article/details/87720332)
[python中os.walk的用法](https://www.jianshu.com/p/bbad16822eab)
[python PyMuPDF(fitz)包中insert_pdf的用法](https://pymupdf.readthedocs.io/en/latest/document.html#Document.insert_pdf)

