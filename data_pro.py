import os

import numpy as np

import librosa

import librosa.display

import matplotlib

import matplotlib.pyplot as plt


def generate_spectrogram(path):
    # Load audio file
    if not os.path.exists("./data/spectrograms/" + path.split(".")[0] + ".webp"):
        audio_path = 'data/audio/' + path

        y, sr = librosa.load(audio_path)

        # Generate spectrogram

        D = librosa.stft(y)

        S = librosa.amplitude_to_db(D, ref=np.max)

    # Visualize spectrogram

        N = 256
        q = 0.6
        vals = np.ones((N, 4))

        da = np.zeros(round(q*N))
        t = np.concatenate((da, np.linspace(0.5, 1, round(N-q*N))))
        vals[:, 0] = t
        vals[:, 1] = t
        vals[:, 2] = t
        newcmp = matplotlib.colors.ListedColormap(vals)

        fig, ax = plt.subplots()
        librosa.display.specshow(S, sr=sr, x_axis='time',
                                y_axis='linear', cmap=newcmp, auto_aspect=True)


        px = 1/plt.rcParams['figure.dpi']
        
        fig.set_size_inches((np.shape(S)[1]*px, np.shape(S)[0]*px))

        plt.subplots_adjust(0, 0, 1, 1)
        
        plt.savefig("./data/spectrograms/" + path.split(".")[0] + ".webp")



def get_sounds():
    sounds = "let all_sounds = ["
    
    files = os.listdir("./data/audio")
    for f in files:
        sounds += '"' + f + '",'
        #generate_spectrogram(f)
        
    sounds = sounds[:-1]
    sounds += "]"
    fp = open("sounds.js", 'w')
    fp.write(sounds)
    fp.close()


get_sounds()

