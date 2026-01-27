from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from main import main as run_pipeline # Importa sua lógica existente

app = FastAPI()

# Configuração de CORS (Permite que o React na porta 5173 fale com o Python na 8000)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Em produção, troque "*" por "http://localhost:5173"
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"status": "API Online 🚂"}

@app.post("/refresh")
async def refresh_data():
    """
    Endpoint que o botão do React vai chamar.
    Ele roda o pipeline de dados e atualiza o JSON.
    """
    try:
        print("🔄 Recebi pedido de atualização via API...")
        # Chama a função main() que já criamos no main.py
        run_pipeline()
        return {"message": "Dados atualizados com sucesso!", "success": True}
    except Exception as e:
        return {"message": f"Erro: {str(e)}", "success": False}