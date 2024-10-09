const { getAgendamentoPorId, getAgendamentosPorNome, getAgendamentosPorParteDoNome, getAgendamentosPorIntervaloDeDatas, atualizarAgendamento, deletarAgendamento, connection } = require("./db.js");

describe('Testes para Agendamentos', () => {
    beforeAll(async () => {
        await connection.query(`
            CREATE TABLE IF NOT EXISTS agendamentos (
                id_agenda INT AUTO_INCREMENT PRIMARY KEY,
                nome_pessoa VARCHAR(255),
                contato_telefone VARCHAR(20),
                email VARCHAR(255),
                data_agendamento DATETIME
            )
        `);
        // Inserindo dados de teste
        await connection.query("INSERT INTO agendamentos (nome_pessoa, contato_telefone, email, data_agendamento) VALUES ('Marcos Vinicius', '75998884685', 'marcos@mail.com', '2024-10-15')");
        await connection.query("INSERT INTO agendamentos (nome_pessoa, contato_telefone, email, data_agendamento) VALUES ('Ana Silva', '75998812345', 'ana@mail.com', '2024-10-20')");
        await connection.query("INSERT INTO agendamentos (nome_pessoa, contato_telefone, email, data_agendamento) VALUES ('João Pereira', '75998811111', 'joao@mail.com', '2024-10-18')");
    });

    afterAll(async () => {
        
        await connection.end();
    });

    test('1 - deve retornar o agendamento correto pelo ID', async () => {
        const agendamento = await getAgendamentoPorId(1);
        expect(agendamento).toHaveProperty('nome_pessoa', 'Marcos Vinicius');
        expect(agendamento).toHaveProperty('email', 'marcos@mail.com');
    });

    test('2 - deve retornar undefined para um ID que não existe', async () => {
        const agendamento = await getAgendamentoPorId(999); // ID que não existe
        expect(agendamento).toBeUndefined();
    });

    test('3 - deve retornar agendamentos por nome específico', async () => {
        const agendamentos = await getAgendamentosPorNome('Ana Silva');
        expect(agendamentos).toHaveLength(1);
        expect(agendamentos[0]).toHaveProperty('nome_pessoa', 'Ana Silva');
    });

    test('4 - deve retornar agendamentos que contenham parte do nome', async () => {
        const agendamentos = await getAgendamentosPorParteDoNome('Marcos');
        expect(agendamentos).toHaveLength(1);
        expect(agendamentos[0]).toHaveProperty('nome_pessoa', 'Marcos Vinicius');
    });

    test('5 - deve retornar agendamentos em um intervalo de datas', async () => {
        const agendamentos = await getAgendamentosPorIntervaloDeDatas('2024-10-15', '2024-10-20');
        expect(agendamentos).toHaveLength(2); // Marcos e Ana
    });

    test('6 - deve atualizar um agendamento corretamente', async () => {
        await atualizarAgendamento(1, { nome_pessoa: 'Marcos V.', contato_telefone: '75998899999', email: 'marcosv@mail.com', data_agendamento: '2024-10-15' });
        const agendamento = await getAgendamentoPorId(1);
        expect(agendamento).toHaveProperty('nome_pessoa', 'Marcos V.');
        expect(agendamento).toHaveProperty('contato_telefone', '75998899999');
    });

    test('7 - deve deletar um agendamento corretamente', async () => {
        await deletarAgendamento(2); // Deletar Ana
        const agendamento = await getAgendamentoPorId(2);
        expect(agendamento).toBeUndefined(); // Deve ser indefinido após a exclusão
    });

    test('8 - teste de performance para buscar agendamentos por nome', async () => {
        const { performance } = require('perf_hooks');
        const start = performance.now();

        const agendamentos = await getAgendamentosPorNome('Ana Silva');

        const end = performance.now();
        const duration = end - start;

        console.log(`Tempo de execução para buscar agendamentos por nome: ${duration.toFixed(2)} ms`);

        expect(agendamentos).toHaveLength(1);
        expect(agendamentos[0]).toHaveProperty('nome_pessoa', 'Ana Silva');
    });
});

