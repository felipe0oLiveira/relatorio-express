from fastapi import APIRouter, Depends, HTTPException, Request
from typing import Dict, List, Any
from app.services.collaboration_service import CollaborationService
from app.dependencies.auth import get_current_user
from app.services.supabase_client import supabase
import pandas as pd

router = APIRouter(prefix="/collaboration", tags=["Collaboration"])

collaboration_service = CollaborationService()

@router.post("/share-report")
async def share_report(
    request: Dict[str, Any],
    current_user: Dict = Depends(get_current_user)
):
    """
    Compartilha um relatório com outros usuários
    """
    try:
        report_id = request.get('report_id')
        share_with = request.get('share_with', [])
        
        if not report_id or not share_with:
            raise HTTPException(status_code=400, detail="report_id e share_with são obrigatórios")
        
        result = await collaboration_service.share_report(report_id, current_user['id'], share_with)
        
        return result
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro ao compartilhar relatório: {str(e)}")

@router.get("/shared-reports")
async def get_shared_reports(
    current_user: Dict = Depends(get_current_user)
):
    """
    Obtém relatórios compartilhados com o usuário
    """
    try:
        shared_reports = await collaboration_service.get_shared_reports(current_user['id'])
        
        return {
            'success': True,
            'shared_reports': shared_reports
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro ao buscar relatórios compartilhados: {str(e)}")

@router.put("/update-share-permission")
async def update_share_permission(
    request: Dict[str, Any],
    current_user: Dict = Depends(get_current_user)
):
    """
    Atualiza permissão de um compartilhamento
    """
    try:
        share_id = request.get('share_id')
        new_permission = request.get('new_permission')
        
        if not share_id or not new_permission:
            raise HTTPException(status_code=400, detail="share_id e new_permission são obrigatórios")
        
        result = await collaboration_service.update_share_permission(share_id, current_user['id'], new_permission)
        
        return result
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro ao atualizar permissão: {str(e)}")

@router.delete("/revoke-share")
async def revoke_share(
    share_id: str,
    current_user: Dict = Depends(get_current_user)
):
    """
    Revoga um compartilhamento
    """
    try:
        result = await collaboration_service.revoke_share(share_id, current_user['id'])
        
        return result
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro ao revogar compartilhamento: {str(e)}")

@router.post("/add-comment")
async def add_comment(
    request: Dict[str, Any],
    current_user: Dict = Depends(get_current_user)
):
    """
    Adiciona um comentário a um relatório
    """
    try:
        report_id = request.get('report_id')
        comment = request.get('comment')
        parent_comment_id = request.get('parent_comment_id')
        
        if not report_id or not comment:
            raise HTTPException(status_code=400, detail="report_id e comment são obrigatórios")
        
        result = await collaboration_service.add_comment(report_id, current_user['id'], comment, parent_comment_id)
        
        return result
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro ao adicionar comentário: {str(e)}")

@router.get("/comments")
async def get_comments(
    report_id: str,
    current_user: Dict = Depends(get_current_user)
):
    """
    Obtém comentários de um relatório
    """
    try:
        comments = await collaboration_service.get_comments(report_id, current_user['id'])
        
        return {
            'success': True,
            'comments': comments
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro ao buscar comentários: {str(e)}")

@router.post("/create-team")
async def create_team(
    request: Dict[str, Any],
    current_user: Dict = Depends(get_current_user)
):
    """
    Cria uma equipe para colaboração
    """
    try:
        team_data = request.get('team_data', {})
        
        if not team_data.get('name'):
            raise HTTPException(status_code=400, detail="Nome da equipe é obrigatório")
        
        result = await collaboration_service.create_team(team_data, current_user['id'])
        
        return result
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro ao criar equipe: {str(e)}")

@router.post("/invite-team-member")
async def invite_team_member(
    request: Dict[str, Any],
    current_user: Dict = Depends(get_current_user)
):
    """
    Convida um usuário para uma equipe
    """
    try:
        team_id = request.get('team_id')
        invite_data = request.get('invite_data', {})
        
        if not team_id or not invite_data.get('email'):
            raise HTTPException(status_code=400, detail="team_id e email são obrigatórios")
        
        result = await collaboration_service.invite_team_member(team_id, current_user['id'], invite_data)
        
        return result
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro ao convidar membro: {str(e)}")

@router.get("/team-reports")
async def get_team_reports(
    team_id: str,
    current_user: Dict = Depends(get_current_user)
):
    """
    Obtém relatórios de uma equipe
    """
    try:
        team_reports = await collaboration_service.get_team_reports(team_id, current_user['id'])
        
        return {
            'success': True,
            'team_reports': team_reports
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro ao buscar relatórios da equipe: {str(e)}")

@router.get("/my-teams")
async def get_my_teams(
    current_user: Dict = Depends(get_current_user)
):
    """
    Obtém equipes do usuário
    """
    try:
        response = supabase.table('team_members').select(
            '*, teams(*)'
        ).eq('user_id', current_user['id']).execute()
        
        teams = []
        for member in response.data:
            if member.get('teams'):
                team = member['teams']
                teams.append({
                    'team_id': team['id'],
                    'team_name': team['name'],
                    'team_description': team.get('description', ''),
                    'role': member['role'],
                    'joined_at': member['joined_at']
                })
        
        return {
            'success': True,
            'teams': teams
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro ao buscar equipes: {str(e)}")

@router.get("/team-members")
async def get_team_members(
    team_id: str,
    current_user: Dict = Depends(get_current_user)
):
    """
    Obtém membros de uma equipe
    """
    try:
        # Verifica se o usuário é membro da equipe
        is_member = await collaboration_service._check_team_member(team_id, current_user['id'])
        if not is_member:
            raise HTTPException(status_code=403, detail="Você não tem acesso a esta equipe")
        
        response = supabase.table('team_members').select(
            '*, users(email, name)'
        ).eq('team_id', team_id).execute()
        
        members = []
        for member in response.data:
            if member.get('users'):
                user = member['users']
                members.append({
                    'user_id': member['user_id'],
                    'user_name': user.get('name', 'Usuário'),
                    'user_email': user.get('email', ''),
                    'role': member['role'],
                    'joined_at': member['joined_at']
                })
        
        return {
            'success': True,
            'members': members
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro ao buscar membros: {str(e)}")

@router.post("/share-with-team")
async def share_with_team(
    request: Dict[str, Any],
    current_user: Dict = Depends(get_current_user)
):
    """
    Compartilha um relatório com uma equipe
    """
    try:
        report_id = request.get('report_id')
        team_id = request.get('team_id')
        permission = request.get('permission', 'view')
        
        if not report_id or not team_id:
            raise HTTPException(status_code=400, detail="report_id e team_id são obrigatórios")
        
        # Verifica se o usuário pode compartilhar o relatório
        can_share = await collaboration_service._check_share_permission(report_id, current_user['id'])
        if not can_share:
            raise HTTPException(status_code=403, detail="Você não tem permissão para compartilhar este relatório")
        
        # Verifica se o usuário é membro da equipe
        is_member = await collaboration_service._check_team_member(team_id, current_user['id'])
        if not is_member:
            raise HTTPException(status_code=403, detail="Você não é membro desta equipe")
        
        # Compartilha com a equipe
        team_share_data = {
            'report_id': report_id,
            'team_id': team_id,
            'shared_by': current_user['id'],
            'permission': permission,
            'shared_at': pd.Timestamp.now().isoformat()
        }
        
        response = supabase.table('team_reports').insert(team_share_data).execute()
        
        if response.data:
            return {
                'success': True,
                'message': f'Relatório compartilhado com a equipe com sucesso'
            }
        
        raise HTTPException(status_code=500, detail="Erro ao compartilhar com equipe")
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro ao compartilhar com equipe: {str(e)}")

@router.get("/activity-feed")
async def get_activity_feed(
    current_user: Dict = Depends(get_current_user)
):
    """
    Obtém feed de atividades do usuário
    """
    try:
        # Busca atividades recentes
        activities = []
        
        # Relatórios criados
        reports_response = supabase.table('reports').select('*').eq('created_by', current_user['id']).order('created_at', desc=True).limit(5).execute()
        for report in reports_response.data:
            activities.append({
                'type': 'report_created',
                'title': f'Relatório "{report.get("name", "Relatório")}" criado',
                'timestamp': report['created_at'],
                'data': report
            })
        
        # Relatórios compartilhados com o usuário
        shared_response = supabase.table('shared_reports').select('*, reports(*)').eq('shared_with_email', current_user['email']).order('shared_at', desc=True).limit(5).execute()
        for share in shared_response.data:
            if share.get('reports'):
                report = share['reports']
                activities.append({
                    'type': 'report_shared',
                    'title': f'Relatório "{report.get("name", "Relatório")}" compartilhado com você',
                    'timestamp': share['shared_at'],
                    'data': share
                })
        
        # Comentários em relatórios
        comments_response = supabase.table('report_comments').select('*, reports(name)').eq('user_id', current_user['id']).order('created_at', desc=True).limit(5).execute()
        for comment in comments_response.data:
            if comment.get('reports'):
                report = comment['reports']
                activities.append({
                    'type': 'comment_added',
                    'title': f'Comentário adicionado em "{report.get("name", "Relatório")}"',
                    'timestamp': comment['created_at'],
                    'data': comment
                })
        
        # Ordena por timestamp
        activities.sort(key=lambda x: x['timestamp'], reverse=True)
        
        return {
            'success': True,
            'activities': activities[:10]  # Limita a 10 atividades
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro ao buscar atividades: {str(e)}") 