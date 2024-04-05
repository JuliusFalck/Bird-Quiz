import os

def get_sounds():
    sounds = "let all_sounds = ["
    
    files = os.listdir("./data")
    for f in files:
        sounds += "'" + f + "',"
    sounds = sounds[:-1]
    sounds += "]"
    fp = open("sounds.js", 'w')
    fp.write(sounds)
    fp.close()


get_sounds()