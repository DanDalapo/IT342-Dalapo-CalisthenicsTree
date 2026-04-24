package edu.cit.dalapo.controller;

import edu.cit.dalapo.entity.ExerciseEntity;
import edu.cit.dalapo.repository.ExerciseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/v1/admin")
public class AdminController {

    @Autowired
    private ExerciseRepository exerciseRepository;

    @PostMapping("/exercises")
    public ResponseEntity<?> addExercise(@RequestBody ExerciseEntity newExercise) {
        return ResponseEntity.ok(exerciseRepository.save(newExercise));
    }

    @GetMapping("/exercises")
    public ResponseEntity<?> getAllExercises() {
        return ResponseEntity.ok(exerciseRepository.findAll());
    }

    @PutMapping("/exercises/{id}")
    @Transactional
    public ResponseEntity<?> updateExercise(@PathVariable Long id, @RequestBody ExerciseEntity updatedData) {
        
        return exerciseRepository.findById(id).map(existingExercise -> {

            existingExercise.setName(updatedData.getName());
            existingExercise.setCategory(updatedData.getCategory());
            existingExercise.setProgressionLevel(updatedData.getProgressionLevel());
            existingExercise.setPrerequisiteIds(updatedData.getPrerequisiteIds());
            
            return ResponseEntity.ok(exerciseRepository.save(existingExercise));
        }).orElse(ResponseEntity.notFound().build());
    }
}