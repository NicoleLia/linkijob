import pandas as pd

# 读取CSV文件
df = pd.read_csv("linkedin_jobs.csv")

# 去空行（全为空的行）
df = df.dropna(how="all")

# 去重（基于所有列）
df = df.drop_duplicates()

# 保存处理后的文件
df.to_csv("cleaned_file.csv", index=False)
