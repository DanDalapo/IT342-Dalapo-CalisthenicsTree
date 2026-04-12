package edu.cit.dalapo.controller;

import edu.cit.dalapo.entity.ExerciseEntity;
import edu.cit.dalapo.entity.UserEntity;
import edu.cit.dalapo.entity.UserProgressEntity;
import edu.cit.dalapo.repository.ExerciseRepository;
import edu.cit.dalapo.repository.UserProgressRepository;
import edu.cit.dalapo.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/v1/user")
public class UserController {

    private final ExerciseRepository exerciseRepository;
    private final UserRepository userRepository;
    private final UserProgressRepository userProgressRepository;

    // We updated the constructor to include all three repositories
    public UserController(ExerciseRepository exerciseRepository, UserRepository userRepository, UserProgressRepository userProgressRepository) {
        this.exerciseRepository = exerciseRepository;
        this.userRepository = userRepository;
        this.userProgressRepository = userProgressRepository;
    }

    // (Your existing endpoint for the map)
    @GetMapping("/exercises")
    public ResponseEntity<?> getAllExercises() {
        return ResponseEntity.ok(exerciseRepository.findAll());
    }

    // THE NEW ENDPOINT: Fetch the logged-in user's exact progress levels
    @GetMapping("/progress")
    public ResponseEntity<?> getUserProgress() {
        
        // 1. SECURITY: Find out exactly who is making this request by reading their JWT Token
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String currentUserEmail = authentication.getName();
        
        // 2. Grab their full account details from the database
        UserEntity user = userRepository.findByEmail(currentUserEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // 3. Fetch all their saved progress rows
        List<UserProgressEntity> progressList = userProgressRepository.findByUser(user);

        // 4. Create a clean Dictionary/Map to send back to React
        // We initialize the defaults to Level 0 so brand new accounts start at the very bottom!
        Map<String, Integer> progressMap = new HashMap<>();
        progressMap.put("Push", 0);
        progressMap.put("Pull", 0);
        progressMap.put("Legs", 0);

        // 5. If they HAVE logged workouts before, this will overwrite the 0s with their actual levels!
        for (UserProgressEntity progress : progressList) {
            progressMap.put(progress.getCategory(), progress.getCurrentLevel());
        }

        // React will receive something perfectly clean like: {"Push": 2, "Pull": 0, "Legs": 1}
        return ResponseEntity.ok(progressMap);
    }

    @PostMapping("/progress/complete/{exerciseId}")
    public ResponseEntity<?> completeExercise(@PathVariable Long exerciseId) {
        
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserEntity user = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));

        edu.cit.dalapo.entity.ExerciseEntity exercise = exerciseRepository.findById(exerciseId)
                .orElseThrow(() -> new RuntimeException("Exercise not found"));

        // 3. Find their current progress in that specific category (e.g., "Push")
        UserProgressEntity progress = userProgressRepository.findByUserAndCategory(user, exercise.getCategory())
                .orElseGet(() -> {
                    // If they have never logged this category before, spawn a fresh Level 0 record!
                    UserProgressEntity newProgress = new UserProgressEntity();
                    newProgress.setUser(user);
                    newProgress.setCategory(exercise.getCategory());
                    newProgress.setCurrentLevel(0);
                    return newProgress;
                });

        // 4. THE GAME LOGIC: Can they level up?
        // They only level up if their current level EXACTLY MATCHES the exercise level they just beat.
        if (progress.getCurrentLevel() == exercise.getProgressionLevel()) {
            
            progress.setCurrentLevel(progress.getCurrentLevel() + 1); // LEVEL UP!
            userProgressRepository.save(progress);
            
            return ResponseEntity.ok("LEVEL UP! You are now Level " + progress.getCurrentLevel() + " in " + exercise.getCategory() + "!");
            
        } else if (progress.getCurrentLevel() > exercise.getProgressionLevel()) {
            // They re-played an old exercise they already mastered
            return ResponseEntity.ok("Exercise complete! (Already mastered, no level up).");
            
        } else {
            // They tried to beat a Level 2 exercise while they are only Level 0!
            return ResponseEntity.badRequest().body("Quest Locked! You must complete the prerequisites first.");
        }
    }

    // THE NEW RPG REVERT/UNDO ENDPOINT
    @PostMapping("/progress/revert/{exerciseId}")
    public ResponseEntity<?> revertExercise(@PathVariable Long exerciseId) {
        
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserEntity user = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));

        ExerciseEntity exercise = exerciseRepository.findById(exerciseId)
                .orElseThrow(() -> new RuntimeException("Exercise not found"));

        // Find their current progress
        UserProgressEntity progress = userProgressRepository.findByUserAndCategory(user, exercise.getCategory())
                .orElseThrow(() -> new RuntimeException("No progress found to revert."));

        // Check if they are actually at a higher level than the node they clicked
        if (progress.getCurrentLevel() > exercise.getProgressionLevel()) {
            
            // DOWNGRADE THEIR LEVEL!
            progress.setCurrentLevel(exercise.getProgressionLevel());
            userProgressRepository.save(progress);
            
            return ResponseEntity.ok("Progress reverted. Your current target is back to: " + exercise.getName());
        } else {
            return ResponseEntity.badRequest().body("You can only revert to a previously mastered exercise.");
        }
    }
}