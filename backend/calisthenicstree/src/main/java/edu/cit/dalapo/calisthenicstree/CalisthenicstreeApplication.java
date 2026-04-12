package edu.cit.dalapo.calisthenicstree;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication
@ComponentScan(basePackages = {"edu.cit.dalapo"}) 
@EntityScan(basePackages = {"edu.cit.dalapo"}) 
@EnableJpaRepositories(basePackages = {"edu.cit.dalapo"}) 

public class CalisthenicstreeApplication {

    public static void main(String[] args) {
        SpringApplication.run(CalisthenicstreeApplication.class, args);
    }
    
}