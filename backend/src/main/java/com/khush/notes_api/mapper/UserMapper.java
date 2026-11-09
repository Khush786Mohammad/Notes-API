package com.khush.notes_api.mapper;

import com.khush.notes_api.dto.UserResponseDTO;
import com.khush.notes_api.entity.User;

public class UserMapper {
    public static UserResponseDTO userResponseDTO(User user){
        UserResponseDTO dto = new UserResponseDTO();
        dto.setId(user.getId());
        dto.setUsername(user.getUsername());
        dto.setEmail(user.getEmail());
        return dto;
    }
}
