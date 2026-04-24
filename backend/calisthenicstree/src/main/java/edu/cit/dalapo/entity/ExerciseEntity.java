package edu.cit.dalapo.entity;

import jakarta.persistence.ElementCollection;
import jakarta.persistence.CollectionTable;
import jakarta.persistence.Column;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.*;
import java.util.List;
import java.util.ArrayList;

@Entity
@Table(name = "exercises")
public class ExerciseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ElementCollection
    @CollectionTable(name = "exercise_prerequisites", joinColumns = @JoinColumn(name = "exercise_id"))
    @Column(name = "prerequisite_id")
    private List<Long> prerequisiteIds = new ArrayList<>();

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

    public List<Long> getPrerequisiteIds() {
        return prerequisiteIds;
    }

    public void setPrerequisiteIds(List<Long> prerequisiteIds) {
        this.prerequisiteIds = prerequisiteIds;
    }

}