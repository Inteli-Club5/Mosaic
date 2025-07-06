import os
import sys
import joblib
import json

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
model_path = os.path.join(BASE_DIR, 'models', 'modelo_final.joblib')
encoder_path = os.path.join(BASE_DIR, 'models', 'label_encoder_task.joblib')

model = joblib.load(model_path)
label_encoder = joblib.load(encoder_path)

text = sys.argv[1]

y_pred = model.predict([text])[0]
decoded = label_encoder.inverse_transform([y_pred])[0]

print(json.dumps({
    "task": decoded
}))
