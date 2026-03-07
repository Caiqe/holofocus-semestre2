package school.sptech;

public class log {

        public static void main(String[] args) {

            auxiliar auxiliar = new auxiliar();

            auxiliar.registrar("Acesso", "acesso negado");
            auxiliar.registrar("Acesso", "acesso realizado com sucesso");
            auxiliar.registrar("Login", "usuário admin autenticado");
            auxiliar.registrar("Login", "falha na autenticação do usuário");
            auxiliar.registrar("Arquivo", "arquivo clientes.txt criado");
            auxiliar.registrar("Arquivo", "arquivo clientes.txt deletado");
            auxiliar.registrar("Sistema", "sistema iniciado");
            auxiliar.registrar("Sistema", "sistema encerrado");
            auxiliar.registrar("Banco de Dados", "conexão estabelecida");
            auxiliar.registrar("Banco de Dados", "erro ao executar consulta SQL");
        }
    }
