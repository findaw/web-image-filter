import cv2
import os



def resize_for_train(file_name : str,origin, target_dir):
    width = 100
    height = 100
    dst = None

    try:
        src = cv2.imread(f'{origin}/{file_name}', cv2.IMREAD_COLOR)
        print(src.shape)
        # 절대 크기로 변경 
        if src.shape[0]+src.shape[1] >= width + height:
            dst = cv2.resize(src, dsize=(width, height), interpolation=cv2.INTER_AREA)
        else:
            dst = cv2.resize(src, dsize=(width, height), interpolation=cv2.INTER_CUBIC)
            
        img_gray = cv2.cvtColor(dst, cv2.COLOR_BGR2GRAY)

        save_path = f'data/train/{target_dir}/{file_name}'
        # cv2.imshow('src image', src)
        # cv2.imshow('grayscale dst image', img_gray)
        # cv2.waitKey(0)
        cv2.imwrite(save_path, img_gray)
        print('saved : ', save_path)
    except :
        pass
if __name__ == '__main__':
    path = '\data\\origin\\'
    target = ['cockroach', 'spider', 'etc']
    
    for dir_idx in range(len(target)):
        dir_path = os.getcwd() + path + target[dir_idx]
        file_list = os.listdir(dir_path)

        for file_name in file_list:
            print(file_name)
            resize_for_train(file_name, dir_path, target[dir_idx])

