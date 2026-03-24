# 🎬 Predittore Incassi Film

Progetto completo di Machine Learning per la **previsione degli incassi cinematografici** basato sul dataset TMDB 930k Movies. Il progetto include un notebook Jupyter con l'intera pipeline ML e una web app per utilizzare il modello in modo interattivo.

---

## 📌 Obiettivo

Predire gli **incassi** di un film prima della sua uscita, utilizzando caratteristiche note in anticipo come budget, generi, durata, lingua e data di uscita. 

---


## 📊 Dataset

**TMDB Movies Dataset 2023** — [Kaggle](https://www.kaggle.com/datasets/asaniczka/tmdb-movies-dataset-2023-930k-movies)

- ~1.300.000 film
- 24 colonne (budget, revenue, generi, popolarità, ecc.)
- Dopo la pulizia: **7.583 film** con dati completi e affidabili

---

## 🧪 Pipeline ML

### 1. EDA e Data Cleaning
- Filtro su film con status "Released"
- Rimozione colonne non utili (URL, testo libero, feature non disponibili prima dell'uscita del film)
- Rimozione valori anomali (runtime = 0 o > 240 min, budget/revenue irrealistici)
- Filtro al 20° percentile di budget e revenue per eliminare dati errati
- Analisi delle correlazioni tramite heatmap

### 2. Feature Engineering
- **Log-transform** su revenue (target) e budget per gestire la distribuzione asimmetrica
- **Encoding ciclico** del mese di uscita con sin/cos per catturare la stagionalità
- **Encoding binario** della lingua originale (inglese vs altra lingua)
- **MultiLabelBinarizer** per i 19 generi cinematografici

### 3. Modelli addestrati

| Modello | CV R² | Test R² | Test MAE (log) |
|---|---|---|---|
| Linear Regression | 0.4898 | 0.4673 | 0.9501 |
| Random Forest | 0.5080 | 0.4951 | 0.9212 |
| XGBoost | 0.4311 | 0.4478 | 0.9582 |
| LightGBM | 0.5073 | 0.5131 | 0.9122 |
| **LightGBM Tuned** | **0.5298** | **0.5182** | **0.9051** |

### 4. Tuning
Ottimizzazione degli iperparametri di LightGBM con **RandomizedSearchCV** (50 iterazioni, 5-fold CV).

Migliori parametri trovati:
```
n_estimators: 100
max_depth: 5
learning_rate: 0.05
num_leaves: 100
subsample: 0.8
colsample_bytree: 0.8
```

### 5. Feature Importance
Le feature più importanti per il modello:
1. **Budget** — la feature più influente
2. **Release year** — cattura il trend storico del mercato
3. **Runtime** — correlato con la tipologia di produzione
4. **Month sin/cos** — stagionalità degli incassi
5. **Generi** — Comedy e Horror i più influenti

---

## 🌐 Web App

La web app permette di inserire le caratteristiche di un film e ottenere una stima del revenue mondiale.

### Stack tecnologico
- **Backend:** Python + FastAPI
- **Frontend:** HTML, CSS, JavaScript, Bootstrap 5

### Funzionalità
- Form con tutti i parametri del film
- Predizione del revenue in tempo reale
- Categoria del film basata sul **ROI** (Flop / Mediocre / Successo / Grande Successo / Blockbuster)
- Notifiche toast personalizzate

---

## 🚀 Come avviare il progetto

### 1. Clona il repository
```bash
git clone https://github.com/StefanoMulas03/Predittore-Incassi-Film.git
cd Predittore-Incassi-Film
```

### 2. Crea e attiva la virtual environment
```bash
python -m venv venv

# Mac/Linux
source venv/bin/activate

# Windows
venv\Scripts\activate
```

### 3. Installa le dipendenze
```bash
pip install -r requirements.txt
```

### 4. Scarica il dataset
Scarica `TMDB_movie_dataset_v11.csv` da [Kaggle](https://www.kaggle.com/datasets/asaniczka/tmdb-movies-dataset-2023-930k-movies) e mettilo nella root del progetto.

### 5. Esegui il notebook
Apri `notebook.ipynb` ed esegui tutte le celle in ordine. Al termine verranno generati `model.joblib` e `mlb.joblib`.

### 6. Avvia la web app
```bash
cd webapp
uvicorn main:app --reload
```

Apri il browser su **http://127.0.0.1:8000**

---

## ⚠️ Note

- `model.joblib` e `mlb.joblib` non sono inclusi nel repository perché generati dal notebook. È necessario eseguire il notebook prima di avviare la web app.
- Il dataset CSV non è incluso nel repository perché troppo grande. Va scaricato da Kaggle.
- Il modello ha un R² di 0.52 — le predizioni sono indicative e non precise, soprattutto per film con caratteristiche molto particolari (es. film locali, produzioni indipendenti).

---

