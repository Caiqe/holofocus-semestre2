package school.sptech.database;

import org.springframework.jdbc.datasource.DriverManagerDataSource;

import javax.sql.DataSource;

public class Conexao {
    private DataSource conexao;
    public Conexao() {
        DriverManagerDataSource driver = new DriverManagerDataSource();
        driver.setUsername("root");
        driver.setPassword("P@ssw0rd");
        driver.setUrl("jdbc:mysql://127.0.0.1:3306/holofocus");
        driver.setDriverClassName("com.mysql.cj.jdbc.Driver");
        this.conexao = driver;
    }

    public DataSource getConexao() {
        return this.conexao;
    }
}
