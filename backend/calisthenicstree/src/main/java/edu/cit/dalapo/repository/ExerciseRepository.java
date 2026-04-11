package edu.cit.dalapo.repository;

import edu.cit.dalapo.entity.ExerciseEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ExerciseRepository extends JpaRepository<ExerciseEntity, Long> {
    
    List<ExerciseEntity> findByCategoryOrderByProgressionLevelAsc(String category);
    
}