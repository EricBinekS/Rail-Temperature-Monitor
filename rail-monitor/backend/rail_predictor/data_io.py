import pandas as pd
import os
import json
from .config import Config

def load_locations(filepath: str = Config.INPUT_JSON_FILE) -> pd.DataFrame:
    """Carrega as coordenadas originais."""
    try:
        df = pd.read_json(filepath, encoding='utf-8')
        
        df.rename(columns={
            'SB': Config.ID_COLUMN,
            'Mediana Latitude': Config.LAT_COLUMN,
            'Mediana Longitude': Config.LON_COLUMN
        }, inplace=True)

        required = [Config.ID_COLUMN, Config.LAT_COLUMN, Config.LON_COLUMN]
        if not all(col in df.columns for col in required):
            print(f"⚠️ Colunas encontradas: {df.columns}")
            raise ValueError("JSON de coordenadas com formato inválido.")

        df[Config.ID_COLUMN] = df[Config.ID_COLUMN].astype(str).str.strip()
        return df

    except Exception as e:
        print(f"❌ Erro ao ler coordenadas em {filepath}: {e}")
        return pd.DataFrame()

def save_json_for_frontend(df: pd.DataFrame, target_path: str):
    """Salva o JSON consolidado direto na pasta do Frontend."""
    try:
        os.makedirs(os.path.dirname(target_path), exist_ok=True)
        
        if 'datetime' in df.columns:
            df['datetime'] = df['datetime'].astype(str)
            
        df.to_json(target_path, orient='records', indent=2)
        print(f"✅ JSON Final salvo em: {target_path}")
        
    except Exception as e:
        print(f"❌ Erro ao salvar JSON para o frontend: {e}")