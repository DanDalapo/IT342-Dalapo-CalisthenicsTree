package edu.cit.dalapo.controller;

import edu.cit.dalapo.repository.ExerciseRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/user")
public class UserController {

    private final ExerciseRepository exerciseRepository;

    public UserController(ExerciseRepository exerciseRepository) {
        this.exerciseRepository = exerciseRepository;
    }

    @GetMapping("/exercises")
    public ResponseEntity<?> getAllExercises() {
        return ResponseEntity.ok(exerciseRepository.findAll());
    }
}