package ar.edu.utn.frc.tup.lciii.dtos;

import lombok.Data;

@Data
public class NewUserRequest {
    String name;
    String password;
    String email;
}
