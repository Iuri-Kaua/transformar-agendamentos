from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

db = SQLAlchemy()

class Appointment(db.Model):
    __tablename__ = 'appointments'
    
    id = db.Column(db.Integer, primary_key=True)
    nome = db.Column(db.String(100), nullable=False)
    telefone = db.Column(db.String(20), nullable=False)
    email = db.Column(db.String(100), nullable=False)
    servico = db.Column(db.String(50), nullable=False)
    data = db.Column(db.Date, nullable=False)
    horario = db.Column(db.Time, nullable=False)
    observacoes = db.Column(db.Text)
    google_event_id = db.Column(db.String(100))  # ID do evento no Google Calendar
    status = db.Column(db.String(20), default='agendado')  # agendado, confirmado, cancelado
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'nome': self.nome,
            'telefone': self.telefone,
            'email': self.email,
            'servico': self.servico,
            'data': self.data.isoformat() if self.data else None,
            'horario': self.horario.strftime('%H:%M') if self.horario else None,
            'observacoes': self.observacoes,
            'status': self.status,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }
    
    def __repr__(self):
        return f'<Appointment {self.nome} - {self.data} {self.horario}>'

