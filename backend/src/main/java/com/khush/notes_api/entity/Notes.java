package com.khush.notes_api.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "Notes")
public class Notes {
    @Id
    @Column(name = "notes_id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "title")
    private String title;

    @Column(name = "content", columnDefinition = "TEXT")
    private String content;

    @Column(name = "crt_dt", updatable = false)
    private LocalDateTime crtDt;

    @Column(name = "lst_updt_dt")
    private LocalDateTime lstUpdtDt;

    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @PrePersist
    public void onSave() {
        this.crtDt = LocalDateTime.now();
    }

    @PreUpdate
    public void lastUpdatedAt() {
        this.lstUpdtDt = LocalDateTime.now();
    }
}
