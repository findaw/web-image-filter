import numpy as np                            
import pandas as pd
import matplotlib as mpl
import matplotlib.pyplot as plt
import seaborn as sns
sns.set()
#  한글글꼴로 변경
plt.rcParams['font.size'] = 12.0
# plt.rcParams['font.family'] = 'batang'
plt.rcParams['font.family'] = 'Malgun Gothic'  
plt.rc('axes', unicode_minus = False)

# plot 크기
plt.rc('figure', figsize=(10,6))

# 음수 표시 에러 
mpl.rcParams['axes.unicode_minus'] = False
import json
pd.options.display.max_rows= 10    # 화면에 최대 12개까지 결과 출력
np.random.seed(0)

import statsmodels.api as sm
from sklearn.linear_model import LinearRegression
from sklearn.model_selection import train_test_split

from sklearn.preprocessing import StandardScaler
import os
from keras.models import Sequential
from keras.layers import Dense
import tensorflow as tf
from tensorflow import keras

from keras.layers import Dense, Activation, Dropout, Flatten, Conv2D, MaxPooling2D
from keras.preprocessing.image import ImageDataGenerator
from keras.preprocessing.image import load_img, img_to_array, array_to_img
from keras.applications import vgg16
from keras.applications.vgg16 import VGG16
from PIL import Image
# def set_env():
#     os.environ['CUDA_VISIBLE_DEVICES'] = '0'
#     config = tf.compat.v1.ConfigProto(log_device_placement=True)
#     config.gpu_options.per_process_gpu_memory_fraction = 0.75
#     session = tf.compat.v1.Session(config=config)
#     session
# set_env()

