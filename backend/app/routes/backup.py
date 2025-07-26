from fastapi import APIRouter, HTTPException, BackgroundTasks
from fastapi.responses import StreamingResponse
from app.dependencies.auth import CurrentUser
from app.services.supabase_client import supabase
from typing import List, Optional
from datetime import datetime
import json
import zipfile
from io import BytesIO
import pandas as pd

router = APIRouter()

@router.post("/backup/export")
async def export_user_data(
    background_tasks: BackgroundTasks,
    include_reports: bool = True,
    include_templates: bool = True,
    include_settings: bool = True,
    format: str = "json",
    current_user: str = CurrentUser
):
    """Exporta todos os dados do usuário"""
    try:
        # Dados mock para teste
        export_data = {
            "export_info": {
                "user_id": current_user,
                "export_date": datetime.utcnow().isoformat(),
                "format": format,
                "version": "1.0"
            },
            "data": {
                "reports": [
                    {"id": 1, "name": "Relatório de Vendas", "created_at": "2024-03-19T10:30:00"},
                    {"id": 2, "name": "Análise Financeira", "created_at": "2024-03-18T15:45:00"}
                ] if include_reports else [],
                "templates": [
                    {"id": 1, "name": "Dashboard Executivo", "created_at": "2024-03-19T14:20:00"},
                    {"id": 2, "name": "Relatório de Vendas", "created_at": "2024-03-18T11:30:00"}
                ] if include_templates else [],
                "settings": [
                    {"id": 1, "key": "theme", "value": "dark", "created_at": "2024-03-19T10:00:00"}
                ] if include_settings else []
            }
        }
        
        # Criar arquivo de backup
        if format == "json":
            backup_content = json.dumps(export_data, indent=2, ensure_ascii=False)
            filename = f"autoreport_backup_{current_user}_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json"
            
            return StreamingResponse(
                BytesIO(backup_content.encode('utf-8')),
                media_type="application/json",
                headers={"Content-Disposition": f"attachment; filename={filename}"}
            )
        
        elif format == "zip":
            # Criar ZIP com múltiplos arquivos
            zip_buffer = BytesIO()
            
            with zipfile.ZipFile(zip_buffer, 'w', zipfile.ZIP_DEFLATED) as zip_file:
                # Adicionar arquivo JSON principal
                zip_file.writestr("backup.json", json.dumps(export_data, indent=2, ensure_ascii=False))
                
                # Adicionar arquivos CSV separados se houver dados
                if include_reports and export_data["data"].get("reports"):
                    df_reports = pd.DataFrame(export_data["data"]["reports"])
                    zip_file.writestr("reports.csv", df_reports.to_csv(index=False))
                
                if include_templates and export_data["data"].get("templates"):
                    df_templates = pd.DataFrame(export_data["data"]["templates"])
                    zip_file.writestr("templates.csv", df_templates.to_csv(index=False))
            
            zip_buffer.seek(0)
            filename = f"autoreport_backup_{current_user}_{datetime.now().strftime('%Y%m%d_%H%M%S')}.zip"
            
            return StreamingResponse(
                zip_buffer,
                media_type="application/zip",
                headers={"Content-Disposition": f"attachment; filename={filename}"}
            )
        
        else:
            raise HTTPException(status_code=400, detail="Formato não suportado. Use 'json' ou 'zip'")
        
    except Exception as e:
        return {
            "error": "Erro ao exportar dados",
            "message": str(e),
            "user_id": current_user,
            "format": format
        }

@router.post("/backup/import")
async def import_user_data(
    file_content: str,
    current_user: str = CurrentUser
):
    """Importa dados de backup"""
    try:
        # Decodificar conteúdo do arquivo
        backup_data = json.loads(file_content)
        
        # Validar estrutura do backup
        if "export_info" not in backup_data or "data" not in backup_data:
            return {
                "error": "Formato de backup inválido",
                "user_id": current_user
            }
        
        # Verificar se é do mesmo usuário
        if backup_data["export_info"]["user_id"] != current_user:
            return {
                "error": "Backup não pertence ao usuário atual",
                "user_id": current_user
            }
        
        # Dados mock para teste
        imported_count = {
            "reports": 2,
            "templates": 3,
            "settings": 1
        }
        
        return {
            "message": "Backup importado com sucesso",
            "imported": imported_count,
            "backup_date": backup_data["export_info"]["export_date"],
            "user_id": current_user,
            "import_summary": {
                "total_items": sum(imported_count.values()),
                "import_time": datetime.utcnow().isoformat()
            }
        }
        
    except json.JSONDecodeError:
        return {
            "error": "Arquivo JSON inválido",
            "user_id": current_user
        }
    except Exception as e:
        return {
            "error": "Erro ao importar backup",
            "message": str(e),
            "user_id": current_user
        }

@router.get("/backup/schedule")
async def schedule_backup(
    frequency: str = "weekly",
    current_user: str = CurrentUser
):
    """Agenda backup automático"""
    try:
        # Validar frequência
        valid_frequencies = ["daily", "weekly", "monthly"]
        if frequency not in valid_frequencies:
            return {
                "error": f"Frequência inválida. Use: {', '.join(valid_frequencies)}",
                "user_id": current_user
            }
        
        # Calcular próximo backup
        next_backup = calculate_next_backup(frequency)
        
        # Dados mock para teste
        backup_schedule = {
            "user_id": current_user,
            "frequency": frequency,
            "active": True,
            "last_backup": "2024-03-15T10:30:00",
            "next_backup": next_backup,
            "created_at": datetime.utcnow().isoformat()
        }
        
        return {
            "message": f"Backup agendado com sucesso - frequência: {frequency}",
            "schedule": backup_schedule,
            "user_id": current_user
        }
        
    except Exception as e:
        return {
            "error": "Erro ao agendar backup",
            "message": str(e),
            "user_id": current_user,
            "frequency": frequency
        }

@router.get("/backup/history")
async def get_backup_history(current_user: str = CurrentUser):
    """Histórico de backups do usuário"""
    try:
        # Dados mock para teste
        mock_history = [
            {
                "id": 1,
                "user_id": current_user,
                "backup_type": "json",
                "file_size": 2048,
                "status": "completed",
                "created_at": "2024-03-19T10:30:00"
            },
            {
                "id": 2,
                "user_id": current_user,
                "backup_type": "zip",
                "file_size": 4096,
                "status": "completed",
                "created_at": "2024-03-15T14:20:00"
            },
            {
                "id": 3,
                "user_id": current_user,
                "backup_type": "json",
                "file_size": 1536,
                "status": "completed",
                "created_at": "2024-03-10T09:15:00"
            }
        ]
        
        return {
            "backups": mock_history,
            "total_backups": len(mock_history),
            "user_id": current_user,
            "last_backup": mock_history[0]["created_at"] if mock_history else None
        }
        
    except Exception as e:
        return {
            "error": "Erro ao buscar histórico",
            "message": str(e),
            "user_id": current_user,
            "backups": [],
            "total_backups": 0
        }

def calculate_next_backup(frequency: str) -> str:
    """Calcula próxima data de backup baseada na frequência"""
    from datetime import timedelta
    
    now = datetime.utcnow()
    
    if frequency == "daily":
        next_date = now + timedelta(days=1)
    elif frequency == "weekly":
        next_date = now + timedelta(weeks=1)
    elif frequency == "monthly":
        next_date = now + timedelta(days=30)
    else:
        next_date = now + timedelta(weeks=1)
    
    return next_date.isoformat() 