import os
import json
from datetime import datetime, timedelta
from google.oauth2.credentials import Credentials
from google.auth.transport.requests import Request
from google_auth_oauthlib.flow import InstalledAppFlow
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError

class GoogleCalendarService:
    """Serviço para integração com Google Calendar API"""
    
    # Escopos necessários para o Google Calendar
    SCOPES = ['https://www.googleapis.com/auth/calendar']
    
    def __init__(self):
        self.service = None
        self.calendar_id = 'primary'  # Usar calendário principal
        self._authenticate()
    
    def _authenticate(self):
        """Autenticar com Google Calendar API"""
        creds = None
        token_path = os.path.join(os.path.dirname(__file__), '..', '..', 'token.json')
        credentials_path = os.path.join(os.path.dirname(__file__), '..', '..', 'credentials.json')
        
        # Carregar token existente se disponível
        if os.path.exists(token_path):
            creds = Credentials.from_authorized_user_file(token_path, self.SCOPES)
        
        # Se não há credenciais válidas disponíveis, fazer login
        if not creds or not creds.valid:
            if creds and creds.expired and creds.refresh_token:
                try:
                    creds.refresh(Request())
                except Exception as e:
                    print(f"Erro ao renovar token: {e}")
                    creds = None
            
            if not creds:
                if os.path.exists(credentials_path):
                    flow = InstalledAppFlow.from_client_secrets_file(
                        credentials_path, self.SCOPES)
                    creds = flow.run_local_server(port=0)
                else:
                    print("Arquivo credentials.json não encontrado. Usando modo simulado.")
                    return
            
            # Salvar credenciais para próxima execução
            with open(token_path, 'w') as token:
                token.write(creds.to_json())
        
        try:
            self.service = build('calendar', 'v3', credentials=creds)
        except Exception as e:
            print(f"Erro ao conectar com Google Calendar: {e}")
            self.service = None
    
    def create_event(self, appointment):
        """Criar evento no Google Calendar"""
        if not self.service:
            print("Serviço Google Calendar não disponível. Usando modo simulado.")
            return f"simulated_event_{appointment.id}"
        
        try:
            # Combinar data e horário
            start_datetime = datetime.combine(appointment.data, appointment.horario)
            end_datetime = start_datetime + timedelta(hours=1)  # Duração de 1 hora
            
            # Criar evento
            event = {
                'summary': f'Consulta - {appointment.nome}',
                'description': f'''
Paciente: {appointment.nome}
Telefone: {appointment.telefone}
Email: {appointment.email}
Serviço: {appointment.servico}
Observações: {appointment.observacoes or 'Nenhuma'}
                '''.strip(),
                'start': {
                    'dateTime': start_datetime.isoformat(),
                    'timeZone': 'America/Sao_Paulo',
                },
                'end': {
                    'dateTime': end_datetime.isoformat(),
                    'timeZone': 'America/Sao_Paulo',
                },
                'attendees': [
                    {'email': appointment.email}
                ],
                'reminders': {
                    'useDefault': False,
                    'overrides': [
                        {'method': 'email', 'minutes': 24 * 60},  # 1 dia antes
                        {'method': 'popup', 'minutes': 60},       # 1 hora antes
                    ],
                },
            }
            
            # Inserir evento no calendário
            created_event = self.service.events().insert(
                calendarId=self.calendar_id, 
                body=event,
                sendUpdates='all'  # Enviar convites por email
            ).execute()
            
            print(f"Evento criado: {created_event.get('htmlLink')}")
            return created_event['id']
            
        except HttpError as error:
            print(f"Erro HTTP ao criar evento: {error}")
            return None
        except Exception as error:
            print(f"Erro ao criar evento: {error}")
            return None
    
    def get_events(self, start_date, end_date):
        """Obter eventos do calendário em um período"""
        if not self.service:
            return []
        
        try:
            # Converter datas para formato ISO
            start_iso = start_date.isoformat() + 'T00:00:00Z'
            end_iso = end_date.isoformat() + 'T23:59:59Z'
            
            events_result = self.service.events().list(
                calendarId=self.calendar_id,
                timeMin=start_iso,
                timeMax=end_iso,
                singleEvents=True,
                orderBy='startTime'
            ).execute()
            
            events = events_result.get('items', [])
            return events
            
        except HttpError as error:
            print(f"Erro HTTP ao obter eventos: {error}")
            return []
        except Exception as error:
            print(f"Erro ao obter eventos: {error}")
            return []
    
    def delete_event(self, event_id):
        """Deletar evento do calendário"""
        if not self.service:
            print(f"Evento simulado {event_id} seria deletado.")
            return True
        
        try:
            self.service.events().delete(
                calendarId=self.calendar_id,
                eventId=event_id
            ).execute()
            
            print(f"Evento {event_id} deletado com sucesso.")
            return True
            
        except HttpError as error:
            print(f"Erro HTTP ao deletar evento: {error}")
            return False
        except Exception as error:
            print(f"Erro ao deletar evento: {error}")
            return False
    
    def update_event(self, event_id, appointment):
        """Atualizar evento no calendário"""
        if not self.service:
            print(f"Evento simulado {event_id} seria atualizado.")
            return True
        
        try:
            # Obter evento existente
            event = self.service.events().get(
                calendarId=self.calendar_id,
                eventId=event_id
            ).execute()
            
            # Atualizar dados
            start_datetime = datetime.combine(appointment.data, appointment.horario)
            end_datetime = start_datetime + timedelta(hours=1)
            
            event['summary'] = f'Consulta - {appointment.nome}'
            event['description'] = f'''
Paciente: {appointment.nome}
Telefone: {appointment.telefone}
Email: {appointment.email}
Serviço: {appointment.servico}
Observações: {appointment.observacoes or 'Nenhuma'}
            '''.strip()
            event['start']['dateTime'] = start_datetime.isoformat()
            event['end']['dateTime'] = end_datetime.isoformat()
            
            # Atualizar evento
            updated_event = self.service.events().update(
                calendarId=self.calendar_id,
                eventId=event_id,
                body=event,
                sendUpdates='all'
            ).execute()
            
            print(f"Evento atualizado: {updated_event.get('htmlLink')}")
            return True
            
        except HttpError as error:
            print(f"Erro HTTP ao atualizar evento: {error}")
            return False
        except Exception as error:
            print(f"Erro ao atualizar evento: {error}")
            return False
    
    def check_availability(self, start_datetime, end_datetime):
        """Verificar disponibilidade em um horário específico"""
        if not self.service:
            return True  # Assumir disponível em modo simulado
        
        try:
            # Buscar eventos no período
            events_result = self.service.events().list(
                calendarId=self.calendar_id,
                timeMin=start_datetime.isoformat(),
                timeMax=end_datetime.isoformat(),
                singleEvents=True
            ).execute()
            
            events = events_result.get('items', [])
            
            # Se há eventos no período, não está disponível
            return len(events) == 0
            
        except Exception as error:
            print(f"Erro ao verificar disponibilidade: {error}")
            return True  # Assumir disponível em caso de erro

