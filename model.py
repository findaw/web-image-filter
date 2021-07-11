import numpy as np                            
import pandas as pd
import matplotlib as mpl
import matplotlib.pyplot as plt
import seaborn as sns
sns.set()
plt.rcParams['font.size'] = 12.0
plt.rcParams['font.family'] = 'Malgun Gothic'  
plt.rc('axes', unicode_minus = False)
mpl.rcParams['axes.unicode_minus'] = False
import json
pd.options.display.max_rows= 10    
np.random.seed(12345)
from sklearn.model_selection import train_test_split
import os
from tensorflow import keras
import pickle

from get_data import get_train_data

data_input, data_target = get_train_data()

# 훈련셋 - 테스트셋
train_input, test_input, train_target, test_target =  train_test_split(data_input, data_target, test_size=0.2, random_state=42)

# scale
train_scaled = train_input.reshape(-1,100,100,1) / 255.0
test_scaled = test_input.reshape(-1, 100,100,1) / 255.0

# 훈련셋 - 검증셋 
train_scaled, valid_scaled, train_target, valid_target =  train_test_split(train_scaled, train_target, test_size=0.2, random_state=42)

print(train_scaled.shape, train_target.shape)
print(test_input.shape, test_target.shape)
print(valid_scaled.shape, valid_target.shape)


model = keras.Sequential()
# 필터 층 추가 
# same 패딩을 적용했기 때문에 특성맵과 입력의 크기가 동일
model.add(keras.layers.Conv2D(32, kernel_size=10, activation='relu',
                              padding='same', input_shape=(100,100,1)))

model.add(keras.layers.MaxPooling2D(2))
model.add(keras.layers.Conv2D(64, kernel_size=10, activation='relu', padding='same'))
model.add(keras.layers.MaxPooling2D(2))
model.add(keras.layers.Flatten())    # 출력층 입력을 위해 1차원 변환
model.add(keras.layers.Dense(200, activation='relu'))
model.add(keras.layers.Dropout(0.4))            # 과대적합 방지 
model.add(keras.layers.Dense(3, activation='softmax'))
model.summary()
model.compile(optimizer='adam', loss='sparse_categorical_crossentropy', metrics='accuracy')
checkpoint_cb = keras.callbacks.ModelCheckpoint('model/best-cnn-model.h5')
early_stopping_cb = keras.callbacks.EarlyStopping(patience=2, restore_best_weights=True)
history = model.fit(train_scaled, train_target, epochs=20, validation_data=(valid_scaled, valid_target),
                    callbacks=[checkpoint_cb, early_stopping_cb])
plt.plot(history.history['loss'])
plt.plot(history.history['val_loss'])
plt.xlabel('epoch')
plt.ylabel('loss')
plt.legend(['train', 'val'])
plt.show();


model.evaluate(valid_scaled, valid_target)
model.evaluate(test_scaled, test_target)

