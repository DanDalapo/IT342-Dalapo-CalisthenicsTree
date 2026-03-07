package edu.cit.dalapo.calisthenicstree;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication
// 1. Tell Spring to find all your Controllers, Services, and Security configs here:
@ComponentScan(basePackages = {"edu.cit.dalapo"}) 

// 2. Tell Hibernate to find your Database Entities (like the User class) here:
@EntityScan(basePackages = {"edu.cit.dalapo"}) 

// 3. Tell Spring Data to find your Repositories here:
@EnableJpaRepositories(basePackages = {"edu.cit.dalapo"}) 

public class CalisthenicstreeApplication {

    public static void main(String[] args) {
        SpringApplication.run(CalisthenicstreeApplication.class, args);
    }
}