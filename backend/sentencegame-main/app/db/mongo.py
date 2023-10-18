from pymongo import MongoClient
# ایجاد اتصال به دیتابیس MongoDB
client = MongoClient("mongodb://localhost:27017/")
db = client["Game"]