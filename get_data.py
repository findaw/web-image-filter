import cv2
import os
import numpy as np


def get_train_data() -> tuple : 
    TARGET = ['cockroach', 'etc']
    LABEL = {TARGET[0] : 0, TARGET[1] : 1, TARGET[2]: 2}
    path = '\data\\train\\'
    data_input = []
    data_target = []
    for t_idx in range(len(TARGET)):
        dir_path = os.getcwd() + path + TARGET[t_idx]
        file_list = os.listdir(dir_path)

        for file_name in file_list:
            print(file_name)
            src = cv2.imread(f'{dir_path}/{file_name}', cv2.IMREAD_GRAYSCALE)
            data_input.append(src)
            data_target.append(LABEL[TARGET[t_idx]])
            print(src.shape)

    print(len(data_input))
    print(len(data_target))
    return np.array(data_input), np.array(data_target)


if __name__ == '__main__':
    get_train_data()

