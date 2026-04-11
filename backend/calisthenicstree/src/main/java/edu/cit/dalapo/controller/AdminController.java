package edu.cit.dalapo.controller;

import edu.cit.dalapo.entity.ExerciseEntity;
import edu.cit.dalapo.repository.ExerciseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/admin")
public class AdminController {

    @Autowired
    private ExerciseRepository exerciseRepository;

    @PostMapping("/exercises")
    public ResponseEntity<?> addExercise(@RequestBody ExerciseEntity newExercise) {
        ExerciseEntity savedExercise = exerciseRepository.save(newExercise);
        
        return ResponseEntity.ok(savedExercise);
    }
    
    @GetMapping("/exercises")
    public ResponseEntity<?> getAllExercises() {
        return ResponseEntity.ok(exerciseRepository.findAll());
    }
}