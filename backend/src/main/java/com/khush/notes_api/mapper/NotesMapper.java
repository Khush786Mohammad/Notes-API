package com.khush.notes_api.mapper;

import com.khush.notes_api.dto.NotesRequestDTO;
import com.khush.notes_api.dto.NotesResponseDTO;
import com.khush.notes_api.entity.Notes;

public class NotesMapper {
    public static NotesResponseDTO toDTO(Notes obj) {
        NotesResponseDTO dto = new NotesResponseDTO();
        dto.setId(obj.getId());
        dto.setTitle(obj.getTitle());
        dto.setContent(obj.getContent());
        dto.setCrtDt(obj.getCrtDt());
        dto.setLstUpdtDt(obj.getLstUpdtDt());
        return dto;
    }

    public static Notes toNotesObject(NotesRequestDTO dto){
        Notes notes = new Notes();
        notes.setId(dto.getId());
        notes.setTitle(dto.getTitle());
        notes.setContent(dto.getContent());
        return notes;
    }
}
