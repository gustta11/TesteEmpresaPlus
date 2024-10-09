const mysql = require('mysql2/promise');

const connection = mysql.createPool({
    host:'localhost',
    user:'root',
    password:'password',
    database:'tabela_agendamento'
})

async function getAgendamentoPorId(id_agenda){
    const [rows] = await connection.query('SELECT * FROM agendamentos WHERE id_agenda = ?', [id_agenda]);
    return rows[0];
}

async function getAgendamentosPorNome(nome) {
    const [rows] = await connection.query('SELECT * FROM agendamentos WHERE nome_pessoa = ?', [nome]);
    return rows;
}

async function getAgendamentosPorParteDoNome(parteNome) {
    const [rows] = await connection.query('SELECT * FROM agendamentos WHERE nome_pessoa LIKE ?', [`%${parteNome}%`]);
    return rows;
}

async function getAgendamentosPorIntervaloDeDatas(dataInicio, dataFim) {
    const [rows] = await connection.query('SELECT * FROM agendamentos WHERE data_agendamento BETWEEN ? AND ?', [dataInicio, dataFim]);
    return rows;
}

async function atualizarAgendamento(id_agenda, dadosAtualizados) {
    const { nome_pessoa, contato_telefone, email, data_agendamento } = dadosAtualizados;
    await connection.query('UPDATE agendamentos SET nome_pessoa = ?, contato_telefone = ?, email = ?, data_agendamento = ? WHERE id_agenda = ?', [nome_pessoa, contato_telefone, email, data_agendamento, id_agenda]);
}

async function deletarAgendamento(id_agenda) {
    await connection.query('DELETE FROM agendamentos WHERE id_agenda = ?', [id_agenda]);
}


module.exports  = {getAgendamentoPorId, getAgendamentosPorNome, getAgendamentosPorIntervaloDeDatas, getAgendamentosPorParteDoNome, atualizarAgendamento, deletarAgendamento, connection};