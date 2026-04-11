package edu.cit.dalapo.repository;

import edu.cit.dalapo.entity.UserProgressEntity;
import edu.cit.dalapo.entity.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface UserProgressRepository extends JpaRepository<UserProgressEntity, Long> {
    
    List<UserProgressEntity> findByUser(UserEntity user);
    
    Optional<UserProgressEntity> findByUserAndCategory(UserEntity user, String category);
}