import os
import pandas as pd
from datetime import datetime

# Importações locais
from rail_predictor.config import Config
from rail_predictor.data_io import load_locations, save_json_for_frontend
from rail_predictor.api_client import fetch_weather_data_parallel
from rail_predictor.processing import run_processing_pipeline

def main():
    print(f"\n--- 🚂 INICIANDO ATUALIZAÇÃO DO DASHBOARD ---")
    
    # 1. Carregar Coordenadas (Base Estática)
    # Ajuste o caminho se necessário para apontar para backend/data/coordenadas.json
    locations_path = os.path.join("data", "coordenadas.json")
    locations_df = load_locations(locations_path)
    
    if locations_df.empty:
        print("❌ Parando: Sem coordenadas para processar.")
        return
    print(f"📍 {len(locations_df)} pontos de monitorização carregados.")

    # 2. Buscar Clima (API)
    # Buscamos dados de "hoje" (past_days=1 para ter histórico recente para inércia)
    api_params = {
        'hourly': Config.API_HOURLY_VARS,
        'timezone': Config.API_TIMEZONE,
        'past_days': 1,
        'forecast_days': 1
    }
    
    print(f"📡 Consultando API de Clima...")
    weather_df = fetch_weather_data_parallel(locations_df, api_params)
    
    if weather_df.empty:
        print("❌ Erro: Falha na conexão com a API.")
        return

    # 3. Calcular Temperatura do Trilho
    print(f"🔥 Calculando modelo térmico...")
    processed_df = run_processing_pipeline(weather_df)
    
    # 4. Filtrar Apenas a Hora Atual (O "Agora")
    processed_df['datetime'] = pd.to_datetime(processed_df['datetime'])
    now = pd.Timestamp(datetime.now()).floor('h') # Arredonda para a hora cheia atual
    
    # Pega o registro mais próximo de 'agora' para cada estação
    processed_df['diff'] = (processed_df['datetime'] - now).abs()
    current_status = processed_df.loc[processed_df.groupby(Config.ID_COLUMN)['diff'].idxmin()].copy()
    
    # 5. O GRANDE MERGE (Juntar Temperatura + Coordenadas)
    # Aqui resolvemos o problema do frontend não ter as coordenadas
    final_dashboard_data = pd.merge(
        locations_df, 
        current_status[[Config.ID_COLUMN, 'estimated_rail_temp', 'temperature_celsius', 'sky_condition', 'wind_speed_kmh', 'datetime']],
        on=Config.ID_COLUMN,
        how='inner' # Só mantém se tiver dados de ambos
    )

    # 6. Salvar direto na pasta do Frontend
    # Caminho relativo: Sobe um nível (..) entra em frontend -> src -> data
    output_path = os.path.join("..", "frontend", "src", "data", "dashboard_data.json")
    
    print(f"💾 Salvando dados consolidados...")
    save_json_for_frontend(final_dashboard_data, output_path)
    print("🚀 Processo concluído! O Frontend já pode ler os dados.")

if __name__ == "__main__":
    main()