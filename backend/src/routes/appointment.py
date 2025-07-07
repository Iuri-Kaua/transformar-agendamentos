from flask import Blueprint, request, jsonify
from datetime import datetime, date, time, timedelta
import os
import json
from src.models.appointment import Appointment, db
from src.services.google_calendar import GoogleCalendarService

appointment_bp = Blueprint('appointment', __name__)

# Configurações de horário de funcionamento
WORKING_HOURS = {
    'monday': {'start': '08:00', 'end': '18:00'},
    'tuesday': {'start': '08:00', 'end': '18:00'},
    'wednesday': {'start': '08:00', 'end': '18:00'},
    'thursday': {'start': '08:00', 'end': '18:00'},
    'friday': {'start': '08:00', 'end': '18:00'},
    'saturday': {'start': '08:00', 'end': '12:00'},
    'sunday': None  # Fechado
}

APPOINTMENT_DURATION = 60  # minutos
APPOINTMENT_INTERVAL = 15  # minutos

@appointment_bp.route('/appointments', methods=['POST'])
def create_appointment():
    """Criar novo agendamento"""
    try:
        data = request.get_json()
        
        # Validar dados obrigatórios
        required_fields = ['nome', 'telefone', 'email', 'servico', 'data', 'horario']
        for field in required_fields:
            if not data.get(field):
                return jsonify({'success': False, 'message': f'Campo {field} é obrigatório'}), 400
        
        # Converter data e horário
        appointment_date = datetime.strptime(data['data'], '%Y-%m-%d').date()
        appointment_time = datetime.strptime(data['horario'], '%H:%M').time()
        
        # Verificar se o horário está disponível
        if not is_time_slot_available(appointment_date, appointment_time):
            return jsonify({'success': False, 'message': 'Horário não disponível'}), 400
        
        # Criar agendamento no banco de dados
        appointment = Appointment(
            nome=data['nome'],
            telefone=data['telefone'],
            email=data['email'],
            servico=data['servico'],
            data=appointment_date,
            horario=appointment_time,
            observacoes=data.get('observacoes', '')
        )
        
        db.session.add(appointment)
        db.session.commit()
        
        # Tentar criar evento no Google Calendar
        try:
            calendar_service = GoogleCalendarService()
            event_id = calendar_service.create_event(appointment)
            if event_id:
                appointment.google_event_id = event_id
                db.session.commit()
        except Exception as e:
            print(f"Erro ao criar evento no Google Calendar: {e}")
            # Continuar mesmo se falhar no Google Calendar
        
        return jsonify({
            'success': True, 
            'message': 'Agendamento criado com sucesso!',
            'appointment': appointment.to_dict()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        print(f"Erro ao criar agendamento: {e}")
        return jsonify({'success': False, 'message': 'Erro interno do servidor'}), 500

@appointment_bp.route('/appointments/available-slots', methods=['GET'])
def get_available_slots():
    """Obter horários disponíveis para uma data"""
    try:
        date_str = request.args.get('date')
        if not date_str:
            return jsonify({'success': False, 'message': 'Data é obrigatória'}), 400
        
        appointment_date = datetime.strptime(date_str, '%Y-%m-%d').date()
        
        # Verificar se é um dia útil
        day_name = appointment_date.strftime('%A').lower()
        working_hours = WORKING_HOURS.get(day_name)
        
        if not working_hours:
            return jsonify({'success': True, 'slots': []}), 200
        
        # Gerar todos os horários possíveis
        all_slots = generate_time_slots(working_hours['start'], working_hours['end'])
        
        # Filtrar horários já ocupados
        occupied_slots = get_occupied_slots(appointment_date)
        available_slots = [slot for slot in all_slots if slot not in occupied_slots]
        
        return jsonify({'success': True, 'slots': available_slots}), 200
        
    except Exception as e:
        print(f"Erro ao obter horários disponíveis: {e}")
        return jsonify({'success': False, 'message': 'Erro interno do servidor'}), 500

@appointment_bp.route('/appointments', methods=['GET'])
def list_appointments():
    """Listar agendamentos"""
    try:
        date_str = request.args.get('date')
        
        query = Appointment.query
        
        if date_str:
            appointment_date = datetime.strptime(date_str, '%Y-%m-%d').date()
            query = query.filter(Appointment.data == appointment_date)
        
        appointments = query.order_by(Appointment.data, Appointment.horario).all()
        
        return jsonify({
            'success': True,
            'appointments': [appointment.to_dict() for appointment in appointments]
        }), 200
        
    except Exception as e:
        print(f"Erro ao listar agendamentos: {e}")
        return jsonify({'success': False, 'message': 'Erro interno do servidor'}), 500

@appointment_bp.route('/appointments/<int:appointment_id>', methods=['DELETE'])
def cancel_appointment(appointment_id):
    """Cancelar agendamento"""
    try:
        appointment = Appointment.query.get_or_404(appointment_id)
        
        # Cancelar evento no Google Calendar se existir
        if appointment.google_event_id:
            try:
                calendar_service = GoogleCalendarService()
                calendar_service.delete_event(appointment.google_event_id)
            except Exception as e:
                print(f"Erro ao cancelar evento no Google Calendar: {e}")
        
        # Atualizar status para cancelado
        appointment.status = 'cancelado'
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'Agendamento cancelado com sucesso!'
        }), 200
        
    except Exception as e:
        db.session.rollback()
        print(f"Erro ao cancelar agendamento: {e}")
        return jsonify({'success': False, 'message': 'Erro interno do servidor'}), 500

def generate_time_slots(start_time, end_time):
    """Gerar lista de horários disponíveis"""
    slots = []
    start_minutes = time_to_minutes(start_time)
    end_minutes = time_to_minutes(end_time)
    
    current_time = start_minutes
    while current_time + APPOINTMENT_DURATION <= end_minutes:
        slots.append(minutes_to_time(current_time))
        current_time += APPOINTMENT_INTERVAL
    
    return slots

def time_to_minutes(time_str):
    """Converter horário para minutos"""
    hours, minutes = map(int, time_str.split(':'))
    return hours * 60 + minutes

def minutes_to_time(minutes):
    """Converter minutos para horário"""
    hours = minutes // 60
    mins = minutes % 60
    return f"{hours:02d}:{mins:02d}"

def get_occupied_slots(appointment_date):
    """Obter horários já ocupados em uma data"""
    appointments = Appointment.query.filter(
        Appointment.data == appointment_date,
        Appointment.status != 'cancelado'
    ).all()
    
    return [appointment.horario.strftime('%H:%M') for appointment in appointments]

def is_time_slot_available(appointment_date, appointment_time):
    """Verificar se um horário está disponível"""
    # Verificar se já existe agendamento neste horário
    existing = Appointment.query.filter(
        Appointment.data == appointment_date,
        Appointment.horario == appointment_time,
        Appointment.status != 'cancelado'
    ).first()
    
    return existing is None

