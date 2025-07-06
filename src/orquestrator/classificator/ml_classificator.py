import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.model_selection import train_test_split, cross_val_score, StratifiedKFold
from sklearn.preprocessing import LabelEncoder, StandardScaler
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.ensemble import RandomForestClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.naive_bayes import MultinomialNB
from sklearn.metrics import classification_report, confusion_matrix, accuracy_score, f1_score
from sklearn.metrics import matthews_corrcoef, precision_recall_fscore_support
from sklearn.pipeline import Pipeline
from sklearn.model_selection import GridSearchCV
import joblib
import re
import string
import warnings
warnings.filterwarnings('ignore')

class MLClassifierTrainer:
    def __init__(self, csv_file_path):
        """
        Inicializa o treinador de classificador ML
        
        Args:
            csv_file_path (str): Caminho para o arquivo CSV com os dados
        """
        self.csv_file_path = csv_file_path
        self.data = None
        self.X = None
        self.y_data_type = None
        self.y_data_subtype = None
        self.y_task = None
        self.X_train = None
        self.X_test = None
        self.y_train_data_type = None
        self.y_test_data_type = None
        self.y_train_data_subtype = None
        self.y_test_data_subtype = None
        self.y_train_task = None
        self.y_test_task = None
        self.models = {}
        self.vectorizer = None
        self.label_encoders = {}
        
    def load_data(self):
        """Carrega os dados do arquivo CSV"""
        try:
            self.data = pd.read_csv(self.csv_file_path)
            print(f"Dados carregados com sucesso: {self.data.shape[0]} amostras, {self.data.shape[1]} colunas")
            print(f"Colunas: {list(self.data.columns)}")
            return True
        except Exception as e:
            print(f"Erro ao carregar dados: {e}")
            return False
    
    def explore_data(self):
        """Explora e analisa os dados"""
        if self.data is None:
            print("Dados não carregados. Execute load_data() primeiro.")
            return
        
        print("\n=== ANÁLISE EXPLORATÓRIA DOS DADOS ===")
        print(f"Forma do dataset: {self.data.shape}")
        print(f"\nPrimeiras 5 linhas:")
        print(self.data.head())
        
        print(f"\nInformações sobre valores ausentes:")
        print(self.data.isnull().sum())
        
        print(f"\nDistribuição por data_type:")
        print(self.data['data_type'].value_counts())
        
        print(f"\nDistribuição por data_subtype:")
        print(self.data['data_subtype'].value_counts())
        
        print(f"\nDistribuição por task:")
        print(self.data['task'].value_counts())
        
        # Estatísticas do texto
        self.data['text_length'] = self.data['input_phrase'].str.len()
        self.data['word_count'] = self.data['input_phrase'].str.split().str.len()
        
        print(f"\nEstatísticas do texto:")
        print(f"Comprimento médio: {self.data['text_length'].mean():.2f} caracteres")
        print(f"Número médio de palavras: {self.data['word_count'].mean():.2f}")
        print(f"Faixa de palavras: {self.data['word_count'].min()} - {self.data['word_count'].max()}")
        
    def preprocess_text(self, text):
        """
        Pré-processa o texto de entrada
        
        Args:
            text (str): Texto a ser processado
            
        Returns:
            str: Texto processado
        """
        # Converter para minúsculas
        text = text.lower()
        
        # Remover caracteres especiais, mantendo apenas letras, números e espaços
        text = re.sub(r'[^a-zA-Z0-9\s]', '', text)
        
        # Remover espaços extras
        text = ' '.join(text.split())
        
        return text
    
    def prepare_features(self):
        """Prepara as features e labels para o treinamento"""
        if self.data is None:
            print("Dados não carregados. Execute load_data() primeiro.")
            return False
        
        # Pré-processar texto
        self.data['processed_text'] = self.data['input_phrase'].apply(self.preprocess_text)
        
        # Preparar features (X)
        self.X = self.data['processed_text']
        
        # Preparar labels (y) - codificar labels categóricas
        self.label_encoders['data_type'] = LabelEncoder()
        self.label_encoders['data_subtype'] = LabelEncoder()
        self.label_encoders['task'] = LabelEncoder()
        
        self.y_data_type = self.label_encoders['data_type'].fit_transform(self.data['data_type'])
        self.y_data_subtype = self.label_encoders['data_subtype'].fit_transform(self.data['data_subtype'])
        self.y_task = self.label_encoders['task'].fit_transform(self.data['task'])
        
        print("\n=== PREPARAÇÃO DAS FEATURES ===")
        print(f"Número de classes únicas:")
        print(f"Data Type: {len(self.label_encoders['data_type'].classes_)}")
        print(f"Data Subtype: {len(self.label_encoders['data_subtype'].classes_)}")
        print(f"Task: {len(self.label_encoders['task'].classes_)}")
        
        return True
    
    def split_data(self, test_size=0.2, random_state=42):
        """Divide os dados em conjuntos de treino e teste"""
        if self.X is None:
            print("Features não preparadas. Execute prepare_features() primeiro.")
            return False
        
        # Divisão estratificada baseada na task (mais específica)
        (self.X_train, self.X_test, 
         self.y_train_data_type, self.y_test_data_type,
         self.y_train_data_subtype, self.y_test_data_subtype,
         self.y_train_task, self.y_test_task) = train_test_split(
            self.X, self.y_data_type, self.y_data_subtype, self.y_task,
            test_size=test_size, 
            random_state=random_state,
            stratify=self.y_task  # Estratificação baseada na task
        )
        
        print(f"\n=== DIVISÃO DOS DADOS ===")
        print(f"Treino: {len(self.X_train)} amostras")
        print(f"Teste: {len(self.X_test)} amostras")
        
        return True
    
    def create_models(self):
        """Cria os modelos de classificação"""
        
        # Configurações do TF-IDF
        self.vectorizer = TfidfVectorizer(
            max_features=10000,
            stop_words='english',
            ngram_range=(1, 2),
            min_df=2,
            max_df=0.95
        )
        
        # Modelos para cada nível de classificação
        models_config = {
            'data_type': {
                'random_forest': RandomForestClassifier(n_estimators=100, random_state=42),
                'logistic_regression': LogisticRegression(random_state=42, max_iter=1000),
                'naive_bayes': MultinomialNB()
            },
            'data_subtype': {
                'random_forest': RandomForestClassifier(n_estimators=100, random_state=42),
                'logistic_regression': LogisticRegression(random_state=42, max_iter=1000),
                'naive_bayes': MultinomialNB()
            },
            'task': {
                'random_forest': RandomForestClassifier(n_estimators=100, random_state=42),
                'logistic_regression': LogisticRegression(random_state=42, max_iter=1000),
                'naive_bayes': MultinomialNB()
            }
        }
        
        # Criar pipelines
        self.models = {}
        for level, level_models in models_config.items():
            self.models[level] = {}
            for model_name, model in level_models.items():
                self.models[level][model_name] = Pipeline([
                    ('tfidf', TfidfVectorizer(
                        max_features=10000,
                        stop_words='english',
                        ngram_range=(1, 2),
                        min_df=2,
                        max_df=0.95
                    )),
                    ('classifier', model)
                ])
    
    def train_models(self):
        """Treina todos os modelos"""
        if not self.models:
            self.create_models()
        
        print("\n=== TREINAMENTO DOS MODELOS ===")
        
        # Dados de treino para cada nível
        y_train_levels = {
            'data_type': self.y_train_data_type,
            'data_subtype': self.y_train_data_subtype,
            'task': self.y_train_task
        }
        
        for level, level_models in self.models.items():
            print(f"\nTreinando modelos para {level}...")
            for model_name, model in level_models.items():
                print(f"  Treinando {model_name}...")
                model.fit(self.X_train, y_train_levels[level])
                print(f"  ✓ {model_name} treinado")
    
    def evaluate_model(self, level, model_name):
        """Avalia um modelo específico"""
        model = self.models[level][model_name]
        
        # Dados de teste para cada nível
        y_test_levels = {
            'data_type': self.y_test_data_type,
            'data_subtype': self.y_test_data_subtype,
            'task': self.y_test_task
        }
        
        # Predições
        y_pred = model.predict(self.X_test)
        y_true = y_test_levels[level]
        
        # Métricas
        accuracy = accuracy_score(y_true, y_pred)
        f1 = f1_score(y_true, y_pred, average='weighted')
        mcc = matthews_corrcoef(y_true, y_pred)
        
        # Relatório detalhado
        target_names = self.label_encoders[level].classes_
        report = classification_report(y_true, y_pred, target_names=target_names, output_dict=True)
        
        return {
            'accuracy': accuracy,
            'f1_score': f1,
            'mcc': mcc,
            'classification_report': report
        }
    
    def cross_validate_models(self, cv_folds=5):
        """Realiza validação cruzada para todos os modelos"""
        print("\n=== VALIDAÇÃO CRUZADA ===")
        
        # Dados para cada nível
        y_levels = {
            'data_type': self.y_data_type,
            'data_subtype': self.y_data_subtype,
            'task': self.y_task
        }
        
        cv_results = {}
        
        for level, level_models in self.models.items():
            cv_results[level] = {}
            print(f"\nValidação cruzada para {level}:")
            
            for model_name, model in level_models.items():
                # Validação cruzada estratificada
                cv_scores = cross_val_score(
                    model, self.X, y_levels[level], 
                    cv=StratifiedKFold(n_splits=cv_folds, shuffle=True, random_state=42),
                    scoring='accuracy'
                )
                
                cv_results[level][model_name] = {
                    'scores': cv_scores,
                    'mean': cv_scores.mean(),
                    'std': cv_scores.std()
                }
                
                print(f"  {model_name}: {cv_scores.mean():.4f} (±{cv_scores.std():.4f})")
        
        return cv_results
    
    def evaluate_all_models(self):
        """Avalia todos os modelos treinados"""
        print("\n=== AVALIAÇÃO DOS MODELOS ===")
        
        results = {}
        
        for level in self.models.keys():
            results[level] = {}
            print(f"\n{level.upper()} - Resultados:")
            print("-" * 50)
            
            for model_name in self.models[level].keys():
                evaluation = self.evaluate_model(level, model_name)
                results[level][model_name] = evaluation
                
                print(f"{model_name}:")
                print(f"  Acurácia: {evaluation['accuracy']:.4f}")
                print(f"  F1-Score: {evaluation['f1_score']:.4f}")
                print(f"  MCC: {evaluation['mcc']:.4f}")
                print()
        
        return results
    
    def plot_confusion_matrices(self, level='task', model_name='random_forest'):
        """Plota matriz de confusão para um modelo específico"""
        model = self.models[level][model_name]
        
        # Dados de teste
        y_test_levels = {
            'data_type': self.y_test_data_type,
            'data_subtype': self.y_test_data_subtype,
            'task': self.y_test_task
        }
        
        y_pred = model.predict(self.X_test)
        y_true = y_test_levels[level]
        
        # Matriz de confusão
        cm = confusion_matrix(y_true, y_pred)
        
        plt.figure(figsize=(12, 10))
        sns.heatmap(cm, annot=True, fmt='d', cmap='Blues',
                    xticklabels=self.label_encoders[level].classes_,
                    yticklabels=self.label_encoders[level].classes_)
        plt.title(f'Matriz de Confusão - {level} ({model_name})')
        plt.xlabel('Predição')
        plt.ylabel('Verdadeiro')
        plt.xticks(rotation=45)
        plt.yticks(rotation=0)
        plt.tight_layout()
        plt.show()
    
    def save_models(self, base_path='models'):
        """Salva os modelos treinados"""
        import os
        
        os.makedirs(base_path, exist_ok=True)
        
        for level, level_models in self.models.items():
            for model_name, model in level_models.items():
                filename = f"{base_path}/{level}_{model_name}.joblib"
                joblib.dump(model, filename)
                print(f"Modelo salvo: {filename}")
        
        # Salvar label encoders
        for level, encoder in self.label_encoders.items():
            filename = f"{base_path}/label_encoder_{level}.joblib"
            joblib.dump(encoder, filename)
            print(f"Label encoder salvo: {filename}")
    
    def predict_sample(self, input_text, level='task', model_name='random_forest'):
        """Faz predição para uma amostra específica"""
        model = self.models[level][model_name]
        
        # Pré-processar texto
        processed_text = self.preprocess_text(input_text)
        
        # Predição
        prediction = model.predict([processed_text])[0]
        prediction_proba = model.predict_proba([processed_text])[0]
        
        # Decodificar label
        predicted_label = self.label_encoders[level].inverse_transform([prediction])[0]
        
        # Probabilidades para todas as classes
        classes = self.label_encoders[level].classes_
        probabilities = dict(zip(classes, prediction_proba))
        
        return {
            'prediction': predicted_label,
            'confidence': max(prediction_proba),
            'all_probabilities': probabilities
        }
    
    def run_complete_pipeline(self):
        """Executa o pipeline completo"""
        print("=== PIPELINE COMPLETO DE TREINAMENTO ===")
        
        # 1. Carregar dados
        if not self.load_data():
            return False
        
        # 2. Explorar dados
        self.explore_data()
        
        # 3. Preparar features
        if not self.prepare_features():
            return False
        
        # 4. Dividir dados
        if not self.split_data():
            return False
        
        # 5. Treinar modelos
        self.train_models()
        
        # 6. Validação cruzada
        cv_results = self.cross_validate_models()
        
        # 7. Avaliar modelos
        test_results = self.evaluate_all_models()
        
        # 8. Salvar modelos
        self.save_models()
        
        print("\n=== PIPELINE CONCLUÍDO COM SUCESSO ===")
        
        return True


# Exemplo de uso
if __name__ == "__main__":
    # Inicializar o treinador
    trainer = MLClassifierTrainer('validation.csv')  # Substitua pelo caminho correto
    
    # Executar pipeline completo
    success = trainer.run_complete_pipeline()
    
    if success:
        # Exemplo de predição
        sample_text = "I want help to create a design analysis"
        prediction = trainer.predict_sample(sample_text, level='task', model_name='random_forest')
        
        print(f"\n=== EXEMPLO DE PREDIÇÃO ===")
        print(f"Texto: {sample_text}")
        print(f"Predição: {prediction['prediction']}")
        print(f"Confiança: {prediction['confidence']:.4f}")
        
        # Plotar matriz de confusão (opcional)
        # trainer.plot_confusion_matrices(level='task', model_name='random_forest')