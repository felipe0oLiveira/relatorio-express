from typing import Dict, List, Any, Optional
from datetime import datetime, timedelta
import json
from app.services.supabase_client import supabase

class CollaborationService:
    """
    Serviço de colaboração e compartilhamento similar ao do Zoho Analytics
    Permite compartilhamento seguro, permissões refinadas e colaboração em equipe
    """
    
    def __init__(self):
        self.permission_levels = {
            'view': 1,
            'comment': 2,
            'edit': 3,
            'admin': 4
        }
    
    async def share_report(self, report_id: str, user_id: str, 
                          share_with: List[Dict[str, Any]]) -> Dict[str, Any]:
        """
        Compartilha um relatório com outros usuários
        """
        try:
            # Verifica se o usuário tem permissão para compartilhar
            can_share = await self._check_share_permission(report_id, user_id)
            if not can_share:
                return {
                    'success': False,
                    'error': 'Você não tem permissão para compartilhar este relatório'
                }
            
            shared_items = []
            for share_item in share_with:
                email = share_item.get('email')
                permission = share_item.get('permission', 'view')
                message = share_item.get('message', '')
                
                # Cria registro de compartilhamento
                share_data = {
                    'report_id': report_id,
                    'shared_by': user_id,
                    'shared_with_email': email,
                    'permission_level': self.permission_levels.get(permission, 1),
                    'message': message,
                    'shared_at': datetime.utcnow().isoformat(),
                    'expires_at': share_item.get('expires_at'),
                    'status': 'pending'
                }
                
                # Insere no banco
                response = supabase.table('shared_reports').insert(share_data).execute()
                
                if response.data:
                    shared_items.append({
                        'email': email,
                        'permission': permission,
                        'status': 'shared'
                    })
                    
                    # Envia notificação por email (implementar)
                    await self._send_share_notification(email, report_id, permission, message)
            
            return {
                'success': True,
                'shared_items': shared_items,
                'message': f'Relatório compartilhado com {len(shared_items)} usuário(s)'
            }
            
        except Exception as e:
            return {
                'success': False,
                'error': f'Erro ao compartilhar relatório: {str(e)}'
            }
    
    async def get_shared_reports(self, user_id: str) -> List[Dict[str, Any]]:
        """
        Obtém relatórios compartilhados com o usuário
        """
        try:
            # Busca relatórios compartilhados com o usuário
            response = supabase.table('shared_reports').select(
                '*, reports(*)'
            ).eq('shared_with_email', user_id).execute()
            
            shared_reports = []
            for share in response.data:
                if share.get('reports'):
                    report = share['reports']
                    shared_reports.append({
                        'report_id': share['report_id'],
                        'report_name': report.get('name', 'Relatório'),
                        'shared_by': share['shared_by'],
                        'permission': self._get_permission_name(share['permission_level']),
                        'shared_at': share['shared_at'],
                        'message': share.get('message', ''),
                        'status': share['status']
                    })
            
            return shared_reports
            
        except Exception as e:
            return []
    
    async def update_share_permission(self, share_id: str, user_id: str, 
                                     new_permission: str) -> Dict[str, Any]:
        """
        Atualiza permissão de um compartilhamento
        """
        try:
            # Verifica se o usuário pode modificar este compartilhamento
            can_modify = await self._check_share_owner(share_id, user_id)
            if not can_modify:
                return {
                    'success': False,
                    'error': 'Você não tem permissão para modificar este compartilhamento'
                }
            
            # Atualiza a permissão
            response = supabase.table('shared_reports').update({
                'permission_level': self.permission_levels.get(new_permission, 1),
                'updated_at': datetime.utcnow().isoformat()
            }).eq('id', share_id).execute()
            
            return {
                'success': True,
                'message': f'Permissão atualizada para {new_permission}'
            }
            
        except Exception as e:
            return {
                'success': False,
                'error': f'Erro ao atualizar permissão: {str(e)}'
            }
    
    async def revoke_share(self, share_id: str, user_id: str) -> Dict[str, Any]:
        """
        Revoga um compartilhamento
        """
        try:
            # Verifica se o usuário pode revogar este compartilhamento
            can_revoke = await self._check_share_owner(share_id, user_id)
            if not can_revoke:
                return {
                    'success': False,
                    'error': 'Você não tem permissão para revogar este compartilhamento'
                }
            
            # Remove o compartilhamento
            response = supabase.table('shared_reports').delete().eq('id', share_id).execute()
            
            return {
                'success': True,
                'message': 'Compartilhamento revogado com sucesso'
            }
            
        except Exception as e:
            return {
                'success': False,
                'error': f'Erro ao revogar compartilhamento: {str(e)}'
            }
    
    async def add_comment(self, report_id: str, user_id: str, 
                         comment: str, parent_comment_id: Optional[str] = None) -> Dict[str, Any]:
        """
        Adiciona um comentário a um relatório
        """
        try:
            # Verifica se o usuário tem permissão para comentar
            can_comment = await self._check_comment_permission(report_id, user_id)
            if not can_comment:
                return {
                    'success': False,
                    'error': 'Você não tem permissão para comentar neste relatório'
                }
            
            comment_data = {
                'report_id': report_id,
                'user_id': user_id,
                'comment': comment,
                'parent_comment_id': parent_comment_id,
                'created_at': datetime.utcnow().isoformat(),
                'status': 'active'
            }
            
            response = supabase.table('report_comments').insert(comment_data).execute()
            
            if response.data:
                return {
                    'success': True,
                    'comment_id': response.data[0]['id'],
                    'message': 'Comentário adicionado com sucesso'
                }
            
            return {
                'success': False,
                'error': 'Erro ao adicionar comentário'
            }
            
        except Exception as e:
            return {
                'success': False,
                'error': f'Erro ao adicionar comentário: {str(e)}'
            }
    
    async def get_comments(self, report_id: str, user_id: str) -> List[Dict[str, Any]]:
        """
        Obtém comentários de um relatório
        """
        try:
            # Verifica se o usuário tem permissão para ver comentários
            can_view = await self._check_view_permission(report_id, user_id)
            if not can_view:
                return []
            
            response = supabase.table('report_comments').select(
                '*, users(email, name)'
            ).eq('report_id', report_id).eq('status', 'active').order('created_at').execute()
            
            comments = []
            for comment in response.data:
                comments.append({
                    'id': comment['id'],
                    'comment': comment['comment'],
                    'user_name': comment.get('users', {}).get('name', 'Usuário'),
                    'user_email': comment.get('users', {}).get('email', ''),
                    'created_at': comment['created_at'],
                    'parent_comment_id': comment.get('parent_comment_id')
                })
            
            return comments
            
        except Exception as e:
            return []
    
    async def create_team(self, team_data: Dict[str, Any], user_id: str) -> Dict[str, Any]:
        """
        Cria uma equipe para colaboração
        """
        try:
            team_info = {
                'name': team_data['name'],
                'description': team_data.get('description', ''),
                'created_by': user_id,
                'created_at': datetime.utcnow().isoformat(),
                'status': 'active'
            }
            
            response = supabase.table('teams').insert(team_info).execute()
            
            if response.data:
                team_id = response.data[0]['id']
                
                # Adiciona o criador como admin da equipe
                member_data = {
                    'team_id': team_id,
                    'user_id': user_id,
                    'role': 'admin',
                    'joined_at': datetime.utcnow().isoformat()
                }
                
                supabase.table('team_members').insert(member_data).execute()
                
                return {
                    'success': True,
                    'team_id': team_id,
                    'message': 'Equipe criada com sucesso'
                }
            
            return {
                'success': False,
                'error': 'Erro ao criar equipe'
            }
            
        except Exception as e:
            return {
                'success': False,
                'error': f'Erro ao criar equipe: {str(e)}'
            }
    
    async def invite_team_member(self, team_id: str, user_id: str, 
                                invite_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Convida um usuário para uma equipe
        """
        try:
            # Verifica se o usuário tem permissão para convidar
            can_invite = await self._check_team_admin(team_id, user_id)
            if not can_invite:
                return {
                    'success': False,
                    'error': 'Você não tem permissão para convidar membros'
                }
            
            invite_info = {
                'team_id': team_id,
                'invited_by': user_id,
                'invited_email': invite_data['email'],
                'role': invite_data.get('role', 'member'),
                'message': invite_data.get('message', ''),
                'invited_at': datetime.utcnow().isoformat(),
                'status': 'pending'
            }
            
            response = supabase.table('team_invites').insert(invite_info).execute()
            
            if response.data:
                # Envia notificação por email (implementar)
                await self._send_team_invitation(invite_data['email'], team_id, invite_data.get('message', ''))
                
                return {
                    'success': True,
                    'message': f'Convite enviado para {invite_data["email"]}'
                }
            
            return {
                'success': False,
                'error': 'Erro ao enviar convite'
            }
            
        except Exception as e:
            return {
                'success': False,
                'error': f'Erro ao enviar convite: {str(e)}'
            }
    
    async def get_team_reports(self, team_id: str, user_id: str) -> List[Dict[str, Any]]:
        """
        Obtém relatórios de uma equipe
        """
        try:
            # Verifica se o usuário é membro da equipe
            is_member = await self._check_team_member(team_id, user_id)
            if not is_member:
                return []
            
            response = supabase.table('team_reports').select(
                '*, reports(*)'
            ).eq('team_id', team_id).execute()
            
            team_reports = []
            for team_report in response.data:
                if team_report.get('reports'):
                    report = team_report['reports']
                    team_reports.append({
                        'report_id': report['id'],
                        'report_name': report.get('name', 'Relatório'),
                        'created_by': report.get('created_by'),
                        'created_at': report.get('created_at'),
                        'last_modified': report.get('updated_at'),
                        'team_permission': team_report.get('permission', 'view')
                    })
            
            return team_reports
            
        except Exception as e:
            return []
    
    async def _check_share_permission(self, report_id: str, user_id: str) -> bool:
        """
        Verifica se o usuário pode compartilhar o relatório
        """
        try:
            response = supabase.table('reports').select('created_by').eq('id', report_id).execute()
            if response.data:
                return response.data[0]['created_by'] == user_id
            return False
        except:
            return False
    
    async def _check_share_owner(self, share_id: str, user_id: str) -> bool:
        """
        Verifica se o usuário é o dono do compartilhamento
        """
        try:
            response = supabase.table('shared_reports').select('shared_by').eq('id', share_id).execute()
            if response.data:
                return response.data[0]['shared_by'] == user_id
            return False
        except:
            return False
    
    async def _check_comment_permission(self, report_id: str, user_id: str) -> bool:
        """
        Verifica se o usuário pode comentar no relatório
        """
        # Implementar lógica de verificação de permissão
        return True
    
    async def _check_view_permission(self, report_id: str, user_id: str) -> bool:
        """
        Verifica se o usuário pode ver o relatório
        """
        # Implementar lógica de verificação de permissão
        return True
    
    async def _check_team_admin(self, team_id: str, user_id: str) -> bool:
        """
        Verifica se o usuário é admin da equipe
        """
        try:
            response = supabase.table('team_members').select('role').eq('team_id', team_id).eq('user_id', user_id).execute()
            if response.data:
                return response.data[0]['role'] == 'admin'
            return False
        except:
            return False
    
    async def _check_team_member(self, team_id: str, user_id: str) -> bool:
        """
        Verifica se o usuário é membro da equipe
        """
        try:
            response = supabase.table('team_members').select('id').eq('team_id', team_id).eq('user_id', user_id).execute()
            return len(response.data) > 0
        except:
            return False
    
    def _get_permission_name(self, permission_level: int) -> str:
        """
        Converte nível de permissão para nome
        """
        for name, level in self.permission_levels.items():
            if level == permission_level:
                return name
        return 'view'
    
    async def _send_share_notification(self, email: str, report_id: str, 
                                      permission: str, message: str):
        """
        Envia notificação de compartilhamento por email
        """
        # Implementar envio de email
        pass
    
    async def _send_team_invitation(self, email: str, team_id: str, message: str):
        """
        Envia convite de equipe por email
        """
        # Implementar envio de email
        pass 