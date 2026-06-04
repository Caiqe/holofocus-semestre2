package school.sptech.database;

import org.springframework.jdbc.datasource.DriverManagerDataSource;

import javax.sql.DataSource;

public class Conexao {
    private DataSource conexao;
    public Conexao() {
        DriverManagerDataSource driver = new DriverManagerDataSource();
        driver.setUsername(System.getenv("USER_JAVA"));
        driver.setPassword(System.getenv("SENHA_JAVA"));
        driver.setUrl("jdbc:mysql://mysql-container:3306/holofocus");
        driver.setDriverClassName("com.mysql.cj.jdbc.Driver");
        this.conexao = driver;
    }

    public DataSource getConexao() {
        return this.conexao;
    }
}
