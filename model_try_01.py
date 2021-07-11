from setting import *


train_path = os.getcwd() + '\\dataset\\train'
test_path = os.getcwd() + '\\dataset\\test'
valid_path = os.getcwd() + '\\dataset\\val'

train_dataGen = ImageDataGenerator(
                       rescale=1/255,              # scale
                       fill_mode='nearest',        # 변형시 공간 채우는방식
                       rotation_range=40,         # 회전
                       shear_range=.2,           # 전단 변환
                       vertical_flip=True,      # 수직 뒤집기
                       horizontal_flip=True,    # 수평 뒤집기
                       height_shift_range=.2,    # 이미지 수직 이동
                       width_shift_range=.2,    # 수평 이동
                       zoom_range=.2,          # -0.2~0.2 확대 축소
)
valid_datagen = ImageDataGenerator(rescale=1./255)
test_datagen = ImageDataGenerator(rescale=1./255)

batch_size = 16
train_generator = train_dataGen.flow_from_directory(train_path, target_size=(150,150), batch_size=batch_size, class_mode='categorical')
test_generator = valid_datagen.flow_from_directory(test_path, target_size=(150,150), batch_size=batch_size, class_mode='categorical')
valid_generator = test_datagen.flow_from_directory(valid_path, target_size=(150,150), batch_size=batch_size, class_mode='categorical')

model=Sequential()
model.add(Conv2D(32, activation='relu', kernel_size=10, padding='same', input_shape=(150,150,3)))
model.add(MaxPooling2D(2))

model.add(Conv2D(32, activation='relu', kernel_size=10, padding='same', input_shape=(150,150,3)))
model.add(MaxPooling2D(2))

model.add(Conv2D(64, activation='relu', kernel_size=10, padding='same', input_shape=(150,150,3)))
model.add(MaxPooling2D(2))

model.add(Flatten())
model.add(Dense(64, activation='relu'))
model.add(Dropout(0.4))
model.add(Dense(11, activation='softmax'))

model.compile(loss='categorical_crossentropy',
              optimizer='adam',
              metrics='accuracy')

model.fit_generator(
        train_generator,
        steps_per_epoch=1000 // batch_size,
        validation_data=valid_generator,
        epochs=50)
model.save_weights('model/first_model.h5')  # 많은 시간을 들여 학습한 모델인 만큼, 학습 후에는 꼭 모델을 저장해줍시다.

