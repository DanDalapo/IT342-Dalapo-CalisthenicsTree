package edu.cit.dalapo.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "exercises")
public class ExerciseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "prerequisite_id", nullable = true)
    private Long prerequisiteId;

    private String name;
    private String category;
    private int progressionLevel;

    public ExerciseEntity() {}

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public int getProgressionLevel() {
        return progressionLevel;
    }

    public void setProgressionLevel(int progressionLevel) {
        this.progressionLevel = progressionLevel;
    }

    public Long getPrerequisiteId() {
        return prerequisiteId;
    }
    
    public void setPrerequisiteId(Long prerequisiteId) {
        this.prerequisiteId = prerequisiteId;
    }

}