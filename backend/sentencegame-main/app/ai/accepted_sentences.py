from nltk.corpus import wordnet
import csv
import json
import nltk
import gensim
import fasttext
from sklearn.metrics.pairwise import cosine_similarity
nltk.download('wordnet')

accepted_sentences_list = []

def set_sentences(sentence:str):
    if sentence not in accepted_sentences_list:
        accepted_sentences_list.append(sentence)
    print(accepted_sentences_list)

hesnegar_file_path = 'C:/Users/Public/PersianSWN.csv'
output_csv_path = 'C:/Users/Public/relationships.csv'

def map_persian_to_wordnet(hesnegar_file):
    wordnet_mapping = {}

    with open(hesnegar_file, mode='r', encoding='utf-8') as csv_file:
        csv_reader = csv.reader(csv_file, delimiter='\t')
        for row in csv_reader:
            if len(row) == 5:
                wordnet_id, persian_word, score1, score2, score3 = row
                wordnet_mapping[persian_word] = wordnet_id

    return wordnet_mapping

def construct_wordnet_synsets(wordnet_mapping):
    synsets = {}

    for persian_word, wordnet_id in wordnet_mapping.items():
        synset = wordnet.synset_from_pos_and_offset(wordnet_id[-1], int(wordnet_id[:8]))
        synsets[persian_word] = synset

    return synsets

wordnet_mapping = map_persian_to_wordnet(hesnegar_file_path)
wordnet_synsets = construct_wordnet_synsets(wordnet_mapping)

with open(output_csv_path, mode='w', encoding='utf-8', newline='') as csv_file:
    fieldnames = ['PersianWord', 'WordNetSynset']
    writer = csv.DictWriter(csv_file, fieldnames=fieldnames)
    writer.writeheader()

    for persian_word, synset in wordnet_synsets.items():
        writer.writerow({'PersianWord': persian_word, 'WordNetSynset': str(synset)})

print("Mapping and relationships saved to 'relationships.csv' in your local file path.")
  
hesnegar_file_path = 'C:/Users/Public/PersianSWN.csv'  
def map_persian_to_wordnet(hesnegar_file):
    wordnet_mapping = {}

    with open(hesnegar_file, mode='r', encoding='utf-8') as csv_file:
        csv_reader = csv.reader(csv_file, delimiter='\t')
        for row in csv_reader:
            if len(row) == 5:
                wordnet_id, persian_word, score1, score2, score3 = row
                wordnet_mapping[persian_word] = wordnet_id

    return wordnet_mapping

def construct_wordnet_synsets(wordnet_mapping):
    synsets = {}

    for persian_word, wordnet_id in wordnet_mapping.items():
        synset = wordnet.synset_from_pos_and_offset(wordnet_id[-1], int(wordnet_id[:8]))
        synsets[persian_word] = synset

    return synsets

# Function to group Persian words by WordNet synsets
def group_words_by_synset(wordnet_synsets):
    synset_groups = {}

    for persian_word, synset in wordnet_synsets.items():
        if synset is not None:
            synset_str = str(synset)

            if synset_str in synset_groups:
                synset_groups[synset_str].append(persian_word)
            else:
                synset_groups[synset_str] = [persian_word]

    return synset_groups

wordnet_mapping = map_persian_to_wordnet(hesnegar_file_path)
wordnet_synsets = construct_wordnet_synsets(wordnet_mapping)
synset_groups = group_words_by_synset(wordnet_synsets)

output_json_path = 'C:/Users/Public/synset_groups.json' 
with open(output_json_path, mode='w', encoding='utf-8') as json_file:
    json.dump(synset_groups, json_file, ensure_ascii=False, indent=4)

print(f"Synset groups saved to '{output_json_path}' in your local file path.")

import pandas as pd

file1_data = pd.read_csv('C:/Users/Public/relationshipsupdate.csv', delimiter=',', encoding='utf-8')
file2_data = pd.read_csv('C:/Users/Public/PersianSWN.csv', delimiter='\t', encoding='utf-8', header=None, names=['word_id', 'word', 'col2', 'col3', 'col4'])

mapping = {}


for index, row in file2_data.iterrows():
    word_id, persian_word, col2, col3, col4 = row['word_id'], row['word'], row['col2'], row['col3'], row['col4']

    matching_rows = file1_data[file1_data['words'] == persian_word]
    if not matching_rows.empty:
        synset_name = matching_rows.iloc[0]['synset_name']
        mapping[word_id] = synset_name

mapping_df = pd.DataFrame(list(mapping.items()), columns=['word_id', 'synset_name'])

mapping_df.to_csv('C:/Users/Public/word_id_mapping.csv', index=False, encoding='utf-8')


from nltk.corpus import wordnet as wn


def extract_and_save_hypernyms(word_id, output_file, mapping_df):
    word_id_row = mapping_df[mapping_df['word_id'] == word_id]

    if not word_id_row.empty:
        synset_name = word_id_row['synset_name'].values[0]

        synset_parts = synset_name.split(".")
        if len(synset_parts) == 3 and synset_parts[2].isdigit():
            synset_index = int(synset_parts[2])
        else:
            synset_index = 1

        try:
            hypernyms = wn.synset(f"{synset_parts[0]}.{synset_parts[1]}.{synset_index:02d}").hypernyms()

            if hypernyms:
                word = synset_name.split(".")[0]

                with open(output_file, 'a', encoding='utf-8') as file:
                    for hypernym in hypernyms:
                        hypernym_word = hypernym.name().split(".")[0]
                        file.write(f"Word: {word}, Hypernym: {hypernym_word}\n")
        except (nltk.corpus.reader.wordnet.WordNetError, ValueError) as e:
            print(f"Error processing word_id {word_id}: {e}")
    else:
        print(f"Word ID {word_id} not found in mapping data.")


csv_file_path = 'C:/Users/Public/PersianSWN.csv'
mapping_file_path = 'C:/Users/Public/word_id_mapping.csv'
output_file = 'C:/Users/Public/hypernym_relationships.txt'

df = pd.read_csv(csv_file_path, delimiter='\t', header=None, names=['word_id', 'word', 'col2', 'col3', 'col4'])
word_id_mapping = pd.read_csv(mapping_file_path)

with open(output_file, 'w', encoding='utf-8') as file:
    file.write("Word Hypernym\n")


for index, row in df.iterrows():
    word_id, word, col2, col3, col4 = row['word_id'], row['word'], row['col2'], row['col3'], row['col4']

    extract_and_save_hypernyms(word_id, output_file, word_id_mapping)

print("Hypernym relationships have been saved to the output file for words in the CSV.")

import json

synset_groups_file = 'C:/Users/Public/synset_groups.json'
output_file_path = 'C:/Users/Public/synonym_pairs.txt'


with open(synset_groups_file, 'r', encoding='utf-8') as json_file:
    synset_groups = json.load(json_file)

def find_and_save_synonym_pairs(output_file):
    synonym_pairs = set()

    for synset, words in synset_groups.items():
        for i in range(len(words)):
            for j in range(i + 1, len(words)):
                if words[i] != words[j]:
                    synonym_pairs.add((words[i], words[j]))


    with open(output_file, 'w', encoding='utf-8') as file:
        for pair in synonym_pairs:
            file.write(f"Synonym Pair: {pair[0]}, {pair[1]}\n")

find_and_save_synonym_pairs(output_file_path)

print("Synonym pairs have been saved to the output file.")

csv_file_path = 'C:/Users/Public/PersianSWN.csv'
mapping_file_path = 'C:/Users/Public/word_id_mapping.csv'
antonym_output_file = 'C:/Users/Public/antonym_relationships.txt'

df = pd.read_csv(csv_file_path, delimiter='\t', header=None, names=['word_id', 'word', 'col2', 'col3', 'col4'])
word_id_mapping = pd.read_csv(mapping_file_path)


def extract_and_save_antonyms(word_id, output_file, mapping_df):
    word_id_row = mapping_df[mapping_df['word_id'] == word_id]

    if not word_id_row.empty:
        synset_name = word_id_row['synset_name'].values[0]

        synset_parts = synset_name.split(".")
        if len(synset_parts) == 3 and synset_parts[2].isdigit():
            synset_index = int(synset_parts[2])
        else:
            synset_index = 1

        try:
            synset = wn.synset(f"{synset_parts[0]}.{synset_parts[1]}.{synset_index:02d}")
            antonyms = []
            for lemma in synset.lemmas():
                for antonym in lemma.antonyms():
                    antonyms.append(antonym.name())

            if antonyms:
                word = synset_name.split(".")[0]

                with open(output_file, 'a', encoding='utf-8') as file:
                    for antonym in antonyms:
                        file.write(f"Word: {word}, Antonym: {antonym}\n")
        except (nltk.corpus.reader.wordnet.WordNetError, ValueError) as e:
            print(f"Error processing word_id {word_id}: {e}")
    else:
        print(f"Word ID {word_id} not found in mapping data.")


with open(antonym_output_file, 'w', encoding='utf-8') as file:
    file.write("Word Antonym\n")

for index, row in df.iterrows():
    word_id, word, col2, col3, col4 = row['word_id'], row['word'], row['col2'], row['col3'], row['col4']

    extract_and_save_antonyms(word_id, antonym_output_file, word_id_mapping)

print("Antonym relationships have been saved to the output file.")

model_path = 'C:/Users/Public/fasttext_skipgram_300.bin'
synonym_file_path = 'C:/Users/Public/synonym_pairs.txt'

model = gensim.models.fasttext.load_facebook_vectors(model_path)


with open(synonym_file_path, 'r', encoding='utf-8') as synonym_file:
    lines = synonym_file.readlines()

threshold = 0.3

low_similarity_word_pairs = []

for line in lines:
    line = line.strip()
    if not line:
        continue

    synonym_pair = line.split(', ')
    if len(synonym_pair) != 2:
        continue

    word1, word2 = synonym_pair[0], synonym_pair[1]
    if word1 in model and word2 in model:
        vector1 = model[word1]
        vector2 = model[word2]

        similarity_score = cosine_similarity([vector1], [vector2])[0][0]

        if similarity_score < threshold:
            low_similarity_word_pairs.append((word1, word2))

for pair in low_similarity_word_pairs:
    print(f"Words '{pair[0]}' and '{pair[1]}' have a low cosine similarity.")


input_file = 'C:/Users/Public/jaderah.txt'
pretrained_model = 'C:/Users/Public/fasttext_skipgram_300.bin'
output_model = 'C:/Users/Public/fine_tuned_model1'


pretrained_model = gensim.models.fasttext.load_facebook_vectors(pretrained_model)

fine_tuned_model = fasttext.train_unsupervised(input=input_file, dim=300, ws=10)
fine_tuned_model.save_model(output_model + '.bin')

word_pairs = [["راه", "جاده"], ["رازدار", "مونس"], ["فضا", "محیط"]]

def cosine_similarity_vector(vec1, vec2):
    similarity_score = cosine_similarity([vec1], [vec2])[0][0]
    return similarity_score

print("Cosine Similarities Before Fine-Tuning:")
for word1, word2 in word_pairs:
    if word1 in pretrained_model and word2 in pretrained_model:
        vector1 = pretrained_model[word1]
        vector2 = pretrained_model[word2]
        similarity_score = cosine_similarity([vector1], [vector2])[0][0]
        print(f"Words '{word1}' and '{word2}': {similarity_score:.4f}")

print("\nCosine Similarities After Fine-Tuning:")
for word1, word2 in word_pairs:
    if word1 in fine_tuned_model and word2 in fine_tuned_model:
        vector1 = fine_tuned_model[word1]
        vector2 = fine_tuned_model[word2]
        similarity_score = cosine_similarity([vector1], [vector2])[0][0]
        print(f"Words '{word1}' and '{word2}': {similarity_score:.4f}")

pretrained_model = gensim.models.fasttext.load_facebook_vectors(pretrained_model)
input_file = 'C:/Users/Public/ontonym.txt'
# Fine-tune the model
fine_tuned_model = fasttext.train_unsupervised(input=input_file)
fine_tuned_model.save_model(output_model + '.bin')

ontonym_pairs = [["متحرک", "ثابت"], ["بازنده", "برنده"], ["کثیف", "تمیز"]]

def determine_similarity_change(word1, word2, initial_similarity, similarity_after_training):
    if similarity_after_training > initial_similarity:
        return "improved"
    elif similarity_after_training < initial_similarity:
        return "worsened"
    else:
        return "unchanged"

print("Cosine Similarities Before Fine-Tuning:")
for word1, word2 in ontonym_pairs:
    initial_similarity = cosine_similarity([pretrained_model[word1]], [pretrained_model[word2]])[0][0]

    similarity_after_training = cosine_similarity([fine_tuned_model[word1]], [fine_tuned_model[word2]])[0][0]

    print(f"Similarity between '{word1}' and '{word2}' before training: {initial_similarity:.4f}")
    print(f"Similarity between '{word1}' and '{word2}' after training: {similarity_after_training:.4f}")

    change_status = determine_similarity_change(word1, word2, initial_similarity, similarity_after_training)
    print(f"Training {change_status} the similarity between '{word1}' and '{word2}'.")

input_file = 'C:/Users/Public/hypernym.txt'

# Fine-tune the model
fine_tuned_model = fasttext.train_unsupervised(input=input_file)
fine_tuned_model.save_model(output_model + '.bin')

hypernym_pairs = [["اتفاق", "تصادف"], ["سوزش", "درد"], ["انسان", "معلول"]]

def determine_similarity_change(word1, word2, initial_similarity, similarity_after_training):
    if similarity_after_training > initial_similarity:
        return "improved"
    elif similarity_after_training < initial_similarity:
        return "worsened"
    else:
        return "unchanged"

print("Cosine Similarities Before Fine-Tuning:")
for word1, word2 in hypernym_pairs:
    initial_similarity = cosine_similarity([pretrained_model[word1]], [pretrained_model[word2]])[0][0]

    similarity_after_training = cosine_similarity([fine_tuned_model[word1]], [fine_tuned_model[word2]])[0][0]

    print(f"Similarity between '{word1}' and '{word2}' before training: {initial_similarity:.4f}")
    print(f"Similarity between '{word1}' and '{word2}' after training: {similarity_after_training:.4f}")

    change_status = determine_similarity_change(word1, word2, initial_similarity, similarity_after_training)
    print(f"Training {change_status} the similarity between '{word1}' and '{word2}'.")
