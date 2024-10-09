const express = require('express');
const app = express();
const { obterUsuarioPorId, criarAgendamento, obterAgendamentosPorUsuarioId } = require('./db');


app.use(express.json());

// Rota para obter um usuário
app.get('/usuarios/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const usuario = await obterUsuarioPorId(id);
        if (usuario) {
            res.json(usuario);
        } else {
            res.status(404).json({ mensagem: 'Usuário não existe' });
        }
    } catch (error) {
        res.status(500).json({ mensagem: 'Erro de conexão com o BD' });
    }
});

// Rota para criar um agendamento
app.post('/agendamentos', async (req, res) => {
    const { usuarioId, data, horario, descricao } = req.body;
    try {
        const agendamento = await criarAgendamento(usuarioId, data, horario, descricao);
        res.status(201).json(agendamento);
    } catch (error) {
        res.status(500).json({ mensagem: 'Erro ao criar agendamento' });
    }
});

// Rota para listar agendamentos de um usuário
app.get('/usuarios/:id/agendamentos', async (req, res) => {
    const { id } = req.params;
    try {
        const agendamentos = await obterAgendamentosPorUsuarioId(id);
        res.json(agendamentos);
    } catch (error) {
        res.status(500).json({ mensagem: 'Erro ao buscar agendamentos' });
    }
});

module.exports = app;
