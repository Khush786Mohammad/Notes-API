package com.khush.notes_api.repository;

import com.khush.notes_api.entity.Notes;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface NotesRepository extends JpaRepository<Notes, Long> {
    Page<Notes> findByUserId(Long id, Pageable pageable);
    Optional<Notes> findByIdAndUserId(Long id, Long user_id);

    @Query("""
        SELECT n FROM Notes n WHERE n.user.id = :userId AND (
        LOWER(n.title) LIKE LOWER(CONCAT('%', :search, '%'))
        OR LOWER(n.content) LIKE LOWER(CONCAT('%',:search, '%'))
        )
""")
    Page<Notes> searchNotes(@Param("userId") Long userId, @Param("search") String search, Pageable pageable);
}
